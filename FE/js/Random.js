(function() {
            // ============ DỮ LIỆU MÓN ĂN ============
            const foodData = {
                main: [
                    'Mì Quảng', 'Mì Quảng ếch', 'Mì Quảng gà', 'Mì Quảng tôm thịt',
                    'Bún chả cá', 'Bún mắm nêm', 'Bún thịt nướng', 'Bún bò', 'Bún hải sản',
                    'Bánh tráng cuốn thịt heo', 'Bánh xèo', 'Nem lụi', 'Bê thui Cầu Mống',
                    'Gỏi cá Nam Ô', 'Cơm gà', 'Cơm hến', 'Cơm chiên hải sản',
                    'Cháo hàu', 'Cháo chả cá', 'Bánh canh', 'Bánh canh cá lóc',
                    'Bánh canh chả cá', 'Cao lầu', 'Ram cuốn cải', 'Lẩu hải sản',
                    'Hải sản nướng', 'Hải sản hấp', 'Ốc các loại', 'Chả bò Đà Nẵng'
                ],
                snack: [
                    'Bánh tráng kẹp', 'Bánh tráng nướng', 'Bánh bèo', 'Bánh nậm',
                    'Bánh bột lọc', 'Bánh ít', 'Bánh căn', 'Bánh đập', 'Bánh chuối chiên',
                    'Bánh khoai', 'Bánh tiêu', 'Khoai tây chiên', 'Khoai lang chiên',
                    'Xúc xích nướng', 'Cá viên chiên', 'Bò viên chiên', 'Hồ lô nướng',
                    'Nem chua rán', 'Mít trộn', 'Ốc hút', 'Ốc xào', 'Chân gà sả tắc',
                    'Chân gà nướng', 'Cút lộn xào me', 'Trứng cút nướng', 'Bắp xào',
                    'Bắp nướng', 'Khoai nướng', 'Gỏi khô bò', 'Gỏi xoài', 'Xoài lắc',
                    'Cóc lắc', 'Bánh tráng trộn', 'Bánh tráng cuốn', 'Bánh tráng bơ'
                ],
                dessert: [
                    'Kem bơ', 'Chè sầu riêng', 'Chè Thái', 'Chè khúc bạch',
                    'Chè thập cẩm', 'Chè đậu xanh', 'Chè đậu đen', 'Chè xoa xoa',
                    'Chè bưởi', 'Tào phớ', 'Sữa chua', 'Yaourt muối', 'Flan',
                    'Kem dừa', 'Kem trái cây', 'Sữa chua dẻo', 'Trái cây tô',
                    'Hoa quả dầm', 'Sầu riêng', 'Dừa dầm'
                ],
                drink: [
                    // Cà phê
                    'Cà phê sữa đá', 'Cà phê đen đá', 'Bạc xỉu', 'Cà phê muối',
                    'Cà phê cốt dừa', 'Cà phê trứng', 'Cold brew', 'Cà phê pha máy',
                    // Trà & trà sữa
                    'Trà đào', 'Trà tắc', 'Trà chanh', 'Trà vải', 'Trà dâu',
                    'Trà mãng cầu', 'Trà sữa truyền thống', 'Trà sữa ô long',
                    'Trà sữa thái', 'Matcha latte', 'Matcha đá xay',
                    // Nước trái cây
                    'Nước mía', 'Nước dừa', 'Nước ép cam', 'Nước ép dứa',
                    'Nước ép dưa hấu', 'Nước ép ổi', 'Nước ép cà rốt',
                    'Sinh tố bơ', 'Sinh tố xoài', 'Sinh tố dâu',
                    'Sinh tố mãng cầu', 'Sinh tố sapoche',
                    // Đồ uống ăn vặt
                    'Sữa tươi trân châu đường đen', 'Yaourt đá', 'Chanh dây đá',
                    'Chanh muối', 'Tắc xí muội', 'Soda trái cây', 'Đá me',
                    'Nước sâm', 'Nước đậu đen', 'Nước bí đao'
                ]
            };

            const categoryMeta = {
                main: { name: 'Món ăn chính', icon: 'fa-utensils', emoji: '🍜' },
                snack: { name: 'Ăn vặt', icon: 'fa-cookie-bite', emoji: '🍢' },
                dessert: { name: 'Đồ ngọt', icon: 'fa-ice-cream', emoji: '🍧' },
                drink: { name: 'Đồ uống', icon: 'fa-mug-hot', emoji: '🥤' }
            };

            // Danh mục cho phần menu (có chia nhóm nhỏ hơn)
            const menuCategories = {
                main: [
                    { title: 'Mì & Bún', icon: '🍜', items: ['Mì Quảng', 'Mì Quảng ếch', 'Mì Quảng gà', 'Mì Quảng tôm thịt', 'Bún chả cá', 'Bún mắm nêm', 'Bún thịt nướng', 'Bún bò', 'Bún hải sản'] },
                    { title: 'Bánh & Cuốn', icon: '🥟', items: ['Bánh tráng cuốn thịt heo', 'Bánh xèo', 'Nem lụi', 'Ram cuốn cải'] },
                    { title: 'Cơm & Cháo', icon: '🍚', items: ['Cơm gà', 'Cơm hến', 'Cơm chiên hải sản', 'Cháo hàu', 'Cháo chả cá'] },
                    { title: 'Bánh canh & Cao lầu', icon: '🍲', items: ['Bánh canh', 'Bánh canh cá lóc', 'Bánh canh chả cá', 'Cao lầu'] },
                    { title: 'Hải sản & Đặc sản', icon: '🦐', items: ['Bê thui Cầu Mống', 'Gỏi cá Nam Ô', 'Lẩu hải sản', 'Hải sản nướng', 'Hải sản hấp', 'Ốc các loại', 'Chả bò Đà Nẵng'] }
                ],
                snack: [
                    { title: 'Bánh & Đồ chiên', icon: '🥟', items: ['Bánh tráng kẹp', 'Bánh tráng nướng', 'Bánh bèo', 'Bánh nậm', 'Bánh bột lọc', 'Bánh ít', 'Bánh căn', 'Bánh đập', 'Bánh chuối chiên', 'Bánh khoai', 'Bánh tiêu', 'Khoai tây chiên', 'Khoai lang chiên', 'Xúc xích nướng', 'Cá viên chiên', 'Bò viên chiên', 'Hồ lô nướng', 'Nem chua rán'] },
                    { title: 'Đồ ăn vặt Đà Nẵng', icon: '🌶️', items: ['Mít trộn', 'Ram cuốn cải', 'Ốc hút', 'Ốc xào', 'Chân gà sả tắc', 'Chân gà nướng', 'Cút lộn xào me', 'Trứng cút nướng', 'Bắp xào', 'Bắp nướng', 'Khoai nướng', 'Hải sản nướng', 'Gỏi khô bò', 'Gỏi xoài', 'Xoài lắc', 'Cóc lắc', 'Bánh tráng trộn', 'Bánh tráng cuốn', 'Bánh tráng bơ'] }
                ],
                dessert: [
                    { title: 'Chè & Kem', icon: '🍧', items: ['Kem bơ', 'Chè sầu riêng', 'Chè Thái', 'Chè khúc bạch', 'Chè thập cẩm', 'Chè đậu xanh', 'Chè đậu đen', 'Chè xoa xoa', 'Chè bưởi', 'Kem dừa', 'Kem trái cây'] },
                    { title: 'Sữa chua & Trái cây', icon: '🥭', items: ['Tào phớ', 'Sữa chua', 'Yaourt muối', 'Flan', 'Sữa chua dẻo', 'Trái cây tô', 'Hoa quả dầm', 'Sầu riêng', 'Dừa dầm'] }
                ],
                drink: [
                    { title: 'Cà phê', icon: '☕', items: ['Cà phê sữa đá', 'Cà phê đen đá', 'Bạc xỉu', 'Cà phê muối', 'Cà phê cốt dừa', 'Cà phê trứng', 'Cold brew', 'Cà phê pha máy'] },
                    { title: 'Trà & Trà sữa', icon: '🧋', items: ['Trà đào', 'Trà tắc', 'Trà chanh', 'Trà vải', 'Trà dâu', 'Trà mãng cầu', 'Trà sữa truyền thống', 'Trà sữa ô long', 'Trà sữa thái', 'Matcha latte', 'Matcha đá xay'] },
                    { title: 'Nước trái cây', icon: '🥭', items: ['Nước mía', 'Nước dừa', 'Nước ép cam', 'Nước ép dứa', 'Nước ép dưa hấu', 'Nước ép ổi', 'Nước ép cà rốt', 'Sinh tố bơ', 'Sinh tố xoài', 'Sinh tố dâu', 'Sinh tố mãng cầu', 'Sinh tố sapoche'] },
                    { title: 'Đồ uống ăn vặt', icon: '🧊', items: ['Sữa tươi trân châu đường đen', 'Yaourt đá', 'Chanh dây đá', 'Chanh muối', 'Tắc xí muội', 'Soda trái cây', 'Đá me', 'Nước sâm', 'Nước đậu đen', 'Nước bí đao'] }
                ]
            };

            // ============ DOM REFS ============
            const wheel = document.getElementById('wheel');
            const wheelPointer = document.getElementById('wheelPointer');
            const spinBtn = document.getElementById('spinBtn');
            const resultPlaceholder = document.getElementById('resultPlaceholder');
            const resultContent = document.getElementById('resultContent');
            const resultEmoji = document.getElementById('resultEmoji');
            const resultName = document.getElementById('resultName');
            const resultCat = document.getElementById('resultCat');
            const resultModal = document.getElementById('resultModal');
            const modalResultEmoji = document.getElementById('modalResultEmoji');
            const modalResultName = document.getElementById('modalResultName');
            const modalResultCat = document.getElementById('modalResultCat');
            const historyList = document.getElementById('historyList');
            const menuGrid = document.getElementById('menuGrid');
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            let toastTimeout;

            let currentCategory = 'all';
            let isSpinning = false;
            let spinRotation = 0;
            let history = [];

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
                toastTimeout = setTimeout(() => toast.classList.remove('show'), 2400);
            }

            // ============ GET CURRENT LIST ============
            function getCurrentList() {
                if (currentCategory === 'all') {
                    return [...foodData.main, ...foodData.snack, ...foodData.dessert, ...foodData.drink];
                }
                return foodData[currentCategory] || [];
            }

            function getCategoryOfItem(itemName) {
                for (const [cat, items] of Object.entries(foodData)) {
                    if (items.includes(itemName)) return cat;
                }
                return 'main';
            }

            // ============ UPDATE COUNTS ============
            function updateCounts() {
                document.getElementById('countAll').textContent =
                    foodData.main.length + foodData.snack.length + foodData.dessert.length + foodData.drink.length;
                document.getElementById('countMain').textContent = foodData.main.length;
                document.getElementById('countSnack').textContent = foodData.snack.length;
                document.getElementById('countDessert').textContent = foodData.dessert.length;
                document.getElementById('countDrink').textContent = foodData.drink.length;
            }

            // ============ BUILD WHEEL ============
            function buildWheel() {
                // Xoá các segment cũ
                wheel.querySelectorAll('.wheel-segment, .segment-divider').forEach(el => el.remove());

                const list = getCurrentList();
                const numSegments = Math.min(list.length, 16); // Giới hạn 16 segment để không rối

                // Nếu danh sách dài, chọn random 16 món để hiển thị trên wheel
                let displayItems;
                if (list.length > numSegments) {
                    // Lấy mẫu đều
                    displayItems = [];
                    const step = list.length / numSegments;
                    for (let i = 0; i < numSegments; i++) {
                        displayItems.push(list[Math.floor(i * step)]);
                    }
                } else {
                    displayItems = [...list];
                }

                const angleStep = 360 / displayItems.length;

                displayItems.forEach((item, index) => {
                    const angle = index * angleStep;

                    // Divider
                    const divider = document.createElement('div');
                    divider.className = 'segment-divider';
                    divider.style.transform = `rotate(${angle}deg)`;
                    wheel.appendChild(divider);

                    // Label
                    const segment = document.createElement('div');
                    segment.className = 'wheel-segment';
                    segment.style.transform = `rotate(${angle + angleStep / 2}deg)`;
                    const label = document.createElement('span');
                    label.className = 'segment-label';
                    label.textContent = item.length > 12 ? item.substring(0, 11) + '…' : item;
                    segment.appendChild(label);
                    wheel.appendChild(segment);
                });
            }

            // ============ SPIN ============
            function spin() {
                if (isSpinning) return;

                const list = getCurrentList();
                if (list.length === 0) {
                    showToast('Không có món nào trong thể loại này!', false);
                    return;
                }

                isSpinning = true;
                spinBtn.disabled = true;
                spinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG QUAY...';
                wheelPointer.classList.add('spinning');

                // Random số vòng (5-8 vòng) + góc ngẫu nhiên
                const extraRotation = 360 * (5 + Math.floor(Math.random() * 4)) + Math.floor(Math.random() * 360);
                spinRotation += extraRotation;

                wheel.style.transition = 'transform 5s cubic-bezier(0.15, 0.9, 0.1, 1)';
                wheel.style.transform = `rotate(${spinRotation}deg)`;

                // Chọn món random
                const selectedItem = list[Math.floor(Math.random() * list.length)];
                const cat = getCategoryOfItem(selectedItem);

                // Sau khi quay xong
                setTimeout(() => {
                    isSpinning = false;
                    spinBtn.disabled = false;
                    spinBtn.innerHTML = '<i class="fas fa-dice"></i> QUAY NGAY';
                    wheelPointer.classList.remove('spinning');

                    // Hiển thị kết quả
                    showResult(selectedItem, cat);

                    // Thêm vào lịch sử
                    addHistory(selectedItem, cat);
                }, 5100);
            }

            function showResult(item, cat) {
                const meta = categoryMeta[cat];
                resultPlaceholder.style.display = 'none';
                resultContent.style.display = 'block';

                resultEmoji.textContent = meta.emoji;
                resultName.textContent = item;
                resultCat.innerHTML = `<i class="fas ${meta.icon}"></i> ${meta.name}`;

                // Animation
                resultEmoji.style.animation = 'none';
                setTimeout(() => {
                    resultEmoji.style.animation = 'resultPop 0.5s ease';
                }, 10);

                modalResultEmoji.textContent = meta.emoji;
                modalResultName.textContent = item;
                modalResultCat.innerHTML = `<i class="fas ${meta.icon}"></i> ${meta.name}`;
                resultModal.classList.add('show');
                resultModal.setAttribute('aria-hidden', 'false');
                document.body.classList.add('modal-open');
            }

            function closeResultModal() {
                resultModal.classList.remove('show');
                resultModal.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('modal-open');
            }

            resultModal.querySelectorAll('[data-close-result]').forEach(element => {
                element.addEventListener('click', closeResultModal);
            });

            document.addEventListener('keydown', event => {
                if (event.key === 'Escape' && resultModal.classList.contains('show')) {
                    closeResultModal();
                }
            });

            function addHistory(item, cat) {
                history.unshift({ item, cat, time: new Date() });
                if (history.length > 8) history.pop();

                if (history.length === 0) {
                    historyList.innerHTML = '<li class="history-empty">Chưa có lịch sử quay</li>';
                    return;
                }

                historyList.innerHTML = history.map(h => {
                    const meta = categoryMeta[h.cat];
                    return `<li class="history-item">
                        <span class="history-emoji">${meta.emoji}</span>
                        <span>${h.item}</span>
                    </li>`;
                }).join('');
            }

            // ============ CATEGORY SELECTION ============
            document.querySelectorAll('.cat-option').forEach(option => {
                option.addEventListener('click', function() {
                    if (isSpinning) return;

                    document.querySelectorAll('.cat-option').forEach(o => o.classList.remove('active'));
                    this.classList.add('active');
                    this.querySelector('input').checked = true;

                    currentCategory = this.dataset.cat;

                    // Reset wheel rotation
                    spinRotation = 0;
                    wheel.style.transition = 'none';
                    wheel.style.transform = 'rotate(0deg)';

                    buildWheel();

                    // Reset result
                    resultPlaceholder.style.display = 'block';
                    resultContent.style.display = 'none';

                    const meta = currentCategory === 'all'
                        ? { name: 'Tất cả' }
                        : categoryMeta[currentCategory];
                    showToast(`Đã chọn: ${meta.name}`, true);
                });
            });

            // ============ SPIN BUTTON ============
            spinBtn.addEventListener('click', spin);

            // ============ MENU TABS ============
            document.querySelectorAll('.menu-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    renderMenu(this.dataset.tab);
                });
            });

            // ============ RENDER MENU ============
            function renderMenu(cat) {
                let html = '';
                const categoriesToRender = cat === 'all'
                    ? Object.entries(menuCategories)
                    : [[cat, menuCategories[cat]]];

                categoriesToRender.forEach(([catKey, groups]) => {
                    groups.forEach(group => {
                        html += `
                            <div class="menu-card">
                                <div class="menu-card-header">
                                    <div class="menu-card-icon">${group.icon}</div>
                                    <div>
                                        <div class="menu-card-title">${group.title}</div>
                                        <div class="menu-card-sub">${group.items.length} món</div>
                                    </div>
                                </div>
                                <div class="menu-items">
                                    ${group.items.map(item => `<span class="menu-item" data-item="${item}">${item}</span>`).join('')}
                                </div>
                            </div>
                        `;
                    });
                });

                menuGrid.innerHTML = html;

                // Bind click vào menu item
                menuGrid.querySelectorAll('.menu-item').forEach(item => {
                    item.addEventListener('click', function() {
                        showToast(`Bạn chọn: ${this.dataset.item}`, true);
                    });
                });
            }

            // ============ MUST TRY CHECKLIST ============
            document.querySelectorAll('.must-try-list li').forEach(li => {
                li.addEventListener('click', function() {
                    this.classList.toggle('checked');
                    const item = this.querySelector('.item-text').textContent;

                    if (this.classList.contains('checked')) {
                        // Đếm số đã check
                        const parent = this.closest('.must-try-list');
                        const total = parent.querySelectorAll('li').length;
                        const checked = parent.querySelectorAll('li.checked').length;

                        if (checked === total) {
                            showToast(`🎉 Tuyệt vời! Bạn đã thử hết ${total} món!`, true);
                        } else {
                            showToast(`✓ Đã thử: ${item}`, true);
                        }
                    }
                });
            });

            // ============ INIT ============
            updateCounts();
            buildWheel();
            renderMenu('all');

            // Welcome
            window.addEventListener('load', () => {
                setTimeout(() => {
                    showToast('Chào mừng! Hãy quay để chọn món ngon nhé! 🎲', true);
                }, 600);
            });

        })();
