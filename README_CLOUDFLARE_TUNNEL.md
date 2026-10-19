# Triển khai Hongquy Store qua Cloudflare Tunnel

## Kết quả ngày 09/10/2026

Website đã được mở công khai theo xác nhận của chủ project.

Link: https://oops-sand-patrick-rachel.trycloudflare.com/html/Home.html

Kiểm tra qua HTTPS public:
- Backend/MySQL, trang chủ, đăng nhập: HTTP 200.
- API admin khách hàng: HTTP 401 khi chưa đăng nhập.
- Trang admin chuyển về trang đăng nhập.
- /.env trả HTTP 404.
- Chatbot trả HTTP 503: worker chưa sẵn sàng, chưa xác nhận model hoạt động.
- Chưa thử đăng nhập tài khoản thật, OTP hoặc tạo đơn qua internet.

## Chạy lại lần sau

Bật MySQL. Mở PowerShell tại thư mục project:

```powershell
cd E:\project\maianh\maianh
$env:TRUST_LOCAL_PROXY = 'true'
$env:NODE_ENV = 'production'
node BE/src/server.js
```

Nếu backend đang chạy thì không chạy thêm để tránh trùng cổng.
Cấu hình MySQL/SMTP vẫn lấy từ BE/.env. Không chia sẻ file này.
TRUST_LOCAL_PROXY chỉ tin proxy loopback. Production bật cookie Secure: dùng HTTPS để đăng nhập.

Mở PowerShell khác:

```powershell
cd E:\project\maianh\maianh
.\cloudflared.exe tunnel --url http://127.0.0.1:3000
```

Cloudflared là công cụ dòng lệnh, không có giao diện khi nhấp đúp.
Bản đã kiểm tra: 2026.10.0.
Lấy link HTTPS trycloudflare.com trong log, thêm /html/Home.html và gửi cho người dùng.
Link có thể đổi mỗi lần chạy. API frontend đang dùng URL tương đối.
Chỉ web được tunnel, không mở MySQL hoặc inference worker ra internet.

## Các tiến trình của phiên triển khai hiện tại

Backend và tunnel đang chạy nền.
Log ở .local-deploy/backend.log, backend-error.log, tunnel.log và tunnel-error.log.

```powershell
Get-Content .local-deploy/tunnel-error.log -Tail 30
Get-CimInstance Win32_Process -Filter "Name = 'cloudflared.exe'" | Select-Object ProcessId, ExecutablePath, CommandLine
```

Để dừng tunnel nền: xác định đúng PID từ lệnh trên, rồi dùng Stop-Process -Id <PID>.
Không dừng tất cả tiến trình node vì có thể ảnh hưởng project khác.
Nếu chạy bằng cửa sổ ở hướng dẫn trên, dùng Ctrl+C để dừng.

## Kiểm tra

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health/db
```

Mở link public trên điện thoại dùng 4G/5G, kiểm tra ảnh, sản phẩm và đăng nhập.
Admin vẫn yêu cầu tài khoản admin. Không chia sẻ mật khẩu admin.
Chỉ thử đặt hàng nếu thực sự muốn tạo đơn và gửi email.

## Chatbot tùy chọn

Tunnel không tự chạy model. Để khởi động bằng môi trường có sẵn:

```powershell
cd E:\project\maianh\maianh
powershell -NoProfile -ExecutionPolicy Bypass -File BE/inference/start-local.ps1
```

Không thêm -Install nếu đã cài dependencies. Chờ model load rồi kiểm tra:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/korea/chat/status
```

Chỉ coi chatbot hoạt động khi status ready và nhận phản hồi thật. Hiện chatbot chưa sẵn sàng.

## Lưu ý và các thay đổi

Máy phải bật, có internet và không sleep. Tắt máy hoặc dừng tunnel thì link không hoạt động.
Đây là chia sẻ localhost bằng link tạm, không phải hosting độc lập.

- BE/src/app.js: thêm cấu hình proxy loopback theo biến môi trường.
- .gitignore: bỏ executable cloudflared và log .local-deploy/.
- README_CLOUDFLARE_TUNNEL.md: tài liệu này, lưu UTF-8.

Không sửa dữ liệu DB, SMTP hoặc model. Chưa commit/push thay đổi triển khai.
