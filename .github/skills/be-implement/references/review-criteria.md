## Review Criteria — Backend

Dùng severity: `Critical` / `High` / `Medium` / `Low`

### Critical (block merge ngay)
- Endpoint không có auth khi spec yêu cầu auth
- Password/secret bị expose trong response
- SQL injection risk (string interpolation trong raw query)
- Admin action không có role check

### High (phải fix trước gate)
- Response fields không khớp API spec
- Status code sai với spec (ví dụ trả 200 thay vì 201)
- Validation thiếu cho required field
- Member có thể thao tác resource của người khác

### Medium (có thể tạm pass)
- Thiếu pagination cho list endpoint
- Error message không nhất quán
- Missing edge-case handler (filter rỗng, page âm)
- Thiếu test cho happy path

### Low (defer)
- Tối ưu query chưa cần thiết
- Comment thiếu cho logic phức tạp
- Naming convention không nhất quán

### Output format
```
[Critical] src/controllers/posts.controller.js:45
Vấn đề: endpoint POST /api/posts không check auth middleware
Tác động: bất kỳ ai cũng tạo được bài viết
Fix: thêm authenticate middleware vào route
```
