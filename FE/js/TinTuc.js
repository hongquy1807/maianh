(() => {
  const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let user=null, files=[], categories=[], page=1, category='',sort='new',busy=false,requestVersion=0;
  let editingId=null;
  const modal=$('#postModal'),list=$('#postList');
  function toast(message){$('#toastMsg').textContent=message;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),3500);}
  async function api(path='',options={}){
    const r=await fetch('/api/tintuc'+path,{credentials:'same-origin',...options,headers:{'X-Requested-With':'maianh-web',...options.headers}});
    const result=await r.json();if(!r.ok)throw Object.assign(new Error(result.error||'Không thể tải dữ liệu.'),{status:r.status});return result;
  }
  const avatar=(url,name)=>url?`<img src="${esc(url)}" alt="${esc(name)}">`:'🧸';
  function renderPost(p){
    return `<article class="post-card" id="post-${esc(p.id)}"><div class="post-header"><div class="post-avatar">${avatar(p.avatar_url,p.author_name)}</div><div class="post-meta"><div class="post-author"><strong>${esc(p.author_name)}</strong></div><div class="post-time">${esc(p.created_at)}</div></div>${p.can_edit?`<div class="news-owner-menu"><button type="button" class="news-owner-toggle" aria-label="Tùy chọn bài viết" aria-expanded="false" aria-controls="post-options-${esc(p.id)}"><i class="fas fa-ellipsis-h" aria-hidden="true"></i></button><div class="news-owner-options" id="post-options-${esc(p.id)}" hidden><button type="button" data-edit-post="${esc(p.id)}"><i class="fas fa-pen" aria-hidden="true"></i> Sửa</button><button type="button" data-delete-post="${esc(p.id)}"><i class="fas fa-trash" aria-hidden="true"></i> Xóa</button></div></div>`:''}</div><span class="post-category">${esc(p.category_name)}</span><h3 class="post-title">${esc(p.title)}</h3><div class="post-content news-content">${esc(p.content)}</div><div class="news-attachments">${p.attachments.map(f=>{
      if(f.kind==='image')return `<a href="${esc(f.file_url)}" target="_blank" rel="noopener"><img src="${esc(f.file_url)}" alt="${esc(f.original_name)}" loading="lazy"></a>`;
      if(f.kind==='video')return `<video controls preload="metadata" src="${esc(f.file_url)}" aria-label="${esc(f.original_name)}"></video>`;
      return `<a class="news-document" href="${esc(f.file_url)}" download><i class="fas fa-file-alt" aria-hidden="true"></i><span>${esc(f.original_name)}</span><i class="fas fa-download" aria-hidden="true"></i></a>`;
    }).join('')}</div><div class="post-actions news-social"><button type="button" class="action-btn news-like ${p.is_liked?'liked':''}" data-like="${esc(p.id)}" aria-pressed="${Boolean(p.is_liked)}"><i class="${p.is_liked?'fas':'far'} fa-heart" aria-hidden="true"></i> <span>${Number(p.like_count||0)}</span> Tim</button><button type="button" class="action-btn" data-comments="${esc(p.id)}" aria-expanded="false" aria-controls="comments-${esc(p.id)}"><i class="far fa-comment" aria-hidden="true"></i> <span class="news-comment-count">${Number(p.comment_count||0)}</span> Bình luận</button></div><section class="news-comments" id="comments-${esc(p.id)}" hidden><form data-comment-form="${esc(p.id)}"><textarea name="content" maxlength="2000" required rows="2" placeholder="Viết bình luận của bạn..." aria-label="Nội dung bình luận"></textarea><button type="submit">Gửi bình luận <i class="fas fa-paper-plane" aria-hidden="true"></i></button><p class="comment-error" role="alert"></p></form><div class="news-comment-list"></div><button type="button" class="news-more-comments" data-more-comments="${esc(p.id)}" hidden>Xem thêm bình luận</button></section></article>`;
  }
  async function loadComments(id,append=false){
    const panel=document.getElementById('comments-'+id),more=panel.querySelector('[data-more-comments]');
    const next=append?Number(panel.dataset.page||1)+1:1;more.disabled=true;
    try{
      const result=await api('/'+encodeURIComponent(id)+'/comments?page='+next+'&limit=10');
      const html=result.data.map(c=>`<div class="news-comment" data-comment-id="${esc(c.id)}" data-post-id="${esc(id)}"><div class="post-avatar">${avatar(c.avatar_url,c.author_name)}</div><div><strong>${esc(c.author_name)}</strong><small>${esc(c.created_at)}</small><p class="news-comment-text">${esc(c.content)}</p>${c.can_edit?'<div class="news-comment-tools"><button type="button" data-edit-comment>Sửa</button><button type="button" data-delete-comment>Xóa</button></div>':''}</div></div>`).join('');
      const container=panel.querySelector('.news-comment-list');if(append)container.insertAdjacentHTML('beforeend',html);else container.innerHTML=html||'<p>Chưa có bình luận. Hãy là người đầu tiên nhé!</p>';
      panel.dataset.page=next;more.hidden=next>=result.pagination.totalPages;
      panel.closest('.post-card').querySelector('.news-comment-count').textContent=result.pagination.total;
    }finally{more.disabled=false;}
  }
  function closePostMenus(){
    list.querySelectorAll('.news-owner-toggle').forEach(button=>{button.setAttribute('aria-expanded','false');button.nextElementSibling.hidden=true;});
  }
  document.addEventListener('click',e=>{if(!e.target.closest('.news-owner-menu'))closePostMenus();});
  list.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&e.target.closest('.news-owner-menu')){const button=e.target.closest('.news-owner-menu').querySelector('.news-owner-toggle');closePostMenus();button.focus();e.stopPropagation();}
  });
  list.addEventListener('focusout',e=>{
    const menu=e.target.closest('.news-owner-menu');
    // Focusout fires before the next element becomes document.activeElement.
    // Keep the menu available until an internal action receives its click.
    if(!menu||!e.relatedTarget||menu.contains(e.relatedTarget))return;
    menu.querySelector('.news-owner-options').hidden=true;
    menu.querySelector('.news-owner-toggle').setAttribute('aria-expanded','false');
  });
  list.addEventListener('click',async e=>{
    const toggle=e.target.closest('.news-owner-toggle');
    if(toggle){const open=toggle.getAttribute('aria-expanded')!=='true';closePostMenus();toggle.setAttribute('aria-expanded',String(open));toggle.nextElementSibling.hidden=!open;return;}
    if(e.target.closest('[data-edit-post],[data-delete-post]'))closePostMenus();
    const editComment=e.target.closest('[data-edit-comment]'),deleteComment=e.target.closest('[data-delete-comment]');
    if(editComment){
      const row=editComment.closest('[data-comment-id]');if(row.querySelector('[data-edit-comment-form]'))return;
      const content=row.querySelector('.news-comment-text'),form=document.createElement('form');
      form.dataset.editCommentForm='true';form.innerHTML='<textarea name="content" maxlength="2000" required rows="3" aria-label="Sửa bình luận"></textarea><button type="submit">Lưu</button><button type="button" data-cancel-comment>Hủy</button><p class="comment-error" role="alert"></p>';
      form.querySelector('textarea').value=content.textContent;content.hidden=true;row.querySelector('.news-comment-tools').hidden=true;content.after(form);
      form.querySelector('[data-cancel-comment]').onclick=()=>{content.hidden=false;row.querySelector('.news-comment-tools').hidden=false;form.remove();};
      form.querySelector('textarea').focus();return;
    }
    if(deleteComment){
      if(!confirm('Xóa bình luận này?'))return;const row=deleteComment.closest('[data-comment-id]');deleteComment.disabled=true;
      try{await api('/'+encodeURIComponent(row.dataset.postId)+'/comments/'+encodeURIComponent(row.dataset.commentId),{method:'DELETE'});await loadComments(row.dataset.postId);toast('Đã xóa bình luận.');}
      catch(error){toast(error.message);deleteComment.disabled=false;}return;
    }
    const edit=e.target.closest('[data-edit-post]'),remove=e.target.closest('[data-delete-post]');
    if(edit){
      edit.disabled=true;
      try{
        const p=(await api('/'+encodeURIComponent(edit.dataset.editPost))).data;
        resetEditor();editingId=String(p.id);$('#postTitle').value=p.title;$('#postContent').value=p.content;$('#postCategory').value=p.category_id;
        files=p.attachments.filter(f=>f.id).map(f=>({file:{name:f.original_name,type:f.mime_type,size:Number(f.size_bytes)},upload:f,existing:true,preview:f.kind==='image'?f.file_url:null}));
        modal.querySelector('.modal-header h3').textContent='Chỉnh sửa bài viết';$('#submitPost').textContent='Lưu thay đổi';renderFiles();
        modal.classList.add('show');document.body.style.overflow='hidden';$('#postTitle').focus();
      }catch(error){toast(error.message);}finally{edit.disabled=false;}return;
    }
    if(remove){
      if(!confirm('Xóa bài viết này? Các lượt tim và bình luận cũng sẽ bị xóa.'))return;
      remove.disabled=true;
      try{await api('/'+encodeURIComponent(remove.dataset.deletePost),{method:'DELETE'});history.replaceState(null,'','TinTuc.html');page=1;await loadPosts();await loadCategories();toast('Đã xóa bài viết.');}
      catch(error){toast(error.message);remove.disabled=false;}return;
    }
    const like=e.target.closest('[data-like]'),comments=e.target.closest('[data-comments]'),more=e.target.closest('[data-more-comments]');
    if(like){
      like.disabled=true;
      try{const result=await api('/'+encodeURIComponent(like.dataset.like)+'/like',{method:like.getAttribute('aria-pressed')==='true'?'DELETE':'POST'});like.setAttribute('aria-pressed',String(result.data.is_liked));like.classList.toggle('liked',result.data.is_liked);like.querySelector('i').className=(result.data.is_liked?'fas':'far')+' fa-heart';like.querySelector('span').textContent=result.data.like_count;}
      catch(error){if(error.status===401)toast('Bạn cần đăng nhập để thả tim.');else toast(error.message);}finally{like.disabled=false;}
    }
    if(comments){const panel=document.getElementById('comments-'+comments.dataset.comments);panel.hidden=!panel.hidden;comments.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden){comments.disabled=true;try{await loadComments(comments.dataset.comments);}catch(error){toast(error.message);}finally{comments.disabled=false;}}}
    if(more)try{await loadComments(more.dataset.moreComments,true);}catch(error){toast(error.message);}
  });
  list.addEventListener('submit',async e=>{
    const editForm=e.target.closest('[data-edit-comment-form]');
    if(editForm){
      e.preventDefault();const row=editForm.closest('[data-comment-id]'),input=editForm.querySelector('textarea'),content=input.value.trim(),button=editForm.querySelector('[type="submit"]');if(button.disabled||!content)return;
      editForm.querySelectorAll('button,textarea').forEach(el=>el.disabled=true);
      try{
        await api('/'+encodeURIComponent(row.dataset.postId)+'/comments/'+encodeURIComponent(row.dataset.commentId),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({content})});
        row.querySelector('.news-comment-text').textContent=content;row.querySelector('.news-comment-text').hidden=false;row.querySelector('.news-comment-tools').hidden=false;editForm.remove();toast('Đã sửa bình luận.');
      }catch(error){editForm.querySelector('.comment-error').textContent=error.message;editForm.querySelectorAll('button,textarea').forEach(el=>el.disabled=false);}return;
    }
    const form=e.target.closest('[data-comment-form]');if(!form)return;e.preventDefault();const button=form.querySelector('button'),input=form.querySelector('textarea'),error=form.querySelector('.comment-error');if(button.disabled)return;
    const content=input.value.trim();if(!content)return;button.disabled=true;input.disabled=true;error.textContent='';
    try{await api('/'+encodeURIComponent(form.dataset.commentForm)+'/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content})});input.value='';await loadComments(form.dataset.commentForm);}
    catch(e){error.textContent=e.status===401?'Bạn cần đăng nhập để bình luận.':e.message;}finally{button.disabled=false;input.disabled=false;}
  });
  async function loadPosts(append=false){
    const version=++requestVersion;$('#loadMoreBtn').disabled=true;
    if(!append)list.innerHTML='<p role="status">Đang tải bài viết...</p>';
    try{
      const post=new URLSearchParams(location.search).get('post');
      if(post){const result=await api('/'+encodeURIComponent(post));if(version!==requestVersion)return;list.innerHTML=renderPost(result.data);$('#loadMoreBtn').hidden=true;return;}
      const result=await api('?'+new URLSearchParams({page:String(page),limit:'10',category,sort}));if(version!==requestVersion)return;
      const html=result.data.map(renderPost).join('');if(append)list.insertAdjacentHTML('beforeend',html);else list.innerHTML=html||'<div class="post-card">Chưa có bài viết. Hãy chia sẻ câu chuyện đầu tiên nhé!</div>';
      $('#loadMoreBtn').hidden=page>=result.pagination.totalPages;
    }catch(e){if(version!==requestVersion)return;if(append){page--;toast(e.message);}else list.innerHTML=`<p role="alert">${esc(e.message)}</p>`;}
    finally{if(version===requestVersion)$('#loadMoreBtn').disabled=false;}
  }
  async function loadCategories(){
    categories=(await api('/categories')).data;
    $('#postCategory').innerHTML=categories.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
    $('.category-list').innerHTML=[{slug:'',name:'Tất cả',post_count:categories.reduce((n,c)=>n+Number(c.post_count),0)},...categories].map(c=>`<li><a href="#" data-cat="${esc(c.slug)}" class="${category===c.slug?'active':''}"><i class="fas fa-folder"></i>${esc(c.name)}<span class="count">${Number(c.post_count)}</span></a></li>`).join('');
  }
  function resetEditor(){files.forEach(f=>{if(f.preview&&!f.existing)URL.revokeObjectURL(f.preview);});files=[];editingId=null;$('#postTitle').value='';$('#postContent').value='';$('#postUploadStatus').textContent='';modal.querySelector('.modal-header h3').textContent='Đăng bài viết mới';$('#submitPost').textContent='Đăng bài';renderFiles();}
  function openModal(){if(editingId)resetEditor();if(!user){location.href='DangNhap.html';return;}modal.classList.add('show');document.body.style.overflow='hidden';$('#postTitle').focus();}
  function closeModal(){if(busy)return;modal.classList.remove('show');document.body.style.overflow='';}
  $('#openPostModal').onclick=openModal;$('#closeModal').onclick=closeModal;$('#cancelBtn').onclick=closeModal;
  modal.onclick=e=>{if(e.target===modal)closeModal();};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  const openQuick=()=>{openModal();$('#postContent').value=$('#quickInput').value;};
  $('#quickPostBtn').onclick=openQuick;
  document.querySelectorAll('.composer-tool').forEach(b=>b.onclick=()=>{openQuick();if(user)$('#postFiles').click();});
  $('#emojiPicker').onclick=e=>{const button=e.target.closest('[data-emoji]');if(button&&!busy){$('#postContent').value+=button.dataset.emoji;$('#postContent').focus();}};
  function renderFiles(){
    $('#postFileList').innerHTML=files.map((entry,index)=>`<div class="news-file">${entry.file.type.startsWith('image/')?`<img src="${entry.preview}" alt="Ảnh đã chọn">`:'<i class="fas fa-file" aria-hidden="true"></i>'}<span>${esc(entry.file.name)}<small>${(entry.file.size/1024/1024).toFixed(2)} MB${entry.upload?' · Đã tải lên':''}</small></span><button type="button" data-remove="${index}" aria-label="Bỏ ${esc(entry.file.name)}" ${busy?'disabled':''}>×</button></div>`).join('');
  }
  $('#postFiles').onchange=e=>{
    for(const file of e.target.files){
      if(files.length>=10){toast('Tối đa 10 file đính kèm.');break;}
      if(!/\.(jpe?g|png|webp|mp4|webm|pdf|docx|xlsx|pptx)$/i.test(file.name)||!file.size||file.size>25*1024*1024){toast('File không được hỗ trợ hoặc vượt quá 25 MB: '+file.name);continue;}
      files.push({file,preview:file.type.startsWith('image/')?URL.createObjectURL(file):null});
    }
    e.target.value='';renderFiles();
  };
  $('#postFileList').onclick=async e=>{
    const button=e.target.closest('[data-remove]');if(!button||busy)return;const index=Number(button.dataset.remove),entry=files[index];button.disabled=true;
    try{if(entry.upload&&!entry.existing)await api('/uploads/'+entry.upload.id,{method:'DELETE'});if(entry.preview&&!entry.existing)URL.revokeObjectURL(entry.preview);files.splice(index,1);renderFiles();}catch(error){toast(error.message);button.disabled=false;}
  };
  $('#submitPost').onclick=async()=>{
    if(busy)return;const title=$('#postTitle').value.trim(),content=$('#postContent').value.trim();
    if(!title||!content||!$('#postCategory').value)return toast('Nhập tiêu đề, chủ đề và nội dung bài viết.');
    busy=true;modal.querySelectorAll('button,input,select,textarea').forEach(el=>el.disabled=true);renderFiles();
    try{
      for(let i=0;i<files.length;i++){
        const entry=files[i];if(entry.upload)continue;$('#postUploadStatus').textContent=`Đang tải file ${i+1}/${files.length}: ${entry.file.name}`;
        entry.upload=(await api('/uploads',{method:'POST',headers:{'Content-Type':'application/octet-stream','X-File-Name':encodeURIComponent(entry.file.name)},body:entry.file})).data;renderFiles();
      }
      $('#postUploadStatus').textContent='Đang đăng bài...';
      const wasEditing=Boolean(editingId);
      const result=await api(editingId?'/'+encodeURIComponent(editingId):'',{method:editingId?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,content,category_id:$('#postCategory').value,attachment_ids:files.map(f=>f.upload.id)})});
      files.forEach(f=>{if(f.preview&&!f.existing)URL.revokeObjectURL(f.preview);});files=[];renderFiles();
      $('#postTitle').value='';$('#postContent').value='';$('#quickInput').value='';$('#postUploadStatus').textContent='';
      busy=false;closeModal();resetEditor();history.replaceState(null,'','TinTuc.html?post='+result.data.id);await loadPosts();await loadCategories();toast(wasEditing?'Đã lưu thay đổi.':'Đã đăng bài thành công!');editingId=null;
    }catch(e){$('#postUploadStatus').textContent=e.message;if(e.status===401)toast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');}
    finally{busy=false;modal.querySelectorAll('button,input,select,textarea').forEach(el=>el.disabled=false);renderFiles();}
  };
  $('.category-list').onclick=e=>{const link=e.target.closest('[data-cat]');if(!link)return;e.preventDefault();category=link.dataset.cat;page=1;history.replaceState(null,'','TinTuc.html');document.querySelectorAll('[data-cat]').forEach(el=>el.classList.toggle('active',el===link));loadPosts();};
  document.querySelectorAll('[data-sort]').forEach(button=>button.onclick=()=>{sort=button.dataset.sort;page=1;history.replaceState(null,'','TinTuc.html');document.querySelectorAll('[data-sort]').forEach(el=>el.classList.toggle('active',el===button));loadPosts();});
  $('#loadMoreBtn').onclick=()=>{page++;loadPosts(true);};
  // Remove demonstration statistics and rankings, which are not account data.
  $('.user-stats').hidden=true;$('.hero-stats').hidden=true;
  $('.tag-cloud')?.closest('.sidebar-card').remove();
  $('.sidebar-right .sidebar-card')?.remove();
  $('.user-profile h4').textContent='Khách';$('.user-profile > p').textContent='Đăng nhập để chia sẻ bài viết';
  $('.user-avatar-lg').textContent='🧸';$('.composer-avatar').textContent='🧸';
  fetch('/api/profile',{credentials:'same-origin'}).then(async r=>{if(!r.ok)return;user=(await r.json()).data.user;$('.user-profile h4').textContent=user.full_name;$('.user-profile > p').textContent='Thành viên cộng đồng';$('.user-avatar-lg').innerHTML=avatar(user.avatar_url,user.full_name);$('.composer-avatar').innerHTML=avatar(user.avatar_url,user.full_name);}).catch(()=>{});
  loadCategories().catch(e=>{$('#postCategory').innerHTML='<option value="">Không tải được chủ đề</option>';$('.category-list').textContent=e.message;});loadPosts();
})();
