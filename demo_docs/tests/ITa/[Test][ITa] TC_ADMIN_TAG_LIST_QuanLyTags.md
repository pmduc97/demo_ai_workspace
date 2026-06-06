---
id: ITa_ADMIN_TAG_LIST
name: Kiểm thử chức năng Quản lý Tags
target_screen: demo_docs/fe/[Design][SCREEN] ADMIN_TAG_LIST_QuanLyTags.md
target_api: demo_docs/api/[Design][API] API29_Tags_DanhSach.md, API30, API31, API32
status: DRAFT
---

# ITa: Kiểm thử chức năng Quản lý Tags

## 1. Mục đích (Overview)
Kiểm thử chức năng Quản lý Tags trên giao diện Admin, bao gồm hiển thị danh sách (phân trang, tìm kiếm), thêm mới, cập nhật và xóa tag. Đảm bảo form hoạt động đúng, gọi đúng API (API29, API30, API31, API32) và xử lý chính xác các phản hồi từ server.

## 2. Điều kiện tiền quyết (Pre-conditions)
- User đã đăng nhập với role `admin`.
- Đang đứng tại trang `/admin/tags`.

---

## 3. Validation Field Inventory (Bảng kiểm kê Validate)

| Field ID | Field Name | Data Type | Validation Type | Rule/Constraint | Message Code | TC cần tạo |
|---|---|---|---|---|---|---|
| `keyword` | Tìm kiếm | Text | MaxLength | Max 100 ký tự | N/A | `TC_TAG_VAL_01` |
| `name` | Tên | Text | Required | Bắt buộc | `TAG-E-001` | `TC_TAG_VAL_02` |
| `name` | Tên | Text | MinLength | Min 2 ký tự | `TAG-E-001` | `TC_TAG_VAL_03` |
| `slug` | Slug | Text | Required | Bắt buộc | `TAG-E-001` | `TC_TAG_VAL_04` |
| `slug` | Slug | Text | Format | Chỉ chứa a-z, 0-9, `-` | `TAG-E-001` | `TC_TAG_VAL_05` |
| `description` | Mô tả | Text | MaxLength | Max 500 ký tự | `TAG-E-001` | `TC_TAG_VAL_06` |

## 4. ITa Checklist (Danh sách Test Case)

| TC ID | Scenario | Test Target | Title | Viewpoint (TV) | Priority | Type |
|---|---|---|---|---|---|---|
| `TC_TAG_VAL_01` | Validate | `keyword` | Lỗi vượt quá 100 ký tự ô tìm kiếm | TV-02 | Medium | `[UI]` |
| `TC_TAG_VAL_02` | Validate | `name` | Lỗi bỏ trống Tên tag | TV-02 | High | `[UI]` |
| `TC_TAG_VAL_03` | Validate | `name` | Lỗi Tên tag dưới 2 ký tự | TV-02 | High | `[UI]` |
| `TC_TAG_VAL_04` | Validate | `slug` | Lỗi bỏ trống Slug | TV-02 | High | `[UI]` |
| `TC_TAG_VAL_05` | Validate | `slug` | Lỗi sai định dạng Slug | TV-02 | High | `[UI]` |
| `TC_TAG_VAL_06` | Validate | `description` | Lỗi Mô tả vượt quá 500 ký tự | TV-02 | Medium | `[UI]` |
| `TC_TAG_HP_01` | Happy Path | Form Thêm | Thêm mới Tag thành công | TV-03 | High | `[API]` |
| `TC_TAG_HP_02` | Happy Path | Form Sửa | Cập nhật Tag thành công | TV-03 | High | `[API]` |
| `TC_TAG_HP_03` | Happy Path | Modal Xóa | Xóa Tag thành công | TV-03 | High | `[API]` |
| `TC_TAG_HP_04` | Happy Path | Modal Xóa | Hủy xóa Tag | TV-03 | Medium | `[UI]` |
| `TC_TAG_LIST_01` | Pagination | Danh sách | Hiển thị danh sách và phân trang | TV-08 | High | `[API]` |
| `TC_TAG_LIST_02` | Filter | Danh sách | Tìm kiếm Tag theo keyword | TV-08 | High | `[API]` |
| `TC_TAG_ERR_01` | Error | `slug` | Lỗi trùng Slug khi thêm mới | TV-04 | High | `[API]` |
| `TC_TAG_ERR_02` | Error | `slug` | Lỗi trùng Slug khi cập nhật | TV-04 | High | `[API]` |

