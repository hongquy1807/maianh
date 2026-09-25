# API quản trị sản phẩm

Yêu cầu phiên đăng nhập admin (cookie `maianh_session`). Với POST/PUT/DELETE gửi `Content-Type: application/json` và `X-Requested-With: maianh-web`.

- GET `/api/admin/products`: danh sách, giá thấp nhất và tổng tồn kho của biến thể đang bán.
- GET `/api/admin/product-categories`: danh mục cho form.
- GET `/api/admin/products/:id`: chi tiết, toàn bộ biến thể và ảnh, kể cả sản phẩm ngừng bán.
- POST `/api/admin/products`: tạo sản phẩm, trả 201 và `data.id`.
- PUT `/api/admin/products/:id`: cập nhật toàn bộ sản phẩm, biến thể và ảnh trong một transaction.
- DELETE `/api/admin/products/:id`: xóa; trả 409 nếu sản phẩm có biến thể được tham chiếu bởi đơn hàng.

Ví dụ body POST/PUT:

```json
{
  "category_id": "1",
  "name": "Gấu nâu",
  "slug": "gau-nau",
  "description": "Gấu bông mềm",
  "is_active": 1,
  "variants": [{
    "sku": "GAU-NAU-45",
    "size_label": "45cm",
    "color_label": "Nâu",
    "price": 350000,
    "compare_at_price": null,
    "stock_quantity": 12,
    "is_active": 1
  }],
  "images": [{"image_url": "/uploads/gau-nau.jpg", "alt_text": "Gấu nâu"}]
}
```

Khi sửa biến thể, gửi thêm `id` để giữ nguyên liên kết với giỏ hàng và đơn hàng. Biến thể không có id được tạo mới; biến thể cũ không có trong body sẽ được xóa. Nếu vướng đơn hàng, toàn bộ cập nhật rollback; hãy giữ id và đặt `is_active: 0`. Slug và SKU phải duy nhất. Giá là số nguyên VND, tồn kho là số nguyên không âm. Form chọn file ảnh từ máy và upload bằng POST `/api/admin/product-images` (body là nội dung nhị phân, Content-Type image/jpeg, image/png hoặc image/webp). Tối đa 5 MB/file. File lưu trong `BE/uploads/products` với tên ngẫu nhiên; API trả `data.image_url` để lưu vào `product_images.image_url` khi lưu sản phẩm.

Nút Xem mở `/html/ChiTiet.html?id=:id&preview=1` với `target="_blank"`. Preview dùng API admin, không cho thêm vào giỏ. Khách vẫn dùng GET `/api/products/:id` và chỉ thấy sản phẩm đang bán.

Không cần thay đổi schema `DB/maianh.sql`. Danh mục phải có trong bảng `categories` trước khi thêm sản phẩm.

POST `/api/admin/product-categories`: tạo danh mục, body `{ "name": "Gấu cỡ lớn", "slug": "gau-co-lon" }`. Slug có thể bỏ qua để tự tạo từ tên. Trả 201 với `data: {id,name,slug}`, 400 khi dữ liệu không hợp lệ, 409 khi trùng slug. Yêu cầu phiên admin và header bảo vệ như API sản phẩm.

## Vị trí route và lọc sản phẩm

Toàn bộ API admin được mount tại `BE/src/routes/admin/index.js`. API trang sản phẩm (danh sách, CRUD, danh mục, upload) nằm trong `BE/src/routes/admin/admin_sanpham.js`. URL API hiện có được giữ nguyên.

GET `/api/admin/products?category_id=1&q=gau`: lọc theo ID danh mục và tìm tên sản phẩm; cả hai tham số đều tùy chọn, kết hợp bằng AND. Bỏ `category_id` để xem tất cả danh mục. Frontend tải lựa chọn từ GET `/api/admin/product-categories` và gọi lại API khi đổi bộ lọc hoặc tìm kiếm.
