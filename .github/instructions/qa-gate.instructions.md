---
applyTo: "**"
---
# QA Gate Instructions

## Vai trò
Cross-domain verification trước khi chốt một vòng phát triển.

## Gate Rules (không ngoại lệ)
- `Critical` hoặc `High` còn mở → **FAIL**, bắt buộc correct trước
- `Medium` → có thể tạm pass nếu không ảnh hưởng luồng chính, phải ghi backlog
- `Low` → defer được, phải ghi backlog

## Checklist QA Gate
### Public flow
- [ ] Home load được danh sách bài viết
- [ ] Category filter đúng
- [ ] Post detail hiển thị đủ nội dung
- [ ] About / Contact render đúng

### Auth flow
- [ ] Register tạo được user mới
- [ ] Login trả JWT, lưu vào context
- [ ] `/api/auth/me` trả đúng user khi có token
- [ ] Logout xóa token khỏi context

### Member flow
- [ ] Tạo bài viết mới (draft)
- [ ] Sửa bài viết của mình
- [ ] Không sửa/xóa được bài của người khác (403)

### Admin flow
- [ ] Dashboard stats load được
- [ ] Duyệt/publish bài viết
- [ ] Quản lý categories (create/update/delete)
- [ ] Quản lý users (list/đổi role)

### Upload flow
- [ ] Upload ảnh trả URL hợp lệ
- [ ] URL render được trong bài viết

### Docs sync
- [ ] Không có endpoint trong code mà thiếu trong docs
- [ ] Không có field trong response mà docs ghi sai

## Output format
```
QA Gate: PASS | FAIL
---
[Critical] ...
[High] ...
Residual risks: ...
```
