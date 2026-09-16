# API kết nối MySQL `maianh`

Schema tham chiếu: `DB/maianh.sql`. Dùng `mysql2/promise`, pool kết nối và truy vấn có tham số. Backend không tự import dump vì dump chứa DROP TABLE. Database hiện có được sử dụng trực tiếp.

## Cấu hình và chạy

Thông tin kết nối nằm trong `BE/.env` (đã được `.gitignore` loại trừ). Các biến: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_CONNECTION_LIMIT`; mẫu chia sẻ là `.env.example` và không chứa mật khẩu thật.

```powershell
cd E:\maianh\BE
npm.cmd install
npm.cmd run dev
```

Backend kiểm tra kết nối MySQL trước khi mở HTTP. Nếu kết nối thất bại, sửa `.env` hoặc kiểm tra dịch vụ MySQL rồi chạy lại. Khi tắt server, pool được đóng. Thay `.env` cần khởi động lại server.

## Endpoint GET

Base URL: `http://127.0.0.1:3000/api`.

| Đường dẫn | Kết quả / bộ lọc |
|---|---|
| `/health` | Tiến trình API đang hoạt động |
| `/health/db` | Kiểm tra MySQL trực tiếp: 200 kết nối, 503 mất kết nối |
| `/categories` | Danh mục sản phẩm |
| `/products` | Sản phẩm active; `category` là slug, `q` tìm tên |
| `/products/:id` | Chi tiết sản phẩm active, SKU active và ảnh |
| `/food-categories` | Nhóm món ăn |
| `/foods` | Món active; `category`, `q`, `must_try=0` hoặc `1` |
| `/foods/random` | Một món ngẫu nhiên theo cùng bộ lọc; 404 nếu không có |
| `/post-categories` | Danh mục bài viết |
| `/posts` | Bài published; lọc `category`, ưu tiên bài ghim |
| `/posts/:id` | Nội dung bài published và ảnh |
| `/vocabulary-categories` | Chủ đề từ vựng |
| `/vocabulary` | Từ active; lọc `category` bằng code, `level`, `q` tiếng Hàn/Việt |
| `/vocabulary/:id` | Chi tiết từ vựng |

Các danh sách products/foods/posts/vocabulary nhận `page` (mặc định 1, tối đa 100000) và `limit` (mặc định 20, tối đa 100).

```json
{
  "data": [],
  "pagination": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

Chi tiết và danh mục trả `{ "data": ... }`. ID BIGINT và giá DECIMAL trả chuỗi để giữ độ chính xác; FE có thể chuyển giá VND sang Number trước khi định dạng nếu trong giới hạn an toàn. Các trường boolean từ MySQL hiện trả 0/1. Ngày giờ trả chuỗi theo UTC.

Lỗi: 400 tham số không hợp lệ, 404 không có tài nguyên, 500 lỗi truy vấn nội bộ. Không trả SQL, mật khẩu hay stack trace cho client. Endpoint `/health/db` dùng 503 khi DB không sẵn sàng.

## Ví dụ gọi từ FE

```javascript
const response = await fetch('/api/products?category=gau-bong&page=1&limit=12');
if (!response.ok) throw new Error('Không tải được sản phẩm');
const { data, pagination } = await response.json();
```

Frontend được phục vụ cùng backend nên không cần CORS. Chưa đổi các trang FE sang đọc API; dữ liệu mẫu hiện có vẫn hoạt động như trước.

## Phạm vi hiện tại

Đã triển khai API đọc dữ liệu công khai và [API đăng ký/đăng nhập/khôi phục](AUTH_API.md). API cá nhân `/api/auth/me` yêu cầu cookie phiên. Chưa có đặt hàng/thanh toán và importer CSV. Các bảng nhạy cảm không có endpoint công khai theo user_id. API từ vựng sẽ đọc dữ liệu sau khi importer được triển khai và nhập CSV vào bảng vocabulary.

Schema gốc có 36 bảng; migration xác thực bổ sung 2 bảng. Database có 7 danh mục sản phẩm; danh sách trả mảng rỗng khi chưa có dữ liệu.

## Kiểm tra

`npm.cmd test` chạy kiểm tra API đọc và xác thực với database trong `.env`. Bộ test auth tạo/xóa tài khoản test riêng, không gửi email thật; xem [AUTH_API.md](AUTH_API.md). Các bài kiểm tra chạy HTTP trên cổng tạm, không chiếm cổng 3000.

Tài liệu driver: [MySQL2](https://sidorares.github.io/node-mysql2/docs).
