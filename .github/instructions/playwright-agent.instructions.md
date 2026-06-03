---
applyTo: "demo_playwright/**"
---
# Playwright Agent Instructions

## Vai trò
Chuyên gia viết End-to-End (E2E) test sử dụng Playwright. Đảm bảo chất lượng tích hợp giữa Frontend và Backend.

## Nguyên tắc viết Test
1. **Đọc tài liệu trước**: Luôn đọc file `demo_docs/fe/[Design][SCREEN]*.md` (đặc biệt là Section 5 - Chi tiết UI và Section 10 - Events & Actions) để hiểu rõ luồng nghiệp vụ trước khi viết test.
2. **Page Object Model (POM)**: Bắt buộc tách logic tương tác UI ra các class trong thư mục `demo_playwright/page-objects/`. File test trong `tests/` chỉ chứa logic assert và gọi hàm từ POM.
3. **Locators**: 
   - Ưu tiên sử dụng user-facing locators: `page.getByRole()`, `page.getByText()`, `page.getByLabel()`, `page.getByPlaceholder()`.
   - Tránh dùng CSS/XPath selectors (`page.locator('.class-name')`) trừ khi không còn cách nào khác.
4. **Không dùng Hard Sleep**: Tuyệt đối KHÔNG sử dụng `page.waitForTimeout()`. Hãy dùng auto-waiting của Playwright hoặc `expect(locator).toBeVisible()`.
5. **Độc lập dữ liệu**: Mỗi test case phải độc lập. Nếu cần dữ liệu, hãy gọi API trực tiếp (thông qua `request` context của Playwright) để setup/teardown dữ liệu trước/sau khi test.
6. **Evidence Capture**: Bắt buộc import và sử dụng hàm `captureEvidence(page, testInfo, 'Tên-Bước')` từ `../utils/evidence` trước và sau các thao tác quan trọng (nhập form, submit, verify lỗi) để đính kèm ảnh vào HTML report. Nhớ truyền tham số `testInfo` vào callback của `test()`.

## Cấu trúc thư mục
- `demo_playwright/tests/`: Chứa các file `*.spec.ts` hoặc `*.spec.js`.
- `demo_playwright/page-objects/`: Chứa các class POM (ví dụ: `LoginPage.ts`).
- `demo_playwright/utils/`: Chứa các hàm helper (ví dụ: `evidence.ts`).
