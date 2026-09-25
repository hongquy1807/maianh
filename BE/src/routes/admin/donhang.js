import { Router } from 'express';
import { pool } from '../../config/database.js';
import { resourceId } from '../../lib/validation.js';
const router=Router();
const fail=(status,message)=>Object.assign(new Error(message),{status,publicMessage:message});
router.use('/orders',(req,res,next)=>{
 res.set('Cache-Control','no-store');
 if(!['GET','HEAD','OPTIONS'].includes(req.method)&&(req.get('X-Requested-With')!=='maianh-web'||req.get('Sec-Fetch-Site')==='cross-site'))throw fail(403,'Yêu cầu không hợp lệ.');next();
});
router.get('/orders',async(req,res)=>{
 const [rows]=await pool.execute(`SELECT o.id AS order_id,o.order_number AS id,u.full_name AS customer,
 COALESCE((SELECT GROUP_CONCAT(CONCAT(i.product_name,' x',i.quantity) SEPARATOR ', ') FROM order_items i WHERE i.order_id=o.id),'') AS products,
 o.total_amount AS total,DATE_FORMAT(o.created_at,'%d/%m/%Y') AS date,o.status
 FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC,o.id DESC`);
 res.json({data:rows});
});
router.get('/orders/:id',async(req,res)=>{
 const id=resourceId(req.params.id);
 const [[order]]=await pool.execute(`SELECT o.*,u.full_name AS customer_name,u.email AS customer_email,u.phone AS customer_phone
 FROM orders o JOIN users u ON u.id=o.user_id WHERE o.id=?`,[id]);
 if(!order)throw fail(404,'Không tìm thấy đơn hàng.');
 const [items]=await pool.execute(`SELECT oi.*,(SELECT image_url FROM product_images WHERE product_id=v.product_id ORDER BY sort_order,id LIMIT 1) AS image_url
 FROM order_items oi LEFT JOIN product_variants v ON v.id=oi.variant_id WHERE oi.order_id=?`,[id]);
 const [payments]=await pool.execute('SELECT method,status,amount,paid_at FROM payments WHERE order_id=?',[id]);
 const [refunds]=await pool.execute('SELECT amount,status FROM refunds WHERE order_id=?',[id]);
 const [history]=await pool.execute('SELECT status,note,created_at FROM order_status_history WHERE order_id=? ORDER BY created_at,id',[id]);
 res.json({data:{...order,items,payments,refunds,history}});
});
async function changeOrder(req,res){
 const id=resourceId(req.params.id),cancel=req.params.action==='cancel';
 if(!cancel&&req.params.action!=='confirm')throw fail(404,'Thao tác không tồn tại.');
 const conn=await pool.getConnection();
 try{
  await conn.beginTransaction();
  const [[owner]]=await conn.execute('SELECT user_id FROM orders WHERE id=?',[id]);if(!owner)throw fail(404,'Không tìm thấy đơn hàng.');
  await conn.execute('SELECT id FROM users WHERE id=? FOR UPDATE',[owner.user_id]);
  const [[order]]=await conn.execute('SELECT * FROM orders WHERE id=? FOR UPDATE',[id]);
  if(!order)throw fail(404,'Không tìm thấy đơn hàng.');
  if(cancel?!['pending','confirmed'].includes(order.status):order.status!=='pending')throw fail(409,cancel?'Chỉ hủy đơn chờ xác nhận hoặc đã xác nhận, chưa giao.':'Đơn hàng không còn ở trạng thái chờ xác nhận.');
  const status=cancel?'cancelled':'confirmed';
  if(cancel){
   const [items]=await conn.execute('SELECT variant_id,quantity FROM order_items WHERE order_id=? ORDER BY variant_id',[id]);
   for(const item of items)await conn.execute('UPDATE product_variants SET stock_quantity=stock_quantity+? WHERE id=?',[item.quantity,item.variant_id]);
   const [payments]=await conn.execute("SELECT id,method,amount FROM payments WHERE order_id=? AND status='paid' FOR UPDATE",[id]);
   for(const payment of payments){
    if(payment.method==='store_pay')await conn.execute('UPDATE users SET cash=cash+? WHERE id=?',[payment.amount,order.user_id]);
    await conn.execute('INSERT INTO refunds(payment_id,order_id,reason,amount,status) VALUES(?,?,?,?,?)',[payment.id,id,'Shop hủy đơn hàng',payment.amount,payment.method==='store_pay'?'completed':'requested']);
   }
   await conn.execute("UPDATE payments SET status='cancelled' WHERE order_id=? AND status='pending'",[id]);
  }
  await conn.execute('UPDATE orders SET status=? WHERE id=?',[status,id]);
  await conn.execute('INSERT INTO order_status_history(order_id,actor_user_id,status,note) VALUES(?,?,?,?)',[id,req.user.id,status,cancel?'Shop hủy đơn hàng':'Shop xác nhận đơn hàng']);
  await conn.execute("INSERT INTO notifications(user_id,kind,title,message,target_path) VALUES(?,'order',?,?,?)",[order.user_id,cancel?'Đơn hàng đã hủy':'Đơn hàng đã xác nhận',cancel?'Shop đã hủy đơn hàng. Tiền thanh toán bằng số dư được hoàn vào tài khoản.':'Shop đã xác nhận và đang chuẩn bị đơn hàng.','/html/profile.html#orders']);
  await conn.commit();res.json({data:{id,status}});
 }catch(error){await conn.rollback();throw error;}finally{conn.release();}
}
router.post('/orders/:id/:action',changeOrder);
export default router;
