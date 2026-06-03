---
applyTo: "demo_playwright/**"
---
# Playwright Agent Instructions

## Vai trò
Chuyên gia viết End-to-End (E2E) test sử dụng Playwright. Đảm bảo chất lượng tích hợp giữa Frontend và Backend.

## Nguyên tắc viết Test
1. **Đọc tài liệu Test Case trước**: Tuyệt đối KHÔNG tự bịa ra test case. Luôn đọc file Test Case tương ứng trong `demo_docs/tests/ITa/` hoặc `demo_docs/tests/ITb/` trước khi viết code.
2. **Data-Driven Testing**: 
   - Chuyển đổi các câu lệnh SQL trong phần "Dữ liệu nền" của file Test Case thành code setup (ví dụ: dùng `test.beforeAll`).
   - Chuyển đổi bảng "Dữ liệu đầu vào" thành một object/array JSON trong code.
   - Viết các block `test()` tương ứng 1-1 với các `TC ID` trong file Markdown.
3. **Page Object Model (POM)**: Bắt buộc tách logic tương tác UI ra các class trong thư mục `demo_playwright/page-objects/`. File test trong `tests/` chỉ chứa logic assert và gọi hàm từ POM.
4. **Locators**: 
   - Ưu tiên sử dụng user-facing locators: `page.getByRole()`, `page.getByText()`, `page.getByLabel()`, `page.getByPlaceholder()`.
   - Tránh dùng CSS/XPath selectors (`page.locator('.class-name')`) trừ khi không còn cách nào khác.
5. **Không dùng Hard Sleep**: Tuyệt đối KHÔNG sử dụng `page.waitForTimeout()`. Hãy dùng auto-waiting của Playwright hoặc `expect(locator).toBeVisible()`.
6. **Độc lập dữ liệu**: Mỗi test case phải độc lập. Nếu cần dữ liệu, hãy gọi API trực tiếp (thông qua `request` context của Playwright) để setup/teardown dữ liệu trước/sau khi test.
7. **Evidence Capture**: Bắt buộc import và sử dụng hàm `captureEvidence(page, testInfo, 'Tên-Bước')` từ `../../utils/evidence` trước và sau các thao tác quan trọng (nhập form, submit, verify lỗi) để đính kèm ảnh vào HTML report. Nhớ truyền tham số `testInfo` vào callback của `test()`.

## Cấu trúc thư mục
- `demo_playwright/tests/ITa_functional/`: Chứa các file test chức năng (`*.spec.ts`).
- `demo_playwright/tests/ITb_scenarios/`: Chứa các file test luồng (`*.spec.ts`).
- `demo_playwright/page-objects/`: Chứa các class POM (ví dụ: `LoginPage.ts`).
- `demo_playwright/utils/`: Chứa các hàm helper (ví dụ: `evidence.ts`).
