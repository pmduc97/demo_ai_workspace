---
name: be-implement
description: "Backend implementation workflow for Blog Hoi An/Da Nang. Use when implementing a new API endpoint, fixing backend logic, adding middleware, or updating DB schema. Loads checklist, spec-reading procedure, and review criteria. Trigger phrases: implement backend, create endpoint, fix API, add route, backend feature, controller, migration."
argument-hint: "Endpoint or feature to implement (e.g. POST /api/posts)"
---

# BE Implement Skill

## Mục tiêu
Implement hoặc fix một backend feature đúng spec, an toàn phân quyền, dễ test.

## Khi nào dùng
- Tạo endpoint mới
- Fix lỗi logic trong controller/route
- Thêm/sửa middleware
- Cập nhật DB schema (migration + seed)

## Procedure

### Bước 1 — Đọc spec trước khi code
1. Tìm file API spec: `demo_docs/api/<endpoint-name>.md`
2. Đọc `demo_docs/database.md` nếu thay đổi schema
3. Đọc controller cùng domain để giữ nhất quán style

### Bước 2 — Implement theo checklist
Xem đầy đủ tại [checklist](./references/checklist.md).

Tóm tắt bắt buộc:
- Route đúng method/path/prefix (`/api/*` hoặc `/api/admin/*`)
- Controller trả đúng status code
- Validate input → 422 khi sai
- Auth + role guard đúng (public / member / admin)
- Không expose `password_hash` hay secret
- Error format: `{ message, details? }`

### Bước 3 — Self-review
Chạy checklist review tại [review criteria](./references/review-criteria.md) trước khi báo xong.

### Bước 4 — Verify
```powershell
cd demo_source_be
npm test
```

## Output
```
### Files changed
- src/routes/...
- src/controllers/...
- src/db/migrations/... (nếu có)

### Behavior summary
...

### Verify result
npm test → PASS | FAIL
```
