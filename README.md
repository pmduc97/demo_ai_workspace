# Blog Tin Tức Hội An - Đà Nẵng

Blog tin tức về Hội An và thành phố Đà Nẵng. Giao diện thân thiện người dùng, có trang quản lý admin để đăng tin.

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + React Router v6 |
| Rich Text | TipTap |
| Backend | Node.js + Express + JWT |
| Database | PostgreSQL + Knex.js |
| Upload ảnh | Multer (local `/uploads`) |
| Auth | JWT + bcrypt |

## Cấu trúc thư mục

```
demo_workspace/
├── demo_source_fe/          # React app
│   └── src/
│       ├── pages/
│       │   ├── public/      # Home, Category, PostDetail, About, Contact
│       │   └── admin/       # Dashboard, PostList, PostForm, UserList
│       ├── components/      # Navbar, Footer, PostCard, RichEditor...
│       ├── services/        # axios API calls
│       └── context/         # AuthContext
│
├── demo_source_be/          # Express app
│   └── src/
│       ├── routes/          # auth, posts, categories, users, upload
│       ├── controllers/
│       ├── middlewares/     # auth.js, role.js
│       └── db/
│           ├── migrations/
│           └── seeds/
│
├── demo_docs/               # Tài liệu: ERD, API spec, wireframe
└── demo_test/               # Test cases (Jest + Supertest)
```

## Database Schema

```sql
users        (id, email, password_hash, name, role: 'admin'|'member', created_at)
categories   (id, name, slug, description)
posts        (id, title, slug, content, thumbnail_url, status: 'draft'|'published',
              author_id → users, category_id → categories, created_at, updated_at)
```

## API Endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`

### Posts (public)
- `GET /api/posts` — danh sách, filter by category, pagination
- `GET /api/posts/:slug` — chi tiết

### Posts (member+)
- `POST /api/posts` — tạo bài
- `PUT /api/posts/:id` — sửa bài của mình
- `DELETE /api/posts/:id` — xóa bài của mình

### Posts (admin)
- `PUT /api/admin/posts/:id/status` — duyệt/ẩn bài
- `DELETE /api/admin/posts/:id` — xóa bất kỳ

### Categories (admin)
- `GET/POST/PUT/DELETE /api/categories`

### Users (admin)
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`

### Upload
- `POST /api/upload`

## Giao diện

### Public Site
| Route | Trang |
|---|---|
| `/` | Homepage: banner, bài nổi bật, bài mới nhất |
| `/category/:slug` | Danh sách bài theo danh mục |
| `/post/:slug` | Chi tiết bài viết |
| `/about` | Giới thiệu blog |
| `/contact` | Form liên hệ |

### Admin Panel (`/admin/*`)
| Route | Trang |
|---|---|
| `/admin/login` | Đăng nhập |
| `/admin/dashboard` | Thống kê tổng quan |
| `/admin/posts` | Danh sách bài, filter, duyệt/ẩn |
| `/admin/posts/new` | Tạo bài mới (TipTap editor) |
| `/admin/posts/:id/edit` | Sửa bài |
| `/admin/categories` | Quản lý danh mục |
| `/admin/users` | Quản lý người dùng (admin only) |

## Phân quyền

| Hành động | Admin | Member |
|---|---|---|
| Tạo bài | ✅ | ✅ |
| Sửa/xóa bài của mình | ✅ | ✅ |
| Duyệt/ẩn/xóa bài người khác | ✅ | ❌ |
| Quản lý danh mục | ✅ | ❌ |
| Quản lý người dùng | ✅ | ❌ |

## Kế hoạch triển khai

| Phase | Nội dung | Thời gian |
|---|---|---|
| 1 | Setup project + DB migrations + seed | 1-2 ngày |
| 2 | Backend API (auth, posts, categories, upload) | 3-4 ngày |
| 3 | Frontend Public (homepage, category, post detail, about, contact) | 3-4 ngày |
| 4 | Admin Panel (dashboard, quản lý bài/danh mục/user) | 3-4 ngày |
| 5 | Responsive, test, tài liệu API | 2 ngày |

## Bắt đầu

```bash
# Backend
cd demo_source_be && npm install && npm run dev

# Frontend
cd demo_source_fe && npm install && npm run dev
```

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
