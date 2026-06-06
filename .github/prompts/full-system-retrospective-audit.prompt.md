# Full System Retrospective Audit — Blog Du Lịch

Bạn là **Orchestrator Agent** cho dự án Blog Du Lịch. Workshop này vừa trải qua 4 phase nâng cấp lớn về agent, skill, instruction từ 2 open-source repo (obra/superpowers, leonxlnx/taste-skill). Nhiệm vụ: rà soát hồi tố (retrospective audit) TOÀN BỘ artifacts hiện có để đảm bảo chúng tuân thủ các tiêu chuẩn mới.

---

## 🎯 Scope Audit

| Loại | Quét cái gì | Rule mới cần check |
|------|-------------|-------------------|
| FE Design Docs (13 files) | `demo_docs/fe/[Design][SCREEN]*.md`, `[Design][LIST]*.md` | Defense-in-Depth validation mapping, Anti-Slop, Component Danh Sách |
| BE Design Docs (32+ files) | `demo_docs/api/[Design][API]*.md`, `[Design][LIST]*.md` | Defense-in-Depth mapping, Message Catalog, Query IDs |
| Workflow Docs | `demo_docs/workflow/*.md` | Dead-end check, Branch coverage |
| ITa/ITb Test Docs | `demo_docs/tests/ITa/*.md`, `demo_docs/tests/ITb/*.md` | Test Data from DB (MCP), Condition-Based Waiting |
| FE Code | `demo_source_fe/src/**/*.{jsx,js}` | Anti-Slop Manifesto, useEffect cleanup, min-h-[100dvh], animate transform/opacity |
| BE Code | `demo_source_be/src/**/*.js` (trừ __tests__) | Defense-in-Depth 3-layer validation, Error format `{messageId, message, details?}` |
| Unit Tests | `demo_source_be/src/__tests__/*.test.js` | Iron Law TDD, Test Polluter cleanup, afterEach/afterAll |
| Playwright E2E | `demo_playwright/tests/**/*.spec.ts` | Condition-Based Waiting (no hard sleep), Evidence Capture |

---

## ⚙️ Quy trình làm việc (BẮT BUỘC tuần tự)

### Bước 1: LẬP PLAN
1. Đọc `PROJECT_MANIFEST.yml` để biết trạng thái từng feature
2. Đọc `demo_docs/[Design][COMMON] MESSAGE_Catalog.md`
3. Đọc `demo_docs/[Design][DB] DATABASE_Schema.md`
4. Tạo file plan `PLAN_AUDIT_RETRO.md` trong thư mục gốc, gồm:
   - Danh sách file cần audit (chia theo nhóm: FE_DOCS, BE_DOCS, WORKFLOW, ITA, ITB, FE_CODE, BE_CODE, UNIT_TESTS, PLAYWRIGHT)
   - Mỗi nhóm ghi rõ số lượng file, rule cần check, ưu tiên (Critical/High/Medium/Low)
   - Checklist riêng cho từng nhóm dựa trên instruction/skill tương ứng
5. **CHO USER REVIEW PLAN TRƯỚC KHI LÀM** — dừng lại và hỏi user đã duyệt plan chưa

### Bước 2: THỰC THI (theo thứ tự ưu tiên)
- Mỗi nhóm = 1 todo list riêng, đánh dấu `in-progress` khi đang làm, `completed` khi xong
- Với mỗI file trong nhóm:
  1. Đọc nội dung file
  2. So sánh với checklist của rule mới
  3. Nếu vi phạm → ghi lỗi với severity + location + fix đề xuất
  4. Nếu cần sửa → sửa luôn (trừ khi user muốn review trước)
- Sau mỗi nhóm: tổng hợp kết quả, ghi vào `reports/AGENT_EXECUTION_LOG.md`

### Bước 3: TỔNG HỢP & REVIEW CUỐI
1. Chạy `npm test` trên BE để đảm bảo unit tests vẫn pass sau các sửa chữa
2. Xác nhận FE build được: `cd demo_source_fe && npm run build`
3. Tạo file `AUDIT_REPORT.md` tổng hợp:
   - Số file đã audit, số file có lỗi, số lỗi đã fix
   - Các lỗi chưa fix (residual risks) kèm lý do
   - PASS/FAIL verdict

---

## 📋 Checklists chi tiết cho từng nhóm

### FE Design Docs (dùng skill: doc-fe-implement, doc-fe-review)
- [ ] Đúng format 10-section? (YAML frontmatter, navigation, layout tree, API links, state snippets, error handling, responsive table, events mapping)
- [ ] Anti-Slop: không có emoji, AI cliché trong doc?
- [ ] Component list mapping khớp với `demo_docs/fe/[Design][LIST] COMPONENT_DanhSach.md`?

