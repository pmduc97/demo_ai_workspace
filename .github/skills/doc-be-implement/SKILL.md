---
name: doc-be-implement
description: "BE API design doc workflow for Blog Hoi An/Da Nang. Use when writing, updating, or standardizing a backend API specification document. Ensures consistent 7-section format with YAML frontmatter, request/response mapping, business logic with Query IDs, and Knex.js snippets. Trigger phrases: write api doc, update api spec, standardize api doc, create api design, doc be, api spec."
argument-hint: "Tên file API cần viết/update (e.g. API01_Auth_DangNhap)"
---

# Doc BE Implement Skill

## Mục tiêu
Viết mới hoặc cập nhật một BE API design doc đúng format chuẩn 7 sections, đảm bảo logic xử lý rõ ràng, map chính xác với Database thông qua Query IDs để BE Dev có thể code ngay lập tức.

## Khi nào dùng
- Tạo doc cho API endpoint mới.
- Cập nhật doc API cũ đang thiếu section hoặc sai format.
- Chuẩn hoá loạt doc API trước khi bắt đầu code Backend.

## Procedure

### Bước 1 — Xác định API và Utils
1. Xem danh sách tại `demo_docs/api/[Design][LIST] API_DanhSachEndpoint.md`.
2. Đọc thư viện Utils tại `demo_docs/api/[Design][LIST] UTILS_DanhSach.md` để biết các hàm logic dùng chung và middlewares đã có sẵn.
3. **QUAN TRỌNG**: Nếu API yêu cầu tạo một hàm logic mới có khả năng tái sử dụng (ví dụ: hash password, format response...), bạn **BẮT BUỘC** phải cập nhật thêm vào file `UTILS_DanhSach.md`.
4. File đích: `demo_docs/api/[Design][API] API{ID}_{Group}_{Name}.md`.
5. Đọc file Database Schema tại `demo_docs/[Design][DB] DATABASE_Schema.md` để nắm cấu trúc bảng trước khi viết query.

### Bước 2 — Áp dụng 7-section template
Xem template đầy đủ tại [api-template.md](./references/api-template.md).

Bắt buộc có đủ 7 sections:
1. **Tổng quan** — mô tả ngắn mục đích API.
2. **Thông tin chung** — bảng Method, Endpoint, Auth, Role, Controller.
3. **Request** — bảng Headers/Params và bảng Body Payload (kèm JSON ví dụ).
4. **Response** — bảng Thành công (200/201) và bảng Lỗi & Exceptions.
5. **Logic xử lý** — step-by-step, gắn thẻ `[Q1]`, `[Q2]` vào các bước gọi DB.
6. **Database Queries & Mapping** — bảng giải nghĩa các thẻ `[Q1]`, `[Q2]` kèm Knex.js snippet.
7. **Side Effects** — liệt kê tác động ngoài DB (hoặc "Không có").

### Bước 3 — Kiểm tra tính đồng bộ Database
- Mọi thẻ `[Q1]`, `[Q2]` trong Section 5 phải được định nghĩa chi tiết trong Section 6.
- Các field trong Request/Response phải khớp với kiểu dữ liệu trong Database Schema.

### Bước 4 — Validate format
Xem rules đầy đủ tại [format-rules.md](./references/format-rules.md).

Checklist nhanh:
- [ ] Có YAML frontmatter (version, created, updated, status).
- [ ] Đủ 7 sections, đúng thứ tự.
- [ ] Section 5 và 6 có sử dụng Query IDs mapping.
- [ ] Không có section trống (ghi "Không có" nếu không dùng).

## Output
```
### Files changed
- demo_docs/api/[Design][API] API{ID}_{Group}_{Name}.md

### Sections added/updated
- [x] YAML frontmatter
- [x] 1. Tổng quan
- ...

### Database Mapping verified
- [Q1] SELECT users -> ✓
```
