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
   - **Bắt buộc chia chunk trước khi generate spec:** mỗi spec file khoảng 8-10 TC, tối đa 10 TC. Nếu tài liệu có nhiều hơn 10 TC, tạo nhiều file spec theo nhóm nghiệp vụ/viewpoint thay vì một file lớn.
   - Pattern tên file: `{feature}.{chunk-index}-{chunk-name}.spec.ts`, ví dụ `admin-users.01-list-filter.spec.ts`, `admin-users.02-profile-edit.spec.ts`.
   - Mỗi chunk/spec phải có phạm vi rõ ràng và không phụ thuộc trạng thái chạy của chunk khác.
3. **Page Object Model (POM)**: Bắt buộc tách logic tương tác UI ra các class trong thư mục `demo_playwright/page-objects/`. File test trong `tests/` chỉ chứa logic assert và gọi hàm từ POM.
4. **Locators**: 
   - Ưu tiên sử dụng user-facing locators: `page.getByRole()`, `page.getByText()`, `page.getByLabel()`, `page.getByPlaceholder()`.
   - Tránh dùng CSS/XPath selectors (`page.locator('.class-name')`) trừ khi không còn cách nào khác.
5. **Không dùng Hard Sleep**: Tuyệt đối KHÔNG sử dụng `page.waitForTimeout()`. Hãy dùng auto-waiting của Playwright hoặc `expect(locator).toBeVisible()`.
6. **Độc lập dữ liệu**: Mỗi test case phải độc lập. Nếu cần dữ liệu, hãy gọi API trực tiếp (thông qua `request` context của Playwright) để setup/teardown dữ liệu trước/sau khi test.
7. **Evidence Capture**: Bắt buộc import và sử dụng hàm `captureEvidence(page, testInfo, 'Tên-Bước')` từ `../../utils/evidence` trước và sau các thao tác quan trọng (nhập form, submit, verify lỗi) để đính kèm ảnh vào HTML report. Nhớ truyền tham số `testInfo` vào callback của `test()`.

## Execution Gate trước khi chạy E2E
- Trước khi chạy bất kỳ full suite hoặc chunk suite nào, phải kiểm tra FE và BE đang available.
- Backend check: ưu tiên health endpoint nếu có; nếu không có, dùng endpoint công khai nhẹ như `GET http://localhost:3000/api/categories` hoặc `GET http://localhost:3000/api/posts`.
- Frontend check: dùng `GET http://localhost:5173/` hoặc `baseURL` trong `demo_playwright/playwright.config.ts`.
- Nếu FE hoặc BE chưa chạy/không reachable/không trả response hợp lệ: dừng ngay, ghi `BLOCKED: FE/BE not available`, liệt kê URL đã check, service lỗi, và yêu cầu start `demo_source_be` + `demo_source_fe`. Không chạy full suite và không classify lỗi này là Bug App/Test Code.
- Sau khi FE/BE available, bắt buộc chạy smoke test 2-3 case nhỏ trước full/chunk suite: home page render, login/admin auth hoặc API public 200, và điều hướng tới màn hình target nếu có.
- Chỉ khi smoke test PASS mới chạy toàn bộ chunk/spec. Nếu smoke FAIL, dừng full suite, phân tích root cause Environment/App/Test Code và ghi vào report.

## Chunking Rule cho bộ TC lớn
- Trước khi viết code, tạo `Playwright Chunk Plan` gồm: chunk index, chunk name, danh sách TC ID, spec file dự kiến, setup data dùng chung.
- Nhóm TC khuyến nghị: list/filter/pagination, profile edit, role/status, create/delete, permission/auth, security/error, concurrency.
- Không vượt quá 10 TC trong một spec file. Nếu một nhóm có hơn 10 TC, tách tiếp thành `part-1`, `part-2`.
- Chạy và sửa lỗi theo từng spec file để giảm flaky và dễ root cause.

## Cấu trúc thư mục
- `demo_playwright/tests/ITa_functional/`: Chứa các file test chức năng (`*.spec.ts`).
- `demo_playwright/tests/ITb_scenarios/`: Chứa các file test luồng (`*.spec.ts`).
- `demo_playwright/page-objects/`: Chứa các class POM (ví dụ: `LoginPage.ts`).
- `demo_playwright/utils/`: Chứa các hàm helper (ví dụ: `evidence.ts`).
