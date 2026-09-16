(() => {
  let session;
  async function request(path, body) {
    let response;
    try {
      response = await fetch(`/api/auth${path}`, {
        method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin',
        headers: body === undefined ? {} : { 'Content-Type': 'application/json', 'X-Requested-With': 'maianh-web' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
      });
    } catch { throw new Error('Không thể kết nối máy chủ. Vui lòng thử lại.'); }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(data.error || 'Yêu cầu chưa hoàn tất. Vui lòng thử lại.'), { status: response.status });
    return data;
  }
  function getSession() {
    if (!session) session = request('/me').then(data => data.user).catch(error => {
      if (error.status === 401) return null;
      session = null;
      throw error;
    });
    return session;
  }
  window.MaianhAuth = { request, getSession };
})();
