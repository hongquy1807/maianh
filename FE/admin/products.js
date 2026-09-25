(() => {
  const tbody = document.getElementById('productsTableBody');
  const search = document.getElementById('searchProducts');
  const categoryFilter = document.getElementById('productCategoryFilter');
  const add = document.getElementById('addProductBtn');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => Number(value).toLocaleString('vi-VN') + 'đ';
  let products = [], categories = [], editingId = null;
  async function request(path, method = 'GET', body) {
    const response = await fetch('/api/admin/' + path, { method, credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'maianh-web' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Không thể xử lý yêu cầu.');
    return result;
  }
  const message = document.createElement('p');
  message.setAttribute('role', 'status');
  search.closest('.search-box')?.after(message);
  if (!message.isConnected) tbody.closest('table').before(message);
  function render() {
    const list = products;
    tbody.innerHTML = list.map(p => `<tr>
      <td><div class="table-product"><div class="table-product-img">${p.image_url ? `<img src="${esc(p.image_url)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px">` : '🧸'}</div><div class="table-product-info"><h4>${esc(p.name)}</h4><span>Mã SP: SP-${esc(p.id)}</span></div></div></td>
      <td>${esc(p.category)}</td><td><strong>${money(p.price)}</strong></td><td>${Number(p.stock)} ${Number(p.stock) === 0 ? '(Hết)' : Number(p.stock) < 5 ? '(Sắp hết)' : ''}</td><td>${Number(p.sold)}</td>
      <td><span class="status-badge ${p.status === 'active' ? 'active' : 'inactive'}">${p.status === 'active' ? 'Đang bán' : 'Ngừng bán'}</span></td>
      <td><div class="table-actions"><a class="icon-action view" title="Xem" aria-label="Xem sản phẩm trong tab mới" href="/html/ChiTiet.html?id=${encodeURIComponent(p.id)}&preview=1" target="_blank" rel="noopener noreferrer"><i class="fas fa-eye"></i></a><button class="icon-action" title="Sửa" data-edit="${esc(p.id)}"><i class="fas fa-edit"></i></button><button class="icon-action danger" title="Xoá" data-delete="${esc(p.id)}"><i class="fas fa-trash"></i></button></div></td>
    </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;padding:32px">Không có sản phẩm nào.</td></tr>';
    const badge = document.querySelector('[data-tab="products"] .nav-badge');
    if (badge) badge.textContent = products.length;
  }
  let loadVersion = 0;
  async function load() {
    const version = ++loadVersion;
    const query = new URLSearchParams();
    if (categoryFilter.value) query.set('category_id', categoryFilter.value);
    if (search.value.trim()) query.set('q', search.value.trim());
    tbody.innerHTML = '<tr><td colspan="7">Đang tải sản phẩm...</td></tr>';
    try {
      const result = await request('products?' + query);
      if (version !== loadVersion) return;
      products = result.data;
      render();
    } catch (error) {
      if (version !== loadVersion) return;
      tbody.innerHTML = '<tr><td colspan="7">Không thể tải sản phẩm. Vui lòng thử lại.</td></tr>';
      throw error;
    }
  }
  function renderCategoryFilter() {
    const selected = categoryFilter.value;
    categoryFilter.innerHTML = '<option value="">Tất cả danh mục</option>' + categories.map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
    categoryFilter.value = selected;
  }
  async function loadCategories() {
    categories = (await request('product-categories')).data;
    renderCategoryFilter();
  }
  const dialog = document.createElement('dialog');
  dialog.className = 'product-dialog';
  dialog.innerHTML = `<form id="productEditor"><h2 id="productEditorTitle">Thêm sản phẩm</h2>
    <div class="product-fields"><label>Tên sản phẩm<input name="name" required maxlength="180"></label><label>Slug<input name="slug" required maxlength="180" pattern="[a-z0-9]+(-[a-z0-9]+)*"></label><label>Danh mục<select name="category_id" required></select></label><label>Trạng thái<select name="is_active"><option value="1">Đang bán</option><option value="0">Ngừng bán</option></select></label></div>
    <label>Mô tả<textarea name="description" rows="3" maxlength="15000"></textarea></label>
    <h3>Biến thể (size / màu)</h3><p>Mỗi lựa chọn size/màu có giá, tồn kho và mã SKU riêng. Ví dụ: gấu nâu 45 cm và 60 cm là hai biến thể. Chỉ có một loại thì giữ một biến thể.</p><div id="variantRows"></div><button type="button" id="addVariant">+ Thêm biến thể</button>
    <h3>Ảnh sản phẩm</h3><div class="product-upload"><input type="file" id="productImageFiles" name="imageFiles" accept="image/jpeg,image/png,image/webp" multiple hidden><button type="button" class="product-upload-button" id="chooseProductImages"><i class="fas fa-cloud-upload-alt" aria-hidden="true"></i> Chọn ảnh từ máy</button><span id="productImageCount" role="status">Chưa chọn ảnh</span></div><p>JPG, PNG hoặc WebP, tối đa 5 MB/ảnh và 30 ảnh. Ảnh đầu là ảnh đại diện.</p><div id="productImagePreview" class="product-image-preview"></div>
    <p id="productFormError" role="alert"></p><div class="product-form-actions"><button type="button" id="cancelProduct">Hủy</button><button type="submit" id="saveProduct">Lưu sản phẩm</button></div></form>`;
  document.body.append(dialog);
  const form = dialog.querySelector('form');
  const fields = form.elements;
  const variants = dialog.querySelector('#variantRows');
  const error = dialog.querySelector('#productFormError');
  let selectedImages = [];
  const preview = dialog.querySelector('#productImagePreview');
  function releasePreviews() {
    selectedImages.forEach(image => { if (image.preview) URL.revokeObjectURL(image.preview); });
  }
  dialog.querySelector('#chooseProductImages').onclick = () => fields.imageFiles.click();
  function renderImages() {
    dialog.querySelector('#productImageCount').textContent = selectedImages.length ? `${selectedImages.length}/30 ảnh đã chọn` : 'Chưa chọn ảnh';
    preview.innerHTML = selectedImages.map((image, index) => `<figure><img src="${esc(image.preview || image.image_url)}" alt="${esc(image.alt_text || 'Ảnh sản phẩm')}"><figcaption>${index === 0 ? 'Ảnh đại diện' : 'Ảnh ' + (index + 1)}</figcaption><button type="button" data-remove-image="${index}">Bỏ ảnh</button>${index ? `<button type="button" data-cover-image="${index}">Đặt làm đại diện</button>` : ''}</figure>`).join('');
  }
  fields.imageFiles.addEventListener('change', () => {
    const files = [...fields.imageFiles.files];
    fields.imageFiles.value = '';
    if (selectedImages.length + files.length > 30) { error.textContent = 'Tối đa 30 ảnh.'; return; }
    if (files.some(file => !['image/jpeg','image/png','image/webp'].includes(file.type) || !file.size || file.size > 5 * 1024 * 1024)) {
      error.textContent = 'Chọn ảnh JPG, PNG hoặc WebP, không quá 5 MB/ảnh.'; return;
    }
    error.textContent = '';
    selectedImages.push(...files.map(file => ({ file, preview: URL.createObjectURL(file), alt_text: file.name.slice(0,180) })));
    renderImages();
  });
  preview.addEventListener('click', event => {
    if (saving) return;
    const remove = event.target.closest('[data-remove-image]');
    const cover = event.target.closest('[data-cover-image]');
    if (remove) {
      const [image] = selectedImages.splice(Number(remove.dataset.removeImage), 1);
      if (image.preview) URL.revokeObjectURL(image.preview);
    } else if (cover) selectedImages.unshift(...selectedImages.splice(Number(cover.dataset.coverImage), 1));
    renderImages();
  });
  async function uploadImages() {
    for (const image of selectedImages) {
      if (!image.file || image.image_url) continue;
      const response = await fetch('/api/admin/product-images', { method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': image.file.type, 'X-Requested-With': 'maianh-web' }, body: image.file });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(response.status === 413 ? 'Ảnh vượt quá 5 MB.' : (result.error || 'Không thể tải ảnh lên.'));
      image.image_url = result.data.image_url;
    }
    return selectedImages.map(image => ({ image_url: image.image_url, alt_text: image.alt_text || '' }));
  }
  function variantRow(v = {}) {
    const row = document.createElement('fieldset');
    row.className = 'product-variant';
    row.dataset.id = v.id || '';
    row.innerHTML = `<legend>Biến thể</legend><div class="product-fields">
      ${[['sku','SKU',v.sku ?? '', 'text',80],['size_label','Size',v.size_label ?? '', 'text',80],['color_label','Màu',v.color_label ?? '', 'text',80],['price','Giá bán (đ)',v.price ?? 0,'number'],['compare_at_price','Giá gốc (đ)',v.compare_at_price ?? '','number'],['stock_quantity','Tồn kho',v.stock_quantity ?? 0,'number']].map(([key,label,value,type,max]) => `<label>${label}<input data-field="${key}" type="${type}" value="${esc(value)}" ${type === 'number' ? `min="0" step="1" max="${key === 'stock_quantity' ? 2147483647 : 99999999999999}"` : `maxlength="${max}"`} ${['sku','price','stock_quantity'].includes(key) ? 'required' : ''}></label>`).join('')}
      <label>Trạng thái<select data-field="is_active"><option value="1">Đang bán</option><option value="0">Ngừng bán</option></select></label></div><button type="button" class="remove-variant">Xóa biến thể</button>`;
    row.querySelector('select').value = String(v.is_active ?? 1);
    row.querySelector('button').onclick = () => row.remove();
    variants.append(row);
  }
  async function openEditor(id = null) {
    add.disabled = true;
    try {
      const results = await Promise.all([request('product-categories'), id ? request('products/' + encodeURIComponent(id)) : Promise.resolve({data:null})]);
      categories = results[0].data;
      renderCategoryFilter();
      const p = results[1].data;
      editingId = id;
      form.reset(); error.textContent = '';
      dialog.querySelector('h2').textContent = id ? 'Sửa sản phẩm' : 'Thêm sản phẩm';
      fields.category_id.innerHTML = '<option value="">Chọn danh mục</option>' + categories.map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
      for (const key of ['name','slug','category_id','description','is_active']) fields[key].value = p?.[key] ?? (key === 'is_active' ? '1' : '');
      releasePreviews();
      selectedImages = (p?.images || []).map(image => ({ ...image }));
      renderImages();
      variants.replaceChildren();
      (p?.variants?.length ? p.variants : [{}]).forEach(variantRow);
      dialog.showModal();
    } catch (e) { message.textContent = e.message; }
    finally { add.disabled = false; }
  }
  fields.name.addEventListener('input', () => {
    if (!editingId) fields.slug.value = fields.name.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0,180);
  });
  dialog.querySelector('#addVariant').onclick = () => variantRow();
  dialog.addEventListener('close', () => { releasePreviews(); selectedImages = []; preview.replaceChildren(); });
  dialog.querySelector('#cancelProduct').onclick = () => dialog.close();
  let saving = false;
  dialog.addEventListener('cancel', e => { if (saving) e.preventDefault(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (saving) return;
    const body = { name: fields.name.value, slug: fields.slug.value, category_id: fields.category_id.value,
      description: fields.description.value, is_active: Number(fields.is_active.value),
      images: [],
      variants: [...variants.children].map(row => {
        const v = {};
        if (row.dataset.id) v.id = row.dataset.id;
        row.querySelectorAll('[data-field]').forEach(input => {
          const key = input.dataset.field;
          v[key] = ['price','stock_quantity','is_active','compare_at_price'].includes(key) ? (key === 'compare_at_price' && input.value === '' ? null : Number(input.value)) : input.value;
        });
        return v;
      }) };
    saving = true;
    [...form.elements].forEach(el => el.disabled = true);
    error.textContent = '';
    try {
      body.images = await uploadImages();
      await request('products' + (editingId ? '/' + encodeURIComponent(editingId) : ''), editingId ? 'PUT' : 'POST', body);
      dialog.close();
      message.textContent = 'Đã lưu sản phẩm.';
      try { await load(); } catch (e) { message.textContent += ' Không thể tải lại danh sách: ' + e.message; }
    } catch (e) { error.textContent = e.message; }
    finally { saving = false; [...form.elements].forEach(el => el.disabled = false); }
  });
  tbody.addEventListener('click', async event => {
    const edit = event.target.closest('[data-edit]');
    if (edit) return openEditor(edit.dataset.edit);
    const button = event.target.closest('[data-delete]');
    if (!button) return;
    const p = products.find(p => String(p.id) === button.dataset.delete);
    if (!p || !confirm(`Xóa sản phẩm “${p.name}”? Thao tác này không thể hoàn tác.`)) return;
    button.disabled = true;
    try {
      await request('products/' + encodeURIComponent(p.id), 'DELETE', {});
      products = products.filter(item => String(item.id) !== String(p.id)); render();
      message.textContent = 'Đã xóa sản phẩm.';
    } catch (e) { message.textContent = e.message; button.disabled = false; }
  });
  const categoryDialog = document.createElement('dialog');
  categoryDialog.className = 'product-dialog category-dialog';
  categoryDialog.setAttribute('aria-labelledby', 'categoryEditorTitle');
  categoryDialog.innerHTML = `<form><h2 id="categoryEditorTitle">Thêm danh mục</h2>
    <label>Tên danh mục<input name="name" required maxlength="120" placeholder="Ví dụ: Gấu bông cỡ lớn"></label>
    <label>Slug<input name="slug" required maxlength="80" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="gau-bong-co-lon"></label>
    <p>Slug được tạo từ tên danh mục, bạn có thể chỉnh sửa.</p>
    <p class="category-form-error" role="alert"></p>
    <div class="product-form-actions"><button type="button">Hủy</button><button type="submit">Lưu danh mục</button></div></form>`;
  document.body.append(categoryDialog);
  const categoryForm = categoryDialog.querySelector('form');
  const categoryError = categoryDialog.querySelector('[role="alert"]');
  let categorySaving = false, customCategorySlug = false;
  document.getElementById('addProductCategoryBtn').onclick = () => {
    categoryForm.reset(); categoryError.textContent = ''; customCategorySlug = false;
    categoryDialog.showModal();
  };
  categoryForm.elements.slug.addEventListener('input', () => { customCategorySlug = true; });
  categoryForm.elements.name.addEventListener('input', () => {
    if (!customCategorySlug) categoryForm.elements.slug.value = categoryForm.elements.name.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0,80).replace(/-$/, '');
  });
  categoryForm.querySelector('[type="button"]').onclick = () => categoryDialog.close();
  categoryDialog.addEventListener('cancel', event => { if (categorySaving) event.preventDefault(); });
  categoryForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (categorySaving) return;
    const body = { name: categoryForm.elements.name.value, slug: categoryForm.elements.slug.value };
    categorySaving = true; categoryError.textContent = '';
    [...categoryForm.elements].forEach(el => el.disabled = true);
    try {
      const result = await request('product-categories', 'POST', body);
      categories.push(result.data);
      renderCategoryFilter();
      fields.category_id.add(new Option(result.data.name, result.data.id));
      categoryDialog.close();
      message.textContent = `Đã thêm danh mục “${result.data.name}”. Bạn có thể chọn danh mục này khi thêm hoặc sửa sản phẩm.`;
    } catch (error) { categoryError.textContent = error.message; }
    finally { categorySaving = false; [...categoryForm.elements].forEach(el => el.disabled = false); }
  });
  let searchTimer;
  const reload = () => load().catch(error => { message.textContent = error.message; });
  search.addEventListener('input', () => {
    ++loadVersion;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(reload, 250);
  });
  categoryFilter.addEventListener('change', () => { clearTimeout(searchTimer); reload(); });
  loadCategories().catch(error => { message.textContent = error.message; });
  add.onclick = () => openEditor();
  tbody.innerHTML = '<tr><td colspan="7">Đang tải sản phẩm...</td></tr>';
  load().catch(e => { tbody.innerHTML = '<tr><td colspan="7">Không thể tải danh sách. Vui lòng tải lại trang.</td></tr>'; message.textContent = e.message; });
})();
