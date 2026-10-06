import {pool} from '../config/database.js';
import {sendOrderEmail,mailConfigured} from './reset-mail.js';
export async function queueOrderEmail(conn,orderId,email,{orderNumber,items,total,paid}){
 const text=['Cảm ơn bạn đã đặt hàng tại Hongquy Store!', 'Mã đơn: '+orderNumber,
 ...items.map(i=>`${i.variant.name} x${i.quantity}`),'Tổng thanh toán: '+total.toLocaleString('vi-VN')+'đ',
 paid?'Đã thanh toán thành công. Đơn hàng đang giao và sẽ tự hoàn tất sau 5 phút.':'Đặt hàng thành công. Đơn hàng chưa được xác nhận thanh toán.',
 'Bạn có thể xem chi tiết tại mục Đơn hàng trong trang cá nhân.'].join('\n');
 const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const html=`<div style="background:#fff8e8;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#543a2c;line-height:1.6">
 <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #ffe3a3;border-radius:12px;overflow:hidden">
 <div style="padding:24px;background:#ffe5a0"><div style="font-size:13px;font-weight:700;letter-spacing:1px;color:#a26716">HONGQUY STORE</div><h1 style="font-size:24px;margin:12px 0 0">Đặt hàng thành công</h1></div>
 <div style="padding:24px"><p style="margin-top:0">Cảm ơn bạn đã mua sắm tại Hongquy Store!</p>
 <p style="font-size:13px;color:#80634e">Mã đơn hàng<br><strong style="color:#543a2c;overflow-wrap:anywhere;word-break:break-all">${escape(orderNumber)}</strong></p>
 <table style="width:100%;border-collapse:collapse;font-size:14px" cellpadding="0" cellspacing="0"><thead><tr style="background:#fff8e8"><th align="left" style="padding:12px">Sản phẩm</th><th align="right" style="padding:12px;white-space:nowrap">Số lượng</th></tr></thead><tbody>
 ${items.map(i=>`<tr><td style="padding:12px;border-bottom:1px solid #ffe8bc;word-break:break-word">${escape(i.variant.name)}</td><td align="right" style="padding:12px;border-bottom:1px solid #ffe8bc">x${escape(i.quantity)}</td></tr>`).join('')}</tbody></table>
 <div style="padding:18px;background:#fff8e8;border-radius:8px;margin-top:20px">Tổng thanh toán<br><strong style="font-size:26px;color:#b9750d">${escape(total.toLocaleString('vi-VN'))}đ</strong></div>
 <p><strong>Trạng thái thanh toán:</strong><br>${paid?'Đã thanh toán thành công':'Chưa xác nhận thanh toán'}</p>
 <p style="color:#80634e">${paid?'Đơn hàng đang giao và sẽ tự hoàn tất sau 5 phút.':'Đơn hàng đã được ghi nhận. Vui lòng hoàn tất thanh toán theo phương thức đã chọn.'}</p>
 <p style="padding:14px;border-left:3px solid #efb638;background:#fffaf0">Đăng nhập Hongquy Store → Trang cá nhân → Đơn hàng để xem chi tiết.</p>
 <div style="margin-top:26px;padding-top:18px;border-top:1px solid #ffe8bc;font-size:12px;color:#947966">Email tự động từ Hongquy Store. Vui lòng không trả lời thư này.</div>
 </div></div></div>`;
 await conn.execute('INSERT INTO order_mail_outbox(order_id,recipient,payload) VALUES(?,?,?)',[orderId,email,JSON.stringify({subject:'Hongquy Store | Đặt hàng thành công '+orderNumber,text,html})]);
}
export async function processOrderMail({send=sendOrderEmail,ready=mailConfigured}={}){
 if(!ready())return;
 const conn=await pool.getConnection();let job;
 try{await conn.beginTransaction();
 [[job]]=await conn.query("SELECT * FROM order_mail_outbox WHERE status IN ('pending','sending') AND next_attempt_at<=UTC_TIMESTAMP() ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED");
 if(job)await conn.execute("UPDATE order_mail_outbox SET status='sending',attempts=attempts+1,next_attempt_at=UTC_TIMESTAMP()+INTERVAL 2 MINUTE WHERE id=?",[job.id]);
 await conn.commit();}catch(e){await conn.rollback();throw e;}finally{conn.release();}
 if(!job)return;
 try{await send(job.recipient,typeof job.payload==='string'?JSON.parse(job.payload):job.payload);
 await pool.execute("UPDATE order_mail_outbox SET status='sent',sent_at=UTC_TIMESTAMP(),last_error=NULL WHERE id=?",[job.id]);
 }catch(e){await pool.execute("UPDATE order_mail_outbox SET status='pending',last_error=?,next_attempt_at=TIMESTAMPADD(SECOND,?,UTC_TIMESTAMP()) WHERE id=?",[String(e.code||'MAIL_FAILED').slice(0,80),Math.min(3600,30*2**Math.min(Number(job.attempts),7)),job.id]);}
}
export function startOrderMail(){let busy=false;const tick=async()=>{if(busy)return;busy=true;try{await processOrderMail();}catch(e){console.error('Order email queue:',e.code||e.name);}finally{busy=false;}};const timer=setInterval(tick,5000);timer.unref();void tick();return()=>clearInterval(timer);}
