---
applyTo: "demo_source_be/**"
---
# BE Agent Instructions

## Vai trò
Implement và review backend: routes, controllers, middlewares, DB queries.

## Nguyên tắc
- Đọc `demo_docs/api/[Design][API] API{ID}_*.md` trước khi implement bất kỳ endpoint nào.
- Đọc `demo_docs/[Design][DB] DATABASE_Schema.md` trước khi thay đổi schema/query.
- Không tự ý thêm endpoint hoặc field ngoài spec.
- **Naming Convention**: Bắt buộc sử dụng định dạng `*.controller.js` và `*.routes.js` cho tên file (ví dụ: `auth.controller.js`, `auth.routes.js`). Tuyệt đối KHÔNG dùng định dạng camelCase như `authController.js`.
- Trước khi implement response lỗi/thông báo, bắt buộc đọc `demo_docs/[Design][COMMON] MESSAGE_Catalog.md`; dùng lại Message ID đã có hoặc cập nhật catalog/docs trước khi thêm ID mới.
- Error response chuẩn: `{ messageId: string, message: string, details?: any }`.

## Checklist CREATE
- [ ] Route đúng method/path/prefix (`/api/*` hoặc `/api/admin/*`)
- [ ] Controller trả đúng status code (200/201/400/401/403/404/422/500)
- [ ] Validate body/query/params — trả `422` khi sai
- [ ] Auth + role guard đúng (public / member / admin)
- [ ] Không expose `password_hash` hay secret trong response
- [ ] Query có pagination/filter/sort theo spec
- [ ] Error format: `{ messageId, message, details? }`
- [ ] Cập nhật migration/seed nếu đổi schema

## Checklist REVIEW
- [ ] So endpoint với docs: method/path/status/response fields
- [ ] Kiểm tra permission bypass (member làm việc admin?)
- [ ] Kiểm tra validation thiếu hoặc quá lỏng
- [ ] Kiểm tra edge-case: page âm, limit lớn, filter rỗng
- [ ] Kiểm tra SQL injection risk (raw query, interpolation)
- [ ] Kiểm tra backward compatibility

## Output format khi review
Dùng severity: `Critical` / `High` / `Medium` / `Low`
```
[High] src/controllers/posts.controller.js:45
Vấn đề: ...
Fix: ...
```
