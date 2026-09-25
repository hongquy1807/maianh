(function() {
            // ============ DỮ LIỆU BAN ĐẦU ============
            let cart = [
                {
                    id: 'p1',
                    name: 'Gấu Nâu Mật Ong',
                    emoji: '🧸',
                    price: 350000,
                    oldPrice: 420000,
                    size: '45cm',
                    color: 'Nâu mật ong',
                    quantity: 1,
                    stock: 12
                },
                {
                    id: 'p2',
                    name: 'Gấu Hồng Kẹo Ngọt',
                    emoji: '🧸🌸',
                    price: 390000,
                    oldPrice: 450000,
                    size: '60cm',
                    color: 'Hồng pastel',
                    quantity: 2,
                    stock: 8
                },
                {
                    id: 'p3',
                    name: 'Gấu Vàng Nắng Mai',
                    emoji: '🧸☀️',
                    price: 420000,
                    oldPrice: null,
                    size: '50cm',
                    color: 'Vàng nắng',
                    quantity: 1,
                    stock: 5
                },
                {
                    id: 'p4',
                    name: 'Gấu Kem Dâu',
                    emoji: '🧸🍓',
                    price: 370000,
                    oldPrice: null,
                    size: '35cm',
                    color: 'Hồng pastel',
                    quantity: 1,
                    stock: 20
                }
            ];

            let shippingFee = 30000;
            const FREESHIP_THRESHOLD = 500000;
            let apiCartEnabled = false;

            async function cartApiRequest(path = '', options = {}) {
                const response = await fetch(`/api/cart${path}`, {
                    credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json', ...(options.body ? { 'X-Requested-With': 'maianh-web' } : {}) },
                    ...options
                });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) throw Object.assign(new Error(data.error || 'Không thể cập nhật giỏ hàng.'), {status:response.status});
                if(options.method && options.method!=='GET')window.dispatchEvent(new Event('cart-updated'));
                return data.data || [];
            }

            function setCartRows(rows) {
                cart = rows.map(row => ({
                        id: String(row.variant_id),
                        variantId: String(row.variant_id),
                        name: row.name,
                        price: Number(row.price),
                        oldPrice: row.old_price ? Number(row.old_price) : null,
                        size: row.size || 'Mặc định',
                        color: row.color || 'Mặc định',
                        quantity: Number(row.quantity),
                        stock: Number(row.stock),
                        imageUrl: row.image_url
                    }));
            }

            async function loadApiCart() {
                try {
                    const user = await window.MaianhAuth?.getSession();
                    if (!user) return;
                    const rows = await cartApiRequest();
                    setCartRows(rows);
                    apiCartEnabled = true;
                } catch {
                    apiCartEnabled = false;
                }
            }

            function syncApiItem(item) {
                if (!apiCartEnabled || !item?.variantId) return;
                cartApiRequest(`/${encodeURIComponent(item.variantId)}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ quantity: item.quantity })
                }).catch(() => showToast('Không thể đồng bộ giỏ hàng.', false));
            }

            // Sản phẩm gợi ý
            let suggestedProducts = [];

            // DOM
            const cartItemsList = document.getElementById('cartItemsList');
            const emptyCart = document.getElementById('emptyCart');
            const cartFooterActions = document.getElementById('cartFooterActions');
            const cartHeaderRow = document.getElementById('cartHeaderRow');
            const summarySidebar = document.getElementById('summarySidebar');
            const suggestedGrid = document.getElementById('suggestedGrid');
            const headerCartCount = document.getElementById('headerCartCount');
            const cartSummaryText = document.getElementById('cartSummaryText');
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            const confirmModal = document.getElementById('confirmModal');
            let toastTimeout;

            // ============ HELPERS ============
            function escapeHtml(value) {
                return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
            }

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
                toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
            }

            // ============ RENDER CART ITEMS ============
            function renderCart() {
                if (cart.length === 0) {
                    cartItemsList.innerHTML = '';
                    cartHeaderRow.style.display = 'none';
                    emptyCart.classList.add('show');
                    cartFooterActions.style.display = 'none';
                    summarySidebar.style.display = 'none';
                    updateHeaderBadge();
                    return;
                }

                cartHeaderRow.style.display = 'grid';
                emptyCart.classList.remove('show');
                cartFooterActions.style.display = 'flex';
                summarySidebar.style.display = 'block';

                cartItemsList.innerHTML = cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="item-product">
                            <div class="item-img">${item.imageUrl
                                ? `<img class="product-photo" src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" loading="lazy" width="80" height="80">`
                                : '<span class="cart-image-placeholder">Chưa có ảnh</span>'}</div>
                            <div class="item-info">
                                <h3>${escapeHtml(item.name)}</h3>
                                <div class="item-variant">
                                    <span>${escapeHtml(item.size)}</span>
                                    <span>${escapeHtml(item.color)}</span>
                                </div>
                                <div class="item-stock">
                                    <i class="fas fa-circle"></i> Còn ${item.stock} sản phẩm
                                </div>
                            </div>
                        </div>
                        <div class="item-price">
                            ${formatPrice(item.price)}
                            ${item.oldPrice ? `<small>${formatPrice(item.oldPrice)}</small>` : ''}
                        </div>
                        <div class="item-qty-wrap">
                            <div class="qty-selector">
                                <button class="qty-btn" data-action="minus" data-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="text" class="qty-number" value="${item.quantity}" readonly>
                                <button class="qty-btn" data-action="plus" data-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div class="item-total">${formatPrice(item.price * item.quantity)}</div>
                        <button class="btn-remove" data-id="${item.id}" title="Xoá sản phẩm">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('');

                bindItemEvents();
                updateSummary();
                updateHeaderBadge();
            }

            // ============ BIND ITEM EVENTS ============
            function bindItemEvents() {
                // Quantity buttons
                document.querySelectorAll('.qty-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.dataset.id;
                        const action = this.dataset.action;
                        const item = cart.find(i => i.id === id);
                        if (!item) return;

                        if (action === 'plus') {
                            if (item.quantity < item.stock) {
                                item.quantity++;
                            } else {
                                showToast(`Chỉ còn ${item.stock} sản phẩm trong kho!`, false);
                                return;
                            }
                        } else {
                            if (item.quantity > 1) {
                                item.quantity--;
                            } else {
                                // Xoá luôn
                                removeItem(id);
                                return;
                            }
                        }
                        syncApiItem(item);
                        renderCart();
                    });
                });

                // Remove buttons
                document.querySelectorAll('.btn-remove').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.dataset.id;
                        const item = cart.find(i => i.id === id);
                        if (item) {
                            showConfirm(
                                'Xoá sản phẩm?',
                                `Bạn có chắc muốn xoá "${item.name}" khỏi giỏ hàng không?`,
                                () => removeItem(id)
                            );
                        }
                    });
                });
            }

            // ============ REMOVE ITEM ============
            function removeItem(id) {
                const item = cart.find(i => i.id === id);
                cart = cart.filter(i => i.id !== id);
                if (apiCartEnabled && item?.variantId) {
                    cartApiRequest(`/${encodeURIComponent(item.variantId)}`, { method: 'DELETE' })
                        .catch(() => showToast('Không thể cập nhật giỏ hàng.', false));
                }
                renderCart();
                if (item) showToast(`Đã xoá "${item.name}" khỏi giỏ hàng`, true);
            }

            // ============ UPDATE SUMMARY ============
            function updateSummary() {
                const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
                const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

                // Ship
                let ship = shippingFee;
                if (subtotal >= FREESHIP_THRESHOLD) {
                    ship = 0;
                }

                const total = Math.max(0, subtotal + ship);

                // Update UI
                document.getElementById('itemCountText').textContent = totalItems;
                document.getElementById('subtotalText').textContent = formatPrice(subtotal);
                document.getElementById('shippingText').textContent = ship === 0 ? 'Miễn phí' : formatPrice(ship);
                document.getElementById('totalText').textContent = formatPrice(total);
                headerCartCount.textContent = totalItems;
                cartSummaryText.textContent = `Bạn có ${totalItems} sản phẩm trong giỏ hàng`;

                // Freeship progress
                const freeshipBox = document.getElementById('freeshipBox');
                const freeshipFill = document.getElementById('freeshipFill');
                const freeshipText = document.getElementById('freeshipText');
                const freeshipNote = document.getElementById('freeshipNote');

                if (subtotal >= FREESHIP_THRESHOLD) {
                    freeshipBox.style.background = 'linear-gradient(135deg, var(--yellow-main), var(--yellow-soft))';
                    freeshipText.innerHTML = '<i class="fas fa-check-circle"></i> Chúc mừng! Bạn được miễn phí vận chuyển 🎉';
                    freeshipFill.style.width = '100%';
                    freeshipNote.textContent = 'Đã đạt mốc miễn phí ship!';
                } else {
                    const percent = Math.min(100, (subtotal / FREESHIP_THRESHOLD) * 100);
                    const remain = FREESHIP_THRESHOLD - subtotal;
                    freeshipBox.style.background = 'linear-gradient(135deg, var(--yellow-light), var(--pink-soft))';
                    freeshipText.innerHTML = `<i class="fas fa-truck-fast"></i> Mua thêm ${formatPrice(remain)} để được miễn phí ship!`;
                    freeshipFill.style.width = percent + '%';
                    freeshipNote.textContent = `${formatPrice(subtotal)} / ${formatPrice(FREESHIP_THRESHOLD)}`;
                }

                // Steps line
                document.getElementById('stepsLineFill').style.width = '50%';

                // Disable checkout if empty
                document.getElementById('checkoutBtn').disabled = cart.length === 0;
            }

            function updateHeaderBadge() {
                const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
                headerCartCount.textContent = totalItems;
            }

            // ============ COUPONS ============


            // ============ CLEAR CART ============
            document.getElementById('clearCartBtn').addEventListener('click', function() {
                if (cart.length === 0) return;
                showConfirm(
                    'Xoá toàn bộ giỏ hàng?',
                    'Bạn có chắc muốn xoá tất cả sản phẩm khỏi giỏ hàng không? Hành động này không thể hoàn tác.',
                    () => {
                        cart = [];
                        if (apiCartEnabled) cartApiRequest('', { method: 'DELETE' }).catch(() => showToast('Không thể xoá giỏ hàng.', false));
                        renderCart();
                        showToast('Đã xoá toàn bộ giỏ hàng', true);
                    }
                );
            });

            // ============ CONFIRM MODAL ============
            let confirmCallback = null;

            function showConfirm(title, message, callback) {
                document.getElementById('confirmTitle').textContent = title;
                document.getElementById('confirmMessage').textContent = message;
                confirmCallback = callback;
                confirmModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }

            function hideConfirm() {
                confirmModal.classList.remove('show');
                document.body.style.overflow = '';
                confirmCallback = null;
            }

            document.getElementById('confirmCancel').addEventListener('click', hideConfirm);
            document.getElementById('confirmOk').addEventListener('click', () => {
                if (confirmCallback) confirmCallback();
                hideConfirm();
            });

            confirmModal.addEventListener('click', (e) => {
                if (e.target === confirmModal) hideConfirm();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && confirmModal.classList.contains('show')) hideConfirm();
            });

            // ============ CHECKOUT ============
            document.getElementById('checkoutBtn').addEventListener('click', function() {
                if (cart.length === 0) {
                    showToast('Giỏ hàng đang trống!', false);
                    return;
                }

                sessionStorage.setItem('maianh_checkout_cart', JSON.stringify({
                    items: cart,
                    coupons: [],
                    total: document.getElementById('totalText').textContent
                }));
                window.location.assign('thanhtoan.html');
            });

            // ============ SUGGESTED PRODUCTS ============
            async function renderSuggested() {
                suggestedGrid.innerHTML='<p>Đang tải sản phẩm gợi ý...</p>';
                try {
                    suggestedProducts=await cartApiRequest('/suggestions');
                    suggestedGrid.innerHTML=suggestedProducts.map(p=>`<div class="product-card">
                        <span class="product-edge-icon" aria-hidden="true">🧸</span><span class="product-blossom top" aria-hidden="true">🌸</span><span class="product-blossom side" aria-hidden="true">🌸</span><span class="product-blossom bottom" aria-hidden="true">🌸</span>
                        <a class="product-img" href="ChiTiet.html?id=${encodeURIComponent(p.id)}" aria-label="Xem ${escapeHtml(p.name)}">${p.image_url?`<img class="product-photo" src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.name)}" loading="lazy">`:'<span class="suggestion-no-image">Chưa có ảnh</span>'}</a>
                        <a class="product-name suggestion-link" href="ChiTiet.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a>
                        <p class="suggestion-category">${escapeHtml(p.category_name)}</p>
                        <div class="product-price">${formatPrice(Number(p.price))} ${Number(p.old_price)>Number(p.price)?`<small>${formatPrice(Number(p.old_price))}</small>`:''}</div>
                        <button class="btn-add-sm" data-variant-id="${escapeHtml(p.variant_id)}"><i class="fas fa-cart-plus"></i> Thêm vào giỏ</button>
                    </div>`).join('')||'<p class="suggestion-status">Chưa có thêm sản phẩm gợi ý. <a href="Home.html">Khám phá cửa hàng</a></p>';
                } catch(error) {suggestedGrid.innerHTML=error.status===401?'<p class="suggestion-status"><a href="DangNhap.html">Đăng nhập</a> để xem sản phẩm gợi ý.</p>':'<p class="suggestion-status">Không tải được sản phẩm gợi ý. <button type="button" id="retrySuggestions">Thử lại</button></p>';document.getElementById('retrySuggestions')?.addEventListener('click',renderSuggested);}
            }
            let addingSuggestion=false;
            suggestedGrid.addEventListener('click',async event=>{
                const button=event.target.closest('[data-variant-id]');if(!button||addingSuggestion)return;
                addingSuggestion=true;button.disabled=true;
                try {
                    const rows=await cartApiRequest('',{method:'POST',body:JSON.stringify({variant_id:button.dataset.variantId,quantity:1})});
                    setCartRows(rows);apiCartEnabled=true;renderCart();showToast('Đã thêm sản phẩm vào giỏ!',true);await renderSuggested();
                }catch(error){if(error.status===401)location.href='DangNhap.html';else showToast(error.message,false);button.disabled=false;}
                finally{addingSuggestion=false;}
            });

            // ============ INIT ============
            loadApiCart().finally(() => {
                renderCart();
                renderSuggested();
            });

            // Welcome toast
            window.addEventListener('load', () => {
                setTimeout(() => {
                    showToast('Chào mừng đến giỏ hàng của bạn! 🛒', true);
                }, 500);
            });

        })();
