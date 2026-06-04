# Review Checklist — FE Screen Design Doc

## Nhóm F — Format (20 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| F1 | Tên file đúng pattern `[Design][SCREEN] {CODE}_{Name}.md` | 4 | High |
| F2 | Có YAML frontmatter với đủ 4 fields: `version`, `created`, `updated`, `status` | 4 | High |
| F3 | `status` là một trong `draft \| stable \| deprecated` | 2 | Medium |
| F4 | Heading h1 đúng format `# [Design][SCREEN] {CODE}_{Name}` | 3 | Medium |
| F5 | Có Change Log (bảng Ver/Nội dung/Ngày/Người tạo) ngay sau frontmatter | 3 | High |
| F6 | Đủ 12 sections, đúng thứ tự, heading level `##` | 4 | Critical |

## Nhóm C — Content (50 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| C1 | **Section 1** — Có mô tả mục đích màn hình, 1–3 câu | 2 | Medium |
| C2 | **Section 2** — Bảng có đủ 4 trường: Route, Auth, Redirect, URL Params | 4 | High |
| C3 | **Section 3** — Có 2 bảng "Vào từ đâu" và "Đi đến đâu" | 2 | Medium |
| C4 | **Section 4** — Có JSX tree minh hoạ layout. Các component dùng lại phải khớp với `COMPONENT_DanhSach.md` (hoặc đã được thêm mới vào đó) | 3 | High |
| C5 | **Section 5** — Có bảng Ma trận trạng thái UI (hoặc ghi "Không có" có lý do) | 4 | High |
| C6 | **Section 6** — Có bảng chi tiết UI đủ 9 cột (bao gồm I/O, Giá trị khởi tạo, Nguồn dữ liệu, Event ID) | 5 | High |
| C7 | **Section 7** — Có bảng API Calls + sub-section Request Mapping + Response Mapping (hoặc ghi "Không có") | 5 | High |
| C8 | **Section 8** — Có snippet state (hoặc ghi "Không có") | 2 | Medium |
| C9 | **Section 9** — Có bảng edge cases với cột HTTP Status + Component hiển thị; phân biệt interceptor vs màn hình tự xử lý | 4 | Medium |
| C10 | **Section 10** — Có bảng responsive 3 breakpoint | 3 | High |
| C11 | **Section 11** — Có bảng tóm tắt Event ID nhất quán (E00, E01...) + Sequence Diagram Mermaid cho event phức tạp | 6 | High |
| C12 | **Section 12** — Có Message List đầy đủ (E/C/S/I), đúng format MessageId, ghi rõ component hiển thị | 5 | High |
| C13 | Không có section nào để trống hoàn toàn | 5 | High |

## Nhóm A — API Sync (20 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| A1 | Mỗi API call trong bảng có link đến file `[Design][API]` tương ứng | 5 | High |
| A2 | Method (GET/POST/PUT/DELETE) khớp với API spec | 5 | Critical |
| A3 | Request Mapping: fields khớp với API spec (tên, kiểu dữ liệu) | 5 | High |
| A4 | Response Mapping: fields và format hiển thị đúng với API spec | 5 | High |

## Nhóm Q — Quality (10 điểm)

| ID | Mục kiểm tra | Điểm | Severity nếu fail |
|----|-------------|------|------------------|
| Q1 | Không còn nội dung cũ/thừa (heading cũ, sections lặp) | 3 | High |
| Q2 | Event ID nhất quán giữa Section 6, Section 11, và Section 12 | 4 | High |
| Q3 | Dùng bảng markdown thay vì bullet list khi có cấu trúc 2 chiều | 1 | Low |
| Q4 | Code snippet có khai báo ngôn ngữ (` ```js `, ` ```jsx `, ` ```mermaid `) | 2 | Low |

## Severity Guide

| Severity | Ảnh hưởng |
|---------|----------|
| Critical | Fail ngay lập tức, bắt buộc fix trước release |
| High | Trừ điểm nặng, nên fix trước release |
| Medium | Có thể tạm pass với ghi backlog |
| Low | Defer được, chỉ ghi note |
