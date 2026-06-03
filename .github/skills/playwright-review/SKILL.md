---
name: playwright-review
description: "Workflow review Playwright E2E test code. Sử dụng sau khi viết xong test spec để đảm bảo tuân thủ đúng cấu trúc thư mục, evidence capture, và POM. Trigger phrases: review playwright test, check e2e test, review test code."
argument-hint: "Đường dẫn file test spec cần review"
---

# Skill: playwright-review

## Mục đích
Đánh giá và kiểm tra chất lượng của file Playwright test spec vừa được tạo, đảm bảo không mắc các lỗi phổ biến như sai thư mục, thiếu evidence, hoặc không dùng POM.

## Khi nào sử dụng
- Ngay sau khi hoàn thành việc viết code cho một file Playwright test spec.
- Khi user yêu cầu review lại test code E2E.

## Checklist Review (Bắt buộc kiểm tra từng mục)

### 1. Cấu trúc thư mục (Folder Structure)
- [ ] File test spec phải nằm đúng thư mục phân loại:
  - Test chức năng (ITa): `demo_playwright/tests/ITa_functional/`
  - Test luồng nghiệp vụ (ITb): `demo_playwright/tests/ITb_scenarios/`
- [ ] Tên file phải có đuôi `.spec.ts` hoặc `.spec.js`.

### 2. Bằng chứng kiểm thử (Evidence Capture)
- [ ] Phải import hàm `captureEvidence` từ `../../utils/evidence`.
- [ ] **Trước khi thao tác:** Phải gọi `await captureEvidence(page, testInfo, 'Ten-Buoc-Truoc-Action')` trước khi thực hiện các hành động chính (như click submit, điền form).
- [ ] **Sau khi thao tác/Kiểm tra kết quả:** Phải gọi `await captureEvidence(page, testInfo, 'Ten-Buoc-Sau-Action')` sau khi assert kết quả (`expect`).

### 3. Page Object Model (POM)
- [ ] Test spec KHÔNG được chứa các locator trực tiếp (ví dụ: `page.locator(...)`).
- [ ] Mọi tương tác với UI phải thông qua các methods và properties của class POM (ví dụ: `loginPage.emailInput.fill(...)`).

### 4. Bao phủ Kịch bản (Scenario Coverage)
- [ ] Các block `test()` phải tương ứng 1-1 với các `TC ID` trong tài liệu Test Case Markdown (ITa/ITb).
- [ ] Phải có đủ các phần: UI Validation, Happy Path, Negative Path (nếu có định nghĩa trong tài liệu).

### 5. Phân tích kết quả chạy Test (Execution Analysis)
- [ ] Nếu có test fail, đã phân loại rõ ràng nguyên nhân là do **Test Code** hay do **Bug App** chưa?
- [ ] Nếu lỗi do Test Code (sai locator, timeout, logic sai): Đã fix và chạy lại thành công chưa?
- [ ] Nếu lỗi do Bug App: Đã lập danh sách Bug Report rõ ràng (Expected vs Actual) để gửi lại cho team Dev chưa?

### 6. Dọn dẹp (Cleanup)
- [ ] Không để lại các thư mục rỗng hoặc file rác trong `demo_playwright/test-results/` hoặc `demo_playwright/playwright-report/` sau khi chạy test thành công.

## Hành động sau khi Review
- Nếu phát hiện lỗi (Fail checklist): Tự động sửa lại code hoặc di chuyển file cho đúng chuẩn.
- Nếu Pass toàn bộ: Báo cáo kết quả review cho user.
