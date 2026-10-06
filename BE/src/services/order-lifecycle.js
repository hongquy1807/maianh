import {pool} from '../config/database.js';
// Called inside the checkout transaction after the payment has been persisted.
export async function shipPaidOrder(conn,id){
 const [updated]=await conn.execute(`UPDATE orders o SET status='shipping' WHERE o.id=? AND o.status IN ('pending','confirmed')
 AND EXISTS(SELECT 1 FROM payments p WHERE p.order_id=o.id AND p.status='paid' AND p.amount>=o.total_amount)`,[id]);
 if(!updated.affectedRows)return;
 await conn.execute("INSERT INTO order_status_history(order_id,status,note) VALUES(?,'shipping',?)",[id,'Đã thanh toán thành công. Tự động giao hàng trong 5 phút.']);
 await conn.execute(`INSERT INTO notifications(user_id,kind,title,message,target_path)
 SELECT user_id,'order','Đơn hàng đang giao','Đã thanh toán thành công. Đơn hàng sẽ tự hoàn tất sau 5 phút.','/html/profile.html#orders' FROM orders WHERE id=?`,[id]);
}
// Persisted timestamps let the worker catch up after a restart. Row locks prevent duplicate events.
export async function advanceOrders(orderId=null,userId=null){
 const [rows]=await pool.execute(`SELECT o.id FROM orders o WHERE (? IS NULL OR o.id=?) AND (? IS NULL OR o.user_id=?) AND
 (o.status='confirmed' OR (o.status='pending' AND EXISTS(SELECT 1 FROM payments p WHERE p.order_id=o.id AND p.status='paid' AND p.amount>=o.total_amount)) OR
 (o.status='shipping' AND COALESCE((SELECT MAX(created_at) FROM order_status_history WHERE order_id=o.id AND status='shipping'),o.updated_at)<=UTC_TIMESTAMP()-INTERVAL 5 MINUTE))`,[orderId,orderId,userId,userId]);
 for(const row of rows){
  const conn=await pool.getConnection();
  try{
   await conn.beginTransaction();
   const [[o]]=await conn.execute('SELECT * FROM orders WHERE id=? FOR UPDATE',[row.id]);
   if(!o){await conn.rollback();continue;}
   if(['pending','confirmed'].includes(o.status)){
    const [[payment]]=await conn.execute("SELECT MAX(COALESCE(paid_at,created_at)) AS since FROM payments WHERE order_id=? AND status='paid' AND amount>=?",[o.id,o.total_amount]);
    let since=payment.since;
    if(!since&&o.status==='confirmed'){
     const [[h]]=await conn.execute("SELECT COALESCE(MAX(created_at),?) AS since FROM order_status_history WHERE order_id=? AND status='confirmed'",[o.updated_at,o.id]);since=h.since;
    }
    if(since){
     await conn.execute("UPDATE orders SET status='shipping' WHERE id=?",[o.id]);
     await conn.execute("INSERT INTO order_status_history(order_id,status,note,created_at) VALUES(?,'shipping',?,?)",[o.id,'Tự động giao hàng trong 5 phút.',since]);
     await conn.execute("INSERT INTO notifications(user_id,kind,title,message,target_path) VALUES(?,'order','Đơn hàng đang giao',?,'/html/profile.html#orders')",[o.user_id,'Đơn hàng '+o.order_number+' đã chuyển sang giao hàng.']);
     o.status='shipping';
    }
   }
   if(o.status==='shipping'){
    const [[t]]=await conn.execute(`SELECT DATE_ADD(COALESCE(MAX(created_at),?),INTERVAL 5 MINUTE) AS due,
     DATE_ADD(COALESCE(MAX(created_at),?),INTERVAL 5 MINUTE)<=UTC_TIMESTAMP() AS ready
     FROM order_status_history WHERE order_id=? AND status='shipping'`,[o.updated_at,o.updated_at,o.id]);
    if(Number(t.ready) === 1){
     await conn.execute("UPDATE orders SET status='delivered' WHERE id=?",[o.id]);
     await conn.execute("INSERT INTO order_status_history(order_id,status,note,created_at) VALUES(?,'delivered',?,?)",[o.id,'Tự động hoàn tất giao hàng sau 5 phút.',t.due]);
     await conn.execute("INSERT INTO notifications(user_id,kind,title,message,target_path) VALUES(?,'order','Đã giao hàng',?,'/html/profile.html#owned')",[o.user_id,'Đơn hàng '+o.order_number+' đã giao thành công. Xem lại trong Vật phẩm đã sở hữu.']);
    }
   }
   await conn.commit();
  }catch(e){await conn.rollback();throw e;}finally{conn.release();}
 }
}
export function startOrderLifecycle(){
 let running=false;
 const tick=async()=>{if(running)return;running=true;try{await advanceOrders();}catch(e){console.error('Order lifecycle failed:',e.code||e.name);}finally{running=false;}};
 void tick();const timer=setInterval(tick,1000);timer.unref();return ()=>clearInterval(timer);
}
