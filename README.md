# AI Full-Cycle Demo: Blog Hội An - Đà Nẵng

Dự án mã nguồn mở chia sẻ cách áp dụng **AI full cycle** để phát triển sản phẩm web theo vòng lặp:
**plan → create → review → correct → verify → qa gate → report**.

Dự án này gồm 2 mục tiêu song song:
- Sản phẩm demo blog tin tức (FE + BE + DB + auth + admin).
- Bộ khung agent/orchestrator để tự động hóa quy trình phát triển, test, fix lỗi, cập nhật tài liệu.

## Giá trị chính

- Chia sẻ thực hành xây dựng AI workflow cho team dev.
- Có sẵn task contract, scripts runtime, gate rule và report để tái sử dụng.
- Có thể mở rộng khi thêm tính năng mới mà không cần xây lại từ đầu.

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + React Router v6 |
| Backend | Node.js + Express + JWT |
| Database | PostgreSQL + Knex.js |
| Auth | JWT + bcryptjs |
| Upload | Multer |
| Test | Jest + Supertest |
| Automation | Bash scripts + JSON task contracts |

## Cấu trúc thư mục (bản mới)

```text
demo_workspace/
├── demo_source_fe/                # Frontend source (public + admin)
├── demo_source_be/                # Backend source (routes/controllers/db/tests)
│   └── src/__tests__/             # Backend tests
├── demo_docs/                     # Product/docs thiết kế nghiệp vụ
├── docs/                          # Tài liệu vận hành agent và mapping
├── agents/                        # Định nghĩa role agent
├── skills/                        # Skill theo domain + phase
├── scripts/
│   ├── run_cycle.sh               # Full-cycle v4 (command-driven)
│   ├── run_cycle_v5.sh            # Full-cycle v5 (AI-driven contract)
│   └── agent_runner.sh            # Runner thực thi phase plan
├── .agents/
│   ├── tasks.json                 # Task contract v4
│   ├── tasks.v5.json              # Task contract v5
│   ├── ai_status.jsonl            # Timeline event cho AI cycle
│   └── overall_gate_decision.json # Kết quả gate tổng
└── reports/                       # Báo cáo mỗi lần cycle
```

## AI Full-Cycle Runtime

### v4 (command-driven)
- Dùng `scripts/run_cycle.sh`.
- Có phase và gate, phù hợp để bootstrap nhanh.

### v5 (AI-driven contract)
- Dùng `scripts/run_cycle_v5.sh`.
- Mỗi task khai báo đầy đủ hành động theo phase trong `.agents/tasks.v5.json`.
- `scripts/agent_runner.sh` thực thi phase plan có cấu trúc (`purpose` + `cmd`).
- Xuất timeline AI và report để audit.

Xem thêm: `docs/agent-v5-runtime.md`, `docs/agent-playbook.md`, `docs/skills-mapping.md`.

## Domain Product

### Public routes
- `/`
- `/category/:slug`
- `/post/:slug`
- `/about`
- `/contact`

### Admin routes
- `/admin/login`
- `/admin/dashboard`
- `/admin/posts`
- `/admin/posts/new`
- `/admin/posts/:id/edit`
- `/admin/categories`
- `/admin/users`

### API core
- Auth: `/api/auth/*`
- Posts: `/api/posts/*`
- Categories: `/api/categories/*`
- Admin: `/api/admin/*`
- Upload: `/api/upload`
- Health: `/api/health`

## Quick Start

### 1) Cài đặt

```bash
cd demo_source_be && npm install
cd ../demo_source_fe && npm install
```

### 2) Chạy backend

```bash
cd demo_source_be
npm run migrate
npm run seed
npm run dev
```

### 3) Chạy frontend

```bash
cd demo_source_fe
npm run dev
```

## Chạy full-cycle automation

### V4

```bash
bash scripts/run_cycle.sh
```

### V5 (khuyến nghị cho demo AI full cycle)

```bash
bash scripts/run_cycle_v5.sh
```

Kết quả:
- Gate tổng: `.agents/overall_gate_decision.json`
- Report mới nhất: `reports/ai-cycle-*.md` hoặc `reports/cycle-*.md`

## Mở rộng cho feature mới

1. Thêm task mới vào `.agents/tasks.v5.json`.
2. Định nghĩa actions cho `create/review/correct/verify`.
3. Chạy `bash scripts/run_cycle_v5.sh`.
4. Review report, tiếp tục tối ưu skill/task contract.

## Lưu ý open-source

- Không commit file secret local như `demo_source_be/.env`.
- Có thể commit `agents/`, `skills/`, `.agents/` nếu mục tiêu là chia sẻ framework full-cycle cho cộng đồng.

## Trạng thái hiện tại (2026-05-31)

### Backend (`demo_source_be/`)
| Phần | Status |
|---|---|
| Express app, health check | ✅ Xong |
| Middlewares (auth, role, validate) | ✅ Xong |
| Routes + Controllers (auth, posts, categories, admin, upload) | ✅ Xong |
| Migrations + Seeds | ✅ Xong |
| DB chạy thực (PostgreSQL `hoian_blog`) | ❌ Chưa chạy |

### Frontend (`demo_source_fe/`)
| Phần | Status |
|---|---|
| Vite + Tailwind + React Router skeleton | ✅ Xong |
| axios + JWT interceptor | ✅ Xong |
| AuthContext, ProtectedRoute | ❌ Chưa làm |
| Components, Pages (public + admin) | ❌ Chưa làm |

### Tests
| Phần | Status |
|---|---|
| health.test.js | ✅ Xong |
| Auth / Posts / Categories / Admin tests | ❌ Chưa làm |

### AI Full-Cycle Framework
| Phần | Status |
|---|---|
| 6 agents (be, fe, test, docs, qa, orchestrator, verify) | ✅ Xong |
| 15 skills (5 domain × 3 phase) | ✅ Xong |
| scripts v4 + v5 + agent_runner | ✅ Xong |
| Task contracts (4 tasks mỗi version) | ✅ Xong |
| Docs vận hành (playbook, v5-runtime, skills-mapping) | ✅ Xong |

### Bước tiếp theo
1. Tạo DB PostgreSQL `hoian_blog` → chạy `npm run migrate && npm run seed`
2. Implement FE: `AuthContext` → `ProtectedRoute` → components → pages
3. Viết tests: auth, posts, categories, admin endpoints
4. Chạy `bash scripts/run_cycle_v5.sh` để verify toàn bộ cycle

## Giấy phép và đóng góp

Dự án hướng tới chia sẻ cách làm, bạn có thể fork, mở rộng task contracts, thêm skill packs và gửi PR.