### BE Design Docs (dùng skill: doc-be-implement, doc-be-review)
- [ ] Đúng format 7-section? (YAML frontmatter, request/response mapping, business logic với Query IDs, Knex.js snippets)
- [ ] Defense-in-Depth: có ghi rõ validation ở từng lớp (Boundary → Business → Data)?
- [ ] Error format đã dùng `{messageId, message, details?}`?
- [ ] Message ID tồn tại trong `MESSAGE_Catalog.md`?

### Workflow Docs
- [ ] Mermaid diagram có đủ branch? Không có dead-end?
- [ ] Mỗi bước có mapping đến API endpoint, screen?
- [ ] Coverage đủ cho ITb scenarios?

### ITa/ITb Test Docs
- [ ] Test Data lấy từ DB thật qua MCP? (không data giả)
- [ ] Condition-Based Waiting được yêu cầu (không hard sleep)?
- [ ] Chunking hợp lý (max 10 TC/spec)?

### FE Code
- [ ] Anti-Slop: không emoji trong UI string, không `#000000`, không AI cliché?
- [ ] `useEffect` có cleanup function?
- [ ] `min-h-[100dvh]` cho layout chính?
- [ ] Animation chỉ dùng `transform`/`opacity`?
- [ ] Loading/Success/Error state đủ cho mọi API call?
- [ ] Empty state handling?
- [ ] Responsive desktop/mobile?

### BE Code
- [ ] Defense-in-Depth: validate 3 lớp (Boundary → Business → Data)?
  - Boundary: format/type (422)
  - Business: logic/quyền (400/403)
  - Data: DB constraints (500/422)
- [ ] Error format: `{messageId: string, message: string, details?: any}`?
- [ ] Auth/role guard đúng?
- [ ] Không expose password_hash?
- [ ] Pagination/filter/sort cho list endpoints?

### Unit Tests (Jest + Supertest)
- [ ] Mỗi test có cleanup (afterEach/afterAll)?
- [ ] Không phụ thuộc thứ tự chạy?
- [ ] Coverage: happy path + error cases (401/403/404/422) đủ?
- [ ] Assertions check cả status + response body?
- [ ] Không hardcode token/ID thật?

### Playwright E2E
- [ ] Condition-Based Waiting: không `page.waitForTimeout()`?
- [ ] POM: UI logic trong page-objects/, test chỉ assert?
- [ ] Evidence Capture ở bước quan trọng?
- [ ] Data-driven: setup data qua API, không phụ thuộc seed?

---

## 🚨 Severity Guidelines

| Severity | Định nghĩa | Action |
|----------|-----------|--------|
| **Critical** | Violation gây crash, lỗi bảo mật, mất dữ liệu | Fix ngay, không delay |
| **High** | Violation nghiêm trọng (sai logic, sai format response, thiếu validation) | Fix trước khi kết thúc audit |
| **Medium** | Vi phạm best practice nhưng không break luồng chính | Fix nếu có thời gian, nếu không ghi backlog |
| **Low** | Code style, naming, cosmetic | Ghi backlog, defer |

---

## 📤 Output Format Cuối Cùng

```markdown
# AUDIT REPORT — Blog Du Lịch Retrospective
Date: 2026-06-06
Status: PASS | FAIL

## Summary
- Files audited: X
- Files with violations: X
- Violations found: X (Critical: X, High: X, Medium: X, Low: X)
- Violations fixed: X
- Residual risks: X

## By Category

### FE Design Docs (X files)
- [Critical] ... (fixed / unfixed)
- [High] ...

### BE Design Docs (X files)
- [Critical] ...

### Workflow Docs
...

### ITa/ITb Test Docs
...

### FE Code
...

### BE Code
...

### Unit Tests
...

### Playwright E2E
...

## Residual Risks
- [Medium] ...
- [Low] ...

## Verdict
QA Gate: PASS | FAIL
```

---

## ⚠️ Rules Khi Làm Việc

1. **LUÔN đọc instruction/skill trước khi audit một nhóm**: dùng skill `doc-fe-review` trước khi review FE docs, skill `be-implement` trước khi audit BE code, etc.
2. **Không đoán mò**: nếu không chắc rule có áp dụng không, đọc lại file instruction tương ứng
3. **Không tự ý thay đổi scope**: bám sát danh sách file trong plan
4. **Ghi log sau mỗi nhóm** vào `reports/AGENT_EXECUTION_LOG.md` trước khi chuyển sang nhóm khác
5. **Cấm dùng `// TODO` hoặc `// ...` trong code sửa**: phải viết full implementation
6. **Nếu file quá dài**: dừng ở breakpoint sạch (cuối function), ghi `[PAUSED — X of Y complete. Send "continue" to resume...]`
7. **Sau khi sửa code BE/FE**: kiểm tra file không bị lỗi syntax bằng `get_errors()` tool

Bắt đầu bằng cách đọc `PROJECT_MANIFEST.yml`, tạo `PLAN_AUDIT_RETRO.md`, và trình cho user duyệt trước nhé!