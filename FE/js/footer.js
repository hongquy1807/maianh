(() => {
  class SiteFooter extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = 'true';
      this.innerHTML = `<footer class="sf-footer">
        <div class="sf-inner">
          <div class="sf-intro">
            <div><span class="sf-eyebrow">MỘT CHÚT DỄ THƯƠNG MỖI NGÀY</span><h2>Mua sắm, học tập <span>& tận hưởng.</span></h2><p>Những món đồ xinh, một từ tiếng Hàn mới hay gợi ý cho bữa ăn tiếp theo.</p></div>
            <a class="sf-explore" href="Random.html">Hôm nay thử gì? <i class="fas fa-dice" aria-hidden="true"></i></a>
          </div>
          <div class="sf-grid">
            <div class="sf-brand"><a href="Home.html"><span aria-hidden="true">🧸</span> Teddy Yêu Thương</a><p>Một góc nhỏ để tìm quà, chia sẻ niềm vui và khám phá điều mới cùng nhau.</p><span class="sf-signature">Soft • Cute • Lovely</span></div>
            <nav aria-label="Mua sắm"><h3>Mua sắm</h3><ul>
              <li><a href="Home.html?category=an-vat#products">Ăn vặt</a></li>
              <li><a href="Home.html?category=gau-bong#products">Gấu bông</a></li>
              <li><a href="Home.html?category=quan-ao#products">Quần áo</a> · <a href="Home.html?category=giay-dep#products">Giày dép</a></li>
              <li><a href="Home.html?category=trang-suc#products">Trang sức</a> · <a href="Home.html?category=luu-niem#products">Lưu niệm</a></li>
              <li><a href="Home.html?category=decor-phong#products">Decor phòng</a></li>
            </ul></nav>
            <nav aria-label="Học tập và khám phá"><h3>Học tập & khám phá</h3><ul>
              <li><a href="Korean.html">Ôn tập tiếng Hàn</a></li>
              <li><a href="Korean.html#panel-flashcard">Flashcard từ vựng</a></li>
              <li><a href="Korean.html#panel-typing">Luyện gõ tiếng Hàn</a></li>
              <li><a href="TinTuc.html">Tin tức & cộng đồng</a></li>
              <li><a href="Random.html">Random món ăn</a></li>
              <li><a href="Random.html#mustTrySection">Những món phải thử</a></li>
            </ul></nav>
            <nav aria-label="Tài khoản"><h3>Góc của bạn</h3><ul>
              <li><a href="profile.html">Trang cá nhân</a></li>
              <li><a href="Cart.html">Giỏ hàng</a></li>
              <li><a href="profile.html#orders">Đơn hàng của bạn</a></li>
              <li><a href="profile.html#wishlist">Sản phẩm yêu thích</a></li>
              <li><a href="DangNhap.html">Đăng nhập / Đăng ký</a></li>
            </ul></nav>
            <div class="sf-contact"><h3>Kết nối với Teddy</h3><p>Cần hỗ trợ mua sắm hoặc muốn gửi góp ý?</p><a href="mailto:hello@teddyyeuthuong.vn"><i class="fas fa-envelope" aria-hidden="true"></i> hello@teddyyeuthuong.vn</a><a href="tel:19001234"><i class="fas fa-phone" aria-hidden="true"></i> 1900 1234</a><p class="sf-hours">8:00 – 22:00 · Thứ 2 – Chủ nhật</p></div>
          </div>
          <div class="sf-bottom"><span>© ${new Date().getFullYear()} Teddy Yêu Thương</span><span>Gửi một chút yêu thương <i class="fas fa-heart" aria-hidden="true"></i></span><a href="#" class="sf-top">Về đầu trang ↑</a></div>
        </div>
      </footer>`;
      this.querySelector('.sf-top').addEventListener('click', event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
    }
  }
  customElements.define('site-footer', SiteFooter);
})();
