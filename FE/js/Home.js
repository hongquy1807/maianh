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
                headerCartCount.textContent = totalItems;
                cartTotal.textContent = formatPrice(totalPrice);
                cartItems.textContent = totalItems + ' sản phẩm';

                // Animation nhỏ cho badge
                cartBadge.style.transform = 'scale(1.3)';
                headerCartCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                    headerCartCount.style.transform = 'scale(1)';
                }, 200);
            }

            function addToCart(productId, productName, productPrice) {
                const existingItem = cart.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                }
                updateCartUI();
                showToast(`Đã thêm "${productName}" vào giỏ!`, true);
            }

            // Xử lý nút thêm giỏ hàng
            document.querySelectorAll('.btn-add').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const card = this.closest('.product-card');
                    if (!card) return;

                    const id = card.dataset.id;
                    const name = card.dataset.name;
                    const price = parseInt(card.dataset.price, 10);

                    if (id && name && !isNaN(price)) {
                        addToCart(id, name, price);
                    }
                });
            });

            // Wishlist
            document.querySelectorAll('.product-wish').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.classList.toggle('active');
                    const icon = this.querySelector('i');
                    if (this.classList.contains('active')) {
                        icon.className = 'fas fa-heart';
                        showToast('Đã thêm vào yêu thích! 💖', true);
                    } else {
                        icon.className = 'far fa-heart';
                    }
                });
            });

            // Thanh toán
            document.getElementById('checkoutBtn').addEventListener('click', function() {
                if (cart.length === 0) {
                    showToast('Giỏ hàng đang trống, thêm gấu bông nha! 🧸', false);
                    return;
                }
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                showToast(`Đặt hàng thành công ${totalItems} bé gấu! 🎉`, true);
                cart = [];
                updateCartUI();
            });

            // Khởi tạo
            updateCartUI();

            // Toast chào mừng
            window.addEventListener('load', () => {
                setTimeout(() => {
                    showToast('Chào mừng bạn đến với Teddy Yêu Thương! 💛', true);
                }, 800);
            });

        })();
