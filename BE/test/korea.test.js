import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import app from '../src/app.js';
import {pool} from '../src/config/database.js';
import {hashToken} from '../src/lib/passwords.js';
after(()=>pool.end());
test('TOPIK rewards are server-graded, owned and applied once',async()=>{
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base=`http://127.0.0.1:${server.address().port}/api/korea`;
 const token=randomBytes(32).toString('hex');let userId,categoryId,createdCategory=false;const wordIds=[];
 const call=(path,body,auth=true)=>fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web',...(auth?{Cookie:'maianh_session='+token}:{})},...(body?{body:JSON.stringify(body)}:{})});
 try{
  const [u]=await pool.execute('INSERT INTO users(email,password_hash,full_name,cash) VALUES(?,?,?,0)',[randomUUID()+'@example.invalid','disabled','Learning test']);userId=u.insertId;
  await pool.execute('INSERT INTO auth_sessions(user_id,token_hash,expires_at) VALUES(?,?,UTC_TIMESTAMP()+INTERVAL 1 HOUR)',[userId,hashToken(token)]);
  const [[category]]=await pool.execute("SELECT id FROM vocabulary_categories WHERE code='topik6'");
  if(category)categoryId=category.id;else{const [c]=await pool.execute("INSERT INTO vocabulary_categories(code,name) VALUES('topik6','TOPIK 6')");categoryId=c.insertId;createdCategory=true;}
  const words=[];for(const [korean,vietnamese] of [['가게','Cửa hàng'],['가다','Đi']]){const [w]=await pool.execute('INSERT INTO vocabulary(external_id,category_id,korean,vietnamese) VALUES(?,?,?,?)',[randomUUID(),categoryId,korean,vietnamese]);wordIds.push(w.insertId);words.push({id:w.insertId,korean,vietnamese});}
  for(let i=0;i<55;i++){const [w]=await pool.execute('INSERT INTO vocabulary(external_id,category_id,korean,vietnamese) VALUES(?,?,?,?)',[randomUUID(),categoryId,'단어'+i,'Từ thử '+i]);wordIds.push(w.insertId);}
  assert.equal((await call('/topics',undefined,false)).status,200);
  assert.equal((await call('/sessions',{mode:'flashcard',category_id:categoryId},false)).status,401);
  const started=await call('/sessions',{mode:'flashcard',category_id:categoryId});assert.equal(started.status,201);const initial=(await started.json()).data;
  assert.equal(initial.total,50);
  const [[deck]]=await pool.execute('SELECT words FROM korea_sessions WHERE id=?',[initial.id]);const selected=typeof deck.words==='string'?JSON.parse(deck.words):deck.words;assert.equal(new Set(selected.map(w=>String(w.id))).size,50);
  assert.equal((await call('/sessions/'+initial.id+'/skip',{index:0})).status,400);
  assert.equal((await (await call('/sessions',{mode:'flashcard',category_id:categoryId})).json()).data.id,initial.id);
  await pool.execute('UPDATE korea_sessions SET words=? WHERE id=?',[JSON.stringify(words),initial.id]);
  assert.equal((await call('/sessions/'+initial.id+'/answer',{index:1})).status,409);
  const first=(await (await call('/sessions/'+initial.id+'/answer',{index:0})).json()).data;assert.equal(first.result.delta,0);
  const answers=await Promise.all([call('/sessions/'+initial.id+'/answer',{index:1}),call('/sessions/'+initial.id+'/answer',{index:1})]);
  const results=await Promise.all(answers.map(r=>r.json()));assert.ok(results.every(r=>r.data.completed));
  const cash=async()=>{const [[u]]=await pool.execute('SELECT cash FROM users WHERE id=?',[userId]);return Number(u.cash);};assert.equal(await cash(),50000);
  const typing=(await (await call('/sessions',{mode:'typing',category_id:categoryId})).json()).data;
  assert.ok(!('korean' in typing.word));await pool.execute('UPDATE korea_sessions SET words=? WHERE id=?',[JSON.stringify(words),typing.id]);
  const right=(await (await call('/sessions/'+typing.id+'/answer',{index:0,answer:'가게'})).json()).data;assert.equal(right.result.correct,true);assert.equal(await cash(),60000);
  await call('/sessions/'+typing.id+'/answer',{index:0,answer:'wrong'});assert.equal(await cash(),60000);
  await pool.execute('UPDATE users SET cash=0 WHERE id=?',[userId]);assert.equal((await call('/sessions/'+typing.id+'/answer',{index:1,answer:'wrong'})).status,409);
  await pool.execute('UPDATE users SET cash=10000 WHERE id=?',[userId]);const wrong=(await (await call('/sessions/'+typing.id+'/answer',{index:1,answer:'wrong'})).json()).data;assert.equal(wrong.result.delta,-10000);assert.equal(await cash(),0);
  const skipping=(await (await call('/sessions',{mode:'typing',category_id:categoryId})).json()).data;
  await pool.execute('UPDATE korea_sessions SET words=? WHERE id=?',[JSON.stringify(words),skipping.id]);
  const skipped=(await (await call('/sessions/'+skipping.id+'/skip',{index:0})).json()).data;
  assert.equal(skipped.position,1);assert.equal(skipped.result.delta,0);assert.equal(skipped.result.answer,null);assert.equal(skipped.correct+skipped.wrong,0);
  await call('/sessions/'+skipping.id+'/skip',{index:0});assert.equal(await cash(),0);
  const finished=(await (await call('/sessions/'+skipping.id+'/skip',{index:1})).json()).data;assert.equal(finished.completed,true);assert.equal(await cash(),0);
  const [[attempts]]=await pool.execute('SELECT COUNT(*) AS n FROM vocabulary_attempts WHERE user_id=?',[userId]);assert.equal(Number(attempts.n),2);
  const [[n]]=await pool.execute("SELECT COUNT(*) AS n FROM notifications WHERE user_id=? AND kind='learning'",[userId]);assert.equal(Number(n.n),1);
 }finally{
  if(userId)await pool.execute('DELETE FROM users WHERE id=?',[userId]);for(const id of wordIds)await pool.execute('DELETE FROM vocabulary WHERE id=?',[id]);if(createdCategory)await pool.execute('DELETE FROM vocabulary_categories WHERE id=?',[categoryId]);
  server.closeAllConnections();await new Promise(r=>server.close(r));
 }
});