---

## 5. Dữ liệu Test (Test Data)

### 5.1. Dữ liệu nền (Setup Data - DB State)
```sql
-- Xóa data cũ để clean state
DELETE FROM tags;

-- Tạo dữ liệu mẫu
INSERT INTO tags (id, name, slug, description, created_at, updated_at) VALUES 
(1, 'Du lịch biển', 'du-lich-bien', 'Các bài viết về du lịch biển', NOW(), NOW()),
(2, 'Du lịch núi', 'du-lich-nui', 'Các bài viết về du lịch núi', NOW(), NOW()),
(3, 'Ẩm thực', 'am-thuc', 'Khám phá ẩm thực', NOW(), NOW());

-- Reset sequence
SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags));
```

### 5.2. Dữ liệu đầu vào (Input Data Sets)

| Data ID | `name` | `slug` | `description` | Ghi chú (Mục đích) |
|---|---|---|---|---|
| `TD_TAG_VALID_01` | `Văn hóa` | `van-hoa` | `Khám phá văn hóa` | Dữ liệu chuẩn thêm mới |
| `TD_TAG_VALID_02` | `Lễ hội` | `le-hoi` | `Các lễ hội truyền thống` | Dữ liệu chuẩn cập nhật |
| `TD_TAG_INV_NAME_EMPTY` | `""` | `slug-test` | `Mô tả` | Test lỗi bỏ trống Tên |
| `TD_TAG_INV_NAME_MIN` | `A` | `a` | `Mô tả` | Test lỗi Tên dưới 2 ký tự |
| `TD_TAG_INV_SLUG_EMPTY` | `Test` | `""` | `Mô tả` | Test lỗi bỏ trống Slug |
| `TD_TAG_INV_SLUG_FMT` | `Test` | `slug@test` | `Mô tả` | Test lỗi sai định dạng Slug |
| `TD_TAG_INV_DESC_MAX` | `Test` | `test` | `[Chuỗi 501 ký tự]` | Test lỗi Mô tả quá dài |
| `TD_TAG_DUP_SLUG` | `Biển` | `du-lich-bien` | `Mô tả` | Test lỗi trùng Slug |

---

## 6. Kịch bản Kiểm thử Chi tiết (TC Detail)

