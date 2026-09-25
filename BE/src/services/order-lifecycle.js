import { pool } from '../config/database.js';
// History timestamps survive restarts; overdue orders catch up in both phases.
export async function advanceOrders(orderId=null) {
  for(const [from,to] of [['confirmed','shipping'],['shipping','delivered']]){
    const [rows]=await pool.execute(`SELECT o.id FROM orders o WHERE o.status=? AND (? IS NULL OR o.id=?) AND
      COALESCE((SELECT MAX(h.created_at) FROM order_status_history h WHERE h.order_id=o.id AND h.status=o.status),o.updated_at)<=UTC_TIMESTAMP()-INTERVAL 1 DAY`,[from,orderId,orderId]);
    for(const row of rows){
      const conn=await pool.getConnection();
      try{
        await conn.beginTransaction();
        const [[order]]=await conn.execute('SELECT id,user_id,status,updated_at FROM orders WHERE id=? FOR UPDATE',[row.id]);
        if(!order||order.status!==from){await conn.rollback();continue;}
        const [[timing]]=await conn.execute(`SELECT DATE_ADD(COALESCE(MAX(created_at),?),INTERVAL 1 DAY) AS due,
          DATE_ADD(COALESCE(MAX(created_at),?),INTERVAL 1 DAY)<=UTC_TIMESTAMP() AS ready
          FROM order_status_history WHERE order_id=? AND status=?`,[order.updated_at,order.updated_at,row.id,from]);
        if(!timing.ready){await conn.rollback();continue;}
        await conn.execute('UPDATE orders SET status=? WHERE id=?',[to,row.id]);
        await conn.execute('INSERT INTO order_status_history(order_id,status,note,created_at) VALUES(?,?,?,?)',[row.id,to,'Tự động chuyển trạng thái sau 24 giờ',timing.due]);
        await conn.execute("INSERT INTO notifications(user_id,kind,title,message,target_path) VALUES(?,'order',?,?,?)",[order.user_id,to==='shipping'?'Đơn hàng đang giao':'Đơn hàng đã giao','Đơn hàng của bạn đã được cập nhật trạng thái.','/html/profile.html#orders']);
        await conn.commit();
      }catch(error){await conn.rollback();throw error;}finally{conn.release();}
    }
  }
}
export function startOrderLifecycle(){
  let running=false;
  const tick=async()=>{if(running)return;running=true;try{await advanceOrders();}catch(e){console.error('Order lifecycle failed:',e.code||e.name);}finally{running=false;}};
  void tick();const timer=setInterval(tick,60000);timer.unref();return ()=>clearInterval(timer);
}
