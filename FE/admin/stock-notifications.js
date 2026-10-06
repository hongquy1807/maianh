(() => {
 const button=document.querySelector('.topbar-icon-btn[title="Thông báo"]');
 const badge=button?.querySelector('.badge');
 if(button)button.onclick=()=>{location.href='/html/profile.html#notifications';};
 async function refresh(){
  try{const r=await fetch('/api/notifications/unread-count',{credentials:'same-origin'});if(!r.ok)return;const {data}=await r.json();if(badge){badge.textContent=data.unread_count;badge.hidden=!data.unread_count;}}catch{}
 }
 const tab=()=>{if(location.hash==='#products')document.querySelector('.nav-item[data-tab="products"]')?.click();};
 window.addEventListener('hashchange',tab);window.addEventListener('load',tab);tab();refresh();
 setInterval(()=>{if(!document.hidden)refresh();},15000);
})();
