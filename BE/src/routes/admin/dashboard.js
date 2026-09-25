import { Router } from 'express';
import { pool } from '../../config/database.js';
import { badRequest } from '../../lib/validation.js';
const router=Router();
router.get('/dashboard',async(req,res)=>{
 const range=req.query.range||'month';if(!['week','month','year'].includes(range))throw badRequest('Khoảng thời gian không hợp lệ.');
 const [[{today}]]=await pool.execute("SELECT DATE_FORMAT(UTC_TIMESTAMP()+INTERVAL 7 HOUR,'%Y-%m-%d') AS today");
 const date=new Date(today+'T00:00:00Z'), year=date.getUTCFullYear(),month=date.getUTCMonth();
 let start=new Date(date),end=new Date(date);end.setUTCDate(end.getUTCDate()+1);
 if(range==='week')start.setUTCDate(start.getUTCDate()-6);
 if(range==='month')start=new Date(Date.UTC(year,month,1));
 if(range==='year')start=new Date(Date.UTC(year,0,1));
 const iso=d=>d.toISOString().slice(0,10);
 // Revenue is recognized on delivery, using stored history and falling back for legacy orders.
 const delivered="DATE(COALESCE((SELECT MAX(h.created_at) FROM order_status_history h WHERE h.order_id=o.id AND h.status='delivered'),o.updated_at)+INTERVAL 7 HOUR)";
 const [[summary]]=await pool.execute(`SELECT
 (SELECT COUNT(*) FROM orders WHERE DATE(created_at+INTERVAL 7 HOUR)=?) AS ordersToday,
 (SELECT COALESCE(SUM(o.total_amount),0) FROM orders o WHERE o.status='delivered' AND ${delivered}>=? AND ${delivered}<?) AS monthRevenue,
 (SELECT COUNT(*) FROM users WHERE role='customer') AS customers,
 (SELECT COALESCE(AVG(rating),0) FROM product_reviews) AS rating`,[today,iso(new Date(Date.UTC(year,month,1))),iso(end)]);
 const bucket=range==='year'?`DATE_FORMAT(${delivered},'%Y-%m')`:`DATE_FORMAT(${delivered},'%Y-%m-%d')`;
 const [revenue]=await pool.execute(`SELECT ${bucket} AS bucket,SUM(o.total_amount) AS value FROM orders o WHERE o.status='delivered' AND ${delivered}>=? AND ${delivered}<? GROUP BY bucket ORDER BY bucket`,[iso(start),iso(end)]);
 const chart=[];for(let d=new Date(start);d<end;range==='year'?d.setUTCMonth(d.getUTCMonth()+1):d.setUTCDate(d.getUTCDate()+1)){
  const key=iso(d).slice(0,range==='year'?7:10);chart.push({label:range==='year'?'T'+(d.getUTCMonth()+1):d.getUTCDate()+'/'+(d.getUTCMonth()+1),value:Number(revenue.find(r=>r.bucket===key)?.value||0)});
 }
 const [categories]=await pool.execute(`SELECT c.id,c.name,SUM(i.quantity) AS quantity FROM order_items i JOIN orders o ON o.id=i.order_id JOIN product_variants v ON v.id=i.variant_id JOIN products p ON p.id=v.product_id JOIN categories c ON c.id=p.category_id WHERE o.status='delivered' AND ${delivered}>=? AND ${delivered}<? GROUP BY c.id,c.name ORDER BY quantity DESC,c.id`,[iso(start),iso(end)]);
 const [topProducts]=await pool.execute(`SELECT p.id,p.name,SUM(i.quantity) AS sales FROM order_items i JOIN orders o ON o.id=i.order_id JOIN product_variants v ON v.id=i.variant_id JOIN products p ON p.id=v.product_id WHERE o.status='delivered' AND ${delivered}>=? AND ${delivered}<? GROUP BY p.id,p.name ORDER BY sales DESC,p.id LIMIT 5`,[iso(start),iso(end)]);
 const [activities]=await pool.execute(`SELECT o.order_number,u.full_name AS customer,o.status,o.total_amount,o.updated_at FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.updated_at DESC,o.id DESC LIMIT 8`);
 res.set('Cache-Control','no-store').json({data:{...Object.fromEntries(Object.entries(summary).map(([k,v])=>[k,Number(v)])),range,chart,categories,topProducts,activities,period:{start:iso(start),end:today},timezone:'Asia/Ho_Chi_Minh'}});
});
export default router;
