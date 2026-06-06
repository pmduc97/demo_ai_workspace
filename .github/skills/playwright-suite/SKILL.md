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
0. Đọc `.github/knowledge/playwright-lessons.md` trước để áp dụng các bài học phòng tránh lỗi lặp lại.
1. Tìm và đọc file Test Case tương ứng trong `demo_docs/tests/ITa/` hoặc `demo_docs/tests/ITb/`.
2. **Tuyệt đối không tự bịa ra test case.** Phải bám sát 100% các kịch bản (UI Validation, Happy Path, Negative Path) và dữ liệu test (Test Data) đã được định nghĩa trong file Markdown.
3. **Bắt buộc xác định route/navigation từ tài liệu và code trước khi viết smoke/spec:**
   - Đọc `demo_docs/fe/[Design][LIST] SCREEN_DanhSachManHinh.md` và FE screen spec tương ứng.
   - Confirm route thực tế trong `demo_source_fe/src/App.jsx`.
   - Nếu route docs khác code, dừng và report `Docs-Code Mismatch` thay vì tự chọn route.
   - Không dùng text tiếng Việt có dấu làm assertion gate chính trong smoke/navigation; ưu tiên URL, role, placeholder, button/input chức năng, API response.
4. **Bắt buộc chia nhỏ test theo chunk trước khi viết code:**
   - Lập bảng `Playwright Chunk Plan` từ danh sách TC trong tài liệu.
   - Mỗi chunk khoảng **8-10 TC**, tối đa **10 TC/spec file**. Nếu feature có nhiều hơn 10 TC thì phải tạo nhiều file `.spec.ts` riêng.
   - Ưu tiên chia theo nhóm nghiệp vụ/viewpoint: `list-filter-pagination`, `profile-edit`, `role-status`, `create-delete`, `permission-auth`, `security-error`, `concurrency`.
   - Không trộn ITa và ITb trong cùng một spec file.
   - Mỗi spec file chỉ chứa TC thuộc đúng chunk đã định nghĩa; không generate một file spec khổng lồ cho toàn bộ feature.
   - Đặt tên file theo pattern: `{feature}.{chunk-index}-{chunk-name}.spec.ts`, ví dụ `admin-users.01-list-filter.spec.ts`.
   - Nếu user chỉ yêu cầu một chunk cụ thể, chỉ viết spec cho chunk đó và ghi rõ các chunk còn lại là backlog.

### Bước 2 — Tạo Page Object Model (POM)
1. Tạo file class trong `demo_playwright/page-objects/` (ví dụ: `LoginPage.js`).
2. Định nghĩa các locators trong `constructor` (ưu tiên `getByRole`, `getByLabel`).
3. Định nghĩa các methods đại diện cho hành động của user (ví dụ: `async login(email, password)`).

### Bước 3 — Viết Test Spec (Data-Driven)
1. Tạo file test trong `demo_playwright/tests/ITa_functional/` (nếu là ITa) hoặc `demo_playwright/tests/ITb_scenarios/` (nếu là ITb). Nếu tổng TC > 10, tạo nhiều spec theo `Playwright Chunk Plan`, mỗi file khoảng 8-10 TC.
2. Import class POM vừa tạo và hàm `captureEvidence` từ `../../utils/evidence`.
3. **Setup Data:** Chuyển đổi các câu lệnh SQL trong phần "Dữ liệu nền" của file Test Case thành code setup (ví dụ: dùng `test.beforeAll` để gọi DB hoặc API setup).
4. **Input Data:** Chuyển đổi bảng "Dữ liệu đầu vào" thành một object/array JSON trong code.
5. **Test Cases:** Viết các block `test()` tương ứng 1-1 với các `TC ID` trong file Markdown. Truyền đúng `Data ID` vào test. Mỗi spec file chỉ được chứa tối đa 10 block `test()` nghiệp vụ; nếu cần helper/setup chung, tách vào fixture/helper để tránh phình file.
6. **Assertion (Rất quan trọng):**
   - **Với ITa:** Chú ý các tag `[UI]` (chỉ assert giao diện, không chờ API) và `[API]` (phải dùng `page.waitForResponse` để assert status code và response body).
   - **Với ITb:** Bắt buộc phải viết code verify DB khớp với `DB Confirmation Matrix` trong tài liệu.
7. Gọi `await captureEvidence(page, testInfo, 'Tên-Bước')` trước và sau các action chính để lưu lại bằng chứng UI.

### Bước 4 — Chạy thử và Phân tích kết quả (Analysis & Retry Loop)
1. Mở terminal, di chuyển vào `demo_playwright/`.
2. **Execution Gate bắt buộc:** kiểm tra backend và frontend đang available trước khi chạy E2E.
   - Backend: gọi health endpoint nếu có, hoặc endpoint công khai nhẹ như `GET http://localhost:3000/api/categories` / `GET http://localhost:3000/api/posts`.
   - Frontend: gọi `GET http://localhost:5173/` hoặc `baseURL` trong `demo_playwright/playwright.config.ts`.
   - Nếu FE hoặc BE chưa chạy/không reachable/không trả response hợp lệ: dừng ngay, ghi `BLOCKED: FE/BE not available`, không chạy full suite và không tính là bug app/test code.
3. **Smoke test bắt buộc trước full/chunk suite:** chạy 2-3 case nhỏ để xác nhận môi trường ổn định, tối thiểu gồm home page render, login/admin auth hoặc API public trả 200, và điều hướng tới màn hình target nếu có.
   - Nếu smoke FAIL: dừng, phân tích Environment/App/Test Code, ghi report; không chạy full suite để tránh lỗi hàng loạt.
   - Chỉ khi smoke PASS mới chạy tiếp từng chunk/spec.
   - Smoke phải tuân thủ `.github/knowledge/playwright-lessons.md`: route trace từ docs/code, assertion gate không phụ thuộc text tiếng Việt có dấu, fail fast khi API/environment treo.
4. Chạy test theo từng chunk/spec file, không chạy cả feature lớn ngay từ đầu: `npx playwright test tests/{ITa_functional|ITb_scenarios}/{tên-file}.spec.ts`.
5. Nếu có test case bị FAIL, **BẮT BUỘC** phải phân tích nguyên nhân dựa trên log lỗi, trace, hoặc screenshot:
   - **Lỗi do Test Code (Flaky, sai locator, timeout, logic test sai):** Phải tiến hành fix lại code test (hoặc POM) và chạy lại riêng test case đó (`-g "Tên TC"`) cho đến khi PASS.
   - **Lỗi do Bug App (FE/BE code không đúng spec):** Ghi nhận lại thành Bug Report. KHÔNG sửa test code để bypass lỗi của app.
6. Lặp lại quá trình này cho đến khi tất cả các test case đều PASS, hoặc các test case FAIL đã được xác nhận chắc chắn là do Bug App.
7. **KHÔNG tự động chạy `npx playwright show-report`**. Chỉ cần verify, phân tích log/trace, fix test code và chạy lại. Nếu là bug app thì tổng hợp report 1 lần ở cuối. User sẽ tự mở report nếu cần.

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
- Environment Gate: PASS | BLOCKED (FE/BE URL đã kiểm tra)
- Smoke Test: PASS | FAIL (case đã chạy)
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
