// Resolve shared navigation links after each page has initialized its own UI.
(() => {
  const page = location.pathname.split('/').pop().toLowerCase() || 'home.html';
  const activateSection = () => {
    const hash = location.hash.slice(1);
    if (page === 'profile.html') {
      const tab = [...document.querySelectorAll('.sidebar-nav-item[data-tab]')].find(item => item.dataset.tab === hash);
      tab?.click();
    }
    if (page === 'korean.html') {
      const tab = [...document.querySelectorAll('.mode-tab')].find(item => `panel-${item.dataset.mode}` === hash);
      if (tab) { tab.click(); document.getElementById(hash)?.scrollIntoView({ block: 'start' }); }
    }
  };
  activateSection();
  window.addEventListener('hashchange', activateSection);

  if (page !== 'home.html') return;
  const params = new URLSearchParams(location.search);
  const query = (params.get('q') || '').trim();
  const category = params.get('category');
  const names = { 'an-vat': 'Ăn vặt', 'gau-bong': 'Gấu bông', 'quan-ao': 'Quần áo', 'giay-dep': 'Giày dép', 'trang-suc': 'Trang sức', 'luu-niem': 'Lưu niệm', 'decor-phong': 'Decor phòng' };
  if (!query && !category) return;
  const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  let count = 0;
  document.querySelectorAll('#productGrid .product-card').forEach(card => {
    const matches = (!category || card.dataset.category === category) && normalize(card.dataset.name || '').includes(normalize(query));
    card.hidden = !matches;
    if (matches) count++;
  });
  const status = document.createElement('div');
  status.className = 'shared-product-status';
  status.setAttribute('role', 'status');
  status.append(document.createTextNode(`${names[category] || 'Sản phẩm'}${query ? ` · Tìm kiếm “${query}”` : ''}: ${count ? `${count} sản phẩm` : 'Chưa có sản phẩm phù hợp.'} `));
  const reset = document.createElement('a');
  reset.href = 'Home.html#products';
  reset.textContent = 'Xem tất cả sản phẩm';
  status.append(reset);
  document.getElementById('products').after(status);
  const input = document.querySelector('.sh-search input');
  if (input) input.value = query;
  document.getElementById('products').scrollIntoView({ block: 'start' });
})();
