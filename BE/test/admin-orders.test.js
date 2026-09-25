import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import app from '../src/app.js';
import {pool} from '../src/config/database.js';
import {hashToken} from '../src/lib/passwords.js';
import {advanceOrders} from '../src/services/order-lifecycle.js';
after(()=>pool.end());
test('admin orders ownership, confirmation, timed delivery and single refund',async()=>{
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const base=`http://127.0.0.1:${server.address().port}/api/admin/orders`,users=[],orders=[];
 const tokens=[randomBytes(32).toString('hex'),randomBytes(32).toString('hex')];
 const call=(path='',method='GET',token=tokens[0])=>fetch(base+path,{method,headers:{Cookie:'maianh_session='+token,'X-Requested-With':'maianh-web'}});
 try{
  for(let i=0;i<2;i++){
   const [u]=await pool.execute('INSERT INTO users(email,password_hash,full_name,role,cash) VALUES(?,?,?,?,0)',[randomUUID()+'@example.invalid','disabled','Order test',i?'customer':'admin']);users.push(u.insertId);
   await pool.execute('INSERT INTO auth_sessions(user_id,token_hash,expires_at) VALUES(?,?,UTC_TIMESTAMP()+INTERVAL 1 HOUR)',[u.insertId,hashToken(tokens[i])]);
  }
  async function createOrder(){const [o]=await pool.execute("INSERT INTO orders(order_number,user_id,recipient_name,recipient_phone,shipping_address,subtotal,shipping_fee,discount_amount) VALUES(?,?,?,?,?,100,0,0)",['T-'+randomUUID(),users[1],'Receiver','0912345678','Test address']);orders.push(o.insertId);return o.insertId;}
  const customerBase=base.replace('/orders','/customers');
  const customerCall=(path='',method='GET',body,token=tokens[0])=>fetch(customerBase+path,{method,headers:{Cookie:'maianh_session='+token,'X-Requested-With':'maianh-web','Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
  assert.equal((await customerCall('/'+users[1],'GET',undefined,tokens[1])).status,403);
  const details=await customerCall('/'+users[1]);assert.equal(details.status,200);assert.ok(!('password_hash' in (await details.json()).data));
  assert.equal((await customerCall('/'+users[1],'PATCH',{name:'Updated customer',address:'123 Street'})).status,200);
  assert.equal((await customerCall('/'+users[1],'PATCH',{cash:9999})).status,400);
  const gift={amount:'50000',key:randomUUID()};
  assert.equal((await customerCall('/'+users[1]+'/gifts','POST',{...gift,amount:'-1'})).status,400);
  assert.equal((await customerCall('/'+users[1]+'/gifts','POST',gift,tokens[1])).status,403);
  const gifts=await Promise.all([customerCall('/'+users[1]+'/gifts','POST',gift),customerCall('/'+users[1]+'/gifts','POST',gift)]);
  assert.deepEqual(gifts.map(r=>r.status).sort(),[200,201]);
  assert.equal((await customerCall('/'+users[1]+'/gifts','POST',{...gift,amount:'60000'})).status,409);
  const [[cash]]=await pool.execute('SELECT cash FROM users WHERE id=?',[users[1]]);assert.equal(Number(cash.cash),50000);
  const [notices]=await pool.execute("SELECT message FROM notifications WHERE user_id=? AND kind='system'",[users[1]]);assert.equal(notices.length,1);assert.ok(notices[0].message.includes('50.000đ'));
  await pool.execute('UPDATE users SET cash=0,full_name=? WHERE id=?',['Order test',users[1]]);
  for(const range of ['week','month','year']){
   const response=await fetch(base.replace('/orders','/dashboard')+'?range='+range,{headers:{Cookie:'maianh_session='+tokens[0]}});
   assert.equal(response.status,200);const dashboard=(await response.json()).data;
   assert.equal(dashboard.range,range);assert.ok(dashboard.chart.length>0);assert.ok(dashboard.chart.every(p=>Number.isFinite(p.value)&&p.value>=0));
   if(range==='week')assert.equal(dashboard.chart.length,7);
   assert.ok(Array.isArray(dashboard.categories));assert.ok(Array.isArray(dashboard.topProducts));assert.ok(Array.isArray(dashboard.activities));
  }
  assert.equal((await fetch(base.replace('/orders','/dashboard')+'?range=invalid',{headers:{Cookie:'maianh_session='+tokens[0]}})).status,400);
  assert.equal((await fetch(base.replace('/orders','/dashboard'),{headers:{Cookie:'maianh_session='+tokens[1]}})).status,403);
  const id=await createOrder();
  assert.equal((await call('','GET',tokens[1])).status,403);
  const detail=await call('/'+id);assert.equal(detail.status,200);assert.equal((await detail.json()).data.customer_name,'Order test');
  assert.equal((await call('/'+id+'/confirm','POST')).status,200);
  assert.equal((await call('/'+id+'/confirm','POST')).status,409);
  await advanceOrders(id);
  const state=async()=>{const [[o]]=await pool.execute('SELECT status FROM orders WHERE id=?',[id]);return o.status;};
  assert.equal(await state(),'confirmed');
  await pool.execute("UPDATE order_status_history SET created_at=UTC_TIMESTAMP()-INTERVAL 25 HOUR WHERE order_id=? AND status='confirmed'",[id]);
  await Promise.all([advanceOrders(id),advanceOrders(id)]);assert.equal(await state(),'shipping');
  assert.equal((await call('/'+id+'/cancel','POST')).status,409);
  await pool.execute("UPDATE order_status_history SET created_at=UTC_TIMESTAMP()-INTERVAL 25 HOUR WHERE order_id=? AND status='shipping'",[id]);
  await advanceOrders(id);assert.equal(await state(),'delivered');
  const [[counts]]=await pool.execute("SELECT COUNT(*) AS n FROM order_status_history WHERE order_id=? AND status='shipping'",[id]);assert.equal(Number(counts.n),1);
  const missed=await createOrder();await call('/'+missed+'/confirm','POST');
  await pool.execute("UPDATE order_status_history SET created_at=UTC_TIMESTAMP()-INTERVAL 49 HOUR WHERE order_id=? AND status='confirmed'",[missed]);
  await advanceOrders(missed);const [[caughtUp]]=await pool.execute('SELECT status FROM orders WHERE id=?',[missed]);assert.equal(caughtUp.status,'delivered');
  const cancelId=await createOrder();await call('/'+cancelId+'/confirm','POST');
  await pool.execute("INSERT INTO payments(order_id,method,status,amount,idempotency_key,paid_at) VALUES(?,'store_pay','paid',100,?,UTC_TIMESTAMP())",[cancelId,randomUUID()]);
  const responses=await Promise.all([call('/'+cancelId+'/cancel','POST'),call('/'+cancelId+'/cancel','POST')]);assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);
  const [[wallet]]=await pool.execute('SELECT cash FROM users WHERE id=?',[users[1]]);assert.equal(Number(wallet.cash),100);
  const [refunds]=await pool.execute('SELECT status FROM refunds WHERE order_id=?',[cancelId]);assert.equal(refunds.length,1);assert.equal(refunds[0].status,'completed');
 }finally{
  for(const id of orders)await pool.execute('DELETE FROM orders WHERE id=?',[id]);
  for(const id of users)await pool.execute('DELETE FROM customer_gifts WHERE user_id=? OR admin_id=?',[id,id]);
  for(const id of users)await pool.execute('DELETE FROM users WHERE id=?',[id]);
  server.closeAllConnections();await new Promise(r=>server.close(r));
 }
});
