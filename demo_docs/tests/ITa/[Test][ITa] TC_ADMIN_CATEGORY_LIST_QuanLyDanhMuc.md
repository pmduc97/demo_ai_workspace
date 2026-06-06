---
id: ITa_ADMIN_CATEGORY_LIST
name: Kiểm thử chức năng Quản lý danh mục
target_screen: demo_docs/fe/[Design][SCREEN] ADMIN_CATEGORY_LIST_QuanLyDanhMuc.md
target_api: 
  - demo_docs/api/[Design][API] API14_Categories_DanhSach.md
  - demo_docs/api/[Design][API] API16_Categories_Tao.md
  - demo_docs/api/[Design][API] API17_Categories_CapNhat.md
  - demo_docs/api/[Design][API] API18_Categories_Xoa.md
status: DRAFT
---

# ITa: Kiểm thử chức năng Quản lý danh mục

## 1. Mục đích (Overview)
Kiểm tra tính năng Quản lý danh mục trên giao diện Admin, bao gồm xem danh sách (có phân trang, tìm kiếm, lọc, sắp xếp), thêm mới, cập nhật, và xóa mềm danh mục. Đảm bảo form hoạt động đúng, gọi đúng API, xử lý chính xác các phản hồi từ server và phân quyền đúng (chỉ Admin).

## 2. Điều kiện tiền quyết (Pre-conditions)
> **Lưu ý:** Quá trình test phải sử dụng Condition-Based Waiting (chờ element, chờ API response), tuyệt đối không dùng hard sleep (`waitForTimeout`).
- User đã đăng nhập với role `admin`.
- Đang đứng tại trang `/admin/categories`.

---

## 3. Validation Field Inventory (Bảng kiểm kê Validate)

| Field ID | Field Name | Data Type | Validation Type | Rule/Constraint | Message Code | TC cần tạo |
|---|---|---|---|---|---|---|
| `name` | Tên danh mục | String | Required, MinLength | Bắt buộc, min 2 ký tự | `CATEGORY-E-001` | TC_VAL_01, TC_VAL_02 |
| `slug` | Slug | String | Required, Format, Unique | Bắt buộc, chỉ a-z, 0-9, `-`, unique | `CATEGORY-E-001`, `CATEGORY-E-002` | TC_VAL_03, TC_VAL_04, TC_VAL_05 |
| `description` | Mô tả | String | MaxLength | Max 500 ký tự | `CATEGORY-E-001` | TC_VAL_06 |
| `status` | Trạng thái | String | Enum | `active`, `hidden` | `CATEGORY-E-001` | TC_VAL_07 |
| `thumbnail_url` | Ảnh đại diện | String | MaxLength | Max 255 ký tự | `CATEGORY-E-001` | TC_VAL_08 |
| `seo_title` | Tiêu đề SEO | String | MaxLength | Max 70 ký tự | `CATEGORY-E-001` | TC_VAL_09 |
| `seo_description` | Mô tả SEO | String | MaxLength | Max 160 ký tự | `CATEGORY-E-001` | TC_VAL_10 |

---

## 4. ITa Checklist (Danh sách Test Case)

| TC ID | Scenario | Test Target | Title | Viewpoint (TV) | Priority | Type |
|---|---|---|---|---|---|---|
| `TC_VAL_01` | Validate | `name` | Bỏ trống Tên danh mục | TV-02 | High | `[UI]` |
| `TC_VAL_02` | Validate | `name` | Tên danh mục dưới 2 ký tự | TV-02 | High | `[UI]` |
| `TC_VAL_03` | Validate | `slug` | Bỏ trống Slug | TV-02 | High | `[UI]` |
| `TC_VAL_04` | Validate | `slug` | Slug sai định dạng (chứa ký tự đặc biệt) | TV-02 | High | `[UI]` |
| `TC_VAL_05` | Error | `slug` | Slug đã tồn tại trong hệ thống | TV-04 | High | `[API]` |
| `TC_VAL_06` | Validate | `description` | Mô tả vượt quá 500 ký tự | TV-02 | Medium | `[UI]` |
| `TC_VAL_07` | Validate | `thumbnail_url` | Ảnh đại diện vượt quá 255 ký tự | TV-02 | Medium | `[UI]` |
| `TC_VAL_08` | Validate | `seo_title` | Tiêu đề SEO vượt quá 70 ký tự | TV-02 | Medium | `[UI]` |
| `TC_VAL_09` | Validate | `seo_description` | Mô tả SEO vượt quá 160 ký tự | TV-02 | Medium | `[UI]` |
| `TC_VAL_10` | Validate | `description` | Mô tả đúng 500 ký tự (exact-max) | TV-03 | High | `[API]` |
| `TC_VAL_11` | Validate | `thumbnail_url` | Ảnh đại diện đúng 255 ký tự (exact-max) | TV-03 | High | `[API]` |
| `TC_VAL_12` | Validate | `seo_title` | Tiêu đề SEO đúng 70 ký tự (exact-max) | TV-03 | High | `[API]` |
| `TC_VAL_13` | Validate | `seo_description` | Mô tả SEO đúng 160 ký tự (exact-max) | TV-03 | High | `[API]` |
| `TC_HP_01` | Happy | Form | Tạo danh mục thành công với đầy đủ thông tin | TV-03 | High | `[API]` |
| `TC_HP_02` | Happy | Form | Cập nhật danh mục thành công | TV-03 | High | `[API]` |
| `TC_HP_03` | Happy | Form | Xóa mềm danh mục thành công | TV-03 | High | `[API]` |
| `TC_HP_04` | Happy | List | Tìm kiếm, lọc, sắp xếp và phân trang danh sách | TV-08 | High | `[API]` |
| `TC_PER_01` | Permission | Page | Truy cập trang quản lý danh mục với role member | TV-04 | High | `[UI]` |
| `TC_ERR_01` | Error | API | Xóa danh mục không tồn tại | TV-04 | Medium | `[API]` |
| `TC_UI_01` | UI | List | Hiển thị Empty State khi danh sách rỗng | TV-07 | Medium | `[UI]` |
| `TC_UI_02` | UI | Form | Ngăn chặn Double-click khi submit form | TV-10 | Medium | `[UI]` |

