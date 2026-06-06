# Kế hoạch Tích hợp "Superpowers" vào AI Workflow

Tài liệu này phác thảo kế hoạch áp dụng các phương pháp luận tiên tiến từ dự án `obra/superpowers` vào bộ khung AI workflow của dự án Blog Du Lịch. Kế hoạch được chia thành các hạng mục cụ thể kèm theo lộ trình áp dụng để bạn dễ dàng review và triển khai dần.

## 1. "Iron Law" trong Debugging & TDD (Kỷ luật thép)
**Mục tiêu:** Ép buộc AI tuân thủ nghiêm ngặt quy trình TDD và Systematic Debugging, loại bỏ hoàn toàn việc "đoán mò" (guess-and-check).
**Hành động:**
- **Cập nhật `test-agent.instructions.md`:** Thêm rule `IRON LAW: NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`. Bắt buộc AI phải viết test fail trước khi implement tính năng.
- **Cập nhật `be-agent.instructions.md` & `fe-agent.instructions.md`:** Thêm rule `IRON LAW: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST`. Khi fix bug, AI phải viết test tái hiện lỗi, tìm ra root cause rồi mới được sửa code.

## 2. Two-Stage Review Process (Review 2 giai đoạn)
**Mục tiêu:** Tách bạch việc kiểm tra logic nghiệp vụ và chất lượng code để AI không bị quá tải context (hallucination) khi review.
**Hành động:**
- **Cập nhật các file prompt review** (`.github/prompts/be-review.prompt.md`, `.github/prompts/fe-review.prompt.md`).
- Yêu cầu agent thực hiện review theo 2 bước tuần tự và rõ ràng:
  - **Bước 1: Spec Compliance Review:** Code có đáp ứng đúng 100% những gì tài liệu thiết kế (Markdown spec) yêu cầu không? (Không thừa tính năng, không thiếu logic).
  - **Bước 2: Code Quality Review:** Code có sạch, dễ bảo trì, đúng cấu trúc thư mục, tuân thủ SOLID/DRY không?

## 3. Condition-Based Waiting (Chờ theo điều kiện)
**Mục tiêu:** Loại bỏ các hàm `sleep` hoặc `timeout` cứng trong test E2E, giúp test chạy nhanh và ổn định hơn (chống flaky tests).
**Hành động:**
- **Cập nhật `playwright-agent.instructions.md`:** Nghiêm cấm sử dụng `page.waitForTimeout()`. Bắt buộc dùng `expect(locator).toBeVisible()` hoặc các hàm auto-wait của Playwright.
- **Tạo file tiện ích:** Có thể tạo thêm `demo_playwright/utils/waitUtils.ts` chứa các hàm `waitUntil(condition)` custom cho các case phức tạp.

## 4. Defense-in-Depth Validation (Validate nhiều lớp)
**Mục tiêu:** Tăng cường bảo mật và tính toàn vẹn dữ liệu cho Backend, tránh việc lọt dữ liệu rác.
**Hành động:**
- **Cập nhật `be-agent.instructions.md`:** Thay đổi rule hiện tại (chỉ validate ở boundary) thành validate nhiều lớp:
  - *Lớp 1 (Boundary):* Route/Middleware (Validate format, type bằng thư viện như Joi/Zod).
  - *Lớp 2 (Business):* Controller/Service (Validate logic nghiệp vụ, quyền truy cập).
  - *Lớp 3 (Data):* Database (Sử dụng Constraints, Foreign Keys chặt chẽ trong Knex migrations).

## 5. Persuasion Principles (Nguyên tắc thuyết phục AI)
**Mục tiêu:** Viết prompt/instruction hiệu quả hơn, "hack" tâm lý AI để ép tuân thủ rule 100%.
**Hành động:**
- **Review toàn bộ file `.instructions.md` và `SKILL.md`:**
  - Sử dụng *Authority*: Dùng các từ khóa mạnh mang tính mệnh lệnh tuyệt đối (`BẮT BUỘC`, `TUYỆT ĐỐI KHÔNG`, `IRON LAW`).
  - Sử dụng *Commitment*: Yêu cầu AI phải in ra một checklist kế hoạch và xác nhận trước khi bắt tay vào code các task phức tạp.

## 6. Test Polluter Identification (Dò tìm test gây ô nhiễm)
**Mục tiêu:** Đảm bảo các test case hoàn toàn độc lập, không để lại "rác" trong DB làm ảnh hưởng đến kết quả của test khác.
**Hành động:**
- **Tạo script tự động:** Viết một script (VD: `demo_source_be/scripts/find-polluter.js`) để tự động chạy từng test file và kiểm tra trạng thái DB trước/sau khi chạy.
- **Cập nhật `test-agent.instructions.md`:** Nhấn mạnh việc sử dụng `afterEach` hoặc `afterAll` để dọn dẹp DB (teardown) triệt để.

## 7. Receiving Code Review (Quy trình nhận Feedback)
**Mục tiêu:** Tránh việc AI trả lời "thảo mai" khi nhận feedback, ép AI tập trung vào fact kỹ thuật và sửa lỗi chính xác.
**Hành động:**
- **Cập nhật `copilot-instructions.md`:** Thêm rule khi AI nhận được feedback sửa lỗi từ user:
  - Không xin lỗi, không khen ngợi (VD: cấm nói "Bạn nói đúng quá", "Xin lỗi vì sự nhầm lẫn").
  - Tuân theo quy trình: `READ -> UNDERSTAND -> VERIFY -> EVALUATE -> RESPOND`.
  - Trả lời trực tiếp bằng fact kỹ thuật và báo cáo chính xác những dòng code/file nào đã được sửa.

---

## Lộ trình áp dụng đề xuất

Để không làm xáo trộn workflow hiện tại, tôi đề xuất áp dụng theo 3 Phase:

- **Phase 1 (Quick Wins - Dễ làm, hiệu quả ngay):** 
  - Áp dụng **(1) Iron Law**, **(5) Persuasion Principles**, và **(7) Receiving Code Review**.
  - *Cách làm:* Chỉ cần dùng tool edit để cập nhật các file `.instructions.md` và `copilot-instructions.md`.

- **Phase 2 (Quy trình - Cần sửa prompt):** 
  - Áp dụng **(2) Two-Stage Review** và **(4) Defense-in-Depth**.
  - *Cách làm:* Cập nhật lại nội dung các file `.prompt.md` và `SKILL.md` liên quan đến review và backend.

- **Phase 3 (Kỹ thuật - Cần code thêm tool/script):** 
  - Áp dụng **(3) Condition-Based Waiting** và **(6) Test Polluter Identification**.
  - *Cách làm:* Viết thêm code utility cho Playwright và script check DB cho Backend.
