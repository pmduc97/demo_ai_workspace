# Review Checklist — FE Screen Design Doc

## Nhóm F — Format (25 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| F1 | Tên file đúng pattern `[Design][SCREEN] {CODE}_{Name}.md` | 5 | High |
| F2 | Có YAML frontmatter với đủ 4 fields: `version`, `created`, `updated`, `status` | 5 | High |
| F3 | `status` là một trong `draft \| stable \| deprecated` | 3 | Medium |
| F4 | Heading h1 đúng format `# [Design][SCREEN] {CODE}_{Name}` | 4 | Medium |
| F5 | Đủ 10 sections, đúng thứ tự, heading level `##` | 5 | Critical |
| F6 | Sub-sections dùng `###`, không dùng `####` trở xuống khi không cần | 3 | Low |

## Nhóm C — Content (45 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| C1 | **Section 1** — Có mô tả mục đích màn hình, 1–3 câu | 3 | Medium |
| C2 | **Section 2** — Bảng có đủ 4 trường: Route, Auth, Redirect, URL Params | 5 | High |
| C3 | **Section 3** — Có 2 bảng "Vào từ đâu" và "Đi đến đâu" | 3 | Medium |
| C4 | **Section 4** — Có JSX tree minh hoạ layout. Các component dùng lại phải khớp với `COMPONENT_DanhSach.md` (hoặc đã được thêm mới vào đó) | 4 | High |
| C5 | **Section 5** — Có bảng chi tiết UI (format, min/max, JSON mapping) | 5 | High |
| C6 | **Section 6** — Có bảng API Calls (hoặc ghi "Không có" rõ ràng) | 5 | High |
| C7 | **Section 7** — Có snippet state (hoặc ghi "Không có") | 3 | Medium |
| C8 | **Section 8** — Có bảng edge cases (hoặc ghi "Không có") | 4 | Medium |
| C9 | **Section 9** — Có bảng responsive 3 breakpoint | 4 | High |
| C10 | **Section 10** — Có bảng Events & Actions. Các hàm logic chung phải khớp với `UTILS_DanhSach.md` (hoặc đã được thêm mới vào đó) | 5 | High |
| C11 | Không có section nào để trống hoàn toàn | 4 | High |

## Nhóm A — API Sync (20 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| A1 | Mỗi API call trong bảng có link đến file `[Design][API]` tương ứng | 6 | High |
| A2 | Method (GET/POST/PUT/DELETE) khớp với API spec | 5 | Critical |
| A3 | Request body fields khớp với API spec | 5 | High |
| A4 | Response shape được mô tả đúng (array vs object, field names) | 4 | High |

## Nhóm Q — Quality (10 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| Q1 | Không còn nội dung cũ/thừa (heading cũ, sections lặp) | 4 | High |
| Q2 | Dùng bảng markdown thay vì bullet list khi có cấu trúc 2 chiều | 3 | Low |
| Q3 | Code snippet có khai báo ngôn ngữ (` ```js `, ` ```jsx `) | 3 | Low |

---

## Severity Guide

| Severity | Ảnh hưởng |
|---------|----------|
| Critical | Fail ngay lập tức, bắt buộc fix trước release |
| High | Trừ điểm nặng, nên fix trước release |
| Medium | Có thể tạm pass với ghi backlog |
| Low | Defer được, chỉ ghi note |
