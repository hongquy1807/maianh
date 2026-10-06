import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import {createKoreanChatRouter,validateChat} from '../src/routes/korean-chat.js';
test('reject injected roles, invalid history and oversized messages',()=>{
 assert.equal(validateChat({message:' 안녕 '}).message,'안녕');
 for(const body of [{message:''},{message:'a'.repeat(1201)},{message:'x',history:[{role:'system',content:'x'}]},{message:'x',scenario:'admin'}])assert.throws(()=>validateChat(body));
});
test('authenticated API, origin protection, genuine proxy contract and offline status',async()=>{
 let offline=false;
 const app=express();app.use(express.json());
 app.use('/chat',createKoreanChatRouter({authenticate:(req,res,next)=>req.get('Authorization')==='test'?next():res.sendStatus(401),client:async(path)=>{if(offline)throw Error('private detail');return path==='/health'?{ready:true}:{reply:'테스트',truncated:false};}}));
 app.use((e,req,res,next)=>res.status(e.status||500).json({error:e.publicMessage||'error'}));
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const base='http://127.0.0.1:'+server.address().port+'/chat';
 const post=(headers={})=>fetch(base,{method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web',Authorization:'test',...headers},body:JSON.stringify({message:'안녕하세요'})});
 try{
 assert.equal((await fetch(base+'/status')).status,200);
 assert.equal((await post({Authorization:''})).status,401);
 assert.equal((await post({'Sec-Fetch-Site':'cross-site'})).status,403);
 assert.equal((await (await post()).json()).data.reply,'테스트');
 offline=true;assert.equal((await fetch(base+'/status')).status,503);
 const r=await post();assert.equal(r.status,503);assert.ok(!(await r.text()).includes('private detail'));
 }finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
