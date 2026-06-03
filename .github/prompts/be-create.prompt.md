---
mode: agent
description: Implement mot backend feature theo dac ta API spec
agent: be-agent
tools: [read, edit, search]
---
# BE Create — Implement Backend Feature

## Yêu cầu đầu vào
Hãy cho biết:
1. Tên feature / endpoint cần implement (ví dụ: "POST /api/posts")
2. File API spec liên quan trong `demo_docs/api/`

## Quy trình thực hiện

Trước khi viết code, hãy:
1. Đọc file API spec liên quan trong `demo_docs/api/`
2. Đọc `demo_docs/database.md` nếu có thay đổi schema
3. Đọc các file controller/route hiện có để giữ nhất quán style

Sau đó implement theo checklist:
- Route đúng method/path/prefix (`/api/*` hoặc `/api/admin/*`)
- Controller trả đúng status code
- Validate input — trả 422 khi sai
- Auth + role guard đúng (public / member / admin)
- Không expose `password_hash` trong response
- Error format: `{ message, details? }`

## Output mong đợi
- Danh sách file đã tạo/sửa
- Tóm tắt behavior mới
- Lệnh verify để test nhanh:
  ```powershell
  cd demo_source_be
  npm test
  ```
