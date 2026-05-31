# CLAUDE.md — Blog Hội An / Đà Nẵng

## 🗂 Project Status
_Cập nhật: 2026-05-31_

### Docs (`demo_docs/`)
| Phần | Status | Chi tiết |
|---|---|---|
| FE screen-list | ✅ Xong | 11 màn hình, `demo_docs/fe/screen-list.md` |
| FE detail design | ✅ Xong | 11 file md (HOME, CATEGORY, POST_DETAIL, ABOUT, CONTACT, ADMIN_LOGIN, ADMIN_DASHBOARD, ADMIN_POST_LIST, ADMIN_POST_FORM, ADMIN_CATEGORY_LIST, ADMIN_USER_LIST) |
| API list | ✅ Xong | 22 endpoint, `demo_docs/api/api-list.md` |
| API detail design | ✅ Xong | 22 file md |

### Backend (`demo_source_be/`)
| Phần | Status | Chi tiết |
|---|---|---|
| package.json + scripts | ✅ Xong | dev, migrate, seed |
| knexfile.js + DB config | ✅ Xong | PostgreSQL, dotenv |
| Migrations | ✅ Xong | users, categories, posts |
| Seeds | ✅ Xong | 2 users, 3 categories, 3 posts mẫu |
| node_modules | ✅ Installed | — |
| src/app.js | ✅ Xong | Express + routes mount + error handler |
| Middlewares (auth, role, validate) | ✅ Xong | `src/middlewares/` |
| Routes | ✅ Xong | auth, posts, categories, admin, upload |
| Controllers | ✅ Xong | auth, posts, categories, users, upload |
| Upload (Multer) | ✅ Xong | `src/controllers/upload.controller.js` |
| DB migrate/seed chạy thực | ❌ Chưa chạy | Cần PostgreSQL DB `hoian_blog` |

### Frontend (`demo_source_fe/`)
| Phần | Status | Chi tiết |
|---|---|---|
| package.json + config | ✅ Xong | Vite, Tailwind, PostCSS |
| node_modules | ✅ Installed | — |
| src/main.jsx + App.jsx | ✅ Xong | BrowserRouter + AuthProvider + routes đầy đủ |
| src/services/api.js | ✅ Xong | axios + JWT interceptor |
| AuthContext | ❌ Chưa làm | `src/context/AuthContext.jsx` |
| Components (Navbar, Footer, PostCard...) | ❌ Chưa làm | — |
| Pages Public (HOME, CATEGORY...) | ❌ Chưa làm | — |
| Pages Admin | ❌ Chưa làm | — |
| ProtectedRoute | ❌ Chưa làm | `src/components/ProtectedRoute.jsx` |

### Tests (`demo_source_be/src/__tests__/`)
| Phần | Status | Chi tiết |
|---|---|---|
| health.test.js | ✅ Xong | Smoke test `/api/health` |
| Auth/Posts/Categories/Admin tests | ❌ Chưa làm | — |

### AI Full-Cycle Framework
| Phần | Status | Chi tiết |
|---|---|---|
| agents/ (6 agents) | ✅ Xong | be, fe, test, docs, qa, orchestrator + verify |
| skills/ (15 skills) | ✅ Xong | 5 domain × 3 phase (create/review/correct) |
| scripts/run_cycle_v5.sh | ✅ Xong | V5 AI-driven orchestrator |
| scripts/run_cycle.sh | ✅ Xong | V4 command-driven orchestrator |
| scripts/agent_runner.sh | ✅ Xong | Phase plan executor |
| .agents/tasks.v5.json | ✅ Xong | 4 tasks: be, fe, test-suite, docs-sync |
| .agents/tasks.json | ✅ Xong | 4 tasks: be, fe, docs-db-sync, test-suite |
| docs/ (3 files) | ✅ Xong | playbook, v5-runtime, skills-mapping |

### Bước tiếp theo
1. Tạo DB PostgreSQL `hoian_blog`, chạy migrate + seed
2. Implement FE: AuthContext → ProtectedRoute → components → pages public → pages admin
3. Viết tests: auth, posts, categories, admin endpoints
4. Chạy `bash scripts/run_cycle_v5.sh` để verify toàn bộ cycle



## Dự án
Blog tin tức về Hội An và Đà Nẵng. Stack: React 18 + Vite (FE), Express + Knex (BE), PostgreSQL (DB).

## Cấu trúc
- `demo_source_fe/` — React frontend
- `demo_source_be/` — Express backend
- `demo_docs/` — Tài liệu (ERD, API spec)
- `demo_test/` — Jest + Supertest

## Quy tắc code

### Chung
- Không thêm comment trừ khi logic thực sự không rõ ràng
- Không thêm tính năng ngoài yêu cầu
- Validate input chỉ ở boundary (route handler), không validate lại trong service

### Backend (demo_source_be)
- Framework: Express, query builder: Knex.js
- Auth: JWT (access token), password: bcrypt
- Upload ảnh: Multer, lưu vào `uploads/`
- Middleware auth: `src/middlewares/auth.js`, role check: `src/middlewares/role.js`
- Route prefix: `/api/*`, admin routes: `/api/admin/*`

### Frontend (demo_source_fe)
- Styling: TailwindCSS — không dùng CSS module hay styled-components
- HTTP client: axios, tập trung trong `src/services/`
- Auth state: React Context (`src/context/AuthContext.jsx`)
- Rich text editor: TipTap

## Database
- Migrations và seeds dùng Knex CLI
- 3 bảng chính: `users`, `categories`, `posts`
- Role: `'admin'` | `'member'`
- Post status: `'draft'` | `'published'`

## Lệnh thường dùng
```bash
# BE
cd demo_source_be
npm run dev          # nodemon
npx knex migrate:latest
npx knex seed:run

# FE
cd demo_source_fe
npm run dev
npm run build
```
