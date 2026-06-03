# Blog Hội An / Đà Nẵng — AI Workflow Demo

Dự án demo blog tin tức về Hội An và Đà Nẵng, đồng thời là **bộ khung AI workflow** chạy trên GitHub Copilot theo vòng lặp:

```
plan → create → review → correct → qa gate
```

Hai mục tiêu song song:
- Sản phẩm thực: blog tin tức có FE + BE + DB + auth + admin panel.
- Bộ khung: custom agents, skills, instructions cho GitHub Copilot để tự động hóa quy trình phát triển.

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + React Router v6 |
| Backend | Node.js + Express + Knex.js + JWT |
| Database | PostgreSQL |
| Auth | JWT + bcryptjs |
| Upload | Multer |
| Test | Jest + Supertest |
| AI Workflow | GitHub Copilot — custom agents, skills, instructions |

## Cấu trúc thư mục

```text
demo_ai_workspace/
├── .github/
│   ├── copilot-instructions.md    # Rules toàn workspace (auto-load)
│   ├── agents/                    # Custom agents
│   │   ├── orchestrator.agent.md  # Agent tổng — điều phối full cycle
│   │   ├── be-agent.agent.md      # Backend specialist
│   │   ├── fe-agent.agent.md      # Frontend specialist
│   │   ├── test-agent.agent.md    # Test specialist
│   │   └── qa-agent.agent.md      # QA / cross-domain verifier
│   ├── instructions/              # Context tự động theo file path
│   │   ├── be-agent.instructions.md     # applyTo: demo_source_be/**
│   │   ├── fe-agent.instructions.md     # applyTo: demo_source_fe/**
│   │   ├── docs-agent.instructions.md   # applyTo: demo_docs/**
│   │   ├── test-agent.instructions.md   # applyTo: src/__tests__/**
│   │   └── qa-gate.instructions.md      # applyTo: **
│   ├── prompts/                   # Slash commands trong Copilot Chat
│   │   ├── be-create.prompt.md
│   │   ├── be-review.prompt.md
│   │   ├── fe-create.prompt.md
│   │   ├── fe-review.prompt.md
│   │   ├── test-create.prompt.md
│   │   └── qa-gate.prompt.md
│   └── skills/                    # On-demand workflows
│       ├── be-implement/SKILL.md
│       ├── fe-implement/SKILL.md
│       ├── test-suite/SKILL.md
│       └── qa-gate/SKILL.md
├── demo_docs/
│   ├── [Design][DB] DATABASE_Schema.md  # DB schema (3 bảng: users, categories, posts)
│   ├── api/                       # 22 API endpoint specs
│   │   ├── [Design][LIST] API_DanhSachEndpoint.md
│   │   └── [Design][API] API{01-22}_*.md
│   └── fe/                        # 11 FE screen specs
│       ├── [Design][LIST] SCREEN_DanhSachManHinh.md
│       └── [Design][SCREEN] {ScreenCode}_*.md
├── demo_source_be/                # Express backend
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/
│       ├── db/migrations/
│       └── __tests__/
├── demo_source_fe/                # React frontend
│   └── src/
│       ├── context/AuthContext.jsx
│       ├── services/api.js
│       ├── components/
│       └── pages/
└── reports/                       # Báo cáo các cycle cũ
```

## AI Workflow — GitHub Copilot Native

Toàn bộ workflow chạy trong **GitHub Copilot Chat** trên VS Code, không cần script ngoài.

### Cách dùng

**Chạy full cycle cho một feature** — chọn agent **Orchestrator** trong agent picker, mô tả feature cần implement. Orchestrator sẽ tự phân rã task, giao đúng sub-agent, enforce gate rule.

**Dùng nhanh từng việc** — gõ `/` trong Copilot Chat để chọn prompt:

| Lệnh | Tác dụng |
|------|----------|
| `/be-create` | Implement một backend endpoint |
| `/be-review` | Review backend code |
| `/fe-create` | Implement một màn hình FE |
| `/fe-review` | Review frontend code |
| `/test-create` | Viết test suite cho một module |
| `/qa-gate` | Kiểm tra tổng trước khi merge |

