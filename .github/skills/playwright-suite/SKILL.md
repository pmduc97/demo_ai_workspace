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

### Bước 1 — Đọc tài liệu thiết kế
1. Tìm và đọc file `demo_docs/fe/[Design][SCREEN] {ScreenCode}_*.md` tương ứng với tính năng.
2. Tập trung vào **Section 5 (Chi tiết UI)** để biết các control cần tương tác.
3. Tập trung vào **Section 10 (Events & Actions)** để biết luồng logic và kết quả mong đợi.

### Bước 2 — Tạo Page Object Model (POM)
1. Tạo file class trong `demo_playwright/page-objects/` (ví dụ: `LoginPage.js`).
2. Định nghĩa các locators trong `constructor` (ưu tiên `getByRole`, `getByLabel`).
3. Định nghĩa các methods đại diện cho hành động của user (ví dụ: `async login(email, password)`).

### Bước 3 — Viết Test Spec
1. Tạo file test trong `demo_playwright/tests/` (ví dụ: `auth-login.spec.ts`).
2. Import class POM vừa tạo và hàm `captureEvidence` từ `../utils/evidence`.
3. Viết các test cases (ít nhất 1 case thành công và 1 case thất bại/edge case). Nhớ truyền `testInfo` vào callback.
4. Sử dụng `expect` để assert kết quả (ví dụ: URL thay đổi, thông báo lỗi xuất hiện).
5. Gọi `await captureEvidence(page, testInfo, 'Tên-Bước')` trước và sau các action chính để lưu lại bằng chứng UI.

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
