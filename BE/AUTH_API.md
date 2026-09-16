# API xác thực và frontend

Router riêng: `src/routes/auth.js`. Các form trong `FE/html/DangNhap.html` dùng `FE/js/DangNhap.js` và helper `FE/js/auth-api.js`. Giao diện đăng nhập bằng **email**, không dùng số điện thoại làm định danh vì schema hiện tại không yêu cầu số điện thoại duy nhất.

## Khởi tạo

```powershell
cd E:\maianh\BE
npm.cmd install
npm.cmd run db:migrate:auth
npm.cmd run dev
```

Migration `DB/03_auth.sql` đã được áp dụng cho database hiện tại, thêm `auth_sessions` và `password_reset_tokens`. Có thể chạy lại migration này. Không cần import lại `DB/maianh.sql` và không xóa dữ liệu cũ.

## Endpoint

Tất cả POST gửi JSON và header `X-Requested-With: maianh-web`. FE dùng cùng origin với BE, cookie được gửi tự động. Không bật CORS cho các API này.

| Method / đường dẫn | JSON đầu vào | Kết quả |
|---|---|---|
| POST `/api/auth/register` | `full_name, email, phone, password, agree_terms: true` | 201, tài khoản customer mới; sau đó đăng nhập |
| POST `/api/auth/login` | `email, password, remember: boolean` | 200, `{user}` và cookie HttpOnly |
| GET `/api/auth/me` | — | `{user}` hiện tại hoặc 401 |
| POST `/api/auth/logout` | `{}` | Hủy phiên hiện tại và xóa cookie |
| POST `/api/auth/forgot-password` | `email` | Thông báo chung, không tiết lộ email có tồn tại |
| POST `/api/auth/reset-password` | `token, password` | Đổi mật khẩu, hủy tất cả phiên và token khôi phục của người dùng |

Mật khẩu mới dài 8–128 ký tự, băm scrypt với salt riêng. Email được trim/lowercase. Bỏ qua role/status do client gửi. Cookie có SameSite=Lax, HttpOnly; production thêm Secure. Phiên thường hết hạn sau 12 giờ, ghi nhớ sau 30 ngày. Token phiên/reset là 32 byte ngẫu nhiên; DB chỉ lưu SHA-256. Reset hết hạn sau 15 phút và chỉ sử dụng một lần, kiểm tra/cập nhật trong transaction.

Lỗi 400 dữ liệu không hợp lệ, 401 sai thông tin/hết phiên, 403 thiếu header hoặc cross-site, 409 email trùng, 429 vượt giới hạn, 503 chưa cấu hình SMTP. Giới hạn đăng ký/đăng nhập/reset: 30 yêu cầu/IP/15 phút; yêu cầu email: 5/IP/15 phút. Limiter hiện lưu trong RAM phù hợp một tiến trình; khi chạy nhiều instance cần shared store và cấu hình proxy đáng tin cậy.

## Email khôi phục

Đã thêm các biến vào `.env` và `.env.example`; **chưa có tài khoản SMTP nên email thật chưa gửi được**:

```dotenv
APP_ORIGIN=http://127.0.0.1:3000
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

Điền thông tin nhà cung cấp SMTP vào `.env` rồi khởi động lại BE. Cổng 587 dùng STARTTLS, cổng 465 đặt SMTP_SECURE=true. APP_ORIGIN là địa chỉ người nhận truy cập được (localhost chỉ phù hợp thử trên cùng máy). Liên kết mở `DangNhap.html#reset=...`; FE lấy token rồi xóa fragment khỏi thanh địa chỉ. Token không được trả qua API hoặc in ra log.

Khi SMTP chưa cấu hình, form hiển thị rõ chức năng chưa sẵn sàng. Nếu SMTP lỗi khi gửi, token đó bị xóa, backend chỉ ghi log lỗi chung; API vẫn trả thông báo chung để không tiết lộ tài khoản.

## FE

- Đăng ký thành công chuyển sang form đăng nhập và điền email vừa đăng ký.
- Đăng nhập thành công về Home. Header kiểm tra `/me` để trỏ tới đăng nhập hoặc tài khoản.
- Trang profile yêu cầu phiên hợp lệ, đọc tên/email/điện thoại thật và đăng xuất qua API. Các chức năng giao dịch/địa chỉ/điểm còn là demo của trang cũ, chưa nối API riêng.
- Đã bỏ đăng nhập Google/Facebook giả lập; chưa triển khai OAuth.
- Không lưu mật khẩu hoặc session token vào localStorage.

Chưa xác minh quyền sở hữu email khi đăng ký; reset mật khẩu dùng quyền truy cập hộp thư. Các tài khoản cũ không dùng định dạng scrypt-v1 phải đặt lại mật khẩu trước khi đăng nhập.

## Kiểm tra

`npm.cmd test` gồm kiểm tra auth: đăng ký, email trùng, quyền customer, sai mật khẩu, cookie, `/me`, đăng xuất, email không tồn tại, reset đồng thời chỉ một lần thành công, mật khẩu cũ mất hiệu lực, hủy phiên, expiry, CSRF header và rate limit. Test auth tạo tài khoản có email ngẫu nhiên thuộc `example.invalid`, dùng mail giả trong bộ nhớ (không gửi ra ngoài), rồi xóa đúng tài khoản test và dữ liệu liên quan.

Định kỳ xóa hàng đã hết hạn trong `auth_sessions` và `password_reset_tokens`; trạng thái hết hạn được kiểm tra ở mọi yêu cầu nên việc dọn này không ảnh hưởng tính đúng của xác thực.
