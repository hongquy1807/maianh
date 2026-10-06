import {Router} from 'express';
import rateLimit from 'express-rate-limit';

const fail=(status,message)=>Object.assign(new Error(message),{status,publicMessage:message});
export function validateChat(body){
 if(!body || typeof body.message!=='string' || !body.message.trim() || body.message.length>1200)throw fail(400,'Nhập tin nhắn từ 1 đến 1.200 ký tự.');
 const history=body.history??[];
 if(!Array.isArray(history)||history.length>12||history.length%2)throw fail(400,'Lịch sử hội thoại không hợp lệ.');
 let total=body.message.length;
 for(let i=0;i<history.length;i++){
  const m=history[i];
  if(!m||m.role!==(i%2?'assistant':'user')||typeof m.content!=='string'||!m.content.trim()||m.content.length>5000)throw fail(400,'Lịch sử hội thoại không hợp lệ.');
  total+=m.content.length;
 }
 if(total>18000)throw fail(400,'Hội thoại quá dài. Hãy bắt đầu lại.');
 const language=body.language??'kr',scenario=body.scenario??'greeting';
 if(!['vi','kr'].includes(language)||!['greeting','restaurant','shopping','love'].includes(scenario))throw fail(400,'Chế độ hội thoại không hợp lệ.');
 return {message:body.message.trim(),history:history.map(({role,content})=>({role,content})),language,scenario};
}
export function createModelClient(){
 const base=new URL(process.env.KOREAN_MODEL_URL||'http://127.0.0.1:8001');
 const token=process.env.KOREAN_MODEL_TOKEN||'';
 const local=['127.0.0.1','localhost','[::1]'].includes(base.hostname);
 if(!local&&(base.protocol!=='https:'||!token))throw new Error('Remote Korean service requires HTTPS and KOREAN_MODEL_TOKEN');
 if(base.username||base.password||base.search||base.hash)throw new Error('Invalid KOREAN_MODEL_URL');
 return async(path,body)=>{
  const response=await fetch(new URL(path,base),{method:body?'POST':'GET',signal:AbortSignal.timeout(body?90000:3000),headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});
  if(!response.ok)throw fail(response.status===429?429:503,response.status===429?'Model đang bận. Vui lòng thử lại sau.':'Model chưa sẵn sàng. Vui lòng thử lại sau.');
  let bytes=0;const chunks=[];
  for await(const chunk of response.body){bytes+=chunk.length;if(bytes>65536)throw new Error('Oversize model response');chunks.push(chunk);}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
 };
}
export function createKoreanChatRouter({authenticate,client=createModelClient()}={}){
 if(!authenticate)throw new Error('Chat authentication is required');
 const router=Router();
 router.use((req,res,next)=>{res.set('Cache-Control','no-store');next();});
 router.use(rateLimit({windowMs:60000,limit:30,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Quá nhiều yêu cầu. Hãy thử lại sau một phút.'}}));
 router.get('/status',async(req,res)=>{
  try{const h=await client('/health');res.status(h.ready?200:503).json({ready:h.ready===true,quality:'experimental',model:'korean-tutor-v2'});}
  catch{res.status(503).json({ready:false,quality:'experimental',model:'korean-tutor-v2'});}
 });
 router.post('/',authenticate,(req,res,next)=>{
  if(req.get('X-Requested-With')!=='maianh-web'||req.get('Sec-Fetch-Site')==='cross-site')throw fail(403,'Yêu cầu không hợp lệ.');
  if(!req.is('application/json'))throw fail(415,'Cần gửi JSON.');next();
 },async(req,res)=>{
  const input=validateChat(req.body);
  try{
   const result=await client('/chat',input);
   if(typeof result.reply!=='string'||!result.reply.trim()||result.reply.length>5000)throw new Error('Invalid model reply');
   res.json({data:{reply:result.reply,quality:'experimental',truncated:result.truncated===true}});
  }catch(e){if(e.publicMessage)throw e;throw fail(503,'Không nhận được phản hồi từ model. Vui lòng thử lại sau.');}
 });
 return router;
}
