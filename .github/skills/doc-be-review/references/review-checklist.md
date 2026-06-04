# Review Checklist — BE API Design Doc

## Nhóm F — Format (20 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| F1 | Tên file đúng pattern `[Design][API] API{ID}_{Group}_{Name}.md` | 4 | High |
| F2 | Có YAML frontmatter với đủ 4 fields: `version`, `created`, `updated`, `status` | 3 | High |
| F3 | `status` là một trong `draft \| stable \| deprecated` | 2 | Medium |
| F4 | Heading h1 đúng format `# [Design][API] API{ID}_{Group}_{Name}` | 3 | Medium |
| F5 | Có Change Log (bảng Ver/Ngày/Nội dung/Người tạo) ngay sau frontmatter | 3 | High |
| F6 | Đủ 10 sections, đúng thứ tự, heading level `##` | 5 | Critical |

## Nhóm C — Content (35 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| C1 | **Section 1** — Có mô tả mục đích API 1–3 câu + bảng Tài liệu tham chiếu | 2 | Medium |
| C2 | **Section 2** — Bảng có đủ 5 trường: Method, Endpoint, Auth, Role, Controller + Bảng DB liên quan | 4 | High |
| C3 | **Section 3** — Có bảng Headers/Params + bảng Body Payload đủ 7 cột (Logical Name, Physical Field, Kiểu, Bắt buộc, Ràng buộc, Chuẩn hóa input, Mô tả) + JSON example | 5 | High |
| C4 | **Section 4** — Có bảng Validation Rules dạng ID (V-01, V-02...): Đối tượng / Quy tắc / MessageId / HTTP Status | 5 | High |
| C5 | **Section 5** — Có bảng Response 200/201 + JSON example + bảng Lỗi với Error Code chuẩn hóa (ERR_xxx) | 5 | High |
| C6 | **Section 6** — Có Sequence Diagram Mermaid (hoặc ghi "Không có" có lý do rõ ràng) | 4 | High |
| C7 | **Section 10** — Có liệt kê Side Effects hoặc ghi "Không có" | 2 | Medium |
| C8 | **Section 9** — Có Message List đầy đủ (MessageId / Loại / HTTP Status / Nội dung / Điều kiện) | 4 | High |
| C9 | Mỗi Validation Rule (V-xx) trong Section 4 có MessageId tương ứng trong Section 9 | 4 | High |

## Nhóm D — Database & Logic Sync (35 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| D1 | **Section 7** — Logic viết step-by-step rõ ràng. Các hàm logic chung/middlewares phải khớp với `UTILS_DanhSach.md` (hoặc đã được thêm mới vào đó) | 4 | High |
| D2 | **Section 7** — Các bước gọi DB bắt buộc phải gắn thẻ Query ID (`[Q1]`, `[Q2]`...) | 6 | Critical |
| D3 | **Section 8** — Có bảng Database Queries & Mapping giải nghĩa các thẻ Query ID | 6 | Critical |
| D4 | Số lượng và tên thẻ Query ID ở Section 7 khớp 100% với Section 8 | 5 | Critical |
| D5 | **Section 8** — Cột Knex.js Snippet chứa code hợp lệ, đúng logic | 4 | High |
| D6 | **Section 8** — Có cột Điều kiện OK/NG (e.g. `0 record → 404`, `duplicate → 409`) | 4 | High |
| D7 | **Section 8** — Có sub-section Data Mapping: Request→SQL và DB Column→Response | 6 | High |

## Nhóm Q — Quality (10 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| Q1 | Không còn nội dung cũ/thừa (heading cũ, sections lặp) | 3 | High |
| Q2 | Error Code nhất quán giữa Section 4 (V-xx MessageId) và Section 9 (Message List) | 4 | High |
| Q3 | Code snippet có khai báo ngôn ngữ (` ```json `, ` ```js `, ` ```mermaid `) | 3 | Low |

## Severity Guide

| Severity | Ảnh hưởng |
|---------|----------|
| Critical | Fail ngay lập tức, bắt buộc fix trước release |
| High | Trừ điểm nặng, nên fix trước release |
| Medium | Có thể tạm pass với ghi backlog |
| Low | Defer được, chỉ ghi note |
