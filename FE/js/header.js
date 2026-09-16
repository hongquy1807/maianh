(() => {
  const categories = [
    ['Ăn vặt', 'cookie-bite', 'an-vat'], ['Gấu bông', 'paw', 'gau-bong'],
    ['Quần áo', 'tshirt', 'quan-ao'], ['Giày dép', 'shoe-prints', 'giay-dep'],
    ['Trang sức', 'gem', 'trang-suc'], ['Lưu niệm', 'gift', 'luu-niem'],
    ['Decor phòng', 'couch', 'decor-phong']
  ];
  const icon = name => `<i class="fas fa-${name}" aria-hidden="true"></i>`;
  class SiteHeader extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = 'true';
      const page = location.pathname.split('/').pop().toLowerCase() || 'home.html';
      const navLink = (href, label, glyph) => `<a href="${href}"${page === href.toLowerCase() ? ' aria-current="page"' : ''}>${icon(glyph)} ${label}</a>`;
      this.innerHTML = `<header class="sh-header">
        <nav class="sh-nav" aria-label="Điều hướng chính">
          <a class="sh-logo" href="Home.html" aria-label="Teddy Yêu Thương — Trang chủ">
            <span class="sh-logo-icon" aria-hidden="true">🧸</span>
            <span class="sh-brand"><strong>Teddy <span>Yêu Thương</span></strong><small>Soft • Cute • Lovely</small></span>
          </a>
          <button class="sh-menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="site-navigation">${icon('bars')}</button>
          <div class="sh-navigation" id="site-navigation">
            <ul class="sh-links">
              <li>${navLink('Home.html', 'Trang chủ', 'home')}</li>
              <li class="sh-products"><button type="button" class="sh-products-toggle" aria-expanded="false" aria-controls="site-categories"${page === 'chitiet.html' ? ' data-active="true"' : ''}>${icon('shopping-bag')} Sản phẩm ${icon('chevron-down')}</button>
                <ul class="sh-dropdown" id="site-categories" hidden>${categories.map(([label, glyph, slug]) => `<li><a href="Home.html?category=${slug}#products">${icon(glyph)} ${label}</a></li>`).join('')}</ul>
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
            <a href="profile.html#wishlist" aria-label="Yêu thích" title="Yêu thích">${icon('heart')}</a>
            <a href="Cart.html" aria-label="Giỏ hàng" title="Giỏ hàng">${icon('shopping-cart')}<span class="sh-badge" id="headerCartCount">0</span></a>
            <a href="profile.html" aria-label="Tài khoản" title="Tài khoản"${page === 'profile.html' ? ' aria-current="page"' : ''}>${icon('user')}</a>
          </div>
        </nav>
      </header>`;
      const menu = this.querySelector('.sh-menu-toggle');
      const products = this.querySelector('.sh-products-toggle');
      const dropdown = this.querySelector('.sh-dropdown');
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
