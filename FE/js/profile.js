(async function() {
            let currentUser;
            try { currentUser = await MaianhAuth.getSession(); }
            catch { document.querySelector('.hero-name-row h1').textContent = 'Không tải được tài khoản. Vui lòng thử lại.'; return; }
            if (!currentUser) { location.replace('DangNhap.html'); return; }
            document.querySelector('.hero-name-row h1').textContent = currentUser.full_name;
            const contacts = document.querySelectorAll('.hero-info > p > span');
            contacts[0].textContent = currentUser.email;
            contacts[1].textContent = currentUser.phone || 'Chưa có số điện thoại';
            contacts[2].textContent = '';
            for (const [field,value] of Object.entries({name:currentUser.full_name,email:currentUser.email,phone:currentUser.phone,birthday:'Chưa cập nhật',gender:'Chưa cập nhật',address:'Chưa cập nhật'})) {
                document.querySelector(`[data-field="${field}"]`).textContent = value || 'Chưa cập nhật';
            }
            // ============ DỮ LIỆU MẪU ============
            const orders = [
                {
                    id: 'ORD-2025-001',
                    date: '15/01/2025',
                    status: 'pending',
                    statusText: 'Chờ xác nhận',
                    statusIcon: 'fa-clock',
                    products: [
                        { name: 'Gấu Nâu Mật Ong', emoji: '🧸', size: '45cm', qty: 1, price: 350000 },
                        { name: 'Gấu Hồng Kẹo Ngọt', emoji: '🧸🌸', size: '60cm', qty: 1, price: 390000 }
                    ],
                    total: 740000,
                    payment: 'COD',
                    timeline: [
                        { text: 'Đơn hàng đã đặt', time: '15/01/2025 09:30', state: 'done' },
                        { text: 'Đang chờ xác nhận', time: 'Đang xử lý', state: 'current' },
                        { text: 'Xác nhận đơn hàng', time: '', state: '' },
                        { text: 'Đang giao hàng', time: '', state: '' },
                        { text: 'Giao hàng thành công', time: '', state: '' }
                    ]
                },
                {
                    id: 'ORD-2025-002',
                    date: '10/01/2025',
                    status: 'confirmed',
                    statusText: 'Đã xác nhận',
                    statusIcon: 'fa-check',
                    products: [
                        { name: 'Gấu Vàng Nắng Mai', emoji: '🧸☀️', size: '50cm', qty: 1, price: 420000 }
                    ],
                    total: 420000,
                    payment: 'Chuyển khoản',
                    timeline: [
                        { text: 'Đơn hàng đã đặt', time: '10/01/2025 14:20', state: 'done' },
                        { text: 'Đã xác nhận đơn hàng', time: '10/01/2025 15:00', state: 'done' },
                        { text: 'Đang chuẩn bị hàng', time: 'Đang xử lý', state: 'current' },
                        { text: 'Đang giao hàng', time: '', state: '' },
                        { text: 'Giao hàng thành công', time: '', state: '' }
                    ]
                },
                {
                    id: 'ORD-2025-003',
                    date: '05/01/2025',
                    status: 'shipping',
                    statusText: 'Đang giao',
                    statusIcon: 'fa-truck',
                    products: [
                        { name: 'Gấu Kem Dâu', emoji: '🧸🍓', size: '35cm', qty: 2, price: 370000 },
                        { name: 'Gấu Cún Con', emoji: '🧸🐶', size: '65cm', qty: 1, price: 450000 }
                    ],
                    total: 1190000,
                    payment: 'Ví Momo',
                    timeline: [
                        { text: 'Đơn hàng đã đặt', time: '05/01/2025 10:15', state: 'done' },
                        { text: 'Đã xác nhận đơn hàng', time: '05/01/2025 11:00', state: 'done' },
                        { text: 'Đang chuẩn bị hàng', time: '05/01/2025 16:00', state: 'done' },
                        { text: 'Đang giao hàng', time: '06/01/2025 08:30', state: 'current' },
                        { text: 'Giao hàng thành công', time: 'Dự kiến 07/01/2025', state: '' }
                    ]
                },
                {
                    id: 'ORD-2024-156',
                    date: '20/12/2024',
                    status: 'delivered',
                    statusText: 'Đã giao',
                    statusIcon: 'fa-box-open',
                    products: [
                        { name: 'Gấu Mây Bồng Bềnh', emoji: '🧸☁️', size: '70cm', qty: 1, price: 520000 }
                    ],
                    total: 520000,
                    payment: 'COD',
                    timeline: [
                        { text: 'Đơn hàng đã đặt', time: '20/12/2024 09:00', state: 'done' },
                        { text: 'Đã xác nhận đơn hàng', time: '20/12/2024 10:00', state: 'done' },
                        { text: 'Đang chuẩn bị hàng', time: '20/12/2024 15:00', state: 'done' },
                        { text: 'Đang giao hàng', time: '21/12/2024 08:00', state: 'done' },
                        { text: 'Giao hàng thành công', time: '22/12/2024 14:30', state: 'done' }
                    ]
                }
            ];

            const addresses = [
                {
                    id: 1,
                    name: 'Mai Anh',
                    phone: '0912 345 678',
                    address: '123 Đường Yêu Thương, Phường Bến Nghé, Quận 1, TP.HCM',
                    default: true
                },
                {
                    id: 2,
                    name: 'Mai Anh (Văn phòng)',
                    phone: '0912 345 678',
                    address: '456 Đường Nguyễn Huệ, Phường Bến Thành, Quận 1, TP.HCM',
                    default: false
                }
            ];

            const notifications = [
                { icon: 'fa-truck', title: 'Đơn hàng ORD-2025-003 đang giao', desc: 'Đơn hàng của bạn đang trên đường đến. Dự kiến giao 07/01/2025.', time: '2 giờ trước', unread: true },
                { icon: 'fa-gift', title: 'Bạn có 1 mã giảm giá mới!', desc: 'Mã TEDDY20 giảm 20% cho đơn hàng tiếp theo. Hạn dùng đến 31/01/2025.', time: '1 ngày trước', unread: true },
                { icon: 'fa-crown', title: 'Chúc mừng! Bạn đã lên hạng Vàng', desc: 'Bạn cần thêm 520 điểm để lên hạng Kim Cương. Cố lên nhé!', time: '3 ngày trước', unread: false },
                { icon: 'fa-heart', title: 'Gấu yêu thích của bạn đang giảm giá', desc: 'Gấu Nâu Mật Ong giảm 17% chỉ còn 350.000đ. Nhanh tay đặt hàng!', time: '5 ngày trước', unread: false }
            ];

            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            let toastTimeout;

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

            function formatPrice(price) {
                return price.toLocaleString('vi-VN') + 'đ';
            }

            // ============ SIDEBAR NAVIGATION ============
            document.querySelectorAll('.sidebar-nav-item').forEach(item => {
                item.addEventListener('click', function() {
                    const tab = this.dataset.tab;

                    document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
                    this.classList.add('active');

                    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                    document.getElementById('tab-' + tab).classList.add('active');

                    // Scroll to top of main
                    window.scrollTo({ top: 250, behavior: 'smooth' });
                });
            });

            // ============ RENDER ORDERS ============
            function renderOrders(filter = 'all') {
                const container = document.getElementById('ordersList');
                const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

                if (filtered.length === 0) {
                    container.innerHTML = `
                        <div class="empty-orders">
                            <div class="icon">📦</div>
                            <h3>Chưa có đơn hàng nào</h3>
                            <p>Bạn chưa có đơn hàng trong trạng thái này.</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = filtered.map(order => `
                    <div class="order-card" data-order-id="${order.id}">
                        <div class="order-header">
                            <div class="order-code">
                                <strong>#${order.id}</strong>
                                <span><i class="fas fa-calendar"></i> ${order.date}</span>
                                <span><i class="fas fa-credit-card"></i> ${order.payment}</span>
                            </div>
                            <span class="order-status ${order.status}">
                                <i class="fas ${order.statusIcon}"></i> ${order.statusText}
                            </span>
                        </div>

                        <div class="order-products">
                            ${order.products.map(p => `
                                <div class="order-product">
                                    <div class="order-product-img"><img class="product-photo" src="/uploads/products/7e4cb1d424ce6a785ae006361dd1b130.jpg" alt="Gấu bông minh họa" loading="lazy" width="736" height="980"></div>
                                    <div class="order-product-info">
                                        <h4>${p.name}</h4>
                                        <p>Size ${p.size} • SL: ${p.qty}</p>
                                    </div>
                                    <div class="order-product-price">${formatPrice(p.price * p.qty)}</div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="order-footer">
                            <div class="order-total">
                                <span>Tổng cộng:</span>
                                <strong>${formatPrice(order.total)}</strong>
                            </div>
                            <div class="order-actions">
                                <button class="btn-order outline toggle-timeline" data-id="${order.id}">
                                    <i class="fas fa-stream"></i> Theo dõi
                                </button>
                                ${order.status === 'pending' ? `
                                    <button class="btn-order danger cancel-order" data-id="${order.id}">
                                        <i class="fas fa-times"></i> Huỷ đơn
                                    </button>
                                ` : ''}
                                ${order.status === 'delivered' ? `
                                    <button class="btn-order primary rebuy-order" data-id="${order.id}">
                                        <i class="fas fa-redo"></i> Mua lại
                                    </button>
                                ` : ''}
                                ${order.status === 'shipping' ? `
                                    <button class="btn-order primary track-order" data-id="${order.id}">
                                        <i class="fas fa-map-marked-alt"></i> Xem vị trí
                                    </button>
                                ` : ''}
                            </div>
                        </div>

                        <div class="order-timeline" id="timeline-${order.id}">
                            <div class="timeline-title"><i class="fas fa-route"></i> Trạng thái đơn hàng</div>
                            <div class="timeline">
                                ${order.timeline.map(t => `
                                    <div class="timeline-item ${t.state}">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-content">
                                            <h5>${t.text}</h5>
                                            <p>${t.time}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('');

                bindOrderEvents();
            }

            function bindOrderEvents() {
                // Toggle timeline
                document.querySelectorAll('.toggle-timeline').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.dataset.id;
                        const timeline = document.getElementById('timeline-' + id);
                        if (timeline) {
                            timeline.classList.toggle('show');
                            this.innerHTML = timeline.classList.contains('show')
                                ? '<i class="fas fa-chevron-up"></i> Ẩn'
                                : '<i class="fas fa-stream"></i> Theo dõi';
                        }
                    });
                });

                // Cancel order
                document.querySelectorAll('.cancel-order').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.dataset.id;
                        showToast(`Đã gửi yêu cầu huỷ đơn #${id}. Chúng tôi sẽ liên hệ bạn sớm!`, true);
                    });
                });

                // Rebuy
                document.querySelectorAll('.rebuy-order').forEach(btn => {
                    btn.addEventListener('click', function() {
                        showToast('Đã thêm sản phẩm vào giỏ hàng! 🛒', true);
                    });
                });

                // Track
                document.querySelectorAll('.track-order').forEach(btn => {
                    btn.addEventListener('click', function() {
                        showToast('Đơn hàng đang trên đường giao, vui lòng chờ nhé! 🚚', true);
                    });
                });
            }

            // Order tabs
            document.querySelectorAll('.order-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.order-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    renderOrders(this.dataset.status);
                });
            });

            // ============ RENDER ADDRESSES ============
            function renderAddresses() {
                const container = document.getElementById('addressList');
                container.innerHTML = addresses.map(addr => `
                    <div class="address-card ${addr.default ? 'default' : ''}">
                        ${addr.default ? '<span class="default-badge">MẶC ĐỊNH</span>' : ''}
                        <div class="address-name"><i class="fas fa-user"></i> ${addr.name}</div>
                        <div class="address-phone">${addr.phone}</div>
                        <div class="address-detail">${addr.address}</div>
                        <div class="address-actions">
                            <button class="btn-address edit-address" data-id="${addr.id}">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            ${!addr.default ? `
                                <button class="btn-address set-default" data-id="${addr.id}">
                                    <i class="fas fa-check"></i> Mặc định
                                </button>
                                <button class="btn-address danger delete-address" data-id="${addr.id}">
                                    <i class="fas fa-trash"></i> Xoá
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('') + `
                    <button class="add-address-btn" id="addAddressBtn">
                        <i class="fas fa-plus-circle"></i>
                        <span>Thêm địa chỉ mới</span>
                    </button>
                `;

                bindAddressEvents();
            }

            function bindAddressEvents() {
                document.querySelectorAll('.set-default').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.dataset.id);
                        addresses.forEach(a => a.default = a.id === id);
                        renderAddresses();
                        showToast('Đã đặt làm địa chỉ mặc định!', true);
                    });
                });

                document.querySelectorAll('.delete-address').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = parseInt(this.dataset.id);
                        const idx = addresses.findIndex(a => a.id === id);
                        if (idx !== -1) {
                            addresses.splice(idx, 1);
                            renderAddresses();
                            showToast('Đã xoá địa chỉ!', true);
                        }
                    });
                });

                document.querySelectorAll('.edit-address').forEach(btn => {
                    btn.addEventListener('click', () => showToast('Chức năng đang phát triển', false));
                });

                const addBtn = document.getElementById('addAddressBtn');
                if (addBtn) {
                    addBtn.addEventListener('click', () => showToast('Chức năng thêm địa chỉ đang phát triển', false));
                }
            }

            // ============ RENDER NOTIFICATIONS ============
            function renderNotifications() {
                const container = document.getElementById('notificationsList');
                container.innerHTML = notifications.map((n, idx) => `
                    <div class="setting-row" style="cursor: pointer;" data-notif="${idx}">
                        <div class="setting-info">
                            <div class="setting-icon" style="${n.unread ? 'background: linear-gradient(135deg, var(--yellow-main), var(--pink-soft));' : ''}">
                                <i class="fas ${n.icon}"></i>
                            </div>
                            <div class="setting-text">
                                <h4>
                                    ${n.unread ? '<span style="display: inline-block; width: 8px; height: 8px; background: var(--pink-deep); border-radius: 50%; margin-right: 6px;"></span>' : ''}
                                    ${n.title}
                                </h4>
                                <p>${n.desc}</p>
                                <p style="color: var(--yellow-deep); margin-top: 4px; font-size: 0.72rem;">
                                    <i class="fas fa-clock"></i> ${n.time}
                                </p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            // ============ EDIT PROFILE ============
            document.getElementById('editProfileBtn').addEventListener('click', () => {
                document.querySelector('.sidebar-nav-item[data-tab="info"]').click();
                showToast('Chỉnh sửa thông tin tại đây nhé!', true);
            });

            document.getElementById('editInfoBtn').addEventListener('click', () => {
                showToast('Chế độ chỉnh sửa đang phát triển', false);
            });

            // Editable fields
            document.querySelectorAll('.info-value.editable').forEach(field => {
                field.addEventListener('click', function() {
                    const fieldName = this.dataset.field;
                    showToast(`Chỉnh sửa "${fieldName}" đang phát triển`, false);
                });
            });

            // Logout
            document.getElementById('logoutBtn').addEventListener('click', async () => {
                const button = document.getElementById('logoutBtn');
                button.disabled = true;
                try { await MaianhAuth.request('/logout', {}); location.replace('DangNhap.html'); }
                catch (error) { showToast(error.message, false); button.disabled = false; }
            });

            // ============ INIT ============
            renderOrders('all');
            renderAddresses();
            renderNotifications();

            // Welcome
            window.addEventListener('load', () => {
                setTimeout(() => {
                    showToast(`Chào mừng ${currentUser.full_name} quay trở lại!`, true);
                }, 500);
            });

            window.dispatchEvent(new Event('hashchange'));
        })();
