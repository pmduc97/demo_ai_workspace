# Review Checklist — BE API Design Doc

## Nhóm F — Format (25 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| F1 | Tên file đúng pattern `[Design][API] API{ID}_{Group}_{Name}.md` | 5 | High |
| F2 | Có YAML frontmatter với đủ 4 fields: `version`, `created`, `updated`, `status` | 5 | High |
| F3 | `status` là một trong `draft \| stable \| deprecated` | 3 | Medium |
| F4 | Heading h1 đúng format `# [Design][API] API{ID}_{Group}_{Name}` | 4 | Medium |
| F5 | Đủ 7 sections, đúng thứ tự, heading level `##` | 5 | Critical |
| F6 | Sub-sections dùng `###`, không lạm dụng heading sâu hơn | 3 | Low |

## Nhóm C — Content (35 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| C1 | **Section 1** — Có mô tả mục đích API, 1–3 câu | 3 | Medium |
| C2 | **Section 2** — Bảng có đủ 5 trường: Method, Endpoint, Auth, Role, Controller | 6 | High |
| C3 | **Section 3** — Có bảng Headers/Params và bảng Body Payload (kèm JSON ví dụ) | 7 | High |
| C4 | **Section 4** — Có bảng Response 200/201 (kèm JSON ví dụ) và bảng Lỗi & Exceptions | 7 | High |
| C5 | **Section 7** — Có liệt kê Side Effects hoặc ghi "Không có" | 4 | Medium |
| C6 | Các bảng Request/Response có cột định nghĩa kiểu dữ liệu và bắt buộc/null | 4 | High |
| C7 | Không có section nào để trống hoàn toàn | 4 | High |

## Nhóm D — Database & Logic Sync (30 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| D1 | **Section 5** — Logic viết step-by-step rõ ràng. Các hàm logic chung/middlewares phải khớp với `UTILS_DanhSach.md` (hoặc đã được thêm mới vào đó) | 5 | High |
| D2 | **Section 5** — Các bước gọi DB bắt buộc phải gắn thẻ Query ID (`[Q1]`, `[Q2]`...) | 7 | Critical |
| D3 | **Section 6** — Có bảng Database Queries & Mapping giải nghĩa các thẻ Query ID | 7 | Critical |
| D4 | Số lượng và tên thẻ Query ID ở Section 5 khớp 100% với Section 6 | 6 | Critical |
| D5 | **Section 6** — Cột Knex.js Snippet chứa code hợp lệ, đúng logic | 5 | High |

## Nhóm Q — Quality (10 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| Q1 | Không còn nội dung cũ/thừa (heading cũ, sections lặp) | 4 | High |
| Q2 | Dùng bảng markdown thay vì bullet list khi có cấu trúc 2 chiều | 3 | Low |
| Q3 | Code snippet có khai báo ngôn ngữ (` ```json `, ` ```js `) | 3 | Low |

---

## Severity Guide

| Severity | Ảnh hưởng |
|---------|----------|
| Critical | Fail ngay lập tức, bắt buộc fix trước release |
| High | Trừ điểm nặng, nên fix trước release |
| Medium | Có thể tạm pass với ghi backlog |
| Low | Defer được, chỉ ghi note |
