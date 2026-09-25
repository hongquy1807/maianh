import { Router } from 'express';
import { createHash } from 'node:crypto';
import { pool } from '../config/database.js';
import { requireAuth } from './auth.js';
import { badRequest, resourceId } from '../lib/validation.js';
const router=Router();
const fail=(status,message)=>Object.assign(new Error(message),{status,publicMessage:message});
// Same voucher rules as the storefront; amounts are always recomputed on the server.
const coupons={iuhongquy:50,iuhongquy20:20,chaohongquy:10,hongquygiaohang:'fixed',hongquyfreeship:'ship'};
router.use(requireAuth);
router.post('/',async(req,res)=>{
  if(req.get('X-Requested-With')!=='maianh-web'||req.get('Sec-Fetch-Site')==='cross-site')throw fail(403,'Yêu cầu không hợp lệ.');
  const b=req.body||{}, methods={cod:'cod',bank:'bank_transfer',wallet:'momo',store_pay:'store_pay'};
  if(!Object.hasOwn(methods,b.method))throw badRequest('Phương thức không hợp lệ.');
  if(typeof b.key!=='string'||!/^[a-f0-9-]{36}$/.test(b.key))throw badRequest('Mã giao dịch không hợp lệ.');
  const key=`checkout:${req.user.id}:${b.key}`;
  if(!Array.isArray(b.items)||!b.items.length||b.items.length>100)throw badRequest('Giỏ hàng không hợp lệ.');
  const items=b.items.map(i=>({id:resourceId(String(i.variant_id)),quantity:i.quantity})).sort((a,b)=>a.id.localeCompare(b.id));
  if(items.some(i=>!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>99)||new Set(items.map(i=>i.id)).size!==items.length)throw badRequest('Số lượng không hợp lệ.');
  const a=b.address||{};
  for(const [k,max] of [['full_name',120],['phone',24],['address',500]])if(typeof a[k]!=='string'||!a[k].trim()||a[k].length>max)throw badRequest('Thông tin nhận hàng không hợp lệ.');
  if(!/^(0|\+84)\d{9,10}$/.test(a.phone.replace(/[\s.-]/g,'')))throw badRequest('Số điện thoại không hợp lệ.');
  if(!Array.isArray(b.coupons)||b.coupons.length>5||b.coupons.some(c=>!Object.hasOwn(coupons,c))||new Set(b.coupons).size!==b.coupons.length)throw badRequest('Voucher không hợp lệ.');
  const fingerprint=createHash('sha256').update(JSON.stringify({items,method:b.method,address:a,coupons:[...b.coupons].sort(),expected_total:b.expected_total})).digest('hex');
  const conn=await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[user]]=await conn.execute('SELECT cash FROM users WHERE id=? FOR UPDATE',[req.user.id]);
    const [previous]=await conn.execute(`SELECT p.provider_reference,o.id,o.order_number,o.total_amount FROM payments p JOIN orders o ON o.id=p.order_id WHERE p.idempotency_key=? AND o.user_id=?`,[key,req.user.id]);
    if(previous.length){if(previous[0].provider_reference!==fingerprint)throw fail(409,'Mã giao dịch đã dùng cho đơn hàng khác.');await conn.commit();return res.json({data:previous[0]});}
    let subtotal=0;
    for(const i of items){
      const [[v]]=await conn.execute(`SELECT v.*,p.name,p.is_active AS product_active FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.id=? FOR UPDATE`,[i.id]);
      const [[cart]]=await conn.execute('SELECT quantity FROM cart_items WHERE user_id=? AND variant_id=? FOR UPDATE',[req.user.id,i.id]);
      if(!v||!v.is_active||!v.product_active||!cart||Number(cart.quantity)!==i.quantity)throw fail(409,'Giỏ hàng đã thay đổi. Vui lòng quay lại giỏ hàng.');
      if(v.stock_quantity<i.quantity)throw fail(409,'Sản phẩm không đủ tồn kho.');
      i.variant=v;subtotal+=Number(v.price)*i.quantity;
    }
    let discount=0;
    for(const code of b.coupons){const rule=coupons[code];if(rule==='fixed'){if(subtotal<200000)throw badRequest('Voucher yêu cầu đơn từ 200.000đ.');discount+=50000;}else if(typeof rule==='number')discount+=Math.round(subtotal*rule/100);}
    discount=Math.min(discount,subtotal);
    const shipping=subtotal>=500000||b.coupons.includes('hongquyfreeship')?0:30000;
    const total=subtotal+shipping-discount;
    if(!Number.isSafeInteger(total)||subtotal>99999999999999||total>99999999999999)throw badRequest('Giá trị đơn không hợp lệ.');
    if(b.expected_total!==total)throw fail(409,'Giá sản phẩm đã thay đổi. Vui lòng quay lại giỏ hàng.');
    if(b.method==='store_pay'){
      const [debit]=await conn.execute('UPDATE users SET cash=cash-? WHERE id=? AND cash>=?',[total,req.user.id,total]);
      if(!debit.affectedRows)throw Object.assign(fail(409,'Số dư không đủ để thanh toán đơn hàng.'),{publicCode:'INSUFFICIENT_BALANCE'});
    }
    const orderNumber='HQ-'+b.key;
    const [order]=await conn.execute(`INSERT INTO orders(order_number,user_id,recipient_name,recipient_phone,shipping_address,subtotal,shipping_fee,discount_amount,customer_note) VALUES(?,?,?,?,?,?,?,?,?)`,[orderNumber,req.user.id,a.full_name.trim(),a.phone.trim(),a.address.trim(),subtotal,shipping,discount,JSON.stringify({coupons:b.coupons})]);
    for(const i of items){const v=i.variant;await conn.execute('INSERT INTO order_items(order_id,variant_id,product_name,sku,size_label,color_label,unit_price,quantity) VALUES(?,?,?,?,?,?,?,?)',[order.insertId,i.id,v.name,v.sku,v.size_label,v.color_label,v.price,i.quantity]);await conn.execute('UPDATE product_variants SET stock_quantity=stock_quantity-? WHERE id=?',[i.quantity,i.id]);await conn.execute('DELETE FROM cart_items WHERE user_id=? AND variant_id=?',[req.user.id,i.id]);}
    const paid=b.method==='store_pay'||total===0;
    await conn.execute('INSERT INTO payments(order_id,method,status,provider_reference,idempotency_key,amount,paid_at) VALUES(?,?,?,?,?,?,?)',[order.insertId,methods[b.method],paid?'paid':'pending',fingerprint,key,total,paid?new Date():null]);
    await conn.execute('INSERT INTO notifications(user_id,kind,title,message,target_path) VALUES(?,?,?,?,?)',[req.user.id,'order','Đã tạo đơn hàng '+orderNumber,'Đơn hàng của bạn đã được ghi nhận. Tổng tiền: '+total.toLocaleString('vi-VN')+'đ.','/html/profile.html#orders']);
    await conn.commit();
    res.status(201).json({data:{id:String(order.insertId),order_number:orderNumber,total_amount:total,cash:b.method==='store_pay'?Number(user.cash)-total:Number(user.cash)}});
  }catch(error){await conn.rollback();if(error.publicCode==='INSUFFICIENT_BALANCE')return res.status(409).json({code:error.publicCode,error:error.publicMessage});throw error;}finally{conn.release();}
});
export default router;
