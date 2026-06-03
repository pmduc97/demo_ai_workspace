## Checklist CREATE — Backend

### Route & Controller
- [ ] Method đúng: GET / POST / PUT / PATCH / DELETE
- [ ] Path đúng theo spec: `/api/*` (public/member) hoặc `/api/admin/*` (admin)
- [ ] Status code đúng: 200 (get/update) · 201 (create) · 204 (delete)
- [ ] Response shape khớp docs (không thêm/bớt field)

### Validation
- [ ] Validate tất cả required fields trong body/params/query
- [ ] Trả `422` kèm `{ message, details }` khi validation fail
- [ ] Trả `400` cho request malformed

### Auth & Permission
- [ ] Public route: không cần token
- [ ] Member route: middleware `auth.js` protect
- [ ] Admin route: middleware `auth.js` + `role.js` ('admin')
- [ ] Member không làm được việc của admin (403)
- [ ] User chỉ sửa/xóa resource của mình (403 nếu không phải owner)

### Query & Data
- [ ] Pagination: `page` + `limit` với default hợp lý
- [ ] Filter/sort theo spec
- [ ] Không SELECT * — chỉ lấy field cần thiết
- [ ] Không expose `password_hash`, `secret`, token trong response

### Error Handling
- [ ] Format lỗi: `{ message: string, details?: any }`
- [ ] 404 khi resource không tồn tại
- [ ] 409 khi conflict (duplicate email, slug...)
- [ ] 500 chỉ cho unexpected errors — không leak stack trace

### Schema Changes
- [ ] Tạo migration file mới (không sửa migration cũ)
- [ ] Cập nhật seed nếu cần
- [ ] Cập nhật `demo_docs/database.md` nếu đổi schema
