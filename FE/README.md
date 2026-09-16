# Frontend: HTML, CSS và JavaScript

Mỗi trang có ba file cùng tên, ví dụ `html/Home.html`, `css/Home.css`, `js/Home.js`.

- `html/`: toàn bộ trang HTML.
- `css/`: CSS từng trang và `layout.css` dùng chung.
- `js/`: JavaScript từng trang và các module dùng chung bên dưới.

Chạy `npm.cmd run dev` trong `BE`, mở http://127.0.0.1:3000/html/Home.html. URL cũ như `/Home.html` tự chuyển đến vị trí mới, giữ nguyên tham số tìm kiếm.

CSS tĩnh trong HTML đã được chuyển thành class trong file CSS của trang. JavaScript vẫn cập nhật giao diện động khi cần.

## Header và footer dùng chung

- `header.js`: component `<site-header>`, menu theo Home, icon, tìm kiếm, menu mobile và liên kết tài khoản.
- `footer.js`: component `<site-footer>`, các nhóm mua sắm, học tập, khám phá, tài khoản và liên hệ.
- `layout.css`: toàn bộ giao diện của hai component; tiền tố `sh-` / `sf-` tránh xung đột CSS trang.
- `page-links.js`: mở tab theo liên kết footer, tìm kiếm và lọc danh mục trên Home.

Các trang nạp hai script component trong `<head>` để header được dựng trước các script trang đang sử dụng `headerCartCount`. Không đổi thành `async` hoặc `defer` nếu chưa chuyển các script trang sang chờ component.

Thêm trang mới: nạp CSS và các script như Home, đặt `<site-header></site-header>` đầu trang và `<site-footer></site-footer>` cuối nội dung.

Danh mục hiện có dữ liệu là gấu bông. Gán `data-category` cho mỗi `.product-card` khi thêm sản phẩm mới: `an-vat`, `gau-bong`, `quan-ao`, `giay-dep`, `trang-suc`, `luu-niem`, `decor-phong`. Danh mục chưa có dữ liệu hiển thị trạng thái trống.

Thông tin email, hotline và giờ hỗ trợ được giữ từ footer Home; cần cập nhật tại `footer.js` khi có thông tin chính thức. Bộ đếm giỏ hàng tiếp tục do logic hiện có của từng trang cập nhật, chưa đồng bộ dữ liệu giữa các trang.
