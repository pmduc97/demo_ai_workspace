# AI Full-Cycle Demo: Blog Hoi An - Da Nang

Du an ma nguon mo chia se cach ap dung **AI full cycle** de phat trien san pham web theo vong lap:
**plan -> create -> review -> correct -> verify -> qa gate -> report**.

Project nay gom 2 muc tieu song song:
- San pham demo blog tin tuc (FE + BE + DB + auth + admin).
- Bo khung agent/orchestrator de tu dong hoa quy trinh phat trien, test, fix loi, cap nhat tai lieu.

## Gia tri chinh

- Chia se thuc hanh xay dung AI workflow cho team dev.
- Co san task contract, scripts runtime, gate rule va report de tai su dung.
- Co the mo rong khi them tinh nang moi ma khong can xay lai tu dau.

## Tech Stack

| Layer | Cong nghe |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS + React Router v6 |
| Backend | Node.js + Express + JWT |
| Database | PostgreSQL + Knex.js |
| Auth | JWT + bcryptjs |
| Upload | Multer |
| Test | Jest + Supertest |
| Automation | Bash scripts + JSON task contracts |

## Cau truc thu muc (ban moi)

```text
demo_workspace/
├── demo_source_fe/                # Frontend source (public + admin)
├── demo_source_be/                # Backend source (routes/controllers/db/tests)
│   └── src/__tests__/             # Backend tests
├── demo_docs/                     # Product/docs thiet ke nghiep vu
├── docs/                          # Tai lieu van hanh agent va mapping
├── agents/                        # Dinh nghia role agent
├── skills/                        # Skill theo domain + phase
├── scripts/
│   ├── run_cycle.sh               # Full-cycle v4 (command-driven)
│   ├── run_cycle_v5.sh            # Full-cycle v5 (AI-driven contract)
│   └── agent_runner.sh            # Runner thuc thi phase plan
├── .agents/
│   ├── tasks.json                 # Task contract v4
│   ├── tasks.v5.json              # Task contract v5
│   ├── ai_status.jsonl            # Timeline event cho AI cycle
│   └── overall_gate_decision.json # Ket qua gate tong
└── reports/                       # Bao cao moi lan cycle
```

## AI Full-Cycle Runtime

### v4 (command-driven)
- Dung `scripts/run_cycle.sh`.
- Co phase va gate, phu hop de bootstrap nhanh.

### v5 (AI-driven contract)
- Dung `scripts/run_cycle_v5.sh`.
- Moi task khai bao day du hanh dong theo phase trong `.agents/tasks.v5.json`.
- `scripts/agent_runner.sh` thuc thi phase plan co cau truc (`purpose` + `cmd`).
- Xuat timeline AI va report de audit.

Xem them: `docs/agent-v5-runtime.md`, `docs/agent-playbook.md`, `docs/skills-mapping.md`.

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

### 1) Cai dat

```bash
cd demo_source_be && npm install
cd ../demo_source_fe && npm install
```

### 2) Chay backend

```bash
cd demo_source_be
npm run migrate
npm run seed
npm run dev
```

### 3) Chay frontend

```bash
cd demo_source_fe
npm run dev
```

## Chay full-cycle automation

### V4

```bash
bash scripts/run_cycle.sh
```

### V5 (khuyen nghi cho demo AI full cycle)

```bash
bash scripts/run_cycle_v5.sh
```

Ket qua:
- Gate tong: `.agents/overall_gate_decision.json`
- Report moi nhat: `reports/ai-cycle-*.md` hoac `reports/cycle-*.md`

## Mo rong cho feature moi

1. Them task moi vao `.agents/tasks.v5.json`.
2. Dinh nghia actions cho `create/review/correct/verify`.
3. Chay `bash scripts/run_cycle_v5.sh`.
4. Review report, tiep tuc toi uu skill/task contract.

## Luu y open-source

- Khong commit file secret local nhu `demo_source_be/.env`.
- Co the commit `agents/`, `skills/`, `.agents/` neu muc tieu la chia se framework full-cycle cho cong dong.

## Giay phep va dong gop

Du an huong toi chia se cach lam, ban co the fork, mo rong task contracts, them skill packs va gui PR.
