(() => {
  async function getProduct(id, preview = false) {
    if (!/^\d+$/.test(String(id))) throw new Error('Sản phẩm không hợp lệ.');

    let response;
    try {
      response = await fetch(`/api/${preview ? "admin/" : ""}products/${encodeURIComponent(id)}`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });
    } catch {
      throw new Error('Không thể kết nối máy chủ.');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(response.status === 404 ? 'Không tìm thấy sản phẩm.' : (data.error || 'Không thể tải sản phẩm.'));
    }
    return data.data;
  }

  window.MaianhProducts = { getProduct };
})();
