(() => {
  const icon = name => `<i class="fas fa-${name}" aria-hidden="true"></i>`;
  class SiteHeader extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = 'true';
      const page = location.pathname.split('/').pop().toLowerCase() || 'home.html';
      const navLink = (href, label, glyph) => `<a href="${href}"${page === href.toLowerCase() ? ' aria-current="page"' : ''}>${icon(glyph)} ${label}</a>`;
      this.innerHTML = `<header class="sh-header">
        <nav class="sh-nav" aria-label="Điều hướng chính">
          <a class="sh-logo" href="Home.html" aria-label="hongquy sờtore — Trang chủ">
            <span class="sh-logo-icon" aria-hidden="true">🧸</span>
            <span class="sh-brand"><strong>hongquy <span>sờtore</span></strong><small>Soft • Cute • Lovely</small></span>
          </a>
          <button class="sh-menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="site-navigation">${icon('bars')}</button>
          <div class="sh-navigation" id="site-navigation">
            <ul class="sh-links">
              <li>${navLink('Home.html', 'Trang chủ', 'home')}</li>
              <li class="sh-products"><button type="button" class="sh-products-toggle" aria-expanded="false" aria-controls="site-categories"${page === 'chitiet.html' ? ' data-active="true"' : ''}>${icon('shopping-bag')} Sản phẩm ${icon('chevron-down')}</button>
                <ul class="sh-dropdown" id="site-categories" hidden><li class="sh-category-status">Đang tải danh mục…</li></ul>
              </li>
              <li>${navLink('Korean.html', 'Ôn tập tiếng Hàn', 'language')}</li>
              <li>${navLink('TinTuc.html', 'Tin tức', 'newspaper')}</li>
              <li>${navLink('Random.html', 'Random', 'dice')}</li>
            </ul>
            <form class="sh-search" action="Home.html" method="get" role="search">
              <input type="search" name="q" placeholder="Tìm sản phẩm..." aria-label="Tìm sản phẩm">
              <button type="submit" aria-label="Tìm kiếm">${icon('search')}</button>
            </form>
          </div>
          <div class="sh-actions">
            <a href="profile.html#notifications" aria-label="Thông báo" title="Thông báo">${icon('bell')}<span class="sh-badge" id="headerNotificationCount" hidden>0</span></a>
            <a href="profile.html#wishlist" aria-label="Yêu thích" title="Yêu thích">${icon('heart')}</a>
            <a href="Cart.html" aria-label="Giỏ hàng" title="Giỏ hàng">${icon('shopping-cart')}<span class="sh-badge" id="headerCartCount">0</span></a>
            <a href="profile.html" aria-label="Tài khoản" title="Tài khoản"${page === 'profile.html' ? ' aria-current="page"' : ''}>${icon('user')}</a>
          </div>
        </nav>
      </header>`;
      let cartRequestVersion=0;
      const refreshCart=async()=>{
        const version=++cartRequestVersion;
        try {
          const response=await fetch('/api/cart',{credentials:'same-origin',cache:'no-store'});
          if(!response.ok && response.status!==401)return;
          const rows=response.status===401?[]:(await response.json()).data;
          if(version!==cartRequestVersion)return;
          const count=rows.reduce((sum,row)=>sum+Number(row.quantity||0),0);
          const badge=this.querySelector('#headerCartCount');
          badge.textContent=count;
          badge.parentElement.setAttribute('aria-label',`Giỏ hàng: ${count} sản phẩm`);
        }catch{}
      };
      refreshCart();
      window.addEventListener('cart-updated',refreshCart);
      window.addEventListener('pageshow',refreshCart);
      window.addEventListener('focus',refreshCart);
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshCart();});
      const updateNotifications = async () => {
        try {const r=await fetch('/api/notifications/unread-count',{credentials:'same-origin'});if(!r.ok)return;const result=await r.json();const badge=this.querySelector('#headerNotificationCount');const n=result.data.unread_count;badge.textContent=n>99?'99+':n;badge.hidden=!n;}catch{}
      };
      updateNotifications();
      window.addEventListener('notifications-updated',updateNotifications);
      const menu = this.querySelector('.sh-menu-toggle');
      const products = this.querySelector('.sh-products-toggle');
      const dropdown = this.querySelector('.sh-dropdown');
      async function loadCategories() {
        try {
          const response=await fetch('/api/home/categories',{cache:'no-store'});
          if(!response.ok)throw new Error();
          const {data}=await response.json();dropdown.replaceChildren();
          const selected=new URLSearchParams(location.search).get('category');
          const addCategory=(name,slug,count)=>{
            const li=document.createElement('li'),link=document.createElement('a');
            link.href='Home.html'+(slug?'?category='+encodeURIComponent(slug):'')+'#products';
            link.innerHTML=icon(slug?'tag':'th-large');
            const label=document.createElement('span');label.textContent=name;link.append(label);
            if(count!==undefined){const badge=document.createElement('small');badge.className='sh-category-count';badge.textContent=count;link.append(badge);}
            if(page==='home.html' && (selected||'')===slug)link.setAttribute('aria-current','true');
            link.addEventListener('click',closeMenu);li.append(link);dropdown.append(li);
          };
          addCategory('Tất cả sản phẩm','');
          data.forEach(c=>addCategory(c.name,c.slug,c.product_count));
          if(selected)products.dataset.active='true';
        }catch{
          dropdown.innerHTML='<li class="sh-category-status">Không tải được danh mục. <button type="button">Thử lại</button></li>';
          dropdown.querySelector('button').onclick=loadCategories;
        }
      }
      loadCategories();
      const closeProducts = () => { products.setAttribute('aria-expanded', 'false'); dropdown.hidden = true; };
      const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Mở menu'); this.classList.remove('sh-open'); closeProducts(); };
      menu.addEventListener('click', () => {
        const open = menu.getAttribute('aria-expanded') !== 'true';
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
        this.classList.toggle('sh-open', open);
      });
      products.addEventListener('click', () => {
        const open = products.getAttribute('aria-expanded') !== 'true';
        products.setAttribute('aria-expanded', String(open)); dropdown.hidden = !open;
      });
      this.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          if (!dropdown.hidden) { closeProducts(); products.focus(); }
          else { closeMenu(); menu.focus(); }
        }
      });
      document.addEventListener('click', event => { if (!this.contains(event.target)) closeMenu(); });
      this.addEventListener('focusout', () => { queueMicrotask(() => { if (!this.contains(document.activeElement)) closeMenu(); }); });
      this.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
      window.MaianhAuth?.getSession().then(user => {
        const account = this.querySelector('.sh-actions a:last-child');
        account.href = user ? 'profile.html' : 'DangNhap.html';
        account.title = user ? `Tài khoản: ${user.full_name}` : 'Đăng nhập';
        account.setAttribute('aria-label', account.title);
      }).catch(() => {});
    }
  }
  customElements.define('site-header', SiteHeader);
})();
