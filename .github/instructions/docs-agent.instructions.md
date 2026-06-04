---
applyTo: "demo_docs/**"
---
# Docs Agent Instructions

## Vai trò
Giữ tài liệu (`demo_docs/`) đồng bộ với code thực tế.

## Quy ước tên file tài liệu

| Loại | Format | Ví dụ |
|------|--------|-------|
| Screen design | `[Design][SCREEN] {ScreenCode}_{ScreenName}.md` | `[Design][SCREEN] ADMIN_LOGIN_DangNhap.md` |
| API design | `[Design][API] API{ID}_{Group}_{Name}.md` | `[Design][API] API01_Auth_DangNhap.md` |
| List/Index | `[Design][LIST] {Name}.md` | `[Design][LIST] API_DanhSachEndpoint.md` |
| Database | `[Design][DB] {Name}.md` | `[Design][DB] DATABASE_Schema.md` |
| Test Case ITa | `[Test][ITa] TC_{Name}.md` | `[Test][ITa] TC_CreatePost.md` |
| Test Case ITb | `[Test][ITb] TC_{Name}.md` | `[Test][ITb] TC_PublishFlow.md` |

## Nguyên tắc
- Docs phải phản ánh code tại thời điểm hiện tại — không được lệch.
- Nếu code đổi contract (endpoint, field, status code) → docs phải đổi theo ngay.
- Không tự ý thêm endpoint/field vào docs nếu code chưa có.
- Trước khi tạo/cập nhật API docs hoặc FE screen docs có message hiển thị cho user, bắt buộc đọc `demo_docs/[Design][COMMON] MESSAGE_Catalog.md`.
- Nếu Message ID đã tồn tại trong Message Catalog thì phải dùng lại; nếu chưa có thì thêm mới vào Message Catalog trước, sau đó reference lại trong API/FE docs.
- API docs phải mô tả response lỗi có `messageId` và `message`; FE screen docs Section 12 phải dùng Message ID từ Message Catalog, không tự tạo ID local trùng nghĩa.

## Format chuẩn file API doc (Backend)
- Bắt buộc tuân thủ chuẩn **10 sections + Change Log** (có YAML Frontmatter, Bảng DB liên quan, Validation Rules dạng V-xx, Sequence Diagram, Data Mapping, Message List, Query IDs mapping với Knex.js).
- Sử dụng skill `doc-be-implement` để tạo/cập nhật.
- Sử dụng skill `doc-be-review` để kiểm tra.

## Format chuẩn file Screen doc (Frontend)
- Bắt buộc tuân thủ chuẩn **12 sections + Change Log** (có YAML Frontmatter, Ma trận trạng thái UI, Request/Response Mapping, Sequence Diagram, Message List).
- Sử dụng skill `doc-fe-implement` để tạo/cập nhật.
- Sử dụng skill `doc-fe-review` để kiểm tra.

## Format chuẩn file Test Case ITa (Functional Integration)
- Bắt buộc tuân thủ cấu trúc Data-Driven Testing theo `demo_docs/tests/ITa/TEMPLATE_ITa.md`.
- Phải bao phủ 100% các Viewpoint trong `VIEWPOINT_ITa.md`.
- Sử dụng skill `doc-ita-implement` để tạo và `doc-ita-review` để kiểm tra.

## Format chuẩn file Test Case ITb (Scenario Integration)
- Bắt buộc tuân thủ cấu trúc luồng theo `demo_docs/tests/ITb/TEMPLATE_ITb.md`.
- Phải bao phủ 100% các Viewpoint trong `VIEWPOINT_ITb.md`.
- Sử dụng skill `doc-itb-implement` để tạo và `doc-itb-review` để kiểm tra.

## Checklist REVIEW docs chung
- [ ] Method/path/request body/response fields khớp code thực
- [ ] Status code edge case ghi đúng
- [ ] Ví dụ request/response còn valid
- [ ] Không có endpoint được ghi trong docs nhưng chưa implement
- [ ] DB schema trong `database.md` khớp migration thực tế
