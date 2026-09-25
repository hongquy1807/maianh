(() => {
  let checkout;
  try { checkout = JSON.parse(sessionStorage.getItem('maianh_checkout_cart') || 'null'); } catch { checkout = null; }
  const items = checkout?.items || [];
  const coupons = {
    iuhongquy: { type: 'percent', value: 50 },
    iuhongquy20: { type: 'percent', value: 20 },
    chaohongquy: { type: 'percent', value: 10 },
    hongquygiaohang: { type: 'fixed', value: 50000, min: 200000 },
    hongquyfreeship: { type: 'freeship', value: 0 }
  };
  let appliedCoupons = [...new Set((Array.isArray(checkout?.coupons) ? checkout.coupons : []).filter(code => typeof code === 'string').map(code => code.toLowerCase()))].filter(code => Object.hasOwn(coupons, code));
  let discount = 0;
  let freeShipCoupon = false;
  let selectedPayment = 'store_pay';
  const qrMessage = 'Chúc mừng, bạn đã thanh toán thành công! chúc bạn mua sắm zui zẻ nhaaa.';
  const sharedQr = 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&charset-source=UTF-8&data=' + encodeURIComponent(qrMessage);
  let placingOrder = false, completed = false;
  let requestKey = checkout?.paymentKey || crypto.randomUUID();
  if(checkout) checkout.paymentKey = requestKey;


  const $ = id => document.getElementById(id);
  const money = value => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
  const subtotal = () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shipping = () => !items.length || subtotal() >= 500000 || freeShipCoupon ? 0 : 30000;
  const total = () => Math.max(0, subtotal() + shipping() - discount);
  const toast = message => { const element = $('toast'); element.textContent = message; element.style.display = 'block'; element.classList.add('show'); setTimeout(() => { element.classList.remove('show'); element.style.display = 'none'; }, 2200); };

  function renderItems() {
    $('productList').innerHTML = items.map(item => `
      <div class="product">
        <img src="${item.imageUrl || '/uploads/products/7e4cb1d424ce6a785ae006361dd1b130.jpg'}" alt="${item.name}">
        <div class="product-copy"><strong>${item.name}</strong><span class="muted">${item.size || 'Mặc định'} · SL ${item.quantity}</span></div>
        <strong>${money(item.price * item.quantity)}</strong>
      </div>`).join('');
  }

  function updateSummary() {
    appliedCoupons = appliedCoupons.filter(code => subtotal() >= (coupons[code].min || 0));
    discount = Math.min(subtotal(), appliedCoupons.reduce((sum, code) => {
      const coupon = coupons[code];
      return sum + (coupon.type === 'percent' ? Math.round(subtotal() * coupon.value / 100) : coupon.type === 'fixed' ? coupon.value : 0);
    }, 0));
    freeShipCoupon = appliedCoupons.some(code => coupons[code].type === 'freeship');
    $('appliedCoupons').innerHTML = appliedCoupons.map(code => {
      const coupon = coupons[code];
      const label = coupon.type === 'percent' ? `Giảm ${coupon.value}%` : coupon.type === 'fixed' ? `Giảm ${money(coupon.value)}` : 'Miễn phí ship';
      return `<div class="coupon-chip"><i class="fas fa-tag" aria-hidden="true"></i><span class="coupon-name">${code}</span><span class="coupon-value">${label}</span><button type="button" class="coupon-remove" data-remove-coupon="${code}" aria-label="Gỡ mã ${code}"><i class="fas fa-times-circle" aria-hidden="true"></i></button></div>`;
    }).join('');
    $('itemCount').textContent = items.reduce((sum, item) => sum + Number(item.quantity), 0);
    $('shippingMessage').textContent = !items.length ? 'Miễn phí ship cho đơn từ 500.000đ.' : shipping() === 0 ? 'Đơn hàng của bạn được miễn phí ship!' : `Mua thêm ${money(500000 - subtotal())} để được miễn phí ship!`;
    $('shippingProgressFill').style.width = `${Math.min(100, subtotal() / 500000 * 100)}%`;
    $('shippingProgress').setAttribute('aria-valuenow', Math.min(subtotal(), 500000));
    $('shippingProgressText').textContent = `${money(subtotal())} / ${money(500000)}`;
    if (checkout) sessionStorage.setItem('maianh_checkout_cart', JSON.stringify({ ...checkout, coupons: appliedCoupons }));
    $('subtotal').textContent = money(subtotal());
    $('shippingFee').textContent = shipping() ? money(shipping()) : 'Miễn phí';
    $('totalPrice').textContent = money(total());
    $('discountRow').hidden = discount === 0;
    $('discountValue').textContent = `-${money(discount)}`;
    $('qrAmount').textContent = money(total());
    $('qrImage').src = sharedQr;
  }

  let profileAddresses = [];
  let addressesLoading = true;
  const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const validPhone = value => /^(0|\+84)\d{9,10}$/.test(value.replace(/[\s.-]/g, ''));
  function switchAddressMode() {
    const useProfile = $('profileAddressMode').checked && !$('profileAddressMode').disabled;
    $('addressList').hidden = !useProfile;
    $('newAddressForm').hidden = useProfile;
  }
  document.querySelectorAll('[name="addressMode"]').forEach(input => input.addEventListener('change', switchAddressMode));
  function selectedAddress() {
    if (addressesLoading) { toast('Vui lòng chờ kiểm tra địa chỉ hồ sơ.'); return null; }
    if ($('profileAddressMode').checked) {
      const selected = document.querySelector('[name="savedAddress"]:checked');
      const address = profileAddresses.find(a => String(a.id) === selected?.value);
      if (address) return { source: 'profile', address_id: address.id, full_name: address.recipient_name, phone: address.phone, address: address.fullAddress };
      toast('Vui lòng chọn địa chỉ nhận hàng.'); return null;
    }
    const name = $('recipientName'), phone = $('recipientPhone'), address = $('recipientAddress');
    name.setCustomValidity(name.value.trim() ? '' : 'Vui lòng nhập họ tên.');
    phone.setCustomValidity(validPhone(phone.value.trim()) ? '' : 'Số điện thoại không hợp lệ.');
    address.setCustomValidity(address.value.trim() ? '' : 'Vui lòng nhập đầy đủ địa chỉ.');
    if (!$('newAddressForm').reportValidity()) return null;
    return { source: 'new', full_name: name.value.trim(), phone: phone.value.trim(), address: address.value.trim() };
  }
  ['recipientName','recipientPhone','recipientAddress'].forEach(id => $(id).addEventListener('input', () => $(id).setCustomValidity('')));
  $('newAddressForm').addEventListener('submit', event => {
    event.preventDefault();
    const address = selectedAddress();
    if (!address) return;
    window.currentCheckoutUser = address;
    toast('Đã xác nhận địa chỉ nhận hàng.');
  });
  async function loadAddresses() {
    try {
      const response = await fetch('/api/cart/addresses', { credentials: 'same-origin' });
      if (!response.ok) throw new Error(response.status === 401 ? 'Bạn chưa đăng nhập. Vui lòng nhập địa chỉ mới.' : 'Không tải được hồ sơ. Vui lòng nhập địa chỉ mới.');
      const result = await response.json();
      profileAddresses = result.data.filter(a => a.recipient_name?.trim() && a.phone?.trim() && validPhone(a.phone) && a.address_line?.trim() && a.ward?.trim() && a.province?.trim()).map(a => ({ ...a, fullAddress: [a.address_line,a.ward,a.district,a.province].filter(Boolean).join(', ') }));
      $('profileAddressMode').disabled = !profileAddresses.length;
      $('addressStatus').textContent = profileAddresses.length ? 'Chọn địa chỉ đã lưu hoặc nhập địa chỉ mới cho đơn hàng này.' : 'Hồ sơ chưa có địa chỉ và số điện thoại đầy đủ. Bạn cần nhập địa chỉ mới.';
      $('addressList').innerHTML = profileAddresses.map((a,i) => `<label class="address"><input type="radio" name="savedAddress" value="${escapeText(a.id)}" ${i === 0 ? 'checked' : ''}><span><strong>${escapeText(a.recipient_name)}</strong><span class="muted">${escapeText(a.phone)}</span><p class="muted">${escapeText(a.fullAddress)}</p></span></label>`).join('');
      if (profileAddresses.length && !$('recipientName').value && !$('recipientPhone').value && !$('recipientAddress').value) $('profileAddressMode').checked = true;
    } catch (error) { $('addressStatus').textContent = error.message; }
    finally { addressesLoading = false; switchAddressMode(); }
  }

  document.querySelectorAll('.payment[data-method]').forEach(option => option.addEventListener('click', () => {
    document.querySelectorAll('.payment[data-method]').forEach(item => item.classList.remove('selected'));
    option.classList.add('selected');
    selectedPayment = option.dataset.method;
    $('qrSection').classList.toggle('show', selectedPayment === 'bank' || selectedPayment === 'wallet');
    $('qrMethodName').textContent = 'QR lời chúc';
    $('qrImage').src = sharedQr;
  }));

  $('couponForm').addEventListener('submit', event => {
    event.preventDefault();
    const code = $('couponInput').value.trim().toLowerCase();
    if (!items.length) return toast('Giỏ hàng đang trống.');
    if (!Object.hasOwn(coupons, code)) return toast('Mã giảm giá không hợp lệ.');
    if (appliedCoupons.includes(code)) return toast('Mã này đã được áp dụng.');
    const coupon = coupons[code];
    if (subtotal() < (coupon.min || 0)) return toast(`Mã này áp dụng cho đơn từ ${money(coupon.min)}.`);
    appliedCoupons.push(code);
    $('couponInput').value = '';
    updateSummary();
    toast(`Đã áp dụng mã ${code}.`);
  });
  $('appliedCoupons').addEventListener('click', event => {
    const button = event.target.closest('[data-remove-coupon]');
    if (!button) return;
    appliedCoupons = appliedCoupons.filter(code => code !== button.dataset.removeCoupon);
    updateSummary();
    toast('Đã gỡ mã giảm giá.');
  });

  const balanceModal=$('insufficientBalanceModal');
  const closeBalanceModal=()=>balanceModal.close();
  $('closeBalanceModal').addEventListener('click',closeBalanceModal);
  $('returnToCheckout').addEventListener('click',closeBalanceModal);
  balanceModal.addEventListener('close',()=>{$('checkoutBtn').focus();});
  balanceModal.addEventListener('click',event=>{if(event.target===balanceModal){const r=balanceModal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)balanceModal.close();}});
  $('checkoutBtn').addEventListener('click', async () => {
    if(placingOrder || completed)return;
    if (!items.length) return toast('Giỏ hàng đang trống.');
    const address = selectedAddress();
    if (!address) return;
    placingOrder=true;$('checkoutBtn').disabled=true;
    try {
      const response=await fetch('/api/checkout',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-Requested-With':'maianh-web'},body:JSON.stringify({key:requestKey,method:selectedPayment,address,items:items.map(i=>({variant_id:i.variantId || i.id,quantity:Number(i.quantity)})),coupons:appliedCoupons,expected_total:total()})});
      const result=await response.json();
      if(!response.ok){if(response.status===401){location.href='DangNhap.html';return;}throw Object.assign(new Error(result.error || 'Không thể tạo đơn hàng.'),{code:result.code});}
      completed=true;
      $('successModal').querySelector('p').textContent = selectedPayment==='store_pay' ? 'Đã thanh toán bằng số dư. Đơn hàng '+result.data.order_number+' đã được tạo.' : 'Đã tạo đơn hàng '+result.data.order_number+'. Thanh toán sẽ được xác nhận khi nhận tiền.';
      if(result.data.cash!==undefined)$('storePayBalance').textContent='Số dư: '+money(result.data.cash);
      $('successModal').classList.add('show');
      sessionStorage.removeItem('maianh_checkout_cart');
    }catch(error){if(error.code==='INSUFFICIENT_BALANCE')balanceModal.showModal();else toast(error.message);}finally{placingOrder=false;$('checkoutBtn').disabled=completed;}
  });

  $('copyContent').addEventListener('click', async () => {
    await navigator.clipboard.writeText(qrMessage);
    toast('Đã sao chép lời chúc.');
  });

  fetch('/api/profile',{credentials:'same-origin'}).then(async r=>{if(!r.ok)throw new Error();return r.json();}).then(r=>$('storePayBalance').textContent='Số dư: '+money(r.data.user.cash)).catch(()=>$('storePayBalance').textContent='Đăng nhập để thanh toán bằng số dư.');
  renderItems();
  loadAddresses();
  updateSummary();
  if (!items.length) toast('Không có sản phẩm để thanh toán.');
})();
