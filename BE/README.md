# Backend Mai Anh

Backend Node.js + Express. Yêu cầu Node.js 24 trở lên.

## Chạy trên Windows PowerShell

```powershell
cd E:\maianh\BE
npm.cmd install
npm.cmd run dev
```

`dev` tự khởi động lại khi sửa mã nguồn. Dùng `npm.cmd start` để chạy bình thường. Nhấn Ctrl+C để dừng.

- Giao diện hiện có: http://127.0.0.1:3000
- Kiểm tra backend: http://127.0.0.1:3000/api/health

Backend phục vụ các file trong `../FE`: trang ở `html/`, CSS ở `css/`, JavaScript ở `js/`. Địa chỉ `/` chuyển đến `/html/Home.html`; URL trang cũ vẫn được chuyển hướng. Frontend có thể gọi API cùng địa chỉ bằng `fetch('/api/health')`.

## Cấu hình

Mặc định server chạy tại `127.0.0.1:3000`. Để thay đổi, sao chép `.env.example` thành `.env`, rồi sửa `PORT` hoặc `HOST`.

## Cấu trúc

- `src/app.js`: middleware, API và phục vụ frontend.
- `src/server.js`: đọc cấu hình và mở cổng HTTP.

Backend kết nối MySQL `maianh` bằng `.env`, có API đọc sản phẩm, danh mục, bài viết, món ăn, từ vựng và API xác thực. Xem [API.md](API.md) và [AUTH_API.md](AUTH_API.md). Khi cài mới, chạy `npm.cmd run db:migrate:auth` sau khi tạo schema gốc. Giỏ hàng/đơn hàng chưa có API ghi.
