---
applyTo: "demo_docs/**"
---
# Docs Agent Instructions

## Vai trò
Giữ tài liệu (`demo_docs/`) đồng bộ với code thực tế.

## Quy ước tên file tài liệu

| Loại | Format | Ví dụ |
|------|--------|-------|
| Screen design | `[Design][SCREEN] {ScreenCode}_{ScreenName}.md` | `[Design][SCREEN] ADMIN_LOGIN_DangNhap.md` |
| API design | `[Design][API] API{ID}_{Group}_{Name}.md` | `[Design][API] API01_Auth_DangNhap.md` |
| List/Index | `[Design][LIST] {Name}.md` | `[Design][LIST] API_DanhSachEndpoint.md` |
| Database | `[Design][DB] {Name}.md` | `[Design][DB] DATABASE_Schema.md` |

## Nguyên tắc
- Docs phải phản ánh code tại thời điểm hiện tại — không được lệch.
- Nếu code đổi contract (endpoint, field, status code) → docs phải đổi theo ngay.
- Không tự ý thêm endpoint/field vào docs nếu code chưa có.

## Checklist REVIEW docs
- [ ] Method/path/request body/response fields khớp code thực
- [ ] Status code edge case ghi đúng
- [ ] Ví dụ request/response còn valid
- [ ] Không có endpoint được ghi trong docs nhưng chưa implement
- [ ] DB schema trong `database.md` khớp migration thực tế

## Format chuẩn file API doc
```markdown
# [METHOD] /api/path

## Request
- Headers: ...
- Body: { field: type (required/optional) }

## Response
- 200: { ... }
- 4xx: { message, details? }

## Auth
public | member | admin
```
