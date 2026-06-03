---
name: playwright-suite
description: "E2E test writing workflow using Playwright. Use when creating a new E2E test suite for a feature. Ensures POM usage, proper locators, and verification. Trigger phrases: write playwright test, create e2e suite, test e2e."
argument-hint: "Tên tính năng hoặc ScreenCode cần test (e.g. auth_login, ADMIN_LOGIN)"
---

# Playwright Suite Skill

## Mục tiêu
Viết một bộ test E2E hoàn chỉnh cho một tính năng, áp dụng Page Object Model (POM) và đảm bảo test chạy thành công.

## Khi nào dùng
- Sau khi tính năng đã được implement xong cả FE và BE.
- Khi cần bổ sung E2E test cho một luồng nghiệp vụ quan trọng.

## Procedure

### Bước 1 — Đọc tài liệu Test Case (ITa/ITb)
1. Tìm và đọc file Test Case tương ứng trong `demo_docs/tests/ITa/` hoặc `demo_docs/tests/ITb/`.
2. **Tuyệt đối không tự bịa ra test case.** Phải bám sát 100% các kịch bản (UI Validation, Happy Path, Negative Path) và dữ liệu test (Test Data) đã được định nghĩa trong file Markdown.

### Bước 2 — Tạo Page Object Model (POM)
1. Tạo file class trong `demo_playwright/page-objects/` (ví dụ: `LoginPage.js`).
2. Định nghĩa các locators trong `constructor` (ưu tiên `getByRole`, `getByLabel`).
3. Định nghĩa các methods đại diện cho hành động của user (ví dụ: `async login(email, password)`).

### Bước 3 — Viết Test Spec (Data-Driven)
1. Tạo file test trong `demo_playwright/tests/ITa_functional/` (nếu là ITa) hoặc `demo_playwright/tests/ITb_scenarios/` (nếu là ITb).
2. Import class POM vừa tạo và hàm `captureEvidence` từ `../../utils/evidence`.
3. **Setup Data:** Chuyển đổi các câu lệnh SQL trong phần "Dữ liệu nền" của file Test Case thành code setup (ví dụ: dùng `test.beforeAll` để gọi DB hoặc API setup).
4. **Input Data:** Chuyển đổi bảng "Dữ liệu đầu vào" thành một object/array JSON trong code.
5. **Test Cases:** Viết các block `test()` tương ứng 1-1 với các `TC ID` trong file Markdown. Truyền đúng `Data ID` vào test.
6. Sử dụng `expect` để assert kết quả (UI, API response, DB state) đúng như "Kết quả mong đợi" trong tài liệu.
7. Gọi `await captureEvidence(page, testInfo, 'Tên-Bước')` trước và sau các action chính để lưu lại bằng chứng UI.

### Bước 4 — Chạy thử và Verify
1. Mở terminal, di chuyển vào `demo_playwright/`.
2. Chạy lệnh: `npx playwright test tests/{tên-file}.spec.js`.
3. Nếu test fail, đọc log lỗi và sửa lại code test hoặc POM cho đến khi pass.

## Output
```
### Files created/modified
- demo_playwright/page-objects/...
- demo_playwright/tests/...

### Test Scenarios
1. ...
2. ...

### Verify result
npx playwright test -> PASS
```
