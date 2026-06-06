# Blog Du Lịch — AI Workflow Demo

Dự án demo blog tin tức về du lịch Việt Nam và các điểm đến du lịch, đồng thời là **bộ khung AI workflow** chạy trên GitHub Copilot theo vòng lặp:

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
| MCP Server | `mcp-db-sampler` (Query DB thật để sinh Test Data) |

## Tài khoản Đăng nhập (Credentials)

Do dự án sử dụng chung Database cho cả Development và E2E Testing, dữ liệu trong DB có thể thay đổi tùy thuộc vào hành động cuối cùng bạn thực hiện:

1. **Dữ liệu gốc (Seed Data)** - *Dùng khi mới setup hoặc sau khi chạy `npx knex seed:run`:*
   - Admin: `admin@hoianblog.vn` / `password123`
   - Member: `member@hoianblog.vn` / `password123`

2. **Dữ liệu Test (Mock Data)** - *Dùng sau khi chạy Playwright E2E Test (test script tự động xóa DB và nạp data này):*
   - Admin: `admin1@test.com` / `password123`
   - Member: `member1@test.com` / `password123`
   - Member 2: `member2@test.com` / `password123`

## Cấu trúc thư mục

```text
demo_ai_workspace/
├── PROJECT_MANIFEST.yml           # Bản đồ map 1-1 Feature -> Docs -> Code -> DB -> Test
├── .github/
│   ├── copilot-instructions.md    # Rules toàn workspace (auto-load)
│   ├── agents/                    # Custom agents
│   │   ├── orchestrator.agent.md  # Agent tổng — điều phối full cycle
│   │   ├── docs-agent.agent.md    # Docs specialist
│   │   ├── be-agent.agent.md      # Backend specialist
│   │   ├── fe-agent.agent.md      # Frontend specialist
│   │   ├── test-agent.agent.md    # Test specialist
│   │   └── qa-agent.agent.md      # QA / cross-domain verifier
│   ├── instructions/              # Context tự động theo file path
│   │   ├── be-agent.instructions.md     # applyTo: demo_source_be/**
│   │   ├── fe-agent.instructions.md     # applyTo: demo_source_fe/**
│   │   ├── docs-agent.instructions.md   # applyTo: demo_docs/**
│   │   ├── test-agent.instructions.md   # applyTo: src/__tests__/**
│   │   ├── playwright-agent.instructions.md # applyTo: demo_playwright/**
│   │   └── qa-gate.instructions.md      # applyTo: **
│   ├── prompts/                   # Slash commands trong Copilot Chat
│   │   ├── be-create.prompt.md
│   │   ├── be-review.prompt.md
│   │   ├── fe-create.prompt.md
│   │   ├── fe-review.prompt.md
│   │   ├── doc-fe-create.prompt.md
│   │   ├── doc-fe-review.prompt.md
│   │   ├── doc-be-create.prompt.md
│   │   ├── doc-ita-create.prompt.md
│   │   ├── doc-ita-review.prompt.md
│   │   ├── doc-itb-create.prompt.md
│   │   ├── doc-itb-review.prompt.md
│   │   ├── test-create.prompt.md
│   │   ├── playwright-create.prompt.md
│   │   └── qa-gate.prompt.md
│   └── skills/                    # On-demand workflows
│       ├── be-implement/SKILL.md
│       ├── fe-implement/SKILL.md
│       ├── test-suite/SKILL.md
│       ├── playwright-suite/SKILL.md
│       ├── qa-gate/SKILL.md
│       ├── doc-fe-implement/SKILL.md
│       ├── doc-fe-review/SKILL.md
│       ├── doc-be-implement/SKILL.md
│       ├── doc-be-review/SKILL.md
│       ├── doc-ita-implement/SKILL.md
│       ├── doc-ita-review/SKILL.md
│       ├── doc-itb-implement/SKILL.md
│       └── doc-itb-review/SKILL.md
├── demo_docs/
│   ├── [Design] Status.md               # Bảng theo dõi trạng thái tài liệu
│   ├── [Design][DB] DATABASE_Schema.md  # DB schema (3 bảng: users, categories, posts)
│   ├── api/                       # 22 API endpoint specs
│   │   ├── [Design][LIST] API_DanhSachEndpoint.md
│   │   ├── [Design][LIST] UTILS_DanhSach.md
│   │   └── [Design][API] API{01-22}_*.md
│   └── fe/                        # 11 FE screen specs
│       ├── [Design][LIST] SCREEN_DanhSachManHinh.md
│       ├── [Design][LIST] COMPONENT_DanhSach.md
│       ├── [Design][LIST] UTILS_DanhSach.md
│       └── [Design][SCREEN] {ScreenCode}_*.md
│   └── tests/                     # Test Cases (ITa/ITb)
│       ├── ITa/
│       │   ├── TEMPLATE_ITa.md
│       │   ├── VIEWPOINT_ITa.md
│       │   └── CHECKLIST_TC_ITa.md
│       └── ITb/
│           ├── TEMPLATE_ITb.md
│           ├── VIEWPOINT_ITb.md
│           └── CHECKLIST_TC_ITb.md
├── demo_playwright/               # E2E Testing
│   ├── page-objects/              # Page Object Model classes
│   ├── tests/                     # Test specs (*.spec.ts)
│   │   ├── ITa_functional/        # Code test chức năng
│   │   └── ITb_scenarios/         # Code test luồng
│   ├── utils/                     # Helpers (evidence.ts)
│   └── playwright.config.ts
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
    └── AGENT_EXECUTION_LOG.md     # Log truy vết hành động của AI
```

