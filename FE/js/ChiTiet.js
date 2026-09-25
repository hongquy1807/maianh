(function() {
            const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
            const params = new URLSearchParams(window.location.search);
            const selectedId = params.get('id') || '1';
            const selectedName = params.get('name') || 'Gấu Nâu Mật Ong';
            const selectedPrice = Number(params.get('price') || '350000');
            const productMap = {
                '1': { name: 'Gấu Nâu Mật Ong', price: 350000, size: '45cm', color: 'Nâu mật ong' },
                '2': { name: 'Gấu Hồng Kẹo Ngọt', price: 390000, size: '60cm', color: 'Hồng pastel' },
                '3': { name: 'Gấu Vàng Nắng Mai', price: 420000, size: '50cm', color: 'Vàng nắng' },
                '4': { name: 'Gấu Bông Kem Dâu', price: 370000, size: '35cm', color: 'Trắng kem' },
                '5': { name: 'Gấu Cún Con', price: 450000, size: '65cm', color: 'Nâu mật ong' },
                '6': { name: 'Gấu Mây Bồng Bềnh', price: 520000, size: '70cm', color: 'Trắng kem' },
                '7': { name: 'Gấu Trúc Panda', price: 480000, size: '55cm', color: 'Trắng đen' },
                '8': { name: 'Gấu Nơ Hồng', price: 410000, size: '48cm', color: 'Hồng pastel' }
            };

            // ============ TRẠNG THÁI ============
            let currentProduct = {
                id: selectedId,
                name: productMap[selectedId]?.name || decodeURIComponent(selectedName),
                price: productMap[selectedId]?.price || selectedPrice,
                size: productMap[selectedId]?.size || '45cm',
                color: productMap[selectedId]?.color || 'Nâu mật ong',
                quantity: 1
            };

            let cart = [];
            let productVariants = [];

            // DOM refs
            const mainEmoji = document.getElementById('mainEmoji');
            const sizeValue = document.getElementById('sizeValue');
            const colorValue = document.getElementById('colorValue');
            const qtyInput = document.getElementById('qtyInput');
            const currentPriceEl = document.getElementById('currentPrice');
            const oldPriceEl = document.getElementById('oldPrice');
            const saveTagEl = document.getElementById('saveTag');
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            const headerCartCount = document.getElementById('headerCartCount');
            let toastTimeout;

            function formatPrice(price) {
                return `${Number(price || 0).toLocaleString('vi-VN')}đ`;
            }

            function updatePrice(price, compareAtPrice = 0) {
                const currentPrice = Number(price || 0);
                const oldPrice = Number(compareAtPrice || Math.round(currentPrice * 1.2));
                currentPriceEl.textContent = formatPrice(currentPrice);
                oldPriceEl.textContent = formatPrice(oldPrice);
                saveTagEl.textContent = `Tiết kiệm ${formatPrice(Math.max(0, oldPrice - currentPrice))}`;
            }

            function bindSizeOptions() {
                document.querySelectorAll('.size-option').forEach(option => {
                    option.addEventListener('click', function() {
                        document.querySelectorAll('.size-option').forEach(item => item.classList.remove('active'));
                        this.classList.add('active');
                        currentProduct.size = this.dataset.size;
                        currentProduct.price = Number(this.dataset.price);
                        updatePrice(currentProduct.price, this.dataset.compareAtPrice);
                        sizeValue.textContent = currentProduct.size;
                        showToast(`Đã chọn size ${currentProduct.size}`, true);
                    });
                });
            }

            function bindColorOptions() {
                document.querySelectorAll('.color-option').forEach(option => {
                    option.addEventListener('click', function() {
                        document.querySelectorAll('.color-option').forEach(item => item.classList.remove('active'));
                        this.classList.add('active');
                        currentProduct.color = this.dataset.color;
                        colorValue.textContent = currentProduct.color;
                        showToast(`Đã chọn màu ${currentProduct.color}`, true);
                    });
                });
            }

            function renderProduct(product) {
                const variants = Array.isArray(product.variants) ? product.variants : [];
                productVariants = variants;
                const firstVariant = variants[0];
                const images = Array.isArray(product.images) ? product.images : [];
                const title = document.getElementById('productTitle');
                const description = document.getElementById('productDescription');
                const descriptionTitle = document.getElementById('descriptionTitle');
                const descriptionContent = document.getElementById('descriptionContent');

                currentProduct = {
                    ...currentProduct,
                    id: String(product.id),
                    name: product.name,
                    price: Number(firstVariant?.price ?? 0),
                    size: firstVariant?.size_label || 'Mặc định',
                    color: firstVariant?.color_label || 'Mặc định'
                };
                title.textContent = product.name;
                description.textContent = product.description || 'Sản phẩm chất lượng cao từ hongquy sờtore.';
                descriptionTitle.textContent = `Về ${product.name}`;
                descriptionContent.textContent = product.description || 'Sản phẩm được kiểm tra kỹ lưỡng trước khi đến tay khách hàng.';
                document.getElementById('specMaterial').textContent = product.material || 'Đang cập nhật';
                updatePrice(currentProduct.price, firstVariant?.compare_at_price);
                sizeValue.textContent = currentProduct.size;
                colorValue.textContent = currentProduct.color;

                document.getElementById('sizeOptions').replaceChildren();
                document.getElementById('colorOptions').replaceChildren();
                if (variants.length) {
                    document.getElementById('sizeOptions').innerHTML = variants.map((variant, index) => `
                        <div class="size-option${index === 0 ? ' active' : ''}" data-size="${variant.size_label || 'Mặc định'}" data-price="${variant.price}" data-compare-at-price="${variant.compare_at_price || ''}">
                            ${variant.size_label || 'Mặc định'} <small>${Number(variant.stock_quantity) > 0 ? 'Còn hàng' : 'Hết hàng'}</small>
                        </div>
                    `).join('');
                    bindSizeOptions();
                }

                const colors = [...new Map(variants.filter(variant => variant.color_label).map(variant => [variant.color_label, variant])).values()];
                if (colors.length) {
                    document.getElementById('colorOptions').innerHTML = colors.map((variant, index) => `
                        <div class="color-option${index === 0 ? ' active' : ''}" data-color="${esc(variant.color_label)}" title="${esc(variant.color_label)}"></div>
                    `).join('');
                    bindColorOptions();
                }

                document.querySelector('.thumbnails').replaceChildren();
                const mainImage = document.querySelector('#mainEmoji img');
                mainImage.hidden = !images.length;
                if (images.length) {
                    const gallery = document.querySelector('.thumbnails');
                    const imageUrl = images[0].image_url;
                    document.querySelector('#mainEmoji img').src = imageUrl;
                    document.querySelector('#mainEmoji img').alt = product.name;
                    gallery.innerHTML = images.map((image, index) => `
                        <div class="thumb${index === 0 ? ' active' : ''}"><img class="product-photo" src="${esc(image.image_url)}" alt="${esc(image.alt_text || product.name)}" loading="lazy" width="736" height="980"></div>
                    `).join('');
                    gallery.querySelectorAll('.thumb').forEach(thumb => thumb.addEventListener('click', function() {
                        gallery.querySelectorAll('.thumb').forEach(item => item.classList.remove('active'));
                        this.classList.add('active');
                        document.querySelector('#mainEmoji img').src = this.querySelector('img').src;
                    }));
                }
            }

            async function loadProduct() {
                if (!window.MaianhProducts) return;
                try {
                    const product = await MaianhProducts.getProduct(selectedId, params.get('preview') === '1');
                    renderProduct(product);
                    document.title = product.name + ' | hongquy sờtore';
                    document.getElementById('addToCartBtn').disabled = params.get('preview') === '1';
                    if (params.get('preview') === '1') document.getElementById('addToCartBtn').textContent = 'B?n xem tr??c qu?n tr?';
                } catch (error) {
                    document.getElementById('productTitle').textContent = error.message;
                    document.getElementById('productDescription').textContent = '';
                    document.getElementById('addToCartBtn').disabled = true;
                    showToast(error.message, false);
                }
            }

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
            bindSizeOptions();
            bindColorOptions();

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
            document.getElementById('addToCartBtn').addEventListener('click', async function() {
                const variant=productVariants.find(v=>(v.size_label||'Mặc định')===currentProduct.size && (v.color_label||'Mặc định')===currentProduct.color);
                const quantity=Number(qtyInput.value);
                if(!variant || Number(variant.stock_quantity)<1)return showToast('Phân loại này không còn hàng.',false);
                if(!Number.isInteger(quantity)||quantity<1||quantity>99)return showToast('Số lượng phải từ 1 đến 99.',false);
                this.disabled=true;
                try {
                    const response=await fetch('/api/cart',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web'},body:JSON.stringify({variant_id:String(variant.id),quantity})});
                    const result=await response.json();
                    if(response.status===401){location.href='DangNhap.html';return;}
                    if(!response.ok)throw new Error(result.error||'Không thể thêm vào giỏ.');
                    cart=result.data.map(item=>({...item,quantity:Number(item.quantity)}));
                    updateHeaderCart();window.dispatchEvent(new Event('cart-updated'));
                    showToast(`Đã thêm ${quantity} "${currentProduct.name}" vào giỏ!`,true);
                    qtyInput.value=1;currentProduct.quantity=1;
                }catch(error){showToast(error.message,false);}finally{this.disabled=false;}
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

            // Related products use real product and variant IDs.
            const relatedGrid = document.getElementById('relatedGrid');
            async function loadRelated() {
                relatedGrid.innerHTML='<p>Đang tải sản phẩm tương tự...</p>';
                try {
                    const response=await fetch(`/api/products/${encodeURIComponent(selectedId)}/related`);
                    if(!response.ok)throw new Error();
                    const {data}=await response.json();
                    relatedGrid.innerHTML=data.map(p=>`<div class="product-card">
                        <span class="product-edge-icon" aria-hidden="true">🧸</span><span class="product-blossom top" aria-hidden="true">🌸</span><span class="product-blossom side" aria-hidden="true">🌸</span><span class="product-blossom bottom" aria-hidden="true">🌸</span><span class="product-mai" aria-hidden="true"></span>
                        <a class="product-img" href="ChiTiet.html?id=${encodeURIComponent(p.id)}" aria-label="Xem ${esc(p.name)}">${p.image_url?`<img class="product-photo" src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">`:'<span class="related-no-image">Chưa có ảnh</span>'}</a>
                        <a class="product-name related-link" href="ChiTiet.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a><p class="related-category">${esc(p.category_name)}</p>
                        <div class="product-price">${formatPrice(p.price)} ${Number(p.old_price)>Number(p.price)?`<small>${formatPrice(p.old_price)}</small>`:''}</div>
                        <button class="btn-add-sm" data-variant-id="${esc(p.variant_id)}"><i class="fas fa-cart-plus"></i> Thêm vào giỏ</button>
                    </div>`).join('')||'<p>Chưa có sản phẩm tương tự còn hàng.</p>';
                }catch {relatedGrid.innerHTML='<p>Không tải được sản phẩm tương tự. <button type="button" id="retryRelated">Thử lại</button></p>';document.getElementById('retryRelated').onclick=loadRelated;}
            }
            let addingRelated=false;
            relatedGrid.addEventListener('click',async event=>{
                const button=event.target.closest('[data-variant-id]');if(!button||addingRelated)return;
                addingRelated=true;button.disabled=true;
                try {
                    const response=await fetch('/api/cart',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web'},body:JSON.stringify({variant_id:button.dataset.variantId,quantity:1})});
                    const result=await response.json();
                    if(response.status===401){location.href='DangNhap.html';return;}
                    if(!response.ok)throw new Error(result.error||'Không thể thêm vào giỏ.');
                    cart=result.data.map(item=>({...item,quantity:Number(item.quantity)}));
                    updateHeaderCart();window.dispatchEvent(new Event('cart-updated'));showToast('Đã thêm sản phẩm vào giỏ!',true);
                }catch(error){showToast(error.message,false);}finally{addingRelated=false;button.disabled=false;}
            });
            loadRelated();

            // ============ KHỞI TẠO ============
            loadProduct();

        })();
