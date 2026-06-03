# Format Rules — BE API Design Doc

## Tên file
- Pattern: `[Design][API] API{ID}_{Group}_{Name}.md`
- ID: 2 chữ số (e.g. `01`, `14`)
- Group: PascalCase (e.g. `Auth`, `Categories`, `AdminUsers`)
- Name: PascalCase tiếng Việt không dấu (e.g. `DangNhap`, `DanhSach`)
- Ví dụ: `[Design][API] API01_Auth_DangNhap.md`

## YAML Frontmatter
```yaml
---
version: 1.0          # Tăng khi có breaking change
created: YYYY-MM-DD   # Ngày tạo doc lần đầu
updated: YYYY-MM-DD   # Ngày cập nhật gần nhất
status: draft | stable | deprecated
---
```

## Quy tắc 7 sections (bắt buộc, đúng thứ tự)

| # | Section | Bắt buộc | Ghi chú |
|---|---------|---------|---------|
| 1 | Tổng quan | ✅ | 1-3 câu |
| 2 | Thông tin chung | ✅ | Bảng 5 trường (Method, Endpoint, Auth, Role, Controller) |
| 3 | Request | ✅ | Bảng Headers/Params và Body Payload |
| 4 | Response | ✅ | Bảng Thành công và Lỗi & Exceptions |
| 5 | Logic xử lý | ✅ | Step-by-step, bắt buộc dùng thẻ `[Q1]`, `[Q2]` nếu có gọi DB. Các hàm xử lý logic chung và middlewares phải tham chiếu từ `UTILS_DanhSach.md`. Nếu có hàm mới, phải thêm vào danh sách đó. |
| 6 | Database Queries & Mapping | ✅ | Bảng giải nghĩa Query IDs kèm Knex.js snippet |
| 7 | Side Effects | ✅ | Liệt kê hoặc ghi "Không có" |

## Section 5 & 6 — Query IDs Mapping
- Bất kỳ thao tác nào đọc/ghi Database trong Section 5 đều phải được đánh dấu bằng thẻ `[Q1]`, `[Q2]`, `[Q3]`...
- Mỗi thẻ trong Section 5 phải có một dòng tương ứng giải nghĩa trong bảng ở Section 6.
- Cột `Knex.js Snippet dự kiến` trong Section 6 phải viết code hợp lệ của thư viện Knex.js.

## Không được để trống
Nếu section hoặc sub-section không áp dụng (ví dụ GET request không có body), ghi rõ: `> Không có.`

## Phong cách viết
- Tiêu đề heading level 2 (`##`) cho sections chính.
- Sub-sections dùng `###`.
- Dùng bảng markdown thay vì bullet list khi có cấu trúc 2 chiều.
- Code snippet dùng fenced code block với ngôn ngữ (` ```json `, ` ```js `).
