---
id: ITa_[FEATURE_CODE]
name: Kiểm thử chức năng [Tên chức năng]
target_screen: [Đường dẫn file Screen Design]
target_api: [Đường dẫn file API Design]
status: DRAFT
---

# ITa: Kiểm thử chức năng [Tên chức năng]

## 1. Mục đích (Overview)
[Mô tả ngắn gọn mục đích của test case này, ví dụ: Kiểm tra tính năng tạo bài viết mới trên giao diện Admin, đảm bảo form hoạt động đúng, gọi đúng API và xử lý chính xác các phản hồi từ server.]

## 2. Điều kiện tiền quyết (Pre-conditions)
- [Điều kiện 1, ví dụ: User đã đăng nhập với role admin]
- [Điều kiện 2, ví dụ: Đang đứng tại trang /admin/posts/new]

---

## 3. Validation Field Inventory (Bảng kiểm kê Validate)
*Liệt kê tất cả các trường có validation từ tài liệu thiết kế để đảm bảo không bỏ sót.*

| Field ID | Field Name | Data Type | Validation Type | Rule/Constraint | Message Code | TC cần tạo |
|---|---|---|---|---|---|---|
| `[field_id]` | [Tên trường] | [Type] | [Required/MaxLength/...] | [Quy tắc cụ thể] | `[MSG_CODE]` | `[TC_ID]` |

## 4. ITa Checklist (Danh sách Test Case)
*Tóm tắt danh sách các Test Case sẽ thực hiện. Thứ tự ưu tiên: Validate -> Happy Path -> Permission -> Pagination -> Error.*

| TC ID | Scenario | Test Target | Title | Viewpoint (TV) | Priority | Type |
|---|---|---|---|---|---|---|
| `[TC_ID]` | [Validate/Happy/Error] | `[field_id]` hoặc Form | [Tiêu đề TC] | [TV-xx] | [High/Medium] | `[UI]` hoặc `[API]` |

---

## 5. Dữ liệu Test (Test Data)

### 5.1. Dữ liệu nền (Setup Data - DB State)
*Dữ liệu bắt buộc phải được insert vào DB trước khi chạy test suite này.*
```sql
-- Xóa data cũ để clean state
DELETE FROM [table_name] WHERE [condition];

-- Tạo dữ liệu mẫu
INSERT INTO [table_name] (col1, col2) VALUES 
(val1, val2);
```

### 5.2. Dữ liệu đầu vào (Input Data Sets)
*Các bộ dữ liệu dùng để nhập vào form hoặc gọi API.*

| Data ID | `[field_1]` | `[field_2]` | Ghi chú (Mục đích) |
|---|---|---|---|
| `TD_VALID_01` | [Giá trị hợp lệ] | [Giá trị hợp lệ] | Dữ liệu chuẩn, đầy đủ thông tin |
| `TD_INV_EMPTY` | `""` (Rỗng) | [Giá trị] | Test lỗi bỏ trống trường bắt buộc |
| `TD_INV_MAX` | `[Chuỗi quá dài]` | [Giá trị] | Test lỗi vượt quá độ dài cho phép |

---

## 6. Kịch bản Kiểm thử Chi tiết (TC Detail)
*Bảng chi tiết các bước thực hiện. Áp dụng nguyên tắc: 1 Condition = 1 TC, Step và Expected Result phải đánh số tương ứng.*

| TC ID | Viewpoint | Test Target | Precondition | Procedure (Các bước) | Expected Result (Kết quả mong đợi) |
|---|---|---|---|---|---|
| `[TC_ID]` | [TV-xx] | `[Target]` | [Điều kiện] | 1. [Bước 1]<br>2. [Bước 2] | 1. [Kết quả 1]<br>2. **[UI]** [Kết quả UI]<br>**[API]** [Kết quả API] |
