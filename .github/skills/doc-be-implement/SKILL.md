---
name: doc-be-implement
description: "BE API design doc workflow for Blog Hoi An/Da Nang. Use when writing, updating, or standardizing a backend API specification document. Ensures consistent 7-section format with YAML frontmatter, request/response mapping, business logic with Query IDs, and Knex.js snippets. Trigger phrases: write api doc, update api spec, standardize api doc, create api design, doc be, api spec."
argument-hint: "Tên file API cần viết/update (e.g. API01_Auth_DangNhap)"
---

# Doc BE Implement Skill

## Mục tiêu
Viết mới hoặc cập nhật một BE API design doc đúng format chuẩn 10 sections + Change Log, đảm bảo logic xử lý rõ ràng, Validation Rules có ID, Sequence Diagram cho luồng phức tạp, và map chính xác với Database thông qua Query IDs để BE Dev có thể code ngay lập tức.

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

### Bước 2 — Áp dụng 10-section template
Xem template đầy đủ tại [api-template.md](./references/api-template.md).

Bắt buộc có đủ 10 sections (+ Change Log):
- **Change Log** — bảng Ver/Ngày/Nội dung/Người tạo, ngay sau frontmatter.
1. **Tổng quan** — mô tả ngắn mục đích API + bảng Tài liệu tham chiếu.
2. **Thông tin chung** — bảng Method, Endpoint, Auth, Role, Controller + Bảng DB liên quan.
3. **Request** — bảng Headers/Params + bảng Body Payload 7 cột (Logical Name, Physical Field, Kiểu, Bắt buộc, Ràng buộc, Chuẩn hóa input, Mô tả) + JSON example.
4. **Validation Rules** — bảng rule dạng ID (V-01, V-02...): Đối tượng / Quy tắc / MessageId / HTTP Status.
5. **Response** — bảng Thành công (200/201) + JSON example + bảng Lỗi với Error Code chuẩn hóa.
6. **Sequence Diagram** — Mermaid diagram Client→Controller→DB + nhánh lỗi (hoặc "Không có" nếu API đơn giản).
7. **Logic xử lý** — step-by-step, gắn thẻ `[Q1]`, `[Q2]` vào các bước gọi DB.
8. **Database Queries & Mapping** — bảng Query ID + Điều kiện OK/NG + Knex.js snippet + Data Mapping (Request→SQL và DB→Response).
9. **Message List** — bảng MessageId / Loại / HTTP Status / Nội dung / Điều kiện.
10. **Side Effects** — liệt kê tác động ngoài DB (hoặc "Không có").

### Bước 3 — Kiểm tra tính đồng bộ Database
- Mọi thẻ `[Q1]`, `[Q2]` trong Section 7 phải được định nghĩa chi tiết trong Section 8.
- Các field trong Request/Response phải khớp với kiểu dữ liệu trong Database Schema.
- Mỗi Validation Rule (V-xx) trong Section 4 phải có MessageId tương ứng trong Section 9.

### Bước 4 — Validate format
Xem rules đầy đủ tại [format-rules.md](./references/format-rules.md).

Checklist nhanh:
- [ ] Có YAML frontmatter (version, created, updated, status).
- [ ] Có Change Log (bảng Ver/Ngày/Nội dung/Người tạo).
- [ ] Đủ 10 sections, đúng thứ tự.
- [ ] Section 2 có Bảng DB liên quan.
- [ ] Section 3 Body Payload có đủ 7 cột (bao gồm Logical Name, Chuẩn hóa input).
- [ ] Section 4 có Validation Rules dạng ID (V-01, V-02...).
- [ ] Section 5 có Error Code chuẩn hóa (ERR_xxx).
- [ ] Section 6 có Sequence Diagram Mermaid (hoặc ghi "Không có" có lý do).
- [ ] Section 7 và 8 có sử dụng Query IDs mapping + Điều kiện OK/NG.
- [ ] Section 8 có Data Mapping (Request→SQL và DB→Response).
- [ ] Section 9 có Message List đầy đủ.
- [ ] Không có section trống (ghi "Không có" nếu không dùng).

## Output
```
### Files changed
- demo_docs/api/[Design][API] API{ID}_{Group}_{Name}.md

### Sections added/updated
- [x] YAML frontmatter
- [x] Change Log
- [x] 1. Tổng quan (+ Tài liệu tham chiếu)
- [x] 2. Thông tin chung (+ Bảng DB liên quan)
- [x] 3. Request (+ Logical Name, Chuẩn hóa input)
- [x] 4. Validation Rules (V-01 → V-xx)
- [x] 5. Response (+ Error Code)
- [x] 6. Sequence Diagram
- [x] 7. Logic xử lý
- [x] 8. Database Queries & Mapping (+ Data Mapping)
- [x] 9. Message List
- [x] 10. Side Effects

### Database Mapping verified
- [Q1] SELECT users → ✓

### Validation Rules verified
- V-01 → MessageId E-001 → ✓
```

---

## 📝 Ghi Log Bắt Buộc

Sau khi hoàn thành skill này, **PHẢI** ghi log vào `reports/AGENT_EXECUTION_LOG.md` trước khi báo cáo kết quả.

Dùng template sau (copy và điền vào):

```markdown
### [YYYY-MM-DD HH:mm:ss] - {be-agent | fe-agent | test-agent | playwright-agent | docs-agent}
- **Task**: {Mô tả ngắn gọn việc vừa làm}
- **Skill Used**: {tên skill này}
- **Target Feature**: {key trong PROJECT_MANIFEST.yml, ví dụ: auth_login}
- **Files Processed**:
  - `path/to/file` [Modified]
  - `path/to/file` [Verified/Unchanged]
- **Status**: SUCCESS | FAILED | PARTIAL
- **Notes**: {Ghi chú: findings, residual risks, việc chưa làm}
```

> ⚠️ Nếu bị interrupt, ghi `Status: PARTIAL` và ghi rõ đã làm đến bước nào.
> ⚠️ Sau khi ghi log, cập nhật `cycle_checkpoint` trong `PROJECT_MANIFEST.yml`.
