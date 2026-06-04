# Playwright Knowledge Base — Lỗi hay gặp & hành động phòng tránh

## Mục đích
File này lưu các bài học khi viết/chạy Playwright để tránh lặp lại lỗi test code, đặc biệt trong full-cycle ITa/ITb.

## Bài học bắt buộc áp dụng

### 1. Không hardcode route theo cảm tính
- Trước khi tạo navigation/smoke test, phải đọc route từ:
  1. `PROJECT_MANIFEST.yml`
  2. `demo_docs/fe/[Design][LIST] SCREEN_DanhSachManHinh.md`
  3. FE screen design tương ứng trong `demo_docs/fe/`
  4. `demo_source_fe/src/App.jsx` để confirm code thực tế
- Nếu docs và code khác nhau, dừng và report `Docs-Code Mismatch`; không tự chọn route.
- Ví dụ đúng: màn quản lý người dùng dùng `/admin/users`.

### 2. Smoke test phải kiểm tra môi trường trước full suite
- Chỉ chạy full/chunk suite sau khi:
  - BE endpoint nhẹ trả 200.
  - FE home/baseURL trả 200/render được.
  - Route target truy cập được sau auth.
- Nếu smoke fail, dừng full suite và phân loại Environment/App/Test Code.

### 3. Tránh assertion chính bằng text tiếng Việt có dấu
- Trên Windows/terminal có thể bị mojibake khi regex/string tiếng Việt có dấu trong source/log.
- Smoke/navigation assertion nên ưu tiên:
  - `expect(page).toHaveURL(...)`
  - role/placeholder/label ổn định
  - button/input chức năng
  - API response status/body
- Chỉ dùng text tiếng Việt có dấu khi đã chắc file encoding UTF-8 và đó không phải assertion gate chính.

### 4. Không dùng Playwright request cho environment gate nếu request bị treo
- Nếu `request.get()` bị timeout/hang ở smoke/environment gate, dùng `fetch` với `AbortController` timeout ngắn để fail fast.
- Environment gate phải fail nhanh, không để kéo dài làm nhiễu kết quả full cycle.
- Không tự đổi giữa `localhost` và `127.0.0.1` theo cảm tính. Phải verify bằng endpoint thật trước:
  - `Invoke-WebRequest http://localhost:<port>/...`
  - `Invoke-WebRequest http://127.0.0.1:<port>/...`
- Với Vite chỉ hiển thị `Local: http://localhost:3000/`, ưu tiên dùng `localhost` cho FE `baseURL`/`webServer.url`. Có môi trường `127.0.0.1:3000` không reachable dù browser truy cập `localhost:3000` bình thường.
- API helper phải cùng host convention với môi trường đã verify; không đổi sang `127.0.0.1` nếu `localhost` đang PASS.

### 5. Sau UI login, tránh direct `page.goto()` vào protected route ngay lập tức
- Với React AuthContext/ProtectedRoute, sau khi login UI navigate tới dashboard, direct `page.goto('/admin/users')` ngay có thể bị race với `/auth/me` hoặc state hydrate và quay lại dashboard/login.
- Smoke route target sau auth nên ưu tiên điều hướng bằng link trong app:
  - `await page.locator('a[href="/admin/users"]').first().click()`
  - sau đó assert `expect(page).toHaveURL(/\/admin\/users/)`
- Nếu cần direct route, seed auth trước khi app load bằng `addInitScript` và verify `/auth/me` trả đúng role, hoặc chờ rõ ràng auth context ổn định.
- Không assert gate bằng heading tiếng Việt có dấu; sau navigation nên assert thêm element chức năng ổn định như search input, create button, table/action button.

### 6. Chạy Playwright đúng working directory
- Luôn chạy từ `demo_playwright/`.
- Không chạy `npx playwright ... demo_playwright/tests/...` khi current directory là workspace root vì có thể load sai dependency/config.
- Lệnh đúng ví dụ: `npx playwright test tests/smoke/admin-users.smoke.spec.ts`.

### 7. Review test spec phải kiểm tra lại các lỗi trên
- Mỗi spec/smoke mới phải được review theo checklist này trước khi chạy full suite.
- Nếu phát hiện locator/route/assertion có rủi ro, sửa test code trước khi execution.
