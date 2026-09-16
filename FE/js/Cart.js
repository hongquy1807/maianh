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

            // Danh sách mã giảm giá
            const coupons = {
                'TEDDY20': { type: 'percent', value: 20, min: 0, label: 'Giảm 20%' },
                'SHIP50': { type: 'fixed', value: 50000, min: 200000, label: 'Giảm 50.000đ' },
                'WELCOME': { type: 'percent', value: 10, min: 0, label: 'Giảm 10%' },
                'FREESHIP': { type: 'freeship', value: 0, min: 0, label: 'Miễn phí ship' }
            };

            let appliedCoupons = [];
            let shippingFee = 30000;
            const FREESHIP_THRESHOLD = 500000;

            // Sản phẩm gợi ý
            const suggestedProducts = [
                { id: 's1', name: 'Gấu Cún Con', emoji: '🧸🐶', price: 450000, oldPrice: 520000, rating: 5, badge: 'HOT' },
                { id: 's2', name: 'Gấu Mây Bồng Bềnh', emoji: '🧸☁️', price: 520000, oldPrice: null, rating: 5, badge: 'LIMITED' },
                { id: 's3', name: 'Gấu Trúc Panda', emoji: '🧸🐼', price: 480000, oldPrice: 550000, rating: 4.5, badge: null },
                { id: 's4', name: 'Gấu Nơ Hồng', emoji: '🧸🎀', price: 410000, oldPrice: null, rating: 5, badge: 'MỚI' }
            ];

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
                            <div class="item-img"><img class="product-photo" src="/uploads/products/7e4cb1d424ce6a785ae006361dd1b130.jpg" alt="Gấu bông minh họa" loading="lazy" width="736" height="980"></div>
                            <div class="item-info">
                                <h3>${item.name}</h3>
                                <div class="item-variant">
                                    <span>${item.size}</span>
                                    <span>${item.color}</span>
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
                renderCart();
                if (item) showToast(`Đã xoá "${item.name}" khỏi giỏ hàng`, true);
            }

            // ============ UPDATE SUMMARY ============
            function updateSummary() {
                const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
                const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

                // Coupons
                let discount = 0;
                let freeShipCoupon = false;
                appliedCoupons.forEach(code => {
                    const c = coupons[code];
                    if (c.type === 'percent') {
                        discount += Math.round(subtotal * c.value / 100);
                    } else if (c.type === 'fixed') {
                        discount += c.value;
                    } else if (c.type === 'freeship') {
                        freeShipCoupon = true;
                    }
                });

                // Ship
                let ship = shippingFee;
                if (subtotal >= FREESHIP_THRESHOLD || freeShipCoupon) {
                    ship = 0;
                }

                const total = Math.max(0, subtotal - discount + ship);

                // Update UI
                document.getElementById('itemCountText').textContent = totalItems;
                document.getElementById('subtotalText').textContent = formatPrice(subtotal);
                document.getElementById('shippingText').textContent = ship === 0 ? 'Miễn phí' : formatPrice(ship);
                document.getElementById('totalText').textContent = formatPrice(total);
                headerCartCount.textContent = totalItems;
                cartSummaryText.textContent = `Bạn có ${totalItems} sản phẩm trong giỏ hàng`;

                // Discount row
                if (discount > 0) {
                    document.getElementById('discountRow').style.display = 'flex';
                    document.getElementById('discountText').textContent = '-' + formatPrice(discount);
                } else {
                    document.getElementById('discountRow').style.display = 'none';
                }

                // Freeship progress
                const freeshipBox = document.getElementById('freeshipBox');
                const freeshipFill = document.getElementById('freeshipFill');
                const freeshipText = document.getElementById('freeshipText');
                const freeshipNote = document.getElementById('freeshipNote');

                if (subtotal >= FREESHIP_THRESHOLD || freeShipCoupon) {
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
            function renderAppliedCoupons() {
                const container = document.getElementById('appliedCoupons');
                if (appliedCoupons.length === 0) {
                    container.innerHTML = '';
                    return;
                }
                container.innerHTML = appliedCoupons.map(code => `
                    <div class="coupon-chip">
                        <i class="fas fa-tag"></i>
                        <span class="coupon-name">${code}</span>
                        <span class="coupon-value">${coupons[code].label}</span>
                        <button class="coupon-remove" data-code="${code}">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    </div>
                `).join('');

                container.querySelectorAll('.coupon-remove').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const code = this.dataset.code;
                        appliedCoupons = appliedCoupons.filter(c => c !== code);
                        renderAppliedCoupons();
                        updateSummary();
                        showToast(`Đã xoá mã ${code}`, true);
                    });
                });
            }

            document.getElementById('applyCouponBtn').addEventListener('click', function() {
                const input = document.getElementById('couponInput');
                const code = input.value.trim().toUpperCase();

                if (!code) {
                    showToast('Vui lòng nhập mã giảm giá!', false);
                    input.focus();
                    return;
                }

                if (appliedCoupons.includes(code)) {
                    showToast('Mã này đã được áp dụng rồi!', false);
                    return;
                }

                if (!coupons[code]) {
                    showToast('Mã giảm giá không hợp lệ!', false);
                    return;
                }

                const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
                if (coupons[code].min && subtotal < coupons[code].min) {
                    showToast(`Đơn hàng tối thiểu ${formatPrice(coupons[code].min)} để dùng mã này!`, false);
                    return;
                }

                appliedCoupons.push(code);
                input.value = '';
                renderAppliedCoupons();
                updateSummary();
                showToast(`🎉 Đã áp dụng mã ${code} - ${coupons[code].label}!`, true);
            });

            document.getElementById('couponInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') document.getElementById('applyCouponBtn').click();
            });

            // ============ CLEAR CART ============
            document.getElementById('clearCartBtn').addEventListener('click', function() {
                if (cart.length === 0) return;
                showConfirm(
                    'Xoá toàn bộ giỏ hàng?',
                    'Bạn có chắc muốn xoá tất cả sản phẩm khỏi giỏ hàng không? Hành động này không thể hoàn tác.',
                    () => {
                        cart = [];
                        appliedCoupons = [];
                        renderAppliedCoupons();
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

            // ============ PAYMENT METHODS ============
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.addEventListener('click', function() {
                    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // ============ CHECKOUT ============
            document.getElementById('checkoutBtn').addEventListener('click', function() {
                if (cart.length === 0) {
                    showToast('Giỏ hàng đang trống!', false);
                    return;
                }

                const total = document.getElementById('totalText').textContent;
                const method = document.querySelector('.payment-option.active .payment-name').textContent;

                // Đổi step
                document.querySelectorAll('.step').forEach((s, i) => {
                    if (i === 0) { s.classList.remove('active'); s.classList.add('completed'); }
                    if (i === 1) { s.classList.add('active'); }
                });
                document.getElementById('stepsLineFill').style.width = '100%';

                showToast(`Đặt hàng thành công! Tổng: ${total}`, true);

                // Xoá giỏ sau 2s
                setTimeout(() => {
                    cart = [];
                    appliedCoupons = [];
                    renderAppliedCoupons();
                    renderCart();
                    // Reset step
                    document.querySelectorAll('.step').forEach((s, i) => {
                        s.classList.remove('active', 'completed');
                        if (i === 0) s.classList.add('active');
                    });
                    document.getElementById('stepsLineFill').style.width = '50%';
                }, 2500);
            });

            // ============ SUGGESTED PRODUCTS ============
            function renderSuggested() {
                suggestedGrid.innerHTML = suggestedProducts.map(p => `
                    <div class="product-card">
                        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
                        <span class="product-edge-icon" aria-hidden="true">${p.emoji}</span><span class="product-blossom top" aria-hidden="true">🌸</span><span class="product-blossom side" aria-hidden="true">🌸</span><span class="product-blossom bottom" aria-hidden="true">🌸</span><div class="product-img"><img class="product-photo" src="/uploads/products/7e4cb1d424ce6a785ae006361dd1b130.jpg" alt="Gấu bông minh họa" loading="lazy" width="736" height="980"></div>
                        <div class="product-name">${p.name}</div>
                        <div class="product-rating">
                            ${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))}
                            ${p.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        </div>
                        <div class="product-price">
                            ${formatPrice(p.price)}
                            ${p.oldPrice ? `<small>${formatPrice(p.oldPrice)}</small>` : ''}
                        </div>
                        <button class="btn-add-sm" data-id="${p.id}">
                            <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                `).join('');

                suggestedGrid.querySelectorAll('.btn-add-sm').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.dataset.id;
                        const product = suggestedProducts.find(p => p.id === id);
                        if (!product) return;

                        // Kiểm tra đã có trong giỏ chưa
                        const existing = cart.find(i => i.name === product.name);
                        if (existing) {
                            existing.quantity++;
                        } else {
                            cart.push({
                                id: 'new_' + Date.now(),
                                name: product.name,
                                emoji: product.emoji,
                                price: product.price,
                                oldPrice: product.oldPrice,
                                size: '45cm',
                                color: 'Mặc định',
                                quantity: 1,
                                stock: 15
                            });
                        }
                        renderCart();
                        showToast(`Đã thêm "${product.name}" vào giỏ!`, true);
                    });
                });
            }

            // ============ INIT ============
            renderCart();
            renderSuggested();
            renderAppliedCoupons();

            // Welcome toast
            window.addEventListener('load', () => {
                setTimeout(() => {
                    showToast('Chào mừng đến giỏ hàng của bạn! 🛒', true);
                }, 500);
            });

        })();
