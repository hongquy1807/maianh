import { Router } from 'express';
import { randomUUID,randomInt } from 'node:crypto';
import { pool } from '../config/database.js';
import { requireAuth } from './auth.js';
import { badRequest,resourceId } from '../lib/validation.js';
const router=Router();
const fail=(status,message)=>Object.assign(new Error(message),{status,publicMessage:message});
const json=v=>typeof v==='string'?JSON.parse(v):v;
function state(s,cash){
 const words=json(s.words),results=json(s.results),w=words[s.position];
 return {id:s.id,mode:s.mode,category_id:s.category_id,position:s.position,total:words.length,completed:Boolean(s.completed),cash,
 correct:results.filter(r=>r.correct===true).length,wrong:results.filter(r=>r.correct===false).length,
 word:!w?null:s.mode==='typing'?{vietnamese:w.vietnamese}:{...w}};
}
router.use((req,res,next)=>{res.set('Cache-Control','no-store');next();});
router.get('/topics',async(req,res)=>{
 const [data]=await pool.execute(`SELECT c.id,c.code,c.name,COUNT(v.id) AS word_count FROM vocabulary_categories c
 LEFT JOIN vocabulary v ON v.category_id=c.id AND v.is_active=1 WHERE c.code REGEXP '^topik[1-6]$'
 GROUP BY c.id,c.code,c.name ORDER BY c.code`);res.json({data});
});
router.use(requireAuth,(req,res,next)=>{
 if(req.method!=='GET'&&(req.get('X-Requested-With')!=='maianh-web'||req.get('Sec-Fetch-Site')==='cross-site'))throw fail(403,'Yêu cầu không hợp lệ.');next();
});
router.post('/sessions',async(req,res)=>{
 const category=resourceId(String(req.body?.category_id||'')),mode=req.body?.mode;
 if(!['flashcard','typing'].includes(mode))throw badRequest('Chế độ không hợp lệ.');
 const conn=await pool.getConnection();
 try{
  await conn.beginTransaction();
  const [[user]]=await conn.execute('SELECT cash FROM users WHERE id=? FOR UPDATE',[req.user.id]);
  const [[existing]]=await conn.execute('SELECT * FROM korea_sessions WHERE user_id=? AND category_id=? AND mode=? AND completed=0 ORDER BY created_at DESC LIMIT 1',[req.user.id,category,mode]);
  if(existing && (mode!=='flashcard'||json(existing.words).length<=50)){await conn.commit();return res.json({data:state(existing,user.cash)});}
  // Retire legacy full-deck sessions without awarding money; start a new 50-card deck.
  if(existing)await conn.execute('UPDATE korea_sessions SET completed=1 WHERE id=?',[existing.id]);
  const [words]=await conn.execute(`SELECT v.id,v.korean,v.vietnamese,v.romanization,v.word_type,v.example_ko,v.example_vi,c.name AS category_name FROM vocabulary v JOIN vocabulary_categories c ON c.id=v.category_id WHERE v.category_id=? AND v.is_active=1 AND c.code REGEXP '^topik[1-6]$'`,[category]);
  if(!words.length)throw fail(404,'TOPIK này chưa có từ vựng.');
  for(let i=words.length-1;i>0;i--){const j=randomInt(i+1);[words[i],words[j]]=[words[j],words[i]];}
  if(mode==='flashcard')words.splice(50);
  const s={id:randomUUID(),category_id:category,mode,words,results:[],position:0,completed:0};
  await conn.execute('INSERT INTO korea_sessions(id,user_id,category_id,mode,words,results) VALUES(?,?,?,?,?,?)',[s.id,req.user.id,category,mode,JSON.stringify(words),'[]']);
  await conn.commit();res.status(201).json({data:state(s,user.cash)});
 }catch(e){await conn.rollback();throw e;}finally{conn.release();}
});
router.post('/sessions/:id/:action',async(req,res)=>{
 const skip=req.params.action==='skip';
 if(!skip&&req.params.action!=='answer')throw fail(404,'Thao tác không tồn tại.');
 const id=req.params.id,index=req.body?.index;
 if(!/^[a-f0-9-]{36}$/i.test(id)||!Number.isInteger(index)||index<0)throw badRequest('Lượt học không hợp lệ.');
 const conn=await pool.getConnection();
 try{
  await conn.beginTransaction();
  const [[user]]=await conn.execute('SELECT cash FROM users WHERE id=? FOR UPDATE',[req.user.id]);
  const [[s]]=await conn.execute('SELECT * FROM korea_sessions WHERE id=? AND user_id=? FOR UPDATE',[id,req.user.id]);
  if(!s)throw fail(404,'Không tìm thấy lượt học.');
  if(skip&&s.mode!=='typing')throw badRequest('Chỉ đổi câu trong chế độ gõ.');
  const words=json(s.words),results=json(s.results);
  if(index<s.position){await conn.commit();return res.json({data:{...state(s,user.cash),result:results[index],replayed:true}});}
  if(s.completed||index!==s.position)throw fail(409,'Hãy hoàn thành thẻ hiện tại trước.');
  const w=words[index];let delta=0,correct=null;
  if(s.mode==='typing'&&!skip){
   const answer=req.body?.answer;
   if(typeof answer!=='string'||!answer.trim()||answer.length>255)throw badRequest('Nhập câu trả lời tiếng Hàn tối đa 255 ký tự.');
   if(Number(user.cash)<10000)throw fail(409,'Cần ít nhất 10.000đ để tiếp tục chế độ gõ. Bạn có thể lật thẻ để nhận thêm thưởng.');
   const normalize=v=>v.normalize('NFC').trim().replace(/\s+/gu,' ');
   correct=normalize(answer)===normalize(w.korean);delta=correct?10000:-10000;
  }else if(s.mode==='flashcard'&&index===words.length-1)delta=50000;
  if(delta){const [updated]=await conn.execute('UPDATE users SET cash=cash+? WHERE id=? AND cash+? BETWEEN 0 AND 9999999999999.99',[delta,req.user.id,delta]);if(!updated.affectedRows)throw fail(409,'Số dư vượt giới hạn cho phép.');}
  const result={delta,correct,skipped:skip,answer:skip?null:w.korean};results.push(result);s.results=results;s.position++;s.completed=s.position===words.length?1:0;
  await conn.execute('UPDATE korea_sessions SET position=?,completed=?,results=? WHERE id=?',[s.position,s.completed,JSON.stringify(results),id]);
  if(s.mode==='typing'&&!skip)await conn.execute('INSERT INTO vocabulary_attempts(user_id,word_id,is_correct) SELECT ?,id,? FROM vocabulary WHERE id=?',[req.user.id,correct?1:0,w.id]);
  if(s.completed&&s.mode==='flashcard')await conn.execute("INSERT INTO notifications(user_id,kind,title,message,target_path) VALUES(?,'learning',?,?,?)",[req.user.id,'Chúc mừng hoàn thành lật thẻ!','Bạn đã hoàn thành tất cả thẻ và nhận 50.000đ. Tiếp tục phát huy nhé!','/html/Korean.html']);
  const [[balance]]=await conn.execute('SELECT cash FROM users WHERE id=?',[req.user.id]);await conn.commit();
  res.json({data:{...state(s,balance.cash),result,replayed:false}});
 }catch(e){await conn.rollback();throw e;}finally{conn.release();}
});
export default router;
