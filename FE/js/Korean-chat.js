(() => {
 'use strict';
 const el=id=>document.getElementById(id), messages=el('chatMessages'), input=el('chatInput');
 let history=[], busy=false, generation=0, controller=null, language='kr', scenario='greeting', sent=0, replies=0, started=Date.now();
 const status=document.createElement('p');status.id='chatServiceStatus';status.setAttribute('role','status');
 document.querySelector('.chat-bot-info p').replaceWith(status);
 const dot=document.querySelector('.online-dot');
 function message(role,text){
  const row=document.createElement('div');row.className='message '+role;
  const avatar=document.createElement('div');avatar.className='msg-avatar';avatar.textContent=role==='user'?'👤':'🤖';
  const body=document.createElement('div'),bubble=document.createElement('div'),time=document.createElement('div');
  bubble.className='msg-bubble';bubble.textContent=text;
  time.className='msg-time';time.textContent=new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'});
  body.append(bubble,time);row.append(avatar,body);messages.append(row);messages.scrollTop=messages.scrollHeight;return row;
 }
 async function health(){
  try{const r=await fetch('/api/korea/chat/status',{signal:AbortSignal.timeout(4000)});const h=await r.json();
   const ready=r.ok&&h.ready;status.textContent=ready?'V2 · Bản thử nghiệm · Đã kết nối':'V2 · Model chưa hoạt động';dot.style.background=ready?'#de9b00':'#999';
  }catch{status.textContent='V2 · Không kết nối được máy chủ';dot.style.background='#999';}
 }
 function reset(){
  generation++;controller?.abort();controller=null;busy=false;el('chatSend').disabled=false;
  history=[];messages.replaceChildren();sent=0;replies=0;started=Date.now();el('chatMsgCount').textContent='0';el('chatWordCount').textContent='0';
  message('bot','안녕하세요! Bạn muốn luyện nói về điều gì?\nĐây là model V2 thử nghiệm. Câu trả lời, đặc biệt phần giải thích ngữ pháp, có thể chưa chính xác.');
 }
 async function send(){
  const text=input.value.trim();if(!text||busy)return;
  if(text.length>1200){message('bot','Vui lòng nhập tối đa 1.200 ký tự.');return;}
  const current=generation;busy=true;el('chatSend').disabled=true;controller=new AbortController();const abort=controller;
  message('user',text);input.value='';el('chatMsgCount').textContent=String(++sent);
  const pending=message('bot','Đang trả lời…');
  const timer=setTimeout(()=>abort.abort(),95000);
  try{
   const r=await fetch('/api/korea/chat',{method:'POST',credentials:'same-origin',signal:abort.signal,headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web'},body:JSON.stringify({message:text,history,language,scenario})});
   const result=await r.json();if(current!==generation)return;
   if(!r.ok)throw new Error(r.status===401?'Bạn cần đăng nhập để trò chuyện.':result.error||'Chưa nhận được phản hồi.');
   const reply=result.data?.reply;if(typeof reply!=='string')throw new Error('Phản hồi máy chủ không hợp lệ.');
   pending.remove();message('bot',reply);
   history.push({role:'user',content:text},{role:'assistant',content:reply});history=history.slice(-12);
   while(history.reduce((n,m)=>n+m.content.length,0)>16000)history.splice(0,2);
   el('chatWordCount').textContent=String(++replies);
   if(result.data.truncated)message('bot','Phản hồi đã đạt giới hạn độ dài. Bạn có thể yêu cầu giải thích ngắn hơn.');
  }catch(e){if(current!==generation)return;pending.remove();message('bot',e.name==='AbortError'?'Model phản hồi quá lâu. Vui lòng thử lại.':e.message);input.value=text;}
  finally{clearTimeout(timer);if(current===generation){busy=false;controller=null;el('chatSend').disabled=false;input.focus();health();}}
 }
 input.maxLength=1200;input.placeholder='한국어로 이야기해 보세요…';
 el('chatSend').setAttribute('aria-label','Gửi tin nhắn');el('chatSend').onclick=send;
 input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send();}});
 document.querySelectorAll('.lang-btn').forEach(button=>{
  button.classList.toggle('active',button.dataset.lang===language);
  button.onclick=()=>{language=button.dataset.lang;document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b===button));input.placeholder=language==='vi'?'Hỏi nghĩa hoặc yêu cầu giải thích bằng tiếng Việt…':'한국어로 이야기해 보세요…';};
 });
 document.querySelectorAll('.quick-chip').forEach(button=>button.onclick=()=>{if(!busy){input.value=button.dataset.text;send();}});
 const scenes={greeting:'안녕하세요! 한국어로 자기소개를 연습하고 싶어요.',restaurant:'식당 역할극을 해요. 당신은 직원이고 저는 손님이에요. 먼저 말해 주세요.',shopping:'옷 가게 역할극을 해요. 당신은 직원이고 저는 손님이에요.',love:'친구에게 고마운 마음을 한국어로 표현하고 싶어요.'};
 document.querySelectorAll('.scene-btn').forEach(button=>button.onclick=()=>{
  if(busy)return;scenario=button.dataset.scene;reset();document.querySelectorAll('.scene-btn').forEach(b=>b.classList.toggle('active',b===button));input.value=scenes[scenario];send();
 });
 el('chatReset').onclick=reset;
 el('chatInfo').onclick=()=>message('bot','Luyện Hàn: trò chuyện bằng tiếng Hàn. Giải thích Việt: hỏi nghĩa hoặc ngữ pháp bằng tiếng Việt. Chọn tình huống sẽ bắt đầu đoạn hội thoại mới. Bot nhớ tối đa 6 lượt gần nhất; không có chức năng đặt hàng hoặc thay đổi số dư.');
 setInterval(()=>{const seconds=Math.floor((Date.now()-started)/1000);el('chatTime').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');},1000);
 messages.setAttribute('aria-live','polite');messages.setAttribute('aria-label','Hội thoại với tutor');
 reset();health();setInterval(health,30000);
})();
