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

## Change Log (bắt buộc, ngay sau frontmatter)
- Bảng gồm 4 cột: `Ver | Ngày | Nội dung thay đổi | Người tạo`
- Mỗi lần sửa doc phải thêm 1 dòng mới, tăng `Ver` và cập nhật `updated` trong frontmatter

## Quy tắc 10 sections (bắt buộc, đúng thứ tự)

| # | Section | Bắt buộc | Ghi chú |
|---|---------|---------|---------|
| — | Change Log | ✅ | Bảng Ver/Ngày/Nội dung/Người tạo, ngay sau frontmatter |
| 1 | Tổng quan | ✅ | 1-3 câu + bảng Tài liệu tham chiếu |
| 2 | Thông tin chung | ✅ | Bảng 5 trường (Method, Endpoint, Auth, Role, Controller) + Bảng DB liên quan |
| 3 | Request | ✅ | Bảng Headers/Params + Bảng Body Payload (9 cột: Logical Name, Physical Field, Kiểu, Bắt buộc, Ràng buộc, Chuẩn hóa input, Mô tả) + JSON example |
| 4 | Validation Rules | ✅ | Bảng rule dạng ID (V-01, V-02...): Đối tượng / Quy tắc / MessageId / HTTP Status |
| 5 | Response | ✅ | Bảng Thành công (200/201) + JSON example + Bảng Lỗi với Error Code chuẩn hóa |
| 6 | Sequence Diagram | ✅* | Mermaid diagram Client→Controller→DB + nhánh lỗi. Ghi "Không có" nếu API đơn giản (GET list, GET by ID) |
| 7 | Logic xử lý | ✅ | Step-by-step, bắt buộc dùng thẻ `[Q1]`, `[Q2]` nếu có gọi DB. Các hàm logic chung/middlewares phải tham chiếu từ `UTILS_DanhSach.md`. |
| 8 | Database Queries & Mapping | ✅ | Bảng Query ID + Điều kiện OK/NG + Knex.js snippet + Data Mapping (Request→SQL và DB→Response) |
| 9 | Message List | ✅ | Bảng MessageId / Loại / HTTP Status / Nội dung / Điều kiện |
| 10 | Side Effects | ✅ | Liệt kê hoặc ghi "Không có" |

## Section 2 — Bảng DB liên quan
- Liệt kê tất cả bảng mà API này đọc hoặc ghi
- Cột: `Bảng | Hành động (READ/WRITE) | Mục đích`

## Section 3 — Body Payload (7 cột bắt buộc)
| Cột | Mô tả |
|-----|-------|
| Logical Name | Tên nghiệp vụ (tiếng Việt hoặc tiếng Anh dễ hiểu) |
| Physical Field | Tên field thực trong JSON request |
| Kiểu dữ liệu | String / Number / Boolean / Array / Object |
| Bắt buộc | ✅ / ❌ |
| Ràng buộc | Min/Max/Format/Enum |
| Chuẩn hóa input | `trim()` / `toLowerCase()` / `Không` |
| Mô tả | Ghi chú thêm |

## Section 4 — Validation Rules
- Rule ID format: `V-{2 chữ số}` (e.g. `V-01`, `V-02`)
- Thứ tự: Auth/Permission trước → Field validation → Cross-field/Business rule
- Mỗi rule phải có MessageId tương ứng trong Section 9 (Message List)
- Lỗi 401/403/5xx do middleware xử lý chung → ghi chú "do middleware xử lý" thay vì mô tả lại logic

## Section 5 — Response Errors
- Bảng có cột: `HTTP Code | Error Code | Message | Điều kiện xảy ra`
- Error Code format: `ERR_{CATEGORY}` (e.g. `ERR_NOT_FOUND`, `ERR_CONFLICT`, `ERR_VALIDATION`)

## Section 7 & 8 — Query IDs Mapping
- Bất kỳ thao tác nào đọc/ghi Database trong Section 7 đều phải được đánh dấu bằng thẻ `[Q1]`, `[Q2]`, `[Q3]`...
- Mỗi thẻ trong Section 7 phải có một dòng tương ứng trong bảng ở Section 8
- Section 8 bắt buộc có thêm cột **Điều kiện OK/NG** (e.g. `0 record → 404`, `duplicate → 409`)
- Section 8 bắt buộc có sub-section **Data Mapping**: Request→SQL và DB Column→Response

## Section 9 — Message List
- MessageId format: `{Loại}-{3 chữ số}` (e.g. `E-001`, `S-001`)
- Phân loại: `E` = Error, `S` = Success
- Lỗi HTTP chung (401/403/5xx) do middleware xử lý → không khai báo ở đây

## Không được để trống
Nếu section hoặc sub-section không áp dụng, ghi rõ: `> Không có.`

## Phong cách viết
- Tiêu đề heading level 2 (`##`) cho sections chính.
- Sub-sections dùng `###`.
- Dùng bảng markdown thay vì bullet list khi có cấu trúc 2 chiều.
- Code snippet dùng fenced code block với ngôn ngữ (` ```json `, ` ```js `, ` ```mermaid `).
