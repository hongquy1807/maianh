(function() {
            // ============ TRẠNG THÁI ============
            let currentProduct = {
                id: '1',
                name: 'Gấu Nâu Mật Ong',
                price: 350000,
                size: '45cm',
                color: 'Nâu mật ong',
                quantity: 1
            };

            let cart = [];

            // DOM refs
            const mainEmoji = document.getElementById('mainEmoji');
            const sizeValue = document.getElementById('sizeValue');
            const colorValue = document.getElementById('colorValue');
            const qtyInput = document.getElementById('qtyInput');
            const currentPriceEl = document.querySelector('.current-price');
            const oldPriceEl = document.querySelector('.old-price');
            const saveTagEl = document.querySelector('.save-tag');
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            const headerCartCount = document.getElementById('headerCartCount');
            let toastTimeout;

            // ============ TOAST ============
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

            // ============ UPDATE HEADER CART ============
            function updateHeaderCart() {
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                headerCartCount.textContent = totalItems;
                headerCartCount.style.transform = 'scale(1.3)';
                setTimeout(() => headerCartCount.style.transform = 'scale(1)', 200);
            }

            // ============ GALLERY ============
            document.querySelectorAll('.thumb').forEach(thumb => {
                thumb.addEventListener('click', function() {
                    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    mainEmoji.querySelector('img').src = this.querySelector('img').src;
                    // Hiệu ứng nhỏ
                    mainEmoji.style.transform = 'scale(0.8)';
                    setTimeout(() => mainEmoji.style.transform = 'scale(1)', 200);
                });
            });

            // ============ SIZE OPTIONS ============
            document.querySelectorAll('.size-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
                    this.classList.add('active');

                    const newPrice = parseInt(this.dataset.price, 10);
                    const newSize = this.dataset.size;
                    currentProduct.size = newSize;
                    currentProduct.price = newPrice;

                    // Cập nhật giá hiển thị
                    const oldPrice = Math.round(newPrice * 1.2);
                    currentPriceEl.textContent = newPrice.toLocaleString('vi-VN') + 'đ';
                    oldPriceEl.textContent = oldPrice.toLocaleString('vi-VN') + 'đ';
                    const saved = oldPrice - newPrice;
                    saveTagEl.textContent = 'Tiết kiệm ' + saved.toLocaleString('vi-VN') + 'đ';
                    sizeValue.textContent = newSize;

                    showToast(`Đã chọn size ${newSize}`, true);
                });
            });

            // ============ COLOR OPTIONS ============
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
                    this.classList.add('active');
                    const color = this.dataset.color;
                    currentProduct.color = color;
                    colorValue.textContent = color;
                    showToast(`Đã chọn màu ${color}`, true);
                });
            });

            // ============ QUANTITY ============
            document.getElementById('qtyMinus').addEventListener('click', function() {
                let val = parseInt(qtyInput.value, 10);
                if (val > 1) {
                    val--;
                    qtyInput.value = val;
                    currentProduct.quantity = val;
                } else {
                    showToast('Số lượng tối thiểu là 1', false);
                }
            });

            document.getElementById('qtyPlus').addEventListener('click', function() {
                let val = parseInt(qtyInput.value, 10);
                if (val < 99) {
                    val++;
                    qtyInput.value = val;
                    currentProduct.quantity = val;
                } else {
                    showToast('Số lượng tối đa là 99', false);
                }
            });

            // ============ ADD TO CART ============
            document.getElementById('addToCartBtn').addEventListener('click', function() {
                const item = {
                    id: currentProduct.id + '_' + currentProduct.size + '_' + currentProduct.color,
                    name: currentProduct.name + ' (' + currentProduct.size + ' - ' + currentProduct.color + ')',
                    price: currentProduct.price,
                    quantity: currentProduct.quantity
                };

                const existing = cart.find(i => i.id === item.id);
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    cart.push(item);
                }

                updateHeaderCart();
                showToast(`Đã thêm ${currentProduct.quantity} "${currentProduct.name}" vào giỏ!`, true);

                // Reset số lượng về 1
                qtyInput.value = 1;
                currentProduct.quantity = 1;
            });

            // ============ WISHLIST ============
            const wishlistBtn = document.getElementById('wishlistBtn');
            wishlistBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                const icon = this.querySelector('i');
                if (this.classList.contains('active')) {
                    icon.className = 'fas fa-heart';
                    showToast('Đã thêm vào yêu thích! 💖', true);
                } else {
                    icon.className = 'far fa-heart';
                }
            });

            // ============ TABS ============
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const tabId = this.dataset.tab;

                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                    document.getElementById('tab-' + tabId).classList.add('active');

                    // Animate review bars khi mở tab review
                    if (tabId === 'reviews') {
                        setTimeout(() => {
                            document.querySelectorAll('.review-bar .bar-fill').forEach(bar => {
                                const width = bar.style.width;
                                bar.style.width = '0';
                                setTimeout(() => bar.style.width = width, 50);
                            });
                        }, 100);
                    }
                });
            });

            // ============ RELATED PRODUCTS ADD TO CART ============
            document.querySelectorAll('.btn-add-sm').forEach(btn => {
                btn.addEventListener('click', function() {
                    const card = this.closest('.product-card');
                    const name = card.dataset.name;
                    const price = parseInt(card.dataset.price, 10);
                    const id = card.dataset.id;

                    cart.push({
                        id: id + '_' + Date.now(),
                        name: name,
                        price: price,
                        quantity: 1
                    });

                    updateHeaderCart();
                    showToast(`Đã thêm "${name}" vào giỏ!`, true);
                });
            });

            // ============ KHỞI TẠO ============
            updateHeaderCart();

        })();