---

## 5. Dữ liệu Test (Test Data)

> **Lưu ý:** Test Data được lấy trực tiếp từ DB thật qua MCP (không dùng data giả hardcode). Các câu lệnh SQL dưới đây mang tính chất tham khảo cấu trúc.

### 5.1. Dữ liệu nền (Setup Data - DB State)
```sql
-- Xóa data cũ để clean state
DELETE FROM categories WHERE slug IN ('test-category-1', 'test-category-2', 'duplicate-slug');

-- Tạo dữ liệu mẫu
INSERT INTO categories (name, slug, description, status, created_by, updated_by) VALUES 
('Duplicate Slug', 'duplicate-slug', 'Category for duplicate slug test', 'active', 4, 4),
('Test Category 1', 'test-category-1', 'Test category 1', 'active', 4, 4),
('Test Category 2', 'test-category-2', 'Test category 2', 'hidden', 4, 4);
```

### 5.2. Dữ liệu đầu vào (Input Data Sets)

| Data ID | `name` | `slug` | `description` | `status` | Ghi chú (Mục đích) |
|---|---|---|---|---|---|
| `TD_VALID_01` | `Danh mục mới` | `danh-muc-moi` | `Mô tả danh mục mới` | `active` | Dữ liệu chuẩn để tạo mới |
| `TD_VALID_02` | `Cập nhật DM` | `cap-nhat-dm` | `Mô tả cập nhật` | `hidden` | Dữ liệu chuẩn để cập nhật |
| `TD_VALID_EXACT_MAX` | `Tên DM` | `ten-dm` | `[Chuỗi đúng 500 ký tự]` | `active` | Dữ liệu biên hợp lệ (exact-max) |
| `TD_INV_NAME_EMPTY` | `""` | `slug-hop-le` | `""` | `active` | Test lỗi bỏ trống tên |
| `TD_INV_NAME_SHORT` | `A` | `a` | `""` | `active` | Test lỗi tên quá ngắn |
| `TD_INV_SLUG_FORMAT` | `Danh mục` | `danh muc!` | `""` | `active` | Test lỗi slug sai định dạng |
| `TD_INV_SLUG_DUP` | `Duplicate` | `duplicate-slug` | `""` | `active` | Test lỗi trùng slug |

---

## 6. Kịch bản Kiểm thử Chi tiết (TC Detail)

