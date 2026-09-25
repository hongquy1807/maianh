(function() {
            // ============ SLIDESHOW ============
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.dot');
            const prevBtn = document.getElementById('prevSlide');
            const nextBtn = document.getElementById('nextSlide');
            let currentSlide = 0;
            let slideInterval;
            const SLIDE_DURATION = 5000;

            function showSlide(index) {
                if (index < 0) index = slides.length - 1;
                if (index >= slides.length) index = 0;

                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                currentSlide = index;
            }

            function nextSlide() {
                showSlide(currentSlide + 1);
            }

            function prevSlide() {
                showSlide(currentSlide - 1);
            }

            function startAutoSlide() {
                stopAutoSlide();
                slideInterval = setInterval(nextSlide, SLIDE_DURATION);
            }

            function stopAutoSlide() {
                if (slideInterval) clearInterval(slideInterval);
            }

            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoSlide();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoSlide();
            });

            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => {
                    showSlide(i);
                    startAutoSlide();
                });
            });

            // Pause on hover
            const slideshowEl = document.getElementById('slideshow');
            slideshowEl.addEventListener('mouseenter', stopAutoSlide);
            slideshowEl.addEventListener('mouseleave', startAutoSlide);

            startAutoSlide();

            // ============ GIỎ HÀNG ============
            let cart = [];

            const cartBadge = document.getElementById('cartBadge');
            const headerCartCount = document.getElementById('headerCartCount');
            const cartTotal = document.getElementById('cartTotal');
            const cartItems = document.getElementById('cartItems');
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            let toastTimeout;

            function formatPrice(price) {
                return price.toLocaleString('vi-VN') + 'đ';
            }

            function showToast(message, isSuccess = true) {
                toastMsg.textContent = message;
                const icon = toast.querySelector('i');
                if (isSuccess) {
                    icon.className = 'fas fa-check-circle';
                    icon.style.color = '#f48fb1';
                } else {
                    icon.className = 'fas fa-exclamation-circle';
                    icon.style.color = '#e6a800';
                }
                toast.classList.add('show');
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => {
                    toast.classList.remove('show');
                }, 2200);
            }

            function updateCartUI() {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                cartBadge.textContent = totalItems;
                if (headerCartCount) headerCartCount.textContent = totalItems;
                cartTotal.textContent = formatPrice(totalPrice);
                cartItems.textContent = totalItems + ' sản phẩm';

                // Animation nhỏ cho badge
                cartBadge.style.transform = 'scale(1.3)';
                if (headerCartCount) headerCartCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                    if (headerCartCount) headerCartCount.style.transform = 'scale(1)';
                }, 200);
            }

            async function cartRequest(method = 'GET', body) {
                const response = await fetch('/api/cart', { method, credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'maianh-web' },
                    ...(body ? { body: JSON.stringify(body) } : {}) });
                const result = await response.json().catch(() => ({}));
                if (!response.ok) throw Object.assign(new Error(result.error || 'Không thể tải giỏ hàng.'), { status: response.status });
                cart = result.data.map(item => ({ ...item, quantity: Number(item.quantity), price: Number(item.price) }));
                updateCartUI();
                window.dispatchEvent(new Event('cart-updated'));
            }
            let adding = false;
            async function addToCart(button, productName) {
                if (adding || !button.dataset.variantId) return;
                adding = true;
                button.disabled = true;
                try {
                    await cartRequest('POST', { variant_id: button.dataset.variantId, quantity: 1 });
                    showToast(`Đã thêm "${productName}" vào giỏ!`, true);
                } catch (error) {
                    if (error.status === 401) {
                        window.location.href = 'DangNhap.html';
                        return;
                    }
                    showToast(error.message, false);
                } finally { adding = false; button.disabled = false; }
            }

            function bindProductCards() {
                document.querySelectorAll('.btn-add').forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const card = this.closest('.product-card');
                        if (!card) return;
                        addToCart(this, card.dataset.name);
                    });
                });

                document.querySelectorAll('.product-card').forEach(card => {
                    card.addEventListener('click', function(e) {
                        if (e.target.closest('.btn-add') || e.target.closest('.product-wish')) return;
                        const id = card.dataset.id || '1';
                        const name = encodeURIComponent(card.dataset.name || 'San pham');
                        const price = encodeURIComponent(card.dataset.price || '0');
                        window.location.href = `ChiTiet.html?id=${id}&name=${name}&price=${price}`;
                    });
                });
            }

            function escapeHtml(value) {
                return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
            }

            function renderApiProducts(products) {
                const grid = document.getElementById('productGrid');
                grid.innerHTML = products.map(product => {
                    const price = Number(product.price || 0);
                    const oldPrice = Number(product.old_price || 0);
                    return `<div class="product-card" data-category="${escapeHtml(product.category_slug)}" data-id="${product.id}" data-name="${escapeHtml(product.name)}" data-price="${price}">
                        <div class="product-badge">${Number(product.stock || 0) > 0 ? 'Đang bán' : 'Hết hàng'}</div>
                        <div class="product-wish"><i class="far fa-heart"></i></div>
                        <span class="product-edge-icon" aria-hidden="true">🧸</span>
                        <span class="product-blossom top" aria-hidden="true">🌸</span>
                        <span class="product-blossom side" aria-hidden="true">🌸</span>
                        <span class="product-blossom bottom" aria-hidden="true">🌸</span>
                        <span class="product-mai" aria-hidden="true"></span>
                        <div class="product-img"><img class="product-photo" src="${escapeHtml(product.image_url || '/uploads/products/7e4cb1d424ce6a785ae006361dd1b130.jpg')}" alt="${escapeHtml(product.name)}" loading="lazy" width="736" height="980"></div>
                        <div class="product-name">${escapeHtml(product.name)}</div>
                        <div class="product-cat">${escapeHtml(product.category_name || 'Sản phẩm')}</div>
                        <div class="product-rating"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                        <div class="product-price">${formatPrice(price)} ${oldPrice > price ? `<small>${formatPrice(oldPrice)}</small>` : ''}</div>
                        <button class="btn-add" data-variant-id="${escapeHtml(product.variant_id || '')}" ${!product.variant_id || Number(product.stock) < 1 ? 'disabled' : ''}><i class="fas fa-cart-plus"></i> Thêm vào giỏ</button>
                    </div>`;
                }).join('') || '<p>Chưa có sản phẩm phù hợp.</p>';
                bindProductCards();
                bindWishlist();
            }

            async function loadHomeApi() {
                const params = new URLSearchParams(window.location.search);
                const query = new URLSearchParams({ limit: '8' });
                if (params.get('category')) query.set('category', params.get('category'));
                if (params.get('q')) query.set('q', params.get('q'));
                if (params.get('page')) query.set('page',params.get('page'));
                try {
                    const response = await fetch(`/api/home?${query}`, { headers: { Accept: 'application/json' } });
                    if (!response.ok) throw new Error('Không thể tải sản phẩm.');
                    const result = await response.json();
                    renderApiProducts(result.data?.products || []);
                    const category=result.data.categories.find(c=>c.slug===params.get('category'));
                    const heading=document.querySelector('#products h2');
                    heading.textContent=params.get('category')?(category?.name || 'Danh mục không tồn tại'):'Tất cả sản phẩm';
                    document.querySelector('#products .section-sub').textContent='Khám phá cửa hàng';
                    document.querySelector('#products p').textContent=`${result.pagination.total} sản phẩm${params.get('q')?' phù hợp với “'+params.get('q')+'”':''}`;
                    let pager=document.getElementById('productPagination');
                    if(!pager){pager=document.createElement('nav');pager.id='productPagination';pager.setAttribute('aria-label','Phân trang sản phẩm');document.getElementById('productGrid').after(pager);}
                    pager.replaceChildren();
                    const {page,totalPages}=result.pagination;
                    const pageLink=(label,target)=>{const a=document.createElement('a'),search=new URLSearchParams(params);search.set('page',target);a.href='Home.html?'+search+'#products';a.textContent=label;pager.append(a);};
                    if(page>1)pageLink('← Trang trước',page-1);
                    if(totalPages>1){const label=document.createElement('span');label.textContent=`Trang ${page} / ${totalPages}`;pager.append(label);}
                    if(page<totalPages)pageLink('Trang sau →',page+1);
                    if(location.hash==='#products')document.getElementById('products').scrollIntoView({block:'start'});

                } catch {
                    document.getElementById('productGrid').innerHTML = '<p>Không thể tải sản phẩm. Vui lòng tải lại trang.</p>';
                }
            }

            bindProductCards();

            let favoriteIds = new Set();
            async function favoriteRequest(path='',method='GET') {
                const response=await fetch('/api/home/wishlist'+path,{method,credentials:'same-origin',headers:{'X-Requested-With':'maianh-web'}});
                const result=await response.json();
                if(!response.ok) throw Object.assign(new Error(result.error || 'Không thể cập nhật yêu thích.'),{status:response.status});
                return result.data;
            }
            function paintFavorite(btn) {
                const active=favoriteIds.has(btn.closest('.product-card').dataset.id);
                btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));
                btn.setAttribute('aria-label',active?'Bỏ yêu thích':'Thêm vào yêu thích');
                btn.querySelector('i').className=active?'fas fa-heart':'far fa-heart';
            }
            function bindWishlist() {
                document.querySelectorAll('.product-wish').forEach(btn=>{
                    paintFavorite(btn);
                    if(btn.dataset.bound==='true')return;
                    btn.dataset.bound='true';btn.setAttribute('role','button');btn.tabIndex=0;
                    btn.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();btn.click();}});
                    btn.addEventListener('click',async e=>{
                        e.stopPropagation();if(btn.dataset.busy==='true')return;
                        const id=btn.closest('.product-card').dataset.id;
                        const remove=favoriteIds.has(id);btn.dataset.busy='true';
                        try {await favoriteRequest('/'+encodeURIComponent(id),remove?'DELETE':'POST');if(remove)favoriteIds.delete(id);else favoriteIds.add(id);paintFavorite(btn);showToast(remove?'Đã bỏ yêu thích.':'Đã thêm vào yêu thích! 💖');}
                        catch(error){if(error.status===401)location.href='DangNhap.html';else showToast(error.message,false);}
                        finally{delete btn.dataset.busy;}
                    });
                });
            }
            favoriteRequest().then(rows=>{favoriteIds=new Set(rows.map(p=>String(p.id)));document.querySelectorAll('.product-wish').forEach(paintFavorite);}).catch(error=>{if(error.status!==401)showToast(error.message,false);});

            // Khởi tạo
            updateCartUI();
            document.getElementById('productGrid').innerHTML = '<p>Đang tải sản phẩm...</p>';
            loadHomeApi();
            cartRequest().catch(error => { if (error.status !== 401) showToast(error.message, false); });

            // Toast chào mừng
            window.addEventListener('load', () => {
                setTimeout(() => {
                    showToast('Chào mừng bạn đến với hongquy sờtore! 💛', true);
                }, 800);
            });

        })();
