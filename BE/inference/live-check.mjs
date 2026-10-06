// Real HTTP + database session + inference; no mock. Temporary test user removed.
import {randomUUID,randomBytes} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {existsSync} from 'node:fs';
import {pool} from '../src/config/database.js';
import {hashToken} from '../src/lib/passwords.js';
const url='http://127.0.0.1:3000';
let userId;
try{
 const health=await fetch(url+'/api/korea/chat/status');
 if(!health.ok || !(await health.json()).ready)throw Error('Model not ready');
 const [u]=await pool.execute('INSERT INTO users(email,password_hash,full_name,cash) VALUES(?,?,?,0)',[randomUUID()+'@example.invalid','disabled','Local inference test']);userId=u.insertId;
 const token=randomBytes(32).toString('hex');
 await pool.execute('INSERT INTO auth_sessions(user_id,token_hash,expires_at) VALUES(?,?,UTC_TIMESTAMP()+INTERVAL 1 HOUR)',[userId,hashToken(token)]);
 const results=[];let history=[];
 for(const [message,language] of [['오늘 도서관에서 책을 빌렸어요.','kr'],['소설을 빌렸어요. 제가 어디에서 책을 빌렸어요?','kr'],['Giải thích bằng tiếng Việt: 왜 어제에는 갔어요를 써요?','vi']]){
 const start=Date.now();
 const r=await fetch(url+'/api/korea/chat',{method:'POST',signal:AbortSignal.timeout(95000),headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web',Cookie:'maianh_session='+token},body:JSON.stringify({message,history,language,scenario:'greeting'})});
 const result=await r.json();if(!r.ok)throw Error(JSON.stringify(result));
 results.push({message,language,...result.data,milliseconds:Date.now()-start});
 history.push({role:'user',content:message},{role:'assistant',content:result.data.reply});
 }
 const require=createRequire(import.meta.url);
 if(existsSync(new URL('./runtime/browser/node_modules/playwright',import.meta.url))){
  const {chromium}=require('./runtime/browser/node_modules/playwright');
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try{
   const context=await browser.newContext();
   await context.addCookies([{name:'maianh_session',value:token,url,httpOnly:true,sameSite:'Lax'}]);
   const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
   await page.goto(url+'/html/Korean.html');await page.locator('[data-mode="chatbot"]').click();
   await page.locator('#chatInput').fill('안녕하세요! 저는 한국어를 공부해요.');
   const response=page.waitForResponse(r=>r.url().endsWith('/api/korea/chat')&&r.request().method()==='POST',{timeout:95000});
   await page.locator('#chatSend').click();const r=await response;const data=await r.json();
   if(!r.ok()||!data.data?.reply)throw Error('Browser model request failed: '+JSON.stringify(data));
   await page.getByText(data.data.reply,{exact:true}).waitFor();
   if(pageErrors.length)throw Error(JSON.stringify(pageErrors));
   results.push({browser:true,reply:data.data.reply});
   await page.screenshot({path:new URL('./runtime/live-browser.png',import.meta.url).pathname.replace(/^\/(\w:)/,'$1'),fullPage:true});
  }finally{await browser.close();}
 }
 await writeFile(new URL('./runtime/live-results.json',import.meta.url),JSON.stringify(results,null,2),'utf8');
 console.log(JSON.stringify(results,null,2));
}finally{
 if(userId)await pool.execute('DELETE FROM users WHERE id=?',[userId]);
 await pool.end();
}