### Vòng lặp phát triển

```
1. PLAN    → Orchestrator phân rã yêu cầu thành task
2. CREATE  → be-agent / fe-agent implement
3. REVIEW  → tự review hoặc cross-review
4. CORRECT → fix finding Critical/High
5. TEST    → test-agent viết test
6. QA GATE → qa-agent kiểm tra tổng, ra verdict PASS/FAIL
```

### Gate Rules

| Severity | Quy tắc |
|----------|---------|
| Critical / High | Gate **FAIL** — bắt buộc fix trước khi pass |
| Medium | Tạm pass nếu không ảnh hưởng luồng chính — ghi backlog |
| Low | Defer — ghi backlog |

### Context tự động theo file đang mở

Khi mở file trong `demo_source_be/` → Copilot tự load BE rules.
Khi mở file trong `demo_source_fe/` → Copilot tự load FE rules.
Khi mở file trong `src/__tests__/` → Copilot tự load test rules.

## Sản phẩm — Blog Tin Tức

### Public routes
- `/` — trang chủ, danh sách bài viết
- `/category/:slug` — bài viết theo chuyên mục
- `/post/:slug` — chi tiết bài viết
- `/about` — giới thiệu
- `/contact` — liên hệ

### Admin routes (yêu cầu đăng nhập role admin)
- `/admin/login`
- `/admin/dashboard`
- `/admin/posts` — quản lý bài viết
- `/admin/posts/new` + `/admin/posts/:id/edit` — tạo/sửa bài
- `/admin/categories` — quản lý chuyên mục
- `/admin/users` — quản lý tài khoản

### API (22 endpoints)
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- Posts: `/api/posts/*`
- Categories: `/api/categories/*`
- Admin: `/api/admin/*`
- Upload: `/api/upload`
- Health: `/api/health`

Xem đầy đủ tại `demo_docs/api/api-list.md`.

## Quick Start

### Yêu cầu
- Node.js 18+
- PostgreSQL (tạo database tên `hoian_blog`)

### Cài đặt

```powershell
cd demo_source_be
npm install

cd ..\demo_source_fe
npm install
```

### Cấu hình backend

Tạo file `demo_source_be/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hoian_blog
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
```

### Khởi tạo database

```powershell
cd demo_source_be
npx knex migrate:latest
npx knex seed:run
```

### Chạy development

```powershell
# Terminal 1 — Backend (port 3000)
cd demo_source_be
npm run dev

# Terminal 2 — Frontend (port 5173)
cd demo_source_fe
npm run dev
```

### Chạy tests

```powershell
cd demo_source_be
npm test
```

## Trạng thái hiện tại (2026-06-03)

### Backend — ✅ Hoàn chỉnh
| Phần | Status |
|---|---|
| Express app, middlewares, routes, controllers | ✅ Xong |
| Migrations + Seeds | ✅ Xong |
| DB PostgreSQL chạy thực | ❌ Cần tạo DB và chạy migrate |

### Frontend — ⚠️ ~85%
| Phần | Status |
|---|---|
| Routing, AuthContext, ProtectedRoute | ✅ Xong |
| Navbar, Footer, PostCard | ✅ Xong |
| Trang public: Home, Category, Post Detail | ✅ Xong |
| Trang public: About, Contact | ⚠️ Placeholder tĩnh |
| Admin: Login, Post List, Post Form, Category List, User List | ✅ Xong |
| Admin: Dashboard stats | ⚠️ Chỉ có heading |

### Tests
| Phần | Status |
|---|---|
| health.test.js | ✅ Xong |
| auth / posts / categories / admin tests | ❌ Chưa làm |

### Việc cần làm tiếp
1. Tạo DB PostgreSQL `hoian_blog` → chạy migrate + seed
2. Hoàn thiện FE: About/Contact content, Dashboard stats
3. Viết tests: auth, posts, categories, admin

## Đóng góp

Fork tự do. Không commit file `.env` hay secret local.
