(async () => {
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = v => Number(v || 0).toLocaleString('vi-VN')+'đ';
  let data, orders=[];
  function notice(message) { $('#toastMsg').textContent=message; $('#toast').classList.add('show'); setTimeout(()=>$('#toast').classList.remove('show'),3500); }
  async function api(path='',method='GET',body) {
    const r=await fetch('/api/profile'+path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web'},...(body?{body:JSON.stringify(body)}:{})});
    const result=await r.json();
    if(r.status===401) location.replace('DangNhap.html');
    if(!r.ok) throw new Error(result.error || 'Không thể tải hồ sơ.');
    return result.data;
  }
  const addressText=a=>[a.address_line,a.ward,a.district,a.province].filter(Boolean).join(', ');
  document.querySelectorAll('.sidebar-nav-item').forEach(button=>button.onclick=()=>{
    document.querySelectorAll('.sidebar-nav-item,.tab-panel').forEach(el=>el.classList.remove('active'));
    button.classList.add('active'); $('#tab-'+button.dataset.tab).classList.add('active');
  });
  function count(tab,n) { const el=$(`[data-tab="${tab}"] .nav-count`); if(el) el.textContent=n; }
  function render() {
    const u=data.user, address=data.addresses.find(a=>a.is_default) || data.addresses[0];
    $('.hero-name-row h1').textContent=u.full_name;
    const contacts=document.querySelectorAll('.hero-info > p > span');
    [u.email,u.phone || 'Chưa có số điện thoại','Tham gia từ '+String(u.created_at).slice(0,10)].forEach((v,i)=>contacts[i].textContent=v);
    $('.hero-rank').textContent='Thành viên';
    $('.membership-card').hidden=true;
    let balance=$('#heroBalance');
    if(!balance) {balance=document.createElement('div');balance.id='heroBalance';$('.hero-stats-row').before(balance);}
    balance.innerHTML=`<span class="balance-icon"><i class="fas fa-wallet" aria-hidden="true"></i></span><div class="balance-copy"><span class="balance-label">Số dư tài khoản</span><strong>${money(u.cash)}</strong></div>`;
    document.querySelectorAll('.hero-stat strong').forEach((el,i)=>el.textContent=Number([data.stats.orders,data.stats.points,data.stats.wishlist][i]).toLocaleString('vi-VN'));
    $('.info-grid').innerHTML=Object.entries({'Họ và tên':u.full_name,'Email':u.email,'Số điện thoại':u.phone || 'Chưa cập nhật','Ngày tham gia':String(u.created_at).slice(0,10),'Địa chỉ hồ sơ':u.address || 'Chưa cập nhật'}).map(([label,value])=>`<div class="info-field"><label>${label}</label><div class="info-value">${esc(value)}</div></div>`).join('');
    const avatar=$('.hero-avatar');
    avatar.replaceChildren();
    if(u.avatar_url) { const img=document.createElement('img'); img.src=u.avatar_url; img.alt=u.full_name; img.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:50%'; avatar.append(img); } else avatar.textContent='👤';
    const avatarButton=document.createElement('button'); avatarButton.type='button';avatarButton.className='avatar-upload-button';avatarButton.title='Đổi ảnh đại diện';avatarButton.setAttribute('aria-label','Đổi ảnh đại diện');avatarButton.innerHTML='<i class="fas fa-camera" aria-hidden="true"></i>';avatarButton.onclick=()=>avatarInput.click();avatar.append(avatarButton);
    $('#addressList').innerHTML=data.addresses.map(a=>`<div class="address-card ${a.is_default?'default':''}"><h4>${esc(a.recipient_name)} ${a.is_default?'· Mặc định':''}</h4><p>${esc(a.phone)}</p><p>${esc(addressText(a))}</p><div class="address-actions"><button class="btn-address" data-edit-address="${a.id}">Sửa</button>${a.is_default?'':`<button class="btn-address" data-default-address="${a.id}">Đặt mặc định</button>`}<button class="btn-address danger" data-delete-address="${a.id}">Xóa</button></div></div>`).join('')+'<button class="add-address-btn" id="addAddressBtn">+ Thêm địa chỉ mới</button>';
    $('#addAddressBtn').onclick=()=>editAddress();
    count('addresses',data.addresses.length); count('orders',data.stats.orders); count('wishlist',data.stats.wishlist);
  }
  const avatarInput=document.createElement('input');avatarInput.type='file';avatarInput.accept='image/jpeg,image/png,image/webp';avatarInput.hidden=true;document.body.append(avatarInput);
  avatarInput.onchange=async()=>{
    const file=avatarInput.files[0];avatarInput.value='';if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size>5*1024*1024 || !file.size)return notice('Chọn ảnh JPG, PNG hoặc WebP tối đa 5 MB.');
    avatarInput.disabled=true;$('.avatar-upload-button').disabled=true;
    try {const r=await fetch('/api/profile/avatar',{method:'POST',credentials:'same-origin',headers:{'Content-Type':file.type,'X-Requested-With':'maianh-web'},body:file});const result=await r.json();if(!r.ok)throw new Error(result.error || 'Upload ảnh thất bại.');data=result.data;render();notice('Đã cập nhật ảnh đại diện.');}catch(e){notice(e.message);}finally{avatarInput.disabled=false;$('.avatar-upload-button').disabled=false;}
  };
  const dialog=document.createElement('section'); dialog.className='profile-editor profile-inline-editor'; dialog.hidden=true;
  function closeEditor(){dialog.hidden=true;$('.info-grid').hidden=false;}

  function editor(title,fields,save,tab='info') {
    $(`[data-tab="${tab}"]`).click();
    $('#tab-'+tab+' .content-card').append(dialog);
    $('.info-grid').hidden=tab==='info';
    dialog.innerHTML=`<form><h2>${title}</h2>${fields}<p role="alert"></p><div class="address-actions"><button type="button" class="btn-address">Hủy</button><button type="submit" class="btn-address">Lưu thay đổi</button></div></form>`;
    const form=dialog.querySelector('form'); let saving=false;
    form.querySelector('[type="button"]').onclick=()=>closeEditor();
    dialog.oncancel=e=>{if(saving)e.preventDefault();};
    form.onsubmit=async e=>{e.preventDefault();if(saving)return;const values=Object.fromEntries(new FormData(form)); saving=true; [...form.elements].forEach(el=>el.disabled=true);try {data=await save(values);render();closeEditor();notice('Đã lưu thông tin.');}catch(e){form.querySelector('[role="alert"]').textContent=e.message;}finally{saving=false;[...form.elements].forEach(el=>el.disabled=false);}};
    dialog.hidden=false;dialog.scrollIntoView({behavior:'smooth',block:'center'});dialog.querySelector('input')?.focus();
  }
  const input=(key,label,value='',max=120,type='text',required=true)=>`<label>${label}<input name="${key}" type="${type}" maxlength="${max}" value="${esc(value)}" ${required?'required':''}></label>`;
  function editProfile(){editor('Chỉnh sửa hồ sơ',input('full_name','Họ và tên',data.user.full_name)+input('email','Email',data.user.email,255,'email')+input('phone','Số điện thoại',data.user.phone,24,'tel',false)+input('address','Địa chỉ hồ sơ',data.user.address,500,'text',false),v=>api('','PATCH',v));}
  $('#editProfileBtn').onclick=editProfile; $('#editInfoBtn').onclick=editProfile;
  function editAddress(a={}) {editor(a.id?'Sửa địa chỉ':'Thêm địa chỉ',input('recipient_name','Người nhận',a.recipient_name || data.user.full_name)+input('phone','Số điện thoại',a.phone || data.user.phone,24,'tel')+input('address_line','Số nhà, đường',a.address_line,255)+input('ward','Phường / xã',a.ward)+input('district','Quận / huyện',a.district,120,'text',false)+input('province','Tỉnh / thành phố',a.province)+`<label><input type="checkbox" name="is_default" ${a.is_default?'checked':''}> Địa chỉ mặc định</label>`,v=>api('/addresses'+(a.id?'/'+a.id:''),a.id?'PUT':'POST',{...v,is_default:v.is_default?1:0}),'addresses');}
  $('#addressList').onclick=async e=>{
    const button=e.target.closest('button'); if(!button)return;
    const id=button.dataset.editAddress || button.dataset.defaultAddress || button.dataset.deleteAddress;
    const a=data.addresses.find(a=>String(a.id)===id); if(!a)return;
    if(button.dataset.editAddress)return editAddress(a);
    if(button.dataset.deleteAddress && !confirm('Xóa địa chỉ này?'))return;
    button.disabled=true;
    try {data=button.dataset.deleteAddress?await api('/addresses/'+id,'DELETE'):await api('/addresses/'+id,'PUT',{...a,is_default:1});render();notice('Đã cập nhật địa chỉ.');}catch(e){notice(e.message);button.disabled=false;}
  };
  const statuses={pending:'Chờ xác nhận',confirmed:'Đã xác nhận',shipping:'Đang giao',delivered:'Đã giao',cancelled:'Đã hủy'};
  let orderFilter='all';
  function renderOrders() {
    $('#ordersList').innerHTML=orders.filter(o=>orderFilter==='all'||o.status===orderFilter).map(o=>`<div class="order-card"><div class="order-header"><strong>#${esc(o.order_number)}</strong><span>${esc(statuses[o.status]||o.status)}</span></div><div class="order-footer"><span>${esc(o.created_at)}</span><strong>${money(o.total_amount)}</strong></div><div class="profile-order-actions"><button class="btn-address" data-view-order="${esc(o.id)}">Xem đơn hàng</button>${o.status==='pending'?`<button class="btn-address danger" data-cancel-order="${esc(o.id)}">Hủy đơn hàng</button>`:''}</div></div>`).join('') || '<p>Chưa có đơn hàng.</p>';
    document.querySelectorAll('.order-tab').forEach(b=>b.querySelector('.tab-count').textContent=orders.filter(o=>b.dataset.status==='all'||o.status===b.dataset.status).length);
  }
  document.querySelectorAll('.order-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.order-tab').forEach(el=>el.classList.remove('active'));b.classList.add('active');orderFilter=b.dataset.status;renderOrders();});
  const orderModal=document.createElement('dialog');orderModal.className='profile-order-modal';orderModal.setAttribute('aria-labelledby','orderModalTitle');
  orderModal.innerHTML='<div class="order-modal-heading"><h2 id="orderModalTitle">Chi tiết đơn hàng</h2><button type="button" aria-label="Đóng chi tiết đơn hàng">×</button></div><div class="order-modal-body"></div>';
  document.body.append(orderModal);orderModal.querySelector('button').onclick=()=>orderModal.close();
  orderModal.onclick=e=>{if(e.target===orderModal){const r=orderModal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)orderModal.close();}};
  let detailRequest=0;
  async function viewOrder(id) {
    const request=++detailRequest,body=orderModal.querySelector('.order-modal-body');body.innerHTML='<p role="status">Đang tải đơn hàng…</p>';if(!orderModal.open)orderModal.showModal();
    try {
      const o=await api('/orders/'+encodeURIComponent(id));if(request!==detailRequest)return;
      const methods={cod:'Thanh toán khi nhận hàng',bank_transfer:'Chuyển khoản ngân hàng',momo:'Ví điện tử',card:'Thẻ',store_pay:'hongquy sòtore pay'};
      const paymentStates={pending:'Chờ thanh toán',paid:'Đã thanh toán',failed:'Thất bại',cancelled:'Đã hủy'};
      body.innerHTML=`<div class="order-detail-meta"><strong>#${esc(o.order_number)}</strong><span>${esc(statuses[o.status]||o.status)}</span><small>${esc(o.created_at)}</small></div><section class="order-delivery"><h3>Địa chỉ nhận hàng</h3><strong>${esc(o.recipient_name)}</strong><p>Số điện thoại: ${esc(o.recipient_phone)}</p><p>${esc(o.shipping_address)}</p></section><div class="order-detail-products">${o.items.map(i=>`<article class="order-detail-product">${i.image_url?`<img src="${esc(i.image_url)}" alt="${esc(i.product_name)}">`:'<span class="order-photo-placeholder" aria-hidden="true">🧸</span>'}<div><h3>${esc(i.product_name)}</h3><p>${esc([i.size_label,i.color_label].filter(Boolean).join(' · '))}</p><p>${money(i.unit_price)} × ${Number(i.quantity)}</p></div><strong>${money(i.line_total)}</strong></article>`).join('')}</div><div class="order-detail-totals"><p><span>Tạm tính</span><strong>${money(o.subtotal)}</strong></p><p><span>Phí vận chuyển</span><strong>${money(o.shipping_fee)}</strong></p><p><span>Giảm giá</span><strong>−${money(o.discount_amount)}</strong></p><p class="order-grand-total"><span>Tổng tiền</span><strong>${money(o.total_amount)}</strong></p></div><section class="order-payment-info"><h3>Thanh toán</h3>${o.payments.map(p=>`<p>${esc(methods[p.method]||p.method)} · ${esc(paymentStates[p.status]||p.status)}: <strong>${money(p.amount)}</strong></p>`).join('')||'<p>Chưa có thông tin thanh toán.</p>'}${o.refunds.map(r=>`<p>${r.status==='completed'?'Đã hoàn tiền':r.status==='rejected'?'Hoàn tiền bị từ chối':'Đang xử lý hoàn tiền'}: <strong>${money(r.amount)}</strong></p>`).join('')}</section>`;
    }catch(e){if(request===detailRequest)body.innerHTML=`<p role="alert">${esc(e.message)}</p>`;}
  }
  $('#ordersList').onclick=async e=>{
    const button=e.target.closest('[data-view-order],[data-cancel-order]');if(!button)return;
    if(button.dataset.viewOrder)return viewOrder(button.dataset.viewOrder);
    if(!confirm('Bạn muốn hủy đơn hàng này? Tiền đã trả bằng số dư sẽ được hoàn vào tài khoản.'))return;
    button.disabled=true;
    try {
      await api('/orders/'+encodeURIComponent(button.dataset.cancelOrder)+'/cancel','POST',{});
      orders=await api('/orders');renderOrders();data=await api();render();notice('Đã hủy đơn hàng.');
      await loadNotifications();
    }catch(error){notice(error.message);button.disabled=false;try{orders=await api('/orders');renderOrders();}catch{}}
  };
  $('#logoutBtn').onclick=async()=>{try{await MaianhAuth.request('/logout',{});location.replace('DangNhap.html');}catch(e){notice(e.message);}};
  try {data=await api();render();}catch(e){$('.hero-name-row h1').textContent='Không thể tải hồ sơ';notice(e.message);return;}
  async function loadWishlist() {
    const response=await fetch('/api/home/wishlist',{credentials:'same-origin'});
    const result=await response.json();if(!response.ok)throw new Error(result.error || 'Không tải được yêu thích.');
    const rows=result.data;
    data.stats.wishlist=rows.length;count('wishlist',rows.length);document.querySelectorAll('.hero-stat strong')[2].textContent=rows.length;
    $('#wishlistContent').innerHTML=rows.map(p=>`<article class="profile-favorite">
      <button type="button" class="favorite-remove" data-remove-favorite="${esc(p.id)}" aria-label="Bỏ yêu thích ${esc(p.name)}" title="Bỏ yêu thích"><i class="fas fa-heart" aria-hidden="true"></i></button>
      <div class="favorite-photo">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">`:'<span class="favorite-no-photo"><i class="far fa-image" aria-hidden="true"></i>Chưa có ảnh</span>'}</div>
      <div class="favorite-copy"><span class="favorite-category">${esc(p.category_name)}</span><h4>${esc(p.name)}</h4><strong class="favorite-price">${p.price===null?'Chưa có giá':money(p.price)}</strong></div>
      ${Number(p.is_active)?`<a class="favorite-view" href="ChiTiet.html?id=${encodeURIComponent(p.id)}">Xem sản phẩm <i class="fas fa-arrow-right" aria-hidden="true"></i></a>`:'<span class="favorite-unavailable">Tạm ngừng bán</span>'}
    </article>`).join('')||'<div class="favorite-empty"><span aria-hidden="true">💝</span><h4>Chưa có sản phẩm yêu thích</h4><p>Lưu những món đồ bạn thích để dễ tìm lại nhé.</p><a class="favorite-view" href="Home.html">Khám phá sản phẩm</a></div>';
  }
  $('#wishlistContent').onclick=async e=>{
    const button=e.target.closest('[data-remove-favorite]');if(!button)return;button.disabled=true;
    try {const r=await fetch('/api/home/wishlist/'+encodeURIComponent(button.dataset.removeFavorite),{method:'DELETE',credentials:'same-origin',headers:{'X-Requested-With':'maianh-web'}});if(!r.ok)throw new Error('Không thể bỏ yêu thích.');await loadWishlist();notice('Đã bỏ yêu thích.');}catch(error){notice(error.message);button.disabled=false;}
  };
  let notificationPage=1, onlyUnread=false;
  async function notificationsRequest(path='',method='GET') {
    const r=await fetch('/api/notifications'+path,{method,credentials:'same-origin',headers:{'X-Requested-With':'maianh-web'}});
    const result=await r.json();if(!r.ok)throw new Error(result.error||'Không tải được thông báo.');return result;
  }
  function notificationLink(path) {
    if(typeof path!=='string'||!path.startsWith('/')||path.startsWith('//')||path.includes('\\'))return '';
    try {const url=new URL(path,location.origin);return url.origin===location.origin && url.pathname.startsWith('/html/')?url.pathname+url.search+url.hash:'';}catch{return '';}
  }
  async function loadNotifications() {
    const result=await notificationsRequest(`?page=${notificationPage}&limit=20&unread=${onlyUnread?1:0}`);
    count('notifications',result.unread_count);
    $('#notificationsList').innerHTML=`<div class="notification-tools"><label><input type="checkbox" id="unreadFilter" ${onlyUnread?'checked':''}> Chỉ chưa đọc</label><button class="btn-address" data-read-all ${!result.unread_count?'disabled':''}>Đọc tất cả</button></div>`+result.data.map(n=>{
      const link=notificationLink(n.target_path);
      return `<article class="notification-card ${n.read_at?'':'unread'}"><div><h4>${esc(n.title)}</h4><p>${esc(n.message)}</p><small>${esc(n.created_at)}</small></div><div class="notification-actions">${n.read_at?'<span>Đã đọc</span>':`<button class="btn-address" data-read-notification="${esc(n.id)}">Đánh dấu đã đọc</button>`}${link?`<a href="${esc(link)}" data-open-notification="${esc(n.id)}">Xem chi tiết</a>`:''}</div></article>`;
    }).join('')+(!result.data.length?'<p>Chưa có thông báo.</p>':'')+`<div class="notification-tools"><button class="btn-address" data-notification-page="${notificationPage-1}" ${notificationPage<=1?'disabled':''}>Trước</button><span>Trang ${notificationPage} / ${Math.max(1,result.pagination.totalPages)}</span><button class="btn-address" data-notification-page="${notificationPage+1}" ${notificationPage>=result.pagination.totalPages?'disabled':''}>Sau</button></div>`;
    $('#unreadFilter').onchange=async e=>{onlyUnread=e.target.checked;notificationPage=1;try{await loadNotifications();}catch(error){notice(error.message);}};
    window.dispatchEvent(new Event('notifications-updated'));
  }
  $('#notificationsList').onclick=async e=>{
    const action=e.target.closest('[data-read-all],[data-read-notification],[data-open-notification],[data-notification-page]');if(!action)return;
    e.preventDefault();action.disabled=true;
    try {
      if(action.dataset.notificationPage){notificationPage=Number(action.dataset.notificationPage);await loadNotifications();return;}
      const id=action.dataset.readNotification||action.dataset.openNotification;
      await notificationsRequest(id?'/'+encodeURIComponent(id)+'/read':'/read-all','PATCH');
      if(action.dataset.openNotification){location.href=action.href;return;}
      notificationPage=1;await loadNotifications();
    }catch(error){notice(error.message);action.disabled=false;}
  };
  await Promise.allSettled([
    api('/orders').then(rows=>{orders=rows;renderOrders();document.querySelectorAll('.order-tab').forEach(b=>b.querySelector('.tab-count').textContent=rows.filter(o=>b.dataset.status==='all'||o.status===b.dataset.status).length);}).catch(e=>notice(e.message)),
    loadWishlist().catch(e=>notice(e.message)),
    loadNotifications().catch(e=>notice(e.message)),
    api('/preferences').then(p=>{const panel=$('#tab-settings .content-card');panel.innerHTML='<div class="content-title">Cài đặt tài khoản</div>'+[['receive_newsletter','Nhận email bản tin'],['receive_sms','Nhận tin nhắn SMS']].map(([key,label])=>`<label class="setting-row">${label}<input type="checkbox" name="${key}" ${p[key]?'checked':''}></label>`).join('');panel.onchange=async e=>{const inputs=[...panel.querySelectorAll('input')];inputs.forEach(i=>i.disabled=true);try{await api('/preferences','PATCH',Object.fromEntries(inputs.map(i=>[i.name,i.checked?1:0])));notice('Đã lưu cài đặt.');}catch(error){e.target.checked=!e.target.checked;notice(error.message);}finally{inputs.forEach(i=>i.disabled=false);}};}).catch(e=>notice(e.message))
  ]);
  window.dispatchEvent(new Event('hashchange'));
})();