## Quản lý Trạng thái & Truy vết (State & Traceability)

Để giải quyết vấn đề "mất trí nhớ" (Amnesia) giữa các session chat của AI, dự án sử dụng 2 file cốt lõi:
- **`PROJECT_MANIFEST.yml`**: Bản đồ map 1-1 giữa Feature -> Docs -> Code -> DB -> Test. Mọi Agent phải đọc file này đầu tiên để lấy context toàn cục thay vì scan lại repo.
- **`reports/AGENT_EXECUTION_LOG.md`**: Nơi ghi log bắt buộc sau mỗi lần Agent hoàn thành một task, giúp truy vết chính xác AI đã làm gì, sửa file nào.

## AI Workflow — GitHub Copilot Native

Toàn bộ workflow chạy trong **GitHub Copilot Chat** trên VS Code, không cần script ngoài.

### Cách dùng

**Chạy full cycle cho một feature** — chọn agent **Orchestrator** trong agent picker, mô tả feature cần implement. Orchestrator sẽ tự phân rã task, giao đúng sub-agent, enforce gate rule.

**Dùng nhanh từng việc** — gõ `/` trong Copilot Chat để chọn prompt:

### Lệnh Liên Hoàn (Automation Full-Cycle)
| Lệnh | Tác dụng |
|------|----------|
| `/doc-fe-create-and-review` | Tạo tài liệu thiết kế FE (10 sections) và tự chấm điểm |
| `/doc-be-create-and-review` | Tạo tài liệu thiết kế BE (7 sections) và tự chấm điểm |
| `/doc-workflow-create-and-review` | Tạo tài liệu Workflow (Business Flow) và tự chấm điểm |
| `/doc-ita-create-and-review` | Tạo Test Case ITa (dùng MCP lấy data thật) và tự chấm điểm |
| `/doc-itb-create-and-review` | Tạo Test Case ITb (có Mermaid, DB Matrix) và tự chấm điểm |
| `/fe-create-and-review` | Code React component/page, tự review và sửa lỗi |
| `/be-create-and-review` | Code Express/Knex, tự review và sửa lỗi |
| `/test-create-and-review` | Viết Unit/Integration Test (Jest), tự chạy và tự sửa lỗi |
| `/playwright-ita-full-cycle` | Viết code E2E Test ITa, tự chạy, tự sửa lỗi và xuất báo cáo |
| `/playwright-itb-full-cycle` | Viết code E2E Test ITb, tự chạy, tự sửa lỗi và xuất báo cáo |
| `/qa-gate` | Kiểm tra tổng trước khi merge |

### Lệnh Đơn Lẻ (Manual Control)
| Lệnh | Tác dụng |
|------|----------|
| `/be-create` | Chỉ implement backend endpoint |
| `/be-review` | Chỉ review backend code |
| `/fe-create` | Chỉ implement màn hình FE |
| `/fe-review` | Chỉ review frontend code |
| `/test-create` | Chỉ viết test suite cho một module |
| `/playwright-create` | Chỉ viết kịch bản test E2E bằng Playwright |
| `/doc-ita-create` | Chỉ viết tài liệu Test Case ITa |
| `/doc-ita-review` | Chỉ review tài liệu Test Case ITa |
| `/doc-itb-create` | Chỉ viết tài liệu Test Case ITb |
| `/doc-itb-review` | Chỉ review tài liệu Test Case ITb |

### Vòng lặp phát triển

