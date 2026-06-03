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

## Format chuẩn file API doc (Backend)
- Bắt buộc tuân thủ chuẩn **7 sections** (có YAML Frontmatter, Query IDs mapping).
- Sử dụng skill `doc-be-implement` để tạo/cập nhật.
- Sử dụng skill `doc-be-review` để kiểm tra.

## Format chuẩn file Screen doc (Frontend)
- Bắt buộc tuân thủ chuẩn **10 sections** (có YAML Frontmatter, UI mapping, Events & Actions).
- Sử dụng skill `doc-fe-implement` để tạo/cập nhật.
- Sử dụng skill `doc-fe-review` để kiểm tra.

## Checklist REVIEW docs chung
- [ ] Method/path/request body/response fields khớp code thực
- [ ] Status code edge case ghi đúng
- [ ] Ví dụ request/response còn valid
- [ ] Không có endpoint được ghi trong docs nhưng chưa implement
- [ ] DB schema trong `database.md` khớp migration thực tế
