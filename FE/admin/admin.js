
        (function() {
            async function ensureAdminAccess() {
                try {
                    const user = await MaianhAuth.getSession();
                    if (!user) {
                        window.location.replace('/html/DangNhap.html');
                        return false;
                    }
                    if (user.role !== 'admin') {
                        window.location.replace('/html/Home.html');
                        return false;
                    }
                    return true;
                } catch (error) {
                    window.location.replace('/html/DangNhap.html');
                    return false;
                }
            }

            ensureAdminAccess();

            // ============ DOM ============
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            const menuToggle = document.getElementById('menuToggle');
            let toastTimeout;

            // ============ HELPERS ============
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
                toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
            }

            function formatPrice(price) {
                return price.toLocaleString('vi-VN') + 'đ';
            }

            function formatShortPrice(price) {
                if (price >= 1000000000) return (price / 1000000000).toFixed(1) + 'B';
                if (price >= 1000000) return (price / 1000000).toFixed(0) + 'M';
                if (price >= 1000) return (price / 1000).toFixed(0) + 'K';
                return price.toString();
            }

            // ============ MOBILE MENU ============
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('show');
            });

            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
            });

            // ============ TAB NAVIGATION ============
            document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
                item.addEventListener('click', function() {
                    const tab = this.dataset.tab;
                    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                    this.classList.add('active');

                    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                    const panel = document.getElementById('tab-' + tab);
                    if (panel) panel.classList.add('active');

                    // Update page title
                    const titles = {
                        dashboard: 'Chào buổi sáng, <span>Admin!</span>',
                        orders: 'Quản lý <span>đơn hàng</span>',
                        products: 'Quản lý <span>sản phẩm</span>',
                        customers: 'Quản lý <span>khách hàng</span>',
                        reviews: 'Đánh giá <span>sản phẩm</span>',
                        posts: 'Quản lý <span>bài viết</span>',
                        vocabulary: 'Từ vựng <span>tiếng Hàn</span>',
                        categories: 'Quản lý <span>danh mục</span>',
                        settings: 'Cài đặt <span>hệ thống</span>'
                    };
                    document.querySelector('.page-title').innerHTML = titles[tab] || 'Dashboard';

                    // Close mobile menu
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('open');
                        overlay.classList.remove('show');
                    }
                });
            });

            // ============ DASHBOARD DATA ============
            let dashboardVersion=0;
            function paintDashboard(d){
                const values=[d.ordersToday.toLocaleString('vi-VN'),formatPrice(d.monthRevenue),d.customers.toLocaleString('vi-VN'),d.rating.toFixed(1)];
                document.querySelectorAll('#tab-dashboard .stat-value').forEach((el,i)=>el.textContent=values[i]);
                const max=Math.max(1,...d.chart.map(p=>p.value));
                document.getElementById('barChart').innerHTML=d.chart.map(p=>`<div class="bar-wrapper"><div class="bar" style="height:${p.value/max*100}%" title="${orderEscape(p.label)}: ${formatPrice(p.value)}"><div class="bar-tooltip">${formatPrice(p.value)}</div></div><div class="bar-label">${orderEscape(p.label)}</div></div>`).join('');
                const total=d.categories.reduce((sum,c)=>sum+Number(c.quantity),0),colors=['#ffc93c','#ffb3c6','#a5d6a7','#90caf9','#ce93d8','#ffab91'];let angle=0;
                const gradient=d.categories.map((c,i)=>{const from=angle;angle+=Number(c.quantity)/total*360;return `${colors[i%colors.length]} ${from}deg ${angle}deg`;}).join(',');
                document.getElementById('donutChart').style.background=total?`conic-gradient(${gradient})`:'#fff0cb';document.getElementById('donutTotal').textContent=total;
                document.getElementById('donutLegend').innerHTML=d.categories.map((c,i)=>`<div class="legend-item"><div class="legend-dot" style="background:${colors[i%colors.length]}"></div><span class="legend-label">${orderEscape(c.name)}</span><span class="legend-value">${Number(c.quantity)} · ${(Number(c.quantity)/total*100).toFixed(1)}%</span></div>`).join('')||'<p>Chưa có sản phẩm đã giao trong kỳ.</p>';
                document.getElementById('activityList').innerHTML=d.activities.map(a=>`<div class="activity-item"><div class="activity-info"><strong>#${orderEscape(a.order_number)}</strong><span>${orderEscape(a.customer)} · ${orderEscape(orderStatus(a.status))} · ${formatPrice(Number(a.total_amount))}</span></div><div class="activity-time">${new Date(a.updated_at.replace(' ','T')+'Z').toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}</div></div>`).join('')||'<p>Chưa có hoạt động đơn hàng.</p>';
                const top=Math.max(1,...d.topProducts.map(p=>Number(p.sales)));
                document.getElementById('topProducts').innerHTML=d.topProducts.map((p,i)=>`<div class="top-product"><span class="top-rank">${i+1}</span><div class="top-product-info"><strong>${orderEscape(p.name)}</strong><div class="product-bar"><div class="product-bar-fill" style="width:${Number(p.sales)/top*100}%"></div></div></div><span class="top-product-sales">${p.sales} đã giao</span></div>`).join('')||'<p>Chưa có sản phẩm đã giao trong kỳ.</p>';
            }
            async function loadDashboard(range='month'){
                const version=++dashboardVersion;
                try{const r=await fetch('/api/admin/dashboard?range='+encodeURIComponent(range),{credentials:'same-origin'});const result=await r.json();if(!r.ok)throw new Error(result.error||'Không thể tải dashboard.');if(version===dashboardVersion)paintDashboard(result.data);}
                catch(error){if(version===dashboardVersion)showToast(error.message,false);}
            }
            document.querySelectorAll('.chart-tab').forEach(button=>button.onclick=()=>{document.querySelectorAll('.chart-tab').forEach(b=>b.classList.toggle('active',b===button));loadDashboard(button.dataset.range);});

            // ============ ORDERS DATA ============
            let orders = [];
            const statusMap = {
                pending: { text: 'Chờ xác nhận', icon: 'fa-clock', class: 'pending' },
                confirmed: { text: 'Đã xác nhận', icon: 'fa-check', class: 'confirmed' },
                shipping: { text: 'Đang giao', icon: 'fa-truck', class: 'shipping' },
                delivered: { text: 'Đã giao', icon: 'fa-box-open', class: 'delivered' },
                cancelled: { text: 'Đã huỷ', icon: 'fa-times', class: 'cancelled' }
            };

            const orderEscape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
            async function orderRequest(path='',method='GET'){
                const r=await fetch('/api/admin/orders'+path,{method,credentials:'same-origin',headers:{'X-Requested-With':'maianh-web'}});
                const result=await r.json();if(!r.ok)throw new Error(result.error||'Không thể cập nhật đơn hàng.');return result.data;
            }
            function renderOrders(filter='all',searchTerm=''){
                document.querySelectorAll('#tab-orders .filter-chip').forEach(b=>b.querySelector('.count').textContent=orders.filter(o=>b.dataset.filter==='all'||o.status===b.dataset.filter).length);
                document.querySelector('[data-tab="orders"] .nav-badge').textContent=orders.length;
                const term=searchTerm.toLowerCase();
                const rows=orders.filter(o=>(filter==='all'||o.status===filter)&&(!term||o.id.toLowerCase().includes(term)||o.customer.toLowerCase().includes(term)));
                document.getElementById('ordersTableBody').innerHTML=rows.map(o=>{
                    const st=statusMap[o.status]||{text:o.status,icon:'fa-box',class:''};
                    const action=(name,title,icon,disabled=false)=>`<button class="icon-action" data-order-action="${name}" data-order-id="${orderEscape(o.order_id)}" title="${title}" aria-label="${title}" ${disabled?'disabled':''}><i class="fas fa-${icon}" aria-hidden="true"></i></button>`;
                    return `<tr><td><strong>#${orderEscape(o.id)}</strong></td><td>${orderEscape(o.customer)}</td><td>${orderEscape(o.products)}</td><td><strong>${formatPrice(Number(o.total))}</strong></td><td>${orderEscape(o.date)}</td><td><span class="status-badge ${st.class}"><i class="fas ${st.icon}"></i> ${orderEscape(st.text)}</span></td><td><div class="table-actions">${action('confirm','Xác nhận','check',o.status!=='pending')}${action('view','Xem chi tiết','eye')}${action('cancel','Hủy đơn','times',!['pending','confirmed'].includes(o.status))}</div></td></tr>`;
                }).join('')||'<tr><td colspan="7">Không có đơn hàng nào.</td></tr>';
            }
            async function reloadOrders(){orders=await orderRequest();renderOrders(document.querySelector('#tab-orders .filter-chip.active').dataset.filter,document.getElementById('searchOrders').value);}
            const orderDialog=document.createElement('dialog');orderDialog.className='admin-order-dialog';orderDialog.setAttribute('aria-labelledby','adminOrderTitle');
            orderDialog.innerHTML='<div class="admin-order-heading"><h2 id="adminOrderTitle">Chi tiết đơn hàng</h2><button type="button" aria-label="Đóng">×</button></div><div class="admin-order-body"></div>';document.body.append(orderDialog);
            orderDialog.querySelector('button').onclick=()=>orderDialog.close();
            const orderStatus=s=>statusMap[s]?.text||s;
            let orderDetailVersion=0;
            async function viewOrder(id){
                const version=++orderDetailVersion,body=orderDialog.querySelector('.admin-order-body');body.textContent='Đang tải...';if(!orderDialog.open)orderDialog.showModal();
                try{
                    const o=await orderRequest('/'+encodeURIComponent(id));if(version!==orderDetailVersion)return;
                    const methods={store_pay:'hongquy sòtore pay',cod:'Thanh toán khi nhận hàng',bank_transfer:'Chuyển khoản',momo:'Ví điện tử',card:'Thẻ'};
                    const paymentStatus={paid:'Đã thanh toán',pending:'Chờ thanh toán',cancelled:'Đã hủy',failed:'Thất bại'};
                    body.innerHTML=`<p><strong>#${orderEscape(o.order_number)}</strong> · ${orderEscape(orderStatus(o.status))}</p><p>Ngày đặt: ${orderEscape(o.created_at)}</p><div class="admin-order-info"><section><h3>Người đặt đơn</h3><p>${orderEscape(o.customer_name)}</p><p>${orderEscape(o.customer_email)}</p><p>${orderEscape(o.customer_phone||'Chưa có số điện thoại')}</p></section><section><h3>Thông tin nhận hàng</h3><p>${orderEscape(o.recipient_name)} · ${orderEscape(o.recipient_phone)}</p><p>${orderEscape(o.shipping_address)}</p></section></div><div>${o.items.map(i=>`<article class="admin-order-product">${i.image_url?`<img src="${orderEscape(i.image_url)}" alt="${orderEscape(i.product_name)}">`:'<span>🧸</span>'}<div><strong>${orderEscape(i.product_name)}</strong><p>${orderEscape([i.size_label,i.color_label].filter(Boolean).join(' · '))}</p><p>${formatPrice(Number(i.unit_price))} × ${i.quantity}</p></div><strong>${formatPrice(Number(i.line_total))}</strong></article>`).join('')}</div><div class="admin-order-totals"><p>Tạm tính <strong>${formatPrice(Number(o.subtotal))}</strong></p><p>Phí vận chuyển <strong>${formatPrice(Number(o.shipping_fee))}</strong></p><p>Giảm giá <strong>−${formatPrice(Number(o.discount_amount))}</strong></p><p class="grand-total">Tổng tiền <strong>${formatPrice(Number(o.total_amount))}</strong></p></div><h3>Thanh toán</h3>${o.payments.map(p=>`<p>${orderEscape(methods[p.method]||p.method)} · ${orderEscape(paymentStatus[p.status]||p.status)}: ${formatPrice(Number(p.amount))}</p>`).join('')}${o.refunds.map(r=>`<p>Hoàn tiền (${r.status==='completed'?'Đã hoàn':'Đang xử lý'}): ${formatPrice(Number(r.amount))}</p>`).join('')}<h3>Lịch sử đơn hàng</h3>${o.history.map(h=>`<p>${orderEscape(h.created_at)} · ${orderEscape(orderStatus(h.status))}</p>`).join('')}${o.customer_note?`<p>Ghi chú: ${orderEscape(o.customer_note)}</p>`:''}`;
                }catch(e){body.textContent=e.message;}
            }
            document.getElementById('ordersTableBody').onclick=async e=>{
                const button=e.target.closest('[data-order-action]');if(!button||button.disabled)return;
                const action=button.dataset.orderAction,id=button.dataset.orderId;if(action==='view')return viewOrder(id);
                if(!confirm(action==='cancel'?'Hủy đơn này và hoàn tồn kho, hoàn số dư đã thanh toán?':'Xác nhận đơn hàng này?'))return;
                button.disabled=true;
                try{await orderRequest('/'+encodeURIComponent(id)+'/'+action,'POST');await reloadOrders();showToast(action==='cancel'?'Đã hủy đơn hàng.':'Đã xác nhận đơn hàng.',true);}catch(error){showToast(error.message,false);button.disabled=false;}
            };
            setInterval(()=>{if(!document.hidden&&document.getElementById('tab-orders').classList.contains('active'))reloadOrders().catch(()=>{});},60000);

            document.querySelectorAll('#tab-orders .filter-chip').forEach(chip => {
                chip.addEventListener('click', function() {
                    document.querySelectorAll('#tab-orders .filter-chip').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    renderOrders(this.dataset.filter, document.getElementById('searchOrders').value);
                });
            });

            document.getElementById('searchOrders').addEventListener('input', function() {
                const activeFilter = document.querySelector('#tab-orders .filter-chip.active').dataset.filter;
                renderOrders(activeFilter, this.value);
            });

            // ============ CUSTOMERS DATA ============
            let customers=[];
            const customerStatus={active:'Hoạt động',inactive:'Ngừng hoạt động',banned:'Đã khóa'};
            async function customerRequest(path='',method='GET',body){
                const r=await fetch('/api/admin/customers'+path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web'},...(body?{body:JSON.stringify(body)}:{})});
                const result=await r.json();if(!r.ok)throw new Error(result.error||'Không thể cập nhật khách hàng.');return result.data;
            }
            function renderCustomers(searchTerm=''){
                document.querySelector('[data-tab="customers"] .nav-badge').textContent=customers.length;
                const term=searchTerm.toLowerCase();
                document.getElementById('customersTableBody').innerHTML=customers.filter(c=>[c.name,c.email,c.phone].some(v=>String(v||'').toLowerCase().includes(term))).map(c=>{
                    const button=(action,label,icon)=>`<button class="icon-action" data-customer-action="${action}" data-customer-id="${orderEscape(c.id)}" title="${label}" aria-label="${label}"><i class="fas fa-${icon}" aria-hidden="true"></i></button>`;
                    return `<tr><td><strong>${orderEscape(c.name)}</strong></td><td>${orderEscape(c.email)}<br>${orderEscape(c.phone||'')}</td><td><strong class="customer-cash">${formatPrice(Number(c.cash))}</strong></td><td>${Number(c.orders)}</td><td>${formatPrice(Number(c.spent))}</td><td>${orderEscape(customerStatus[c.status]||c.status)}</td><td><div class="table-actions">${button('view','Xem khách hàng','eye')}${button('edit','Sửa thông tin','edit')}${button('gift','Tặng tiền','gift')}${button('status',c.status==='active'?'Khóa tài khoản':'Mở tài khoản',c.status==='active'?'ban':'unlock')}</div></td></tr>`;
                }).join('')||'<tr><td colspan="7">Không có khách hàng phù hợp.</td></tr>';
            }
            async function reloadCustomers(){customers=await customerRequest();renderCustomers(document.getElementById('searchCustomers').value);}
            const customerDialog=document.createElement('dialog');customerDialog.className='admin-order-dialog customer-dialog';customerDialog.setAttribute('aria-labelledby','customerDialogTitle');document.body.append(customerDialog);
            let customerSaving=false;
            customerDialog.addEventListener('cancel',e=>{if(customerSaving)e.preventDefault();});
            function showCustomerBox(title,html){customerDialog.innerHTML=`<div class="admin-order-heading"><h2 id="customerDialogTitle">${title}</h2><button type="button" aria-label="Đóng">×</button></div><div class="customer-dialog-body">${html}</div>`;customerDialog.querySelector('.admin-order-heading button').onclick=()=>{if(!customerSaving)customerDialog.close();};if(!customerDialog.open)customerDialog.showModal();}
            const customerField=(key,label,value,type='text',max=120)=>`<label>${label}<input name="${key}" type="${type}" maxlength="${max}" value="${orderEscape(value||'')}" ${['name','email'].includes(key)?'required':''}></label>`;
            document.getElementById('customersTableBody').onclick=async e=>{
                const button=e.target.closest('[data-customer-action]');if(!button)return;button.disabled=true;
                const id=button.dataset.customerId,action=button.dataset.customerAction;
                try{
                    const c=await customerRequest('/'+encodeURIComponent(id));
                    if(action==='status'){
                        if(!confirm(c.status==='active'?'Khóa tài khoản khách hàng này?':'Mở lại tài khoản khách hàng này?'))return;
                        await customerRequest('/'+id,'PATCH',{status:c.status==='active'?'banned':'active'});await reloadCustomers();showToast('Đã cập nhật trạng thái.',true);return;
                    }
                    if(action==='view'){
                        showCustomerBox('Thông tin khách hàng',`<div class="customer-balance">Số dư tài khoản<strong>${formatPrice(Number(c.cash))}</strong></div><div class="admin-order-info"><section><h3>${orderEscape(c.name)}</h3><p>${orderEscape(c.email)}</p><p>${orderEscape(c.phone||'Chưa có số điện thoại')}</p><p>${orderEscape(c.address||'Chưa có địa chỉ hồ sơ')}</p></section><section><p>Ngày tham gia: ${orderEscape(c.created_at)}</p><p>Trạng thái: ${orderEscape(customerStatus[c.status])}</p><p>${c.orders} đơn hàng · Tổng chi: ${formatPrice(Number(c.spent))}</p></section></div><h3>Địa chỉ nhận hàng</h3>${c.addresses.map(a=>`<p>${orderEscape(a.recipient_name)} · ${orderEscape(a.phone)}<br>${orderEscape([a.address_line,a.ward,a.district,a.province].filter(Boolean).join(', '))}</p>`).join('')||'<p>Chưa có địa chỉ.</p>'}<h3>30 đơn hàng gần nhất</h3>${c.recent_orders.map(o=>`<p>#${orderEscape(o.order_number)} · ${orderEscape(orderStatus(o.status))} · ${formatPrice(Number(o.total_amount))}</p>`).join('')||'<p>Chưa có đơn hàng.</p>'}<h3>30 lần nhận quà gần nhất</h3>${c.gifts.map(g=>`<p>${orderEscape(g.created_at)} · +${formatPrice(Number(g.amount))}</p>`).join('')||'<p>Chưa có giao dịch tặng tiền.</p>'}`);return;
                    }
                    const gift=action==='gift',key=crypto.randomUUID();
                    showCustomerBox(gift?'🎁 Tặng tiền cho khách hàng':'Chỉnh sửa thông tin',`<p><strong>${orderEscape(c.name)}</strong> · ${orderEscape(c.email)}</p><div class="customer-balance">Số dư hiện tại<strong>${formatPrice(Number(c.cash))}</strong></div><form class="customer-form">${gift?'<label>Số tiền muốn tặng (đ)<input name="amount" type="number" min="1" max="9999999999999" step="1" required placeholder="Nhập số tiền"></label>':customerField('name','Họ tên',c.name)+customerField('email','Email',c.email,'email',255)+customerField('phone','Số điện thoại',c.phone,'tel',24)+customerField('address','Địa chỉ hồ sơ',c.address,'text',500)+`<label>Trạng thái<select name="status">${Object.entries(customerStatus).map(([value,label])=>`<option value="${value}" ${value===c.status?'selected':''}>${label}</option>`).join('')}</select></label>`}<p class="customer-error" role="alert"></p><button type="submit" class="btn-primary">${gift?'Tặng tiền':'Lưu thay đổi'}</button></form>`);
                    const form=customerDialog.querySelector('form');let giftAmount=null;
                    form.onsubmit=async event=>{
                        event.preventDefault();if(customerSaving)return;
                        const values=Object.fromEntries(new FormData(form));
                        if(gift&&giftAmount!==null&&giftAmount!==values.amount){form.querySelector('[role="alert"]').textContent='Hãy mở lại hộp tặng tiền để thay đổi số tiền của giao dịch.';return;}
                        if(gift)giftAmount=values.amount;
                        customerSaving=true;form.querySelectorAll('input,select,button').forEach(el=>el.disabled=true);
                        try{await customerRequest('/'+id+(gift?'/gifts':''),gift?'POST':'PATCH',gift?{amount:values.amount,key}:values);customerDialog.close();await reloadCustomers();showToast(gift?'Đã cộng tiền và gửi thông báo cho khách hàng.':'Đã lưu thông tin.',true);}
                        catch(error){form.querySelector('[role="alert"]').textContent=error.message;}
                        finally{customerSaving=false;form.querySelectorAll('input,select,button').forEach(el=>el.disabled=false);}
                    };
                }catch(error){showToast(error.message,false);}finally{button.disabled=false;}
            };

            document.getElementById('searchCustomers').addEventListener('input', function() {
                renderCustomers(this.value);
            });

            // ============ REVIEWS ============
            const reviews = [
                { name: 'Nguyễn Mai Anh', avatar: '👩', product: 'Gấu Nâu Mật Ong', stars: 5, text: 'Gấu siêu mềm luôn ấy! Mình mua tặng sinh nhật cho em gái, bé ôm suốt ngày không rời.', time: '2 giờ trước' },
                { name: 'Trần Minh Quân', avatar: '🧑', product: 'Gấu Hồng Kẹo Ngọt', stars: 5, text: 'Mua tặng người yêu, cô ấy thích mê. Chất lượng vải nhung mịn thật sự!', time: '5 giờ trước' },
                { name: 'Lê Thu Hà', avatar: '👧', product: 'Gấu Vàng Nắng Mai', stars: 4, text: 'Gấu đẹp, mềm, đúng size. Trừ 0.5 sao vì giao hàng hơi chậm.', time: '1 ngày trước' },
                { name: 'Phạm Đức Anh', avatar: '👨', product: 'Gấu Cún Con', stars: 5, text: 'Chất lượng tuyệt vời, đóng gói cẩn thận. Sẽ ủng hộ shop dài dài!', time: '2 ngày trước' }
            ];

            document.getElementById('reviewsList').innerHTML = reviews.map(r => `
                <div class="activity-item" style="margin-bottom: 12px;">
                    <div class="table-product-img" style="width: 50px; height: 50px; font-size: 1.6rem;">${r.avatar}</div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px; flex-wrap: wrap;">
                            <strong style="font-weight: 800; font-size: 0.9rem;">${r.name}</strong>
                            <span style="color: var(--yellow-main); font-size: 0.85rem;">
                                ${'<i class="fas fa-star"></i>'.repeat(r.stars)}
                                ${'<i class="far fa-star"></i>'.repeat(5 - r.stars)}
                            </span>
                            <span style="font-size: 0.72rem; color: var(--text-medium); font-weight: 700;">${r.time}</span>
                        </div>
                        <div style="font-size: 0.78rem; color: var(--yellow-deep); font-weight: 700; margin-bottom: 5px;">
                            <i class="fas fa-box"></i> ${r.product}
                        </div>
                        <p style="font-size: 0.85rem; color: var(--text-medium); font-weight: 600; line-height: 1.5; margin: 0;">${r.text}</p>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button class="icon-action" title="Duyệt" onclick="this.style.background='var(--green)'; this.style.color='white';"><i class="fas fa-check"></i></button>
                        <button class="icon-action danger" title="Xoá"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');

            // ============ POSTS ============
            const posts = [
                { title: 'Bộ sưu tập gấu bông pastel của mình sau 2 năm', author: 'Mai Anh', avatar: '👩', category: 'Khoe bộ sưu tập', likes: 342, comments: 28, date: '15/01/2025', status: 'published' },
                { title: 'Review Gấu Nâu Mật Ong size 60cm', author: 'Minh Quân', avatar: '🧑', category: 'Đánh giá', likes: 218, comments: 45, date: '14/01/2025', status: 'published' },
                { title: 'Hướng dẫn tự may gấu bông tại nhà', author: 'Thu Hà', avatar: '👧', category: 'DIY', likes: 456, comments: 67, date: '13/01/2025', status: 'published' },
                { title: 'Gấu bông bị xẹp sau khi giặt phải làm sao?', author: 'Hoàng Long', avatar: '🧒', category: 'Hỏi đáp', likes: 125, comments: 23, date: '13/01/2025', status: 'pending' }
            ];

            document.getElementById('postsList').innerHTML = posts.map(p => `
                <div class="activity-item" style="margin-bottom: 12px;">
                    <div class="table-product-img" style="width: 50px; height: 50px; font-size: 1.6rem;">${p.avatar}</div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-dark); margin-bottom: 5px;">${p.title}</div>
                        <div style="display: flex; gap: 15px; font-size: 0.75rem; color: var(--text-medium); font-weight: 700; flex-wrap: wrap;">
                            <span><i class="fas fa-user"></i> ${p.author}</span>
                            <span><i class="fas fa-tag"></i> ${p.category}</span>
                            <span><i class="fas fa-heart"></i> ${p.likes}</span>
                            <span><i class="fas fa-comment"></i> ${p.comments}</span>
                            <span><i class="fas fa-calendar"></i> ${p.date}</span>
                        </div>
                    </div>
                    <span class="status-badge ${p.status === 'published' ? 'delivered' : 'pending'}">
                        <i class="fas ${p.status === 'published' ? 'fa-check' : 'fa-clock'}"></i>
                        ${p.status === 'published' ? 'Đã đăng' : 'Chờ duyệt'}
                    </span>
                    <div style="display: flex; gap: 6px;">
                        <button class="icon-action view" title="Xem"><i class="fas fa-eye"></i></button>
                        <button class="icon-action" title="Sửa"><i class="fas fa-edit"></i></button>
                        <button class="icon-action danger" title="Xoá"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');

            // ============ VOCABULARY ============
            const vocabulary = [
                { kr: '안녕하세요', roman: 'annyeonghaseyo', vi: 'Xin chào', cat: 'Chào hỏi' },
                { kr: '감사합니다', roman: 'gamsahamnida', vi: 'Cảm ơn', cat: 'Chào hỏi' },
                { kr: '사랑해요', roman: 'saranghaeyo', vi: 'Tôi yêu bạn', cat: 'Chào hỏi' },
                { kr: '가족', roman: 'gajok', vi: 'Gia đình', cat: 'Gia đình' },
                { kr: '엄마', roman: 'eomma', vi: 'Mẹ', cat: 'Gia đình' },
                { kr: '밥', roman: 'bap', vi: 'Cơm', cat: 'Đồ ăn' },
                { kr: '김치', roman: 'gimchi', vi: 'Kim chi', cat: 'Đồ ăn' },
                { kr: '빨간색', roman: 'ppalgansaek', vi: 'Màu đỏ', cat: 'Màu sắc' },
                { kr: '고양이', roman: 'goyangi', vi: 'Con mèo', cat: 'Động vật' },
                { kr: '하나', roman: 'hana', vi: 'Một', cat: 'Số đếm' }
            ];

            document.getElementById('vocabTableBody').innerHTML = vocabulary.map(v => `
                <tr>
                    <td><strong style="font-size: 1.05rem; color: var(--pink-deep);">${v.kr}</strong></td>
                    <td><em style="color: var(--text-medium); font-weight: 700;">${v.roman}</em></td>
                    <td><strong>${v.vi}</strong></td>
                    <td><span class="status-badge confirmed"><i class="fas fa-tag"></i> ${v.cat}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="icon-action" title="Sửa"><i class="fas fa-edit"></i></button>
                            <button class="icon-action danger" title="Xoá"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');

            // ============ CATEGORIES ============
            const categories = [
                { name: 'Gấu cỡ nhỏ', emoji: '🧸', count: 8, color: '#ffc93c' },
                { name: 'Gấu cỡ vừa', emoji: '🧸', count: 15, color: '#ffb3c6' },
                { name: 'Gấu cỡ lớn', emoji: '🧸', count: 12, color: '#a5d6a7' },
                { name: 'Gấu đặc biệt', emoji: '✨', count: 5, color: '#90caf9' },
                { name: 'Phụ kiện', emoji: '🎀', count: 8, color: '#ce93d8' },
                { name: 'Gấu đôi', emoji: '💝', count: 4, color: '#ffab91' }
            ];

            document.getElementById('categoriesList').innerHTML = categories.map(c => `
                <div class="activity-item" style="margin-bottom: 10px;">
                    <div class="table-product-img" style="background: ${c.color}33; border: 2px solid ${c.color};">${c.emoji}</div>
                    <div style="flex: 1;">
                        <strong style="font-size: 0.92rem; font-weight: 800;">${c.name}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-medium); font-weight: 600; margin-top: 3px;">
                            ${c.count} sản phẩm
                        </div>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button class="icon-action" title="Sửa"><i class="fas fa-edit"></i></button>
                        <button class="icon-action danger" title="Xoá"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');

            // ============ BIND TABLE ACTIONS ============
            function bindTableActions(container, type) {
                container.querySelectorAll('.icon-action').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const title = this.getAttribute('title');
                        if (title === 'Xoá') {
                            showToast(`Đã xoá ${type}!`, true);
                        } else if (title === 'Xem chi tiết' || title === 'Xem') {
                            showToast(`Đang xem chi tiết ${type}...`, true);
                        } else if (title === 'In đơn') {
                            showToast('Đang in đơn hàng...', true);
                        } else {
                            showToast(`${title} ${type}...`, true);
                        }
                    });
                });
            }

            // ============ EXPORT BUTTONS ============
            document.getElementById('exportOrders').addEventListener('click', () => {
                showToast('📥 Đang xuất file Excel...', true);
            });

            document.getElementById('exportCustomers').addEventListener('click', () => {
                showToast('📥 Đang xuất danh sách khách hàng...', true);
            });

            document.getElementById('addPostBtn').addEventListener('click', () => {
                showToast('✍️ Mở trình soạn bài viết mới...', true);
            });

            document.getElementById('addVocabBtn').addEventListener('click', () => {
                showToast('📚 Mở form thêm từ vựng...', true);
            });

            document.getElementById('addCategoryBtn').addEventListener('click', () => {
                showToast('📁 Mở form thêm danh mục...', true);
            });

            document.getElementById('viewAllActivity').addEventListener('click', () => {
                document.querySelector('[data-tab="orders"]').click();
            });

            async function loadAdminApi() {
                try {
                    const user = await MaianhAuth.getSession();
                    if (!user || user.role !== 'admin') return;
                    const request = path => fetch(`/api/admin/${path}`, { credentials: 'same-origin' }).then(async response => {
                        const body = await response.json().catch(() => ({}));
                        if (!response.ok) throw new Error(body.error || 'Không thể tải dữ liệu quản trị.');
                        return body.data;
                    });
                    const [dashboard, apiOrders, apiCustomers] = await Promise.all([
                        request('dashboard'), request('orders'), request('customers')
                    ]);

                    paintDashboard(dashboard);

                    {
                        orders = apiOrders.map(order => ({ ...order, avatar: '👤', total: Number(order.total) }));
                        renderOrders();
                    }
                    {
                        customers = apiCustomers.map(customer => ({ ...customer, avatar: '👤', orders: Number(customer.orders), spent: Number(customer.spent) }));
                        renderCustomers();
                    }
                } catch (error) {
                    showToast(error.message, false);
                }
            }

            // ============ INIT ============
            renderOrders('all');
            renderCustomers();
            loadAdminApi();

            // Welcome
            window.addEventListener('load', () => {
                setTimeout(() => {
                    showToast('👋 Chào mừng Admin quay trở lại!', true);
                }, 500);
            });

        })();
    