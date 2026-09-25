(() => {
  const $ = id => document.getElementById(id);
  const status = $('authStatus');
  let challengeId = null, otpPurpose = 'register';
  let resetToken = new URLSearchParams(location.hash.slice(1)).get('reset');
  if (resetToken) history.replaceState(null, '', location.pathname + location.search);
  function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle('is-error', error);
  }
  function switchForm(name) {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.toggle('active', form.id === `form-${name}`));
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.form === name));
    message('');
  }
  document.querySelectorAll('.auth-tab,[data-switch]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault(); switchForm(button.dataset.form || button.dataset.switch);
  }));
  $('forgotLink').addEventListener('click', event => {
    event.preventDefault(); $('forgotEmail').value = $('loginEmail').value.trim(); switchForm('forgot'); $('forgotEmail').focus();
  });
  document.querySelectorAll('.input-toggle').forEach(button => button.addEventListener('click', () => {
    const input = $(button.dataset.target); input.type = input.type === 'password' ? 'text' : 'password';
    button.setAttribute('aria-label', input.type === 'password' ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
    button.querySelector('i').className = input.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  }));
  const bind = (name, handler) => {
    const form = $(`form-${name}`);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = form.querySelector('[type=submit]');
      if (button.disabled) return;
      if (!form.reportValidity()) return;
      button.disabled = true; button.classList.add('loading'); message('Đang xử lý…');
      try { await handler(); }
      catch (error) { message(error.message, true); }
      finally { button.disabled = false; button.classList.remove('loading'); }
    });
  };
  bind('login', async () => {
    const result = await MaianhAuth.request('/login', { email: $('loginEmail').value.trim(), password: $('loginPassword').value, remember: $('rememberMe').checked });
    const role = result?.user?.role;
    const redirectUrl = role === 'admin' ? '/admin/admin.html' : '/html/Home.html';
    message(role === 'admin' ? 'Đăng nhập thành công. Đang vào trang quản trị…' : 'Đăng nhập thành công. Đang về trang chủ…');
    location.assign(redirectUrl);
  });
  bind('register', async () => {
    if ($('regPassword').value !== $('regConfirmPassword').value) throw new Error('Mật khẩu xác nhận không khớp.');
    const result = await MaianhAuth.request('/register', {
      full_name: $('regName').value.trim(), email: $('regEmail').value.trim(), phone: $('regPhone').value.trim(),
      password: $('regPassword').value, agree_terms: $('agreeTerms').checked
    });
    $('loginEmail').value = $('regEmail').value.trim();
    showOtp(result, 'register', $('regEmail').value.trim());
  });
  bind('forgot', async () => {
    const result = await MaianhAuth.request('/forgot-password', { email: $('forgotEmail').value.trim() });
    showOtp(result, 'reset', $('forgotEmail').value.trim());
  });
  function showOtp(result, purpose, email) {
    challengeId = result.challenge_id; otpPurpose = purpose;
    $('otpCode').value = ''; $('otpDescription').textContent = `Nhập OTP được gửi tới ${email}. Mã có hiệu lực 10 phút. Kiểm tra cả thư mục Spam nhé.`;
    switchForm('otp'); message(result.message); $('otpCode').focus();
  }
  $('requestNewOtp').onclick = event => {event.preventDefault(); switchForm(otpPurpose === 'register' ? 'register' : 'forgot');};
  bind('otp', async () => {
    const result = await MaianhAuth.request('/verify-otp', {challenge_id: challengeId, code: $('otpCode').value.trim()});
    challengeId = null; $('otpCode').value = '';
    if (result.purpose === 'reset') {resetToken = result.token; switchForm('reset'); $('resetPassword').focus();}
    else {$('form-register').reset(); switchForm('login'); message('Đăng ký thành công! Bạn có thể đăng nhập.'); $('loginPassword').focus();}
  });
  bind('reset', async () => {
    if ($('resetPassword').value !== $('resetConfirm').value) throw new Error('Mật khẩu xác nhận không khớp.');
    const result = await MaianhAuth.request('/reset-password', { token: resetToken, password: $('resetPassword').value });
    resetToken = null; $('form-reset').reset(); switchForm('login'); message(result.message);
  });
  $('regPassword').addEventListener('input', () => {
    const value = $('regPassword').value;
    const score = Math.min(4, Number(value.length >= 8) + Number(value.length >= 12) + Number(/[a-z]/.test(value) && /[A-Z]/.test(value)) + Number(/\d/.test(value)));
    $('pwStrength').classList.toggle('show', value.length > 0);
    $('pwStrengthText').className = `strength-text ${value ? 'show' : ''}`;
    $('pwStrengthText').textContent = value.length < 8 ? 'Cần ít nhất 8 ký tự' : 'Nên dùng mật khẩu dài và riêng cho tài khoản này';
    $('pwStrength').querySelectorAll('.strength-bar').forEach((bar,i) => { bar.className = `strength-bar ${i < score ? (score >= 3 ? 'strong' : 'medium') : ''}`; });
  });
  if (resetToken) switchForm('reset');
})();