| TC ID | Viewpoint | Test Target | Precondition | Procedure (Các bước) | Expected Result (Kết quả mong đợi) |
|---|---|---|---|---|---|
| `TC_TAG_VAL_01` | TV-02 | `keyword` | Đang ở trang danh sách Tags | 1. Nhập 101 ký tự vào ô `[Tìm kiếm]` | 1. **[UI]** Ô input không cho phép nhập ký tự thứ 101. |
| `TC_TAG_VAL_02` | TV-02 | `name` | Đang mở modal Thêm mới Tag | 1. Bỏ trống trường `[Tên]`<br>2. Nhập các trường khác hợp lệ<br>3. Click `[Lưu]` | 1. **[UI]** Nút `[Lưu]` bị disable hoặc hiển thị lỗi `TAG-E-001` dưới trường `[Tên]`. Không gọi API. |
| `TC_TAG_VAL_03` | TV-02 | `name` | Đang mở modal Thêm mới Tag | 1. Nhập "A" vào trường `[Tên]`<br>2. Nhập các trường khác hợp lệ<br>3. Click `[Lưu]` | 1. **[UI]** Nút `[Lưu]` bị disable hoặc hiển thị lỗi `TAG-E-001` dưới trường `[Tên]`. Không gọi API. |
| `TC_TAG_VAL_04` | TV-02 | `slug` | Đang mở modal Thêm mới Tag | 1. Nhập hợp lệ trường `[Tên]`<br>2. Xóa trắng trường `[Slug]`<br>3. Click `[Lưu]` | 1. **[UI]** Nút `[Lưu]` bị disable hoặc hiển thị lỗi `TAG-E-001` dưới trường `[Slug]`. Không gọi API. |
| `TC_TAG_VAL_05` | TV-02 | `slug` | Đang mở modal Thêm mới Tag | 1. Nhập hợp lệ trường `[Tên]`<br>2. Nhập "slug@test" vào trường `[Slug]`<br>3. Click `[Lưu]` | 1. **[UI]** Nút `[Lưu]` bị disable hoặc hiển thị lỗi `TAG-E-001` dưới trường `[Slug]`. Không gọi API. |
| `TC_TAG_VAL_06` | TV-02 | `description` | Đang mở modal Thêm mới Tag | 1. Nhập hợp lệ `[Tên]`, `[Slug]`<br>2. Nhập 501 ký tự vào trường `[Mô tả]`<br>3. Click `[Lưu]` | 1. **[UI]** Nút `[Lưu]` bị disable hoặc hiển thị lỗi `TAG-E-001` dưới trường `[Mô tả]`. Không gọi API. |
| `TC_TAG_HP_01` | TV-03 | Form Thêm | Đang mở modal Thêm mới Tag | 1. Nhập dữ liệu `TD_TAG_VALID_01`<br>2. Click `[Lưu]` | 1. **[API]** Gọi API `POST /api/tags` thành công (201).<br>2. **[UI]** Đóng modal, hiển thị toast success, reload danh sách có tag mới. |
| `TC_TAG_HP_02` | TV-03 | Form Sửa | Đang mở modal Sửa Tag (ID=1) | 1. Nhập dữ liệu `TD_TAG_VALID_02`<br>2. Click `[Lưu]` | 1. **[API]** Gọi API `PUT /api/tags/1` thành công (200).<br>2. **[UI]** Đóng modal, hiển thị toast success, reload danh sách thấy tag được cập nhật. |
| `TC_TAG_HP_03` | TV-03 | Modal Xóa | Đang mở modal Xóa Tag (ID=1) | 1. Click `[Xóa]` | 1. **[API]** Gọi API `DELETE /api/tags/1` thành công (200).<br>2. **[UI]** Đóng modal, hiển thị toast success, reload danh sách không còn tag ID=1. |
| `TC_TAG_HP_04` | TV-03 | Modal Xóa | Đang mở modal Xóa Tag (ID=1) | 1. Click `[Hủy]` | 1. **[UI]** Đóng modal, không gọi API xóa, danh sách giữ nguyên. |
| `TC_TAG_LIST_01` | TV-08 | Danh sách | Có > 10 tags trong DB | 1. Truy cập `/admin/tags`<br>2. Click trang 2 trên Pagination | 1. **[API]** Gọi API `GET /api/tags?page=1` rồi `page=2` thành công (200).<br>2. **[UI]** Hiển thị đúng dữ liệu trang 2. |
| `TC_TAG_LIST_02` | TV-08 | Danh sách | Đang ở trang danh sách Tags | 1. Nhập "biển" vào ô `[Tìm kiếm]`<br>2. Click `[Search]` hoặc Enter | 1. **[API]** Gọi API `GET /api/tags?keyword=biển&page=1` thành công (200).<br>2. **[UI]** Danh sách chỉ hiển thị các tag có chứa từ "biển". |
| `TC_TAG_ERR_01` | TV-04 | `slug` | Đang mở modal Thêm mới Tag | 1. Nhập dữ liệu `TD_TAG_DUP_SLUG`<br>2. Click `[Lưu]` | 1. **[API]** Gọi API `POST /api/tags` trả về lỗi 409.<br>2. **[UI]** Hiển thị lỗi `TAG-E-002` dưới trường `[Slug]`. |
| `TC_TAG_ERR_02` | TV-04 | `slug` | Đang mở modal Sửa Tag (ID=2) | 1. Nhập dữ liệu `TD_TAG_DUP_SLUG`<br>2. Click `[Lưu]` | 1. **[API]** Gọi API `PUT /api/tags/2` trả về lỗi 409.<br>2. **[UI]** Hiển thị lỗi `TAG-E-002` dưới trường `[Slug]`. |

