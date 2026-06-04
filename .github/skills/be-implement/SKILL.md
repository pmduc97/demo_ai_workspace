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
1. Tìm file API spec: `demo_docs/api/[Design][API] API{ID}_{Group}_{Name}.md`
2. Đọc `demo_docs/[Design][DB] DATABASE_Schema.md` nếu thay đổi schema
3. Xem danh sách API tại `demo_docs/api/[Design][LIST] API_DanhSachEndpoint.md`
4. Đọc `demo_docs/[Design][COMMON] MESSAGE_Catalog.md`; dùng lại Message ID đã có, nếu chưa có thì cập nhật catalog và API doc trước khi code.

### Bước 2 — Implement theo checklist
Xem đầy đủ tại [checklist](./references/checklist.md).

Tóm tắt bắt buộc:
- Route đúng method/path/prefix (`/api/*` hoặc `/api/admin/*`)
- Controller trả đúng status code
- Validate input → 422 khi sai
- Auth + role guard đúng (public / member / admin)
- Không expose `password_hash` hay secret
- Error format: `{ messageId, message, details? }`

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

---

## 📝 Ghi Log Bắt Buộc

Sau khi hoàn thành skill này, **PHẢI** ghi log vào `reports/AGENT_EXECUTION_LOG.md` trước khi báo cáo kết quả.

Dùng template sau (copy và điền vào):

```markdown
### [YYYY-MM-DD HH:mm:ss] - {be-agent | fe-agent | test-agent | playwright-agent | docs-agent}
- **Task**: {Mô tả ngắn gọn việc vừa làm}
- **Skill Used**: {tên skill này}
- **Target Feature**: {key trong PROJECT_MANIFEST.yml, ví dụ: auth_login}
- **Files Processed**:
  - `path/to/file` [Modified]
  - `path/to/file` [Verified/Unchanged]
- **Status**: SUCCESS | FAILED | PARTIAL
- **Notes**: {Ghi chú: findings, residual risks, việc chưa làm}
```

> ⚠️ Nếu bị interrupt, ghi `Status: PARTIAL` và ghi rõ đã làm đến bước nào.
> ⚠️ Sau khi ghi log, cập nhật `cycle_checkpoint` trong `PROJECT_MANIFEST.yml`.
