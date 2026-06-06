---
name: test-suite
description: "Test writing workflow for Blog Du Lịch backend. Use when writing Jest + Supertest tests, adding test cases for new endpoints, creating test helpers or factories, checking coverage. Trigger phrases: write test, add test, test suite, jest, supertest, coverage, unit test, integration test, test auth, test posts."
argument-hint: "Module to test: auth | posts | categories | admin | upload"
---

# Test Suite Skill

## Mục tiêu
Viết và maintain test suite cho backend API (Jest + Supertest), bao phủ luồng chính và lỗi quan trọng.

## Nguyên tắc (Quy tắc cứng)
- **IRON LAW: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.** BẮT BUỘC phải viết test fail trước khi implement tính năng hoặc fix bug.
- **RECEIVING CODE REVIEW:** Khi nhận feedback sửa lỗi, TUYỆT ĐỐI KHÔNG xin lỗi/khen ngợi. BẮT BUỘC tuân theo quy trình: `READ -> UNDERSTAND -> VERIFY -> EVALUATE -> RESPOND`. Trả lời bằng fact kỹ thuật.

## Khi nào dùng
- Viết test cho module mới (auth, posts, categories, admin, upload)
- Thêm test case cho endpoint vừa implement
- Fix flaky test
- Check coverage

## Procedure

### Bước 1 — Đọc trước khi viết
1. Đọc API spec của module tại `demo_docs/api/`
2. Đọc controller tương ứng tại `demo_source_be/src/controllers/`
3. Đọc test hiện có để giữ nhất quán structure và helpers

### Bước 2 — Setup (nếu chưa có)
Tạo hoặc check file `src/__tests__/helpers/setup.js`:
```javascript
const db = require('../../db');
beforeAll(async () => { /* verify DB connection */ });
afterAll(async () => { await db.destroy(); });
```

### Bước 3 — Viết test theo template
Xem [test template](./references/test-template.md) để có structure chuẩn.

Bắt buộc cho mỗi endpoint:
- Happy path (2xx)
- 401 Unauthorized (không có token)
- 403 Forbidden (sai role)
- 422 Validation error (thiếu/sai field)
- 404 Not found (resource không tồn tại)

### Bước 4 — Chạy và verify
```powershell
cd demo_source_be
npm test
npm test -- --coverage
```

## Output
```
### Test files
- src/__tests__/auth.test.js — X test cases added

### Run
cd demo_source_be && npm test

### Coverage
Statements: X% | Branches: X% | Functions: X% | Lines: X%
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