| TC ID | Viewpoint | Test Target | Precondition | Procedure (Các bước) | Expected Result (Kết quả mong đợi) |
|---|---|---|---|---|---|
| `TC_VAL_01` | TV-02 | `name` | Đang mở modal Thêm danh mục | 1. Bỏ trống trường [Tên danh mục]<br>2. Nhập các trường khác hợp lệ<br>3. Click [Nút Thêm] | 1. **[UI]** Hiển thị lỗi "Tên danh mục là bắt buộc" dưới trường Tên danh mục.<br>2. **[UI]** Nút Thêm bị disable hoặc không gọi API. |
| `TC_VAL_02` | TV-02 | `name` | Đang mở modal Thêm danh mục | 1. Nhập "A" vào trường [Tên danh mục]<br>2. Nhập các trường khác hợp lệ<br>3. Click [Nút Thêm] | 1. **[UI]** Hiển thị lỗi "Tên danh mục phải có ít nhất 2 ký tự".<br>2. **[UI]** Nút Thêm bị disable hoặc không gọi API. |
| `TC_VAL_04` | TV-02 | `slug` | Đang mở modal Thêm danh mục | 1. Nhập "danh muc!" vào trường [Slug]<br>2. Nhập các trường khác hợp lệ<br>3. Click [Nút Thêm] | 1. **[UI]** Hiển thị lỗi "Slug chỉ được chứa chữ cái, số và dấu gạch ngang".<br>2. **[UI]** Nút Thêm bị disable hoặc không gọi API. |
| `TC_VAL_05` | TV-04 | `slug` | Đang mở modal Thêm danh mục | 1. Nhập `TD_INV_SLUG_DUP` vào form<br>2. Click [Nút Thêm] | 1. **[API]** API trả về 409 Conflict.<br>2. **[UI]** Hiển thị lỗi `CATEGORY-E-002` (Slug danh mục đã tồn tại) dưới trường Slug. |
| `TC_HP_01` | TV-03 | Form | Đang mở modal Thêm danh mục | 1. Nhập `TD_VALID_01` vào form<br>2. Click [Nút Thêm] | 1. **[API]** API trả về 201 Created.<br>2. **[UI]** Đóng modal, hiển thị toast `CATEGORY-S-001`.<br>3. **[UI]** Danh sách reload và hiển thị danh mục vừa tạo. |
| `TC_HP_02` | TV-03 | Form | Đang ở danh sách danh mục | 1. Click [Nút Sửa] trên dòng "Test Category 1"<br>2. Nhập `TD_VALID_02` vào form inline<br>3. Click [Nút Lưu] | 1. **[API]** API trả về 200 OK.<br>2. **[UI]** Hiển thị toast `CATEGORY-S-002`.<br>3. **[UI]** Dòng dữ liệu cập nhật thành thông tin mới. |
| `TC_HP_03` | TV-03 | Form | Đang ở danh sách danh mục | 1. Click [Nút Xóa] trên dòng "Test Category 2"<br>2. Click [Nút Xóa] trên ConfirmModal | 1. **[API]** API trả về 200 OK.<br>2. **[UI]** Đóng modal, hiển thị toast `CATEGORY-S-003`.<br>3. **[UI]** Danh sách reload và danh mục "Test Category 2" biến mất. |
| `TC_HP_04` | TV-08 | List | Đang ở danh sách danh mục | 1. Nhập "Test" vào ô Tìm kiếm<br>2. Chọn Trạng thái "active"<br>3. Click [Nút Search] | 1. **[API]** API gọi GET với query `keyword=Test&status=active`.<br>2. **[UI]** Danh sách chỉ hiển thị các danh mục thỏa mãn điều kiện. |
| `TC_PER_01` | TV-04 | Page | Đăng nhập với role `member` | 1. Truy cập URL `/admin/categories` | 1. **[UI]** Bị redirect về `/admin/dashboard` (hoặc trang chủ).<br>2. **[UI]** Hiển thị toast lỗi không có quyền truy cập. |
| `TC_VAL_10` | TV-03 | `description` | Đang mở modal Thêm danh mục | 1. Nhập chuỗi đúng 500 ký tự vào trường [Mô tả]<br>2. Nhập các trường bắt buộc hợp lệ<br>3. Click [Nút Thêm] | 1. **[API]** API trả về 201 Created.<br>2. **[UI]** Tạo thành công, không báo lỗi độ dài. |
| `TC_VAL_11` | TV-03 | `thumbnail_url` | Đang mở modal Thêm danh mục | 1. Nhập chuỗi đúng 255 ký tự vào trường [Ảnh đại diện]<br>2. Nhập các trường bắt buộc hợp lệ<br>3. Click [Nút Thêm] | 1. **[API]** API trả về 201 Created.<br>2. **[UI]** Tạo thành công, không báo lỗi độ dài. |
| `TC_VAL_12` | TV-03 | `seo_title` | Đang mở modal Thêm danh mục | 1. Nhập chuỗi đúng 70 ký tự vào trường [Tiêu đề SEO]<br>2. Nhập các trường bắt buộc hợp lệ<br>3. Click [Nút Thêm] | 1. **[API]** API trả về 201 Created.<br>2. **[UI]** Tạo thành công, không báo lỗi độ dài. |
| `TC_VAL_13` | TV-03 | `seo_description` | Đang mở modal Thêm danh mục | 1. Nhập chuỗi đúng 160 ký tự vào trường [Mô tả SEO]<br>2. Nhập các trường bắt buộc hợp lệ<br>3. Click [Nút Thêm] | 1. **[API]** API trả về 201 Created.<br>2. **[UI]** Tạo thành công, không báo lỗi độ dài. |
| `TC_UI_01` | TV-07 | List | DB không có danh mục nào (hoặc filter không ra kết quả) | 1. Truy cập trang danh sách danh mục | 1. **[UI]** Hiển thị Empty State với thông báo "Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!".<br>2. **[UI]** Bảng không bị vỡ layout. |
| `TC_UI_02` | TV-10 | Form | Đang mở modal Thêm danh mục | 1. Nhập dữ liệu hợp lệ<br>2. Click liên tục (double-click) vào [Nút Thêm] | 1. **[UI]** Nút Thêm bị disable ngay sau lần click đầu tiên.<br>2. **[API]** Chỉ có 1 request POST được gửi đi, không tạo ra dữ liệu trùng lặp. |
