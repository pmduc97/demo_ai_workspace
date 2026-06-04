---
description: Tự động hóa toàn bộ quy trình E2E Test ITb (Viết code, Chạy test, Tự fix lỗi test, và Xuất báo cáo).
---
# Prompt: playwright-itb-full-cycle

## Mô tả
Thực hiện chuỗi hành động khép kín cho mảng Automation Test ITb (Scenario): Viết code Playwright -> Tự review -> Chạy test qua Terminal -> Tự động fix lỗi Test Code -> Xuất báo cáo kết quả chuẩn Enterprise.

## Hướng dẫn cho AI
Bạn đang đóng vai trò là `playwright-agent`. Nhiệm vụ của bạn:

### Phase 1: Create & Review Test Code
1. Đọc file Test Case ITb của luồng do user chỉ định.
2. Áp dụng skill `.github/skills/playwright-suite/SKILL.md` để tạo file Test Spec (`.spec.ts`).
3. **Bắt buộc lập `Playwright Chunk Plan` trước khi generate code:** mỗi chunk khoảng 8-10 TC, tối đa 10 TC/spec file; chia theo bước luồng/pattern nghiệp vụ. Với bộ TC lớn, generate và chạy từng spec theo chunk, không tạo một spec file khổng lồ.
4. Tự review code: Đảm bảo đã viết code query DB để verify dữ liệu khớp với `DB Confirmation Matrix` và mỗi spec không vượt quá 10 TC.

### Phase 2: Execute & Self-Correct (Chạy Test & Tự sửa lỗi)
0. **Execution Gate bắt buộc trước khi chạy full/chunk suite:**
   - Kiểm tra BE available bằng health endpoint nếu có, hoặc endpoint public nhẹ như `GET http://localhost:3000/api/categories` / `GET http://localhost:3000/api/posts`.
   - Kiểm tra FE available bằng `GET http://localhost:5173/` hoặc `baseURL` trong `demo_playwright/playwright.config.ts`.
   - Nếu FE hoặc BE chưa chạy/không reachable: dừng ngay, report `BLOCKED: FE/BE not available`, không chạy full suite.
1. **Smoke test bắt buộc:** chạy 2-3 case nhỏ trước full suite/chunk lớn (home render, API public 200 hoặc login/admin auth, điều hướng màn hình target). Chỉ chạy tiếp nếu smoke PASS.
2. Sử dụng tool `run_in_terminal` để chạy lệnh test theo từng chunk/spec: `npx playwright test demo_playwright/tests/ITb_scenarios/[tên-file].spec.ts`.
3. Đọc kết quả từ Terminal. Nếu FAIL, phân tích nguyên nhân:
   - **Lỗi Test Code:** Tự động sửa lại code test và chạy lại (tối đa 3 lần).
   - **Bug App:** Ghi nhận đây là Bug App. TUYỆT ĐỐI KHÔNG sửa test code để bypass.

### Phase 3: Report Generation (Xuất báo cáo)
1. Đọc file `demo_docs/tests/ITb/CHECKLIST_REPORT_ITb.md` để lấy format báo cáo chuẩn.
2. Tạo file báo cáo lưu vào `test-results/ITb/Report_ITb_[TênLuồng]_[YYYYMMDD].md`.
3. Nội dung báo cáo phải có: Environment Gate, Smoke Test, Thống kê theo Pattern, DB Matrix Verification, Verdict (PASS/FAIL).

### Phase 4: Ghi Log
- Ghi log vào `reports/AGENT_EXECUTION_LOG.md`. Cập nhật `cycle_checkpoint` thành `qa_gate`.