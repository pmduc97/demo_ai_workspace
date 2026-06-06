# Final Comprehensive Review (Round 3) — Blog Du Lịch

Bạn là **Orchestrator Agent** cho dự án Blog Du Lịch. Dự án vừa trải qua Round 1 (Fix) và Round 2 (Verify). Nhiệm vụ của bạn trong session này là thực hiện **Round 3: Final Comprehensive Review** để rà soát toàn diện lần cuối toàn bộ artifacts (kể cả những phần không thay đổi ở các round trước), đảm bảo 100% tuân thủ các tiêu chuẩn mới nhất của dự án.

---

## 🎯 Scope Review Toàn Diện

| Hạng mục | Đối tượng | Tiêu chuẩn / Skill áp dụng |
|----------|-----------|----------------------------|
| **FE Docs** | `demo_docs/fe/*.md` | Dùng skill `doc-fe-review`. Check format 12-section, YAML frontmatter, tiếng Việt có dấu, Anti-Slop. |
| **BE Docs** | `demo_docs/api/*.md` | Dùng skill `doc-be-review`. Check format 10-section, Validation Rules, Sequence Diagram, Query IDs. |
| **Workflow** | `demo_docs/workflow/*.md` | Dùng skill `doc-workflow-review`. Check Exception flows, không dead-end. |
| **Test Docs** | `demo_docs/tests/ITa/*.md`, `ITb/*.md` | Dùng skill `doc-ita-review`, `doc-itb-review`. Check MCP data, Condition-Based Waiting. |
| **FE Code** | `demo_source_fe/src/**/*.jsx` | Check `min-h-[100dvh]`, `useEffect` cleanup, không dùng `transition-all/colors`. |
| **BE Code** | `demo_source_be/src/**/*.js` | Check `messageId` đầy đủ, HTTP status chuẩn (422 cho validation, 403 cho business rule). |
| **Unit Tests**| `demo_source_be/src/__tests__/*.js` | Check assertions khớp với controller (đặc biệt 422/403), có cleanup `afterAll`. |
| **E2E Tests** | `demo_playwright/tests/**/*.ts` | Dùng skill `playwright-review`. Check `captureEvidence`, không dùng `waitForTimeout`, chuẩn POM. |

---

## ⚙️ Quy trình làm việc (BẮT BUỘC tuân thủ)

### Bước 1: LẬP PLAN (`PLAN_FINAL_REVIEW.md`)
1. Đọc `PROJECT_MANIFEST.yml` để nắm tổng quan.
2. Tạo file `PLAN_FINAL_REVIEW.md` liệt kê chi tiết các hạng mục cần review.
3. Trình bày Plan cho user và **TỰ ĐỘNG TIẾN HÀNH** thực thi ngay lập tức không cần chờ duyệt (Full Automation).

### Bước 2: THỰC THI REVIEW TOÀN DIỆN
- Sử dụng `#tool:todo` để quản lý tiến độ toàn bộ quá trình.
- Thực hiện rà soát tuần tự qua tất cả các nhóm (FE Docs, BE Docs, Workflow, Code, Tests).
- Khi review Docs: Bắt buộc gọi các skill tương ứng (`doc-fe-review`, `doc-be-review`, v.v.) để lấy checklist chuẩn.
- Nếu phát hiện lỗi (Findings): Tự động dùng tool để fix ngay lập tức, sau đó ghi chú lại vào log.

### Bước 3: VERIFY HỆ THỐNG
1. Chạy Unit Tests: `cd demo_source_be && npm test`
2. Chạy FE Build: `cd demo_source_fe && npm run build`
3. Gọi agent `qa-gate` (hoặc skill `qa-gate`) để chốt chặn cuối cùng.

### Bước 4: TỔNG HỢP & BÁO CÁO
1. Ghi log chi tiết vào `reports/AGENT_EXECUTION_LOG.md`.
2. Tạo file `FINAL_REVIEW_REPORT.md` tổng hợp:
   - Tổng số file đã rà soát.
   - Các lỗi ngầm (hidden bugs) phát hiện và đã fix trong Round 3.
   - Trạng thái hệ thống hiện tại (PASS/FAIL).
   - Lời khẳng định dự án đã sẵn sàng 100%.

---

## 🚨 Lưu ý đặc biệt cho Agent
- **Không lười biếng (Anti-Slop):** Phải đọc file thật bằng tool `read_file` hoặc `grep_search`, không được đoán nội dung.
- **Tiếng Việt:** Mọi file tài liệu (Markdown) nếu có sửa chữa phải đảm bảo giữ nguyên tiếng Việt có dấu chuẩn xác.
- **Tooling:** Ưu tiên dùng `multi_replace_string_in_file` để sửa nhiều chỗ cùng lúc nhằm tiết kiệm thời gian.
