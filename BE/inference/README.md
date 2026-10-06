# Korean tutor V2 — localhost

Worker dùng chính adapter `E:\project\maianh\chatbot\model` và base/revision trong training_manifest.json. Không train, merge hoặc ghi lại adapter. Model vẫn là bản thử nghiệm; chạy được API không đồng nghĩa nội dung đã đúng.

## Khởi động

Mở PowerShell thứ nhất:

```powershell
cd E:\project\maianh\maianh\BE\inference
.\start-local.ps1
```

Nếu máy mới chưa cài môi trường, chạy `.\start-local.ps1 -Install` một lần (Python 3.12). Tải PyTorch CUDA và base model cần vài GB đĩa/mạng. Worker bind duy nhất `127.0.0.1:8001`, dùng 4-bit NF4, một lượt generate tại một thời điểm. Dùng Windows pagefile khi RAM vật lý thấp có thể khiến nạp chậm; không có fallback câu trả lời giả.

Mở PowerShell thứ hai:

```powershell
cd E:\project\maianh\maianh\BE
npm start
```

MySQL phải đang chạy và BE/.env phải đúng cấu hình hiện có. Không chạy thêm backend nếu cổng 3000 đã có server của project.

Mở http://127.0.0.1:3000/html/Korean.html, đăng nhập rồi chọn Chatbot hội thoại. Website được backend phục vụ trực tiếp; không cần server frontend riêng.

## Kiểm tra

```powershell
# Từ thư mục BE
node --test test/korean-chat.test.js
inference\.venv\Scripts\python.exe -m unittest discover -s inference -p test_service.py
inference\.venv\Scripts\python.exe inference/service.py --check
node --env-file-if-exists=.env inference/live-check.mjs
```

`--check` chỉ xác nhận metadata/tài nguyên, không nạp model. `live-check.mjs` gọi HTTP thật, tạo session/user test tạm, xóa user sau test và lưu kết quả tại `inference/runtime/live-results.json`. Nó không dùng tài khoản người học. Unit test có stub chỉ để kiểm tra hợp đồng API, không dùng làm bằng chứng model hoạt động.

GET `/api/korea/chat/status` báo ready theo worker. POST `/api/korea/chat` yêu cầu session đăng nhập, JSON và header `X-Requested-With: maianh-web`.

Ví dụ body:

```json
{"message":"안녕하세요!","history":[],"language":"kr","scenario":"greeting"}
```

History tối đa 6 cặp user/assistant; worker bỏ nguyên các cặp cũ khi vượt ngân sách 832 input tokens. Sinh tối đa 192 tokens, giới hạn thời gian 60 giây; phản hồi chạm giới hạn được báo truncated. Không tính loss, không cập nhật trọng số. `vi` yêu cầu giải thích Việt; `kr` luyện Hàn. Không đảm bảo model luôn tuân thủ đúng.

Không mở worker ra Internet. Chỉ chạy localhost trong công việc này. Không chia sẻ adapter/dataset công khai khi provenance/license nguồn chưa xác minh.