```
1. DOCS       → docs-agent chuẩn hóa tài liệu thiết kế (FE/BE)
2. PLAN       → Orchestrator phân rã yêu cầu thành task
3. WORKFLOW   → docs-agent tạo tài liệu Workflow (Business Flow) từ FE/BE docs
4. TEST DESIGN→ docs-agent tạo Test Case ITa/ITb (ITb lấy input từ Workflow)
5. CREATE     → be-agent / fe-agent implement
6. REVIEW     → tự review hoặc cross-review
7. CORRECT    → fix finding Critical/High
8. TEST       → test-agent viết test unit/integration
9. E2E TEST   → playwright-agent viết/chạy test E2E dựa trên Test Case ITa/ITb
10. QA GATE   → qa-agent kiểm tra tổng, ra verdict PASS/FAIL
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
# Terminal 1 — Backend (port 3001)
cd demo_source_be
npm run dev

# Terminal 2 — Frontend (port 3000)
cd demo_source_fe
npm run dev
```

### Chạy tests

```powershell
cd demo_source_be
npm test
```

## Trạng thái hiện tại (2026-06-05)

### Backend — ✅ Hoàn chỉnh
| Phần | Status |
|---|---|
| Express app, middlewares, routes, controllers | ✅ Xong |
| Migrations + Seeds | ✅ Xong |
| DB PostgreSQL chạy thực | ✅ Đã tạo DB và chạy migrate/seed |

### Frontend — ⚠️ ~90%
| Phần | Status |
|---|---|
| Routing, AuthContext, ProtectedRoute | ✅ Xong |
| Navbar, Footer, PostCard | ✅ Xong |
| Trang public: Home, Category, Post Detail | ✅ Xong |
| Trang public: About, Contact | ⚠️ Placeholder tĩnh |
| Admin: Login, Post List, Post Form, Category List, User List | ✅ Xong |
| Admin: Dashboard stats | ✅ Xong |

### Tests
| Phần | Status |
|---|---|
| health.test.js | ✅ Xong |
| auth / categories / admin_users tests | ✅ Đã có Unit/Integration Test |
| admin_users E2E tests | ⚠️ Đã có Playwright Test (Pass rate: 89.6%, còn vài bug validation) |
| posts tests | ❌ Chưa làm |

### Việc cần làm tiếp
1. Hoàn thiện FE: About/Contact content
2. Viết tests: posts
3. Fix các bug validation còn tồn đọng của admin_users

## Đóng góp

Fork tự do. Không commit file `.env` hay secret local.

## Lời cảm ơn (Acknowledgments)

Dự án này có tham khảo và áp dụng một số phương pháp luận tiên tiến về AI Workflow từ các dự án mã nguồn mở:

**Từ [obra/superpowers](https://github.com/obra/superpowers):**
- **"Iron Law" trong Debugging & TDD:** Kỷ luật thép bắt buộc AI viết test fail trước khi code và tìm root cause trước khi fix bug.
- **Two-Stage Review Process:** Tách quy trình review thành 2 bước (Spec Compliance và Code Quality).
- **Condition-Based Waiting:** Kỹ thuật chờ theo điều kiện trong test E2E thay vì dùng timeout cứng.
- **Defense-in-Depth Validation:** Validate dữ liệu ở nhiều lớp (Boundary -> Business -> Data).
- **Persuasion Principles:** Sử dụng từ ngữ mạnh và yêu cầu cam kết để tăng độ tuân thủ của AI.
- **Test Polluter Identification:** Kỹ thuật dò tìm và dọn dẹp các test case gây ô nhiễm Database.
- **Receiving Code Review:** Quy trình chuẩn hóa cách AI tiếp nhận và phản hồi feedback.

**Từ [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill):**
- **Anti-Slop Manifesto:** Cấm các dấu hiệu nhận biết AI (AI Tells) như Emojis, màu đen tuyệt đối (`#000000`), văn mẫu AI, và placeholder data.
- **Web Engineering Directives:** Bắt buộc dùng `min-h-[100dvh]`, ưu tiên CSS Grid, và dùng `clamp()` cho Premium Whitespace.
- **Performance Guardrails:** Chỉ animate `transform/opacity` (Hardware Acceleration) và bắt buộc dọn dẹp memory leak trong `useEffect`.
- **Strategic Omissions:** Ép AI không được quên Client-side Form Validation và các trạng thái UI (Empty/Loading/Error).
- **Output Control:** Cấm viết code rút gọn (`// ...`) và quản lý token thông minh bằng `[PAUSED]`.

Xin gửi lời cảm ơn đến tác giả và những người đóng góp cho các dự án trên vì những ý tưởng tuyệt vời này!
