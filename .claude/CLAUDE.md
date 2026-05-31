# CLAUDE.md — Blog Hội An / Đà Nẵng

## 🗂 Project Status
_Cập nhật: 2025-05-30_

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
| src/app.js | ✅ Xong | Express cơ bản, health check `/api/health` |
| Middlewares (auth, role) | ❌ Chưa làm | — |
| Routes | ❌ Chưa làm | — |
| Controllers | ❌ Chưa làm | — |
| Upload (Multer) | ❌ Chưa làm | — |
| DB migrate/seed chạy thực | ❌ Chưa chạy | Cần PostgreSQL DB `hoian_blog` |

### Frontend (`demo_source_fe/`)
| Phần | Status | Chi tiết |
|---|---|---|
| package.json + config | ✅ Xong | Vite, Tailwind, PostCSS |
| node_modules | ✅ Installed | — |
| src/main.jsx + App.jsx | ✅ Xong | Skeleton, chỉ có route `/` placeholder |
| src/services/api.js | ✅ Xong | axios + JWT interceptor |
| AuthContext | ❌ Chưa làm | — |
| Components (Navbar, Footer, PostCard...) | ❌ Chưa làm | — |
| Pages Public (HOME, CATEGORY...) | ❌ Chưa làm | — |
| Pages Admin | ❌ Chưa làm | — |
| ProtectedRoute | ❌ Chưa làm | — |

### Tests (`demo_test/`)
| Phần | Status | Chi tiết |
|---|---|---|
| Thư mục / setup | ❌ Chưa làm | — |

### Bước tiếp theo
1. Tạo DB PostgreSQL `hoian_blog`, chạy migrate + seed
2. Implement BE: middlewares → routes → controllers (theo thứ tự trong `demo_docs/api/`)
3. Implement FE: AuthContext → components → pages public → pages admin
4. Viết tests



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
