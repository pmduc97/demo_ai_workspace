# GitHub Copilot — Workspace Instructions
# Blog Du Lịch

## Dự án
Blog tin tức về du lịch Việt Nam và các điểm đến du lịch.
- **Frontend**: React 18 + Vite + TailwindCSS + React Router v6 (`demo_source_fe/`)
- **Backend**: Node.js + Express + Knex.js + JWT (`demo_source_be/`)
- **Database**: PostgreSQL, 3 bảng: `users`, `categories`, `posts`
- **Unit Test**: Jest + Supertest (`demo_source_be/src/__tests__/`)
- **E2E Test**: Playwright (`demo_playwright/`)

## Quy tắc code — LUÔN tuân thủ

### Chung
- Không thêm comment trừ khi logic thực sự không rõ ràng
- Không thêm tính năng ngoài scope yêu cầu
- Validate dữ liệu nhiều lớp (Defense-in-Depth): Boundary (Route/Middleware) -> Business (Controller/Service) -> Data (Database Constraints).
- Không dùng `var`, ưu tiên `const` > `let`

### Receiving Code Review (Quy trình nhận Feedback)
- **TUYỆT ĐỐI KHÔNG** xin lỗi hay khen ngợi khi nhận được feedback sửa lỗi từ user (VD: cấm nói "Bạn nói đúng quá", "Xin lỗi vì sự nhầm lẫn").
- **BẮT BUỘC** tuân theo quy trình: `READ -> UNDERSTAND -> VERIFY -> EVALUATE -> RESPOND`.
- Trả lời trực tiếp bằng fact kỹ thuật và báo cáo chính xác những dòng code/file nào đã được sửa.

### Terminal & Process Management (NGHIÊM CẤM VI PHẠM)
- **TUYỆT ĐỐI KHÔNG** sử dụng các lệnh kill process hàng loạt như `Stop-Process -Name node -Force`, `killall node`, hoặc `taskkill /IM node.exe /F`. Điều này sẽ làm sập các dự án khác đang chạy trên máy user.
- **BẮT BUỘC**: Khi cần tắt một server bị kẹt port (ví dụ 3000, 3001), phải tìm chính xác PID đang giữ port đó và chỉ kill đúng PID đó.
  - Ví dụ: `netstat -ano | findstr :3000` -> Lấy PID -> `Stop-Process -Id <PID> -Force`.

### Backend (`demo_source_be/`)
- Framework: Express, query builder: Knex.js — không dùng ORM khác
- Auth: JWT (access token), password: bcrypt
- Upload ảnh: Multer, lưu vào `uploads/`
- Middleware auth: `src/middlewares/auth.js`, role check: `src/middlewares/role.js`
- Route prefix: `/api/*`, admin routes: `/api/admin/*`
- Error format chuẩn: `{ message: string, details?: any }`
- Status code: 200/201 success, 400 bad request, 401 unauthorized, 403 forbidden, 404 not found, 422 validation, 500 server error
- Mọi thay đổi API phải khớp `demo_docs/api/`
- Mọi thay đổi schema phải khớp `demo_docs/database.md`

### Frontend (`demo_source_fe/`)
- Styling: TailwindCSS — không dùng CSS module, styled-components, hay inline style
- HTTP client: axios, tập trung trong `src/services/api.js`
- Auth state: React Context tại `src/context/AuthContext.jsx`
- Rich text editor: TipTap
- Route guard: `src/components/ProtectedRoute.jsx`
- UI/flow bám theo `demo_docs/fe/*.md`
- API call luôn có loading/success/error state
- Xử lý empty state khi không có dữ liệu
- Responsive cơ bản desktop/mobile

### Database
- Role: `'admin'` | `'member'`
- Post status: `'draft'` | `'published'`
- Migrations và seeds dùng Knex CLI

## Cấu trúc tài liệu
- API specs: `demo_docs/api/[Design][API] API{ID}_{Group}_{Name}.md` (22 endpoints)
- FE screen specs: `demo_docs/fe/[Design][SCREEN] {ScreenCode}_{ScreenName}.md` (11 màn hình)
- DB schema: `demo_docs/[Design][DB] DATABASE_Schema.md`
- Danh sách API: `demo_docs/api/[Design][LIST] API_DanhSachEndpoint.md`
- Danh sách màn hình: `demo_docs/fe/[Design][LIST] SCREEN_DanhSachManHinh.md`

## Quản lý Trạng thái & Truy vết (State & Traceability)
- **`PROJECT_MANIFEST.yml`**: Bản đồ map 1-1 giữa Feature -> Docs -> Code -> DB -> Test. Mọi Agent phải đọc file này để lấy context thay vì scan repo.
- **`reports/AGENT_EXECUTION_LOG.md`**: Nơi ghi log bắt buộc sau mỗi lần Agent hoàn thành một task.

## Workflow AI (Full-Cycle)
Workspace này dùng quy trình: **plan → docs → workflow → test_design → create → review → test_execution → qa_gate**

Các prompt workflow liên hoàn (Create & Review) có sẵn tại `.github/prompts/`:
- `doc-fe-create-and-review.prompt.md` — Tạo và review tài liệu FE
- `doc-be-create-and-review.prompt.md` — Tạo và review tài liệu BE
- `doc-workflow-create-and-review.prompt.md` — Tạo và review tài liệu Workflow (Business Flow)
- `doc-ita-create-and-review.prompt.md` — Tạo và review Test Case ITa (dùng MCP)
- `doc-itb-create-and-review.prompt.md` — Tạo và review Test Case ITb (dùng MCP)
- `fe-create-and-review.prompt.md` — Code và review Frontend
- `be-create-and-review.prompt.md` — Code và review Backend
- `test-create-and-review.prompt.md` — Viết Unit Test, tự chạy và tự sửa lỗi
- `playwright-ita-full-cycle.prompt.md` — Viết E2E Test ITa, tự chạy, tự sửa lỗi và xuất báo cáo
- `playwright-itb-full-cycle.prompt.md` — Viết E2E Test ITb, tự chạy, tự sửa lỗi và xuất báo cáo
- `qa-gate.prompt.md` — QA gate check trước khi merge

Ngoài ra, bạn vẫn có thể dùng các prompt đơn lẻ nếu chỉ muốn thực hiện một bước:
- `be-create.prompt.md`, `be-review.prompt.md`
- `fe-create.prompt.md`, `fe-review.prompt.md`
- `test-create.prompt.md`, `playwright-create.prompt.md`
- `doc-ita-create.prompt.md`, `doc-ita-review.prompt.md`
- `doc-itb-create.prompt.md`, `doc-itb-review.prompt.md`

## Lệnh thường dùng (Windows)
```powershell
# Backend
cd demo_source_be
npm run dev
npx knex migrate:latest
npx knex seed:run
npm test

# Frontend
cd demo_source_fe
npm run dev
npm run build
```
