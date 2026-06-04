---
description: Tự động hóa toàn bộ quy trình E2E Test ITa (Viết code, Chạy test, Tự fix lỗi test, và Xuất báo cáo).
---
# Prompt: playwright-ita-full-cycle

## Mô tả
Thực hiện chuỗi hành động khép kín cho mảng Automation Test ITa: Viết code Playwright (POM + Spec) -> Tự review -> Chạy test qua Terminal -> Tự động fix lỗi Test Code (nếu có) -> Xuất báo cáo kết quả chuẩn Enterprise.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `playwright-agent`. Nhiệm vụ của bạn là thực hiện quy trình Automation liên hoàn sau:

### Phase 1: Create & Review Test Code
1. Đọc file Test Case ITa của tính năng do user chỉ định.
2. Áp dụng skill `.github/skills/playwright-suite/SKILL.md` để tạo Page Object Model (POM) và file Test Spec (`.spec.ts`).
3. **Bắt buộc lập `Playwright Chunk Plan` trước khi generate code:** mỗi chunk khoảng 8-10 TC, tối đa 10 TC/spec file; chia theo nhóm như list/filter, profile, role/status, create/delete, permission/security. Với bộ TC lớn, generate và chạy từng spec theo chunk, không tạo một spec file khổng lồ.
4. Tự review code vừa viết: Đảm bảo đã xử lý đúng các tag `[UI]` (chỉ check giao diện) và `[API]` (intercept network), có setup DB đầy đủ, và mỗi spec không vượt quá 10 TC.

### Phase 2: Execute & Self-Correct (Chạy Test & Tự sửa lỗi)
0. **Execution Gate bắt buộc trước khi chạy full/chunk suite:**
   - Kiểm tra BE available bằng health endpoint nếu có, hoặc endpoint public nhẹ như `GET http://localhost:3000/api/categories` / `GET http://localhost:3000/api/posts`.
   - Kiểm tra FE available bằng `GET http://localhost:5173/` hoặc `baseURL` trong `demo_playwright/playwright.config.ts`.
   - Nếu FE hoặc BE chưa chạy/không reachable: dừng ngay, report `BLOCKED: FE/BE not available`, không chạy full suite.
1. **Smoke test bắt buộc:** chạy 2-3 case nhỏ trước full suite/chunk lớn (home render, API public 200 hoặc login/admin auth, điều hướng màn hình target). Chỉ chạy tiếp nếu smoke PASS.
2. Sử dụng tool `run_in_terminal` để chạy lệnh test theo từng chunk/spec: `npx playwright test demo_playwright/tests/ITa_functional/[tên-file].spec.ts`.
3. Đọc kết quả từ Terminal. Nếu có test case bị FAIL, bạn **PHẢI** phân tích nguyên nhân:
   - **Nếu là lỗi Test Code** (Sai locator, timeout do chờ sai element, logic test sai): Tự động dùng tool edit file để sửa lại code test và **chạy lại lệnh test**. (Lặp lại tối đa 3 lần).
   - **Nếu là Bug App** (FE/BE code sai logic so với tài liệu, API trả về 500, v.v.): Ghi nhận đây là Bug App. **TUYỆT ĐỐI KHÔNG** sửa test code để bypass lỗi của App.

### Phase 3: Report Generation (Xuất báo cáo)
1. Đọc file `demo_docs/tests/ITa/CHECKLIST_REPORT_ITa.md` để lấy format báo cáo chuẩn.
2. Tạo một file báo cáo mới lưu vào thư mục `test-results/ITa/` với tên `Report_ITa_[TênTínhNăng]_[YYYYMMDD].md`.
3. Nội dung báo cáo bắt buộc phải có:
   - Tổng số Test Cases đã chạy.
   - Kết quả Environment Gate: FE/BE URL đã check và trạng thái PASS/BLOCKED.
   - Kết quả Smoke Test: danh sách smoke case đã chạy và PASS/FAIL.
   - Số lượng Bug Test Code đã phát hiện và tự fix thành công trong quá trình chạy.
   - Số lượng Bug App phát hiện được (Kèm phân tích Root Cause: Lỗi do UI hay API? Sai ở Viewpoint nào?).
   - Verdict cuối cùng (PASS/FAIL).

### Phase 4: Ghi Log
- Ghi log toàn bộ quá trình vào `reports/AGENT_EXECUTION_LOG.md`. Cập nhật `cycle_checkpoint` thành `e2e` hoặc `qa_gate`.