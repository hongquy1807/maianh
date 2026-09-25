import { Router } from 'express';
import { pool } from '../../config/database.js';
import { resourceId,badRequest } from '../../lib/validation.js';
const router=Router();
const fail=(status,message)=>Object.assign(new Error(message),{status,publicMessage:message});
router.use('/customers',(req,res,next)=>{
 res.set('Cache-Control','no-store');
 if(!['GET','HEAD','OPTIONS'].includes(req.method)&&(req.get('X-Requested-With')!=='maianh-web'||req.get('Sec-Fetch-Site')==='cross-site'))throw fail(403,'Yêu cầu không hợp lệ.');next();
});
const select=`SELECT u.id,u.full_name AS name,u.email,u.phone,u.address,u.avatar_url,u.cash,u.status,u.created_at,
 (SELECT COUNT(*) FROM orders o WHERE o.user_id=u.id) AS orders,
 (SELECT COALESCE(SUM(o.total_amount),0) FROM orders o WHERE o.user_id=u.id AND o.status NOT IN ('cancelled','returned')) AS spent
 FROM users u WHERE u.role='customer'`;
router.get('/customers',async(req,res)=>{const [data]=await pool.execute(select+' ORDER BY u.created_at DESC,u.id DESC');res.json({data});});
router.get('/customers/:id',async(req,res)=>{
 const id=resourceId(req.params.id);const [[user]]=await pool.execute(select+' AND u.id=?',[id]);if(!user)throw fail(404,'Không tìm thấy khách hàng.');
 const [addresses]=await pool.execute('SELECT recipient_name,phone,address_line,ward,district,province,is_default FROM addresses WHERE user_id=? ORDER BY is_default DESC',[id]);
 const [orders]=await pool.execute('SELECT id,order_number,status,total_amount,created_at FROM orders WHERE user_id=? ORDER BY created_at DESC LIMIT 30',[id]);
 const [gifts]=await pool.execute('SELECT amount,created_at FROM customer_gifts WHERE user_id=? ORDER BY id DESC LIMIT 30',[id]);
 res.json({data:{...user,addresses,recent_orders:orders,gifts}});
});
router.patch('/customers/:id',async(req,res)=>{
 const id=resourceId(req.params.id),b=req.body||{},sets=[],values=[];
 if(Object.keys(b).some(k=>!['name','email','phone','address','status'].includes(k)))throw badRequest('Chỉ sửa tên, email, số điện thoại, địa chỉ và trạng thái.');
 for(const [key,column,max] of [['name','full_name',120],['email','email',255],['phone','phone',24],['address','address',500]]){
  if(!(key in b))continue;
  if(typeof b[key]!=='string'||b[key].trim().length>max)throw badRequest('Thông tin không hợp lệ.');
  let value=b[key].trim();if(['name','email'].includes(key)&&!value)throw badRequest('Tên và email không được trống.');
  if(key==='email'){value=value.toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))throw badRequest('Email không hợp lệ.');}
  if(key==='phone'&&value&&!/^(0|\+84)\d{9,10}$/.test(value))throw badRequest('Số điện thoại không hợp lệ.');
  sets.push(column+'=?');values.push(value||null);
 }
 if('status' in b){if(!['active','inactive','banned'].includes(b.status))throw badRequest('Trạng thái không hợp lệ.');sets.push('status=?');values.push(b.status);}
 if(!sets.length)throw badRequest('Chưa có thông tin cần sửa.');
 try{const [result]=await pool.execute(`UPDATE users SET ${sets.join(',')} WHERE id=? AND role='customer'`,[...values,id]);if(!result.affectedRows)throw fail(404,'Không tìm thấy khách hàng.');}
 catch(error){if(error.code==='ER_DUP_ENTRY')throw fail(409,'Email đã được sử dụng.');throw error;}
 res.json({data:{id}});
});
router.post('/customers/:id/gifts',async(req,res)=>{
 const id=resourceId(req.params.id),amount=String(req.body?.amount??''),key=req.body?.key;
 if(!/^[1-9]\d{0,12}$/.test(amount))throw badRequest('Nhập số tiền nguyên dương, tối đa 9.999.999.999.999đ.');
 if(typeof key!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(key))throw badRequest('Mã giao dịch không hợp lệ.');
 const conn=await pool.getConnection();
 try{
  await conn.beginTransaction();
  const [[user]]=await conn.execute("SELECT cash FROM users WHERE id=? AND role='customer' FOR UPDATE",[id]);if(!user)throw fail(404,'Không tìm thấy khách hàng.');
  const [[previous]]=await conn.execute('SELECT user_id,amount FROM customer_gifts WHERE admin_id=? AND request_key=?',[req.user.id,key]);
  if(previous){if(String(previous.user_id)!==id||Number(previous.amount)!==Number(amount))throw fail(409,'Mã giao dịch đã được dùng cho yêu cầu khác.');await conn.commit();return res.json({data:{id,cash:user.cash}});}
  const [updated]=await conn.execute('UPDATE users SET cash=cash+? WHERE id=? AND cash<=9999999999999.99-?',[amount,id,amount]);
  if(!updated.affectedRows)throw badRequest('Số dư sau khi cộng vượt giới hạn lưu trữ.');
  await conn.execute('INSERT INTO customer_gifts(admin_id,user_id,amount,request_key) VALUES(?,?,?,?)',[req.user.id,id,amount,key]);
  const money=Number(amount).toLocaleString('vi-VN')+'đ';
  await conn.execute("INSERT INTO notifications(user_id,kind,title,message,target_path) VALUES(?,'system',?,?,?)",[id,'Bạn nhận được quà từ cửa hàng',`Quý khách được chủ cửa hàng tặng một phần quà nho nhỏ trị giá ${money}. Chúc bạn mua sắm thật vui vẻ nhé!`,'/html/profile.html']);
  const [[balance]]=await conn.execute('SELECT cash FROM users WHERE id=?',[id]);await conn.commit();res.status(201).json({data:{id,cash:balance.cash}});
 }catch(error){await conn.rollback();throw error;}finally{conn.release();}
});
export default router;
