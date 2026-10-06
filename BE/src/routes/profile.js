import {advanceOrders} from '../services/order-lifecycle.js';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
﻿import { Router, raw } from 'express';
import { pool } from '../config/database.js';
import { requireAuth } from './auth.js';
import { badRequest, resourceId } from '../lib/validation.js';
const router = Router();
const fail = (status,message) => Object.assign(new Error(message),{status,publicMessage:message});
const text = (v,max,required=true) => {
  if (typeof v !== 'string' || v.trim().length>max || (required && !v.trim())) throw badRequest('Thông tin không hợp lệ hoặc vượt quá độ dài cho phép.');
  return v.trim();
};
const phone = v => { const value=text(v,24).replace(/[\s.-]/g,''); if (!/^(0|\+84)\d{9,10}$/.test(value)) throw badRequest('Số điện thoại không hợp lệ.'); return value; };
router.use(requireAuth, (req,res,next) => {
  res.set('Cache-Control','no-store');
  if (!['GET','HEAD','OPTIONS'].includes(req.method) && (req.get('X-Requested-With') !== 'maianh-web' || req.get('Sec-Fetch-Site') === 'cross-site')) return next(fail(403,'Yêu cầu không hợp lệ.'));
  next();
});
async function profile(id) {
  const [[user]] = await pool.execute('SELECT id,email,full_name,phone,avatar_url,cash,address,created_at FROM users WHERE id=?',[id]);
  const [addresses] = await pool.execute('SELECT id,recipient_name,phone,address_line,ward,district,province,is_default FROM addresses WHERE user_id=? ORDER BY is_default DESC,id DESC',[id]);
  const [[stats]] = await pool.execute(`SELECT (SELECT COUNT(*) FROM orders WHERE user_id=?) AS orders,
    (SELECT COALESCE(SUM(points),0) FROM points_ledger WHERE user_id=?) AS points,
    (SELECT COUNT(*) FROM wishlists WHERE user_id=?) AS wishlist`,[id,id,id]);
  return {user,addresses,stats};
}
router.get('/',async(req,res)=>res.json({data:await profile(req.user.id)}));
router.post('/avatar',raw({type:['image/jpeg','image/png','image/webp'],limit:'5mb'}),async(req,res)=>{
  const bytes=req.body;
  if(!Buffer.isBuffer(bytes) || !bytes.length) throw fail(415,'Chọn ảnh JPG, PNG hoặc WebP.');
  let ext;
  if(bytes.length>=24 && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && bytes.toString('ascii',12,16)==='IHDR') ext='png';
  else if(bytes.length>=4 && bytes[0]===255 && bytes[1]===216 && bytes[2]===255 && bytes.at(-2)===255 && bytes.at(-1)===217) ext='jpg';
  else if(bytes.length>=16 && bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP') ext='webp';
  if(!ext || !req.is({png:'image/png',jpg:'image/jpeg',webp:'image/webp'}[ext])) throw badRequest('File không đúng định dạng ảnh.');
  const directory=new URL('../../uploads/avatars/',import.meta.url);
  await mkdir(directory,{recursive:true});
  const name=`avatar-${randomUUID()}.${ext}`, file=new URL(name,directory);
  await writeFile(file,bytes,{flag:'wx'});
  try {await pool.execute('UPDATE users SET avatar_url=? WHERE id=?',[`/uploads/avatars/${name}`,req.user.id]);}
  catch(error) {await unlink(file);throw error;}
  res.status(201).json({data:await profile(req.user.id)});
});
router.patch('/',async(req,res)=>{
  const body=req.body;
  if (typeof body !== 'object' || Array.isArray(body)) throw badRequest('Dữ liệu không hợp lệ.');
  if (!body || Object.keys(body).some(key=>!['full_name','email','phone','address'].includes(key))) throw badRequest('Chỉ được sửa họ tên, email, số điện thoại và địa chỉ.');
  const values=[],sets=[];
  if ('full_name' in body) {sets.push('full_name=?');values.push(text(body.full_name,120));}
  if ('email' in body) { const email=text(body.email,255).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw badRequest('Email không hợp lệ.'); sets.push('email=?');values.push(email); }
  if ('phone' in body) {sets.push('phone=?');values.push(body.phone === '' ? null : phone(body.phone));}
  if ('address' in body) {sets.push('address=?');values.push(text(body.address,500,false) || null);}
  if (!sets.length) throw badRequest('Chưa có thông tin cần sửa.');
  try {await pool.execute(`UPDATE users SET ${sets.join(',')} WHERE id=?`,[...values,req.user.id]);}
  catch(e) {if(e.code==='ER_DUP_ENTRY') throw fail(409,'Email đã được sử dụng.');throw e;}
  res.json({data:await profile(req.user.id)});
});
async function saveAddress(req,res) {
  const b=req.body||{};
  const values=[text(b.recipient_name,120),phone(b.phone),text(b.address_line,255),text(b.ward,120),text(b.district??'',120,false),text(b.province,120)];
  if (![0,1].includes(b.is_default)) throw badRequest('Trạng thái mặc định không hợp lệ.');
  const id=req.params.id ? resourceId(req.params.id):null;
  const conn=await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('SELECT id FROM users WHERE id=? FOR UPDATE',[req.user.id]);
    const [rows]=await conn.execute('SELECT * FROM addresses WHERE user_id=? FOR UPDATE',[req.user.id]);
    if(id && !rows.some(a=>String(a.id)===id)) throw fail(404,'Không tìm thấy địa chỉ.');
    // Schema permits one default and one non-default address per user.
    const others=rows.filter(a=>String(a.id)!==id);
    const desired=(b.is_default || !others.length) ? 1:0;
    if(others.length>=2 || (!desired && others.some(a=>!a.is_default))) throw fail(409,'Database hiện hỗ trợ tối đa một địa chỉ mặc định và một địa chỉ phụ. Hãy sửa địa chỉ đã có.');
    if(id) await conn.execute('DELETE FROM addresses WHERE id=? AND user_id=?',[id,req.user.id]);
    if(!desired && others.length) await conn.execute('UPDATE addresses SET is_default=1 WHERE user_id=?',[req.user.id]);
    if(desired) await conn.execute('UPDATE addresses SET is_default=0 WHERE user_id=?',[req.user.id]);
    await conn.execute('INSERT INTO addresses(id,user_id,recipient_name,phone,address_line,ward,district,province,is_default) VALUES(?,?,?,?,?,?,?,?,?)',[id,req.user.id,...values,desired]);
    await conn.commit();
  } catch(e) {await conn.rollback();throw e;} finally {conn.release();}
  res.status(id?200:201).json({data:await profile(req.user.id)});
}
router.post('/addresses',saveAddress);
router.put('/addresses/:id',saveAddress);
router.delete('/addresses/:id',async(req,res)=>{
  const id=resourceId(req.params.id);
  const conn=await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('SELECT id FROM users WHERE id=? FOR UPDATE',[req.user.id]);
    const [result]=await conn.execute('DELETE FROM addresses WHERE id=? AND user_id=?',[id,req.user.id]);
    if(!result.affectedRows) throw fail(404,'Không tìm thấy địa chỉ.');
    await conn.execute('UPDATE addresses SET is_default=1 WHERE user_id=?',[req.user.id]);
    await conn.commit();
  } catch(e) {await conn.rollback();throw e;} finally {conn.release();}
  res.json({data:await profile(req.user.id)});
});
router.get('/orders',async(req,res)=>{
  await advanceOrders(null,req.user.id);
  const [data]=await pool.execute('SELECT id,order_number,status,total_amount,created_at FROM orders WHERE user_id=? ORDER BY created_at DESC,id DESC LIMIT 100',[req.user.id]);
  res.json({data});
});
router.get('/owned-items',async(req,res)=>{
 await advanceOrders(null,req.user.id);
 const [data]=await pool.execute(`SELECT oi.id,oi.product_name,oi.sku,oi.size_label,oi.color_label,(oi.quantity-COALESCE((SELECT SUM(quantity) FROM item_resales WHERE order_item_id=oi.id),0)) AS quantity,oi.unit_price,oi.line_total,
 o.id AS order_id,o.order_number,o.status,o.created_at,
 (SELECT MIN(paid_at) FROM payments WHERE order_id=o.id AND status='paid') AS paid_at,
 (SELECT image_url FROM product_images WHERE product_id=v.product_id ORDER BY sort_order,id LIMIT 1) AS image_url
 FROM orders o JOIN order_items oi ON oi.order_id=o.id LEFT JOIN product_variants v ON v.id=oi.variant_id
 WHERE o.user_id=? AND o.status NOT IN ('cancelled','returned')
 AND EXISTS(SELECT 1 FROM payments p WHERE p.order_id=o.id AND p.status='paid' AND p.amount>=o.total_amount)
 AND NOT EXISTS(SELECT 1 FROM refunds r WHERE r.order_id=o.id AND r.status IN ('requested','approved','completed'))
 HAVING quantity>0 ORDER BY o.created_at DESC,o.id DESC,oi.id`,[req.user.id]);
 res.json({data});
});
router.post('/owned-items/:id/sell',async(req,res)=>{
 const id=resourceId(req.params.id), {quantity,key}=req.body||{};
 if(!Number.isInteger(quantity)||quantity<1||quantity>1000000||typeof key!=='string'||!/^[0-9a-f-]{36}$/i.test(key))throw badRequest('Số lượng hoặc mã giao dịch không hợp lệ.');
 const conn=await pool.getConnection();
 try{
  await conn.beginTransaction();
  await conn.execute('SELECT id FROM users WHERE id=? FOR UPDATE',[req.user.id]);
  const [[prior]]=await conn.execute('SELECT * FROM item_resales WHERE user_id=? AND request_key=?',[req.user.id,key]);
  if(prior){
   if(String(prior.order_item_id)!==id||Number(prior.quantity)!==quantity)throw fail(409,'Mã giao dịch đã được sử dụng.');
   const [[wallet]]=await conn.execute('SELECT cash FROM users WHERE id=?',[req.user.id]);
   await conn.commit();return res.json({data:{amount:prior.amount,cash:wallet.cash}});
  }
  const [[item]]=await conn.execute(`SELECT oi.*,o.status,o.total_amount FROM order_items oi JOIN orders o ON o.id=oi.order_id
   WHERE oi.id=? AND o.user_id=? FOR UPDATE`,[id,req.user.id]);
  if(!item)throw fail(404,'Không tìm thấy vật phẩm.');
  if(item.status!=='delivered')throw fail(409,'Chỉ bán lại vật phẩm đã giao thành công.');
  const [[eligible]]=await conn.execute(`SELECT EXISTS(SELECT 1 FROM payments WHERE order_id=? AND status='paid' AND amount>=?) AS paid,
   EXISTS(SELECT 1 FROM refunds WHERE order_id=? AND status IN ('requested','approved','completed')) AS refunded`,[item.order_id,item.total_amount,item.order_id]);
  if(!Number(eligible.paid)||Number(eligible.refunded))throw fail(409,'Vật phẩm không đủ điều kiện bán lại.');
  const [[sold]]=await conn.execute('SELECT COALESCE(SUM(quantity),0) AS n FROM item_resales WHERE order_item_id=?',[id]);
  if(quantity>Number(item.quantity)-Number(sold.n))throw fail(409,'Số lượng sở hữu không đủ.');
  // Decimal arithmetic stays in MySQL; the client never supplies the resale price.
  await conn.execute(`INSERT INTO item_resales(user_id,order_item_id,request_key,quantity,amount)
   SELECT ?,id,?,?,unit_price*?/2 FROM order_items WHERE id=?`,[req.user.id,key,quantity,quantity,id]);
  const [[sale]]=await conn.execute('SELECT amount FROM item_resales WHERE user_id=? AND request_key=?',[req.user.id,key]);
  await conn.execute('UPDATE users SET cash=cash+? WHERE id=?',[sale.amount,req.user.id]);
  const [[wallet]]=await conn.execute('SELECT cash FROM users WHERE id=?',[req.user.id]);
  await conn.commit();res.status(201).json({data:{amount:sale.amount,cash:wallet.cash}});
 }catch(e){await conn.rollback();throw e;}finally{conn.release();}
});
// Order ownership is checked for every read and mutation.
router.get('/orders/:id',async(req,res)=>{
  const id=resourceId(req.params.id);
  await advanceOrders(id,req.user.id);
  const [[order]]=await pool.execute('SELECT * FROM orders WHERE id=? AND user_id=?',[id,req.user.id]);
  if(!order) throw fail(404,'Không tìm thấy đơn hàng.');
  const [items]=await pool.execute(`SELECT oi.*,
    (SELECT image_url FROM product_images WHERE product_id=v.product_id ORDER BY sort_order,id LIMIT 1) AS image_url
    FROM order_items oi LEFT JOIN product_variants v ON v.id=oi.variant_id WHERE oi.order_id=? ORDER BY oi.id`,[id]);
  const [payments]=await pool.execute('SELECT method,status,amount,paid_at FROM payments WHERE order_id=?',[id]);
  const [refunds]=await pool.execute('SELECT amount,status FROM refunds WHERE order_id=?',[id]);
  res.json({data:{...order,items,payments,refunds}});
});
router.post('/orders/:id/cancel',async(req,res)=>{
  const id=resourceId(req.params.id), conn=await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('SELECT id FROM users WHERE id=? FOR UPDATE',[req.user.id]);
    const [[order]]=await conn.execute('SELECT id,status FROM orders WHERE id=? AND user_id=? FOR UPDATE',[id,req.user.id]);
    if(!order) throw fail(404,'Không tìm thấy đơn hàng.');
    if(order.status!=='pending') throw fail(409,'Chỉ có thể hủy đơn hàng đang chờ xác nhận.');
    await conn.execute("UPDATE orders SET status='cancelled' WHERE id=?",[id]);
    const [items]=await conn.execute('SELECT variant_id,quantity FROM order_items WHERE order_id=? ORDER BY variant_id',[id]);
    for(const item of items) await conn.execute('UPDATE product_variants SET stock_quantity=stock_quantity+? WHERE id=?',[item.quantity,item.variant_id]);
    const [payments]=await conn.execute("SELECT id,method,amount FROM payments WHERE order_id=? AND status='paid' FOR UPDATE",[id]);
    for(const payment of payments) {
      const completed=payment.method==='store_pay';
      if(completed) await conn.execute('UPDATE users SET cash=cash+? WHERE id=?',[payment.amount,req.user.id]);
      await conn.execute('INSERT INTO refunds(payment_id,order_id,reason,amount,status) VALUES(?,?,?,?,?)',[payment.id,id,'Khách hàng hủy đơn trước khi xác nhận',payment.amount,completed?'completed':'requested']);
    }
    await conn.execute("UPDATE payments SET status='cancelled' WHERE order_id=? AND status='pending'",[id]);
    await conn.execute("INSERT INTO order_status_history(order_id,actor_user_id,status,note) VALUES(?,?,'cancelled',?)",[id,req.user.id,'Khách hàng hủy đơn']);
    await conn.execute("INSERT INTO notifications(user_id,kind,title,message,target_path) VALUES(?,'order',?,?,?)",[req.user.id,'Đã hủy đơn hàng','Đơn hàng đã được hủy. Tiền thanh toán bằng số dư đã được hoàn vào tài khoản.','/html/profile.html#orders']);
    await conn.commit();
    res.json({data:{id,status:'cancelled'}});
  } catch(error) {await conn.rollback();throw error;} finally {conn.release();}
});
router.get('/notifications',async(req,res)=>{
  const [data]=await pool.execute('SELECT id,title,message,read_at,created_at FROM notifications WHERE user_id=? ORDER BY created_at DESC,id DESC LIMIT 100',[req.user.id]);res.json({data});
});
router.get('/wishlist',async(req,res)=>{
  const [data]=await pool.execute('SELECT p.id,p.name FROM wishlists w JOIN products p ON p.id=w.product_id WHERE w.user_id=? ORDER BY w.created_at DESC',[req.user.id]);res.json({data});
});
router.get('/preferences',async(req,res)=>{
  const [rows]=await pool.execute('SELECT receive_newsletter,receive_sms FROM user_preferences WHERE user_id=?',[req.user.id]);
  res.json({data:rows[0] || {receive_newsletter:1,receive_sms:0}});
});
router.patch('/preferences',async(req,res)=>{
  const b=req.body||{};
  if(Object.keys(b).some(k=>!['receive_newsletter','receive_sms'].includes(k)) || ![0,1].includes(b.receive_newsletter) || ![0,1].includes(b.receive_sms)) throw badRequest('Cài đặt không hợp lệ.');
  await pool.execute(`INSERT INTO user_preferences(user_id,receive_newsletter,receive_sms) VALUES(?,?,?)
    ON DUPLICATE KEY UPDATE receive_newsletter=?,receive_sms=?`,[req.user.id,b.receive_newsletter,b.receive_sms,b.receive_newsletter,b.receive_sms]);
  res.json({data:b});
});
export default router;
