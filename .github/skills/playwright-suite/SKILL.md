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
6. **Assertion (Rất quan trọng):**
   - **Với ITa:** Chú ý các tag `[UI]` (chỉ assert giao diện, không chờ API) và `[API]` (phải dùng `page.waitForResponse` để assert status code và response body).
   - **Với ITb:** Bắt buộc phải viết code verify DB khớp với `DB Confirmation Matrix` trong tài liệu.
7. Gọi `await captureEvidence(page, testInfo, 'Tên-Bước')` trước và sau các action chính để lưu lại bằng chứng UI.

### Bước 4 — Chạy thử và Phân tích kết quả (Analysis & Retry Loop)
1. Mở terminal, di chuyển vào `demo_playwright/`.
2. Chạy lệnh: `npx playwright test tests/{tên-file}.spec.ts`.
3. Nếu có test case bị FAIL, **BẮT BUỘC** phải phân tích nguyên nhân dựa trên log lỗi, trace, hoặc screenshot:
   - **Lỗi do Test Code (Flaky, sai locator, timeout, logic test sai):** Phải tiến hành fix lại code test (hoặc POM) và chạy lại riêng test case đó (`-g "Tên TC"`) cho đến khi PASS.
   - **Lỗi do Bug App (FE/BE code không đúng spec):** Ghi nhận lại thành Bug Report. KHÔNG sửa test code để bypass lỗi của app.
4. Lặp lại quá trình này cho đến khi tất cả các test case đều PASS, hoặc các test case FAIL đã được xác nhận chắc chắn là do Bug App.

## Output
```
### Files created/modified
- demo_playwright/page-objects/...
- demo_playwright/tests/...

### Test Scenarios
1. ...
2. ...

### Phân tích kết quả (Test Execution Report)
- Tổng số TC: X
- PASS: Y
- FAIL do Bug App: Z (Liệt kê chi tiết bug: TC ID, Expected, Actual)
- Lỗi Test Code đã fix: (Liệt kê các lỗi test code đã phát hiện và fix trong quá trình chạy)
```

---

## 📝 Ghi Log Bắt Buộc

Sau khi hoàn thành skill này, **PHẢI** ghi log vào `reports/AGENT_EXECUTION_LOG.md` trước khi báo cáo kết quả.

Dùng template sau (copy và điền vào):

```markdown
### [YYYY-MM-DD HH:mm:ss] - {be-agent | fe-agent | test-agent | playwright-agent | docs-agent}
- **Task**: {Mô tả ngắn gọn việc vừa làm}
- **Skill Used**: {tên skill này}
- **Target Feature**: {key trong PROJECT_MANIFEST.yml, ví dụ: auth_login}
- **Files Processed**:
  - `path/to/file` [Modified]
  - `path/to/file` [Verified/Unchanged]
- **Status**: SUCCESS | FAILED | PARTIAL
- **Notes**: {Ghi chú: findings, residual risks, việc chưa làm}
```

> ⚠️ Nếu bị interrupt, ghi `Status: PARTIAL` và ghi rõ đã làm đến bước nào.
> ⚠️ Sau khi ghi log, cập nhật `cycle_checkpoint` trong `PROJECT_MANIFEST.yml`.
