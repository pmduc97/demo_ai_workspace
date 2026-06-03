# GitHub Copilot — Workspace Instructions
# Blog Hội An / Đà Nẵng

## Dự án
Blog tin tức về Hội An và Đà Nẵng.
- **Frontend**: React 18 + Vite + TailwindCSS + React Router v6 (`demo_source_fe/`)
- **Backend**: Node.js + Express + Knex.js + JWT (`demo_source_be/`)
- **Database**: PostgreSQL, 3 bảng: `users`, `categories`, `posts`
- **Test**: Jest + Supertest (`demo_source_be/src/__tests__/`)

## Quy tắc code — LUÔN tuân thủ

### Chung
- Không thêm comment trừ khi logic thực sự không rõ ràng
- Không thêm tính năng ngoài scope yêu cầu
- Validate input chỉ ở boundary (route handler), không validate lại trong service/controller
- Không dùng `var`, ưu tiên `const` > `let`

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
- API specs: `demo_docs/api/*.md` (22 endpoints)
- FE screen specs: `demo_docs/fe/*.md` (11 màn hình)
- DB schema: `demo_docs/database.md`

## Workflow AI (Full-Cycle)
Workspace này dùng quy trình: **create → review → correct → verify → qa_gate**

Các prompt workflow có sẵn tại `.github/prompts/`:
- `be-create.prompt.md` — Implement backend feature
- `be-review.prompt.md` — Review backend code
- `fe-create.prompt.md` — Implement frontend feature
- `fe-review.prompt.md` — Review frontend code
- `test-create.prompt.md` — Viết test suite
- `qa-gate.prompt.md` — QA gate check trước khi merge

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
