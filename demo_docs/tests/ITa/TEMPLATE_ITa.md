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

## 3. Dữ liệu Test (Test Data)

### 3.1. Dữ liệu nền (Setup Data - DB State)
*Dữ liệu bắt buộc phải được insert vào DB trước khi chạy test suite này.*
```sql
-- Xóa data cũ để clean state
DELETE FROM [table_name] WHERE [condition];

-- Tạo dữ liệu mẫu
INSERT INTO [table_name] (col1, col2) VALUES 
(val1, val2);
```

### 3.2. Dữ liệu đầu vào (Input Data Sets)
*Các bộ dữ liệu dùng để nhập vào form hoặc gọi API.*

| Data ID | `[field_1]` | `[field_2]` | Ghi chú (Mục đích) |
|---|---|---|---|
| `TD_VALID_01` | [Giá trị hợp lệ] | [Giá trị hợp lệ] | Dữ liệu chuẩn, đầy đủ thông tin |
| `TD_INV_EMPTY` | `""` (Rỗng) | [Giá trị] | Test lỗi bỏ trống trường bắt buộc |
| `TD_INV_MAX` | `[Chuỗi quá dài]` | [Giá trị] | Test lỗi vượt quá độ dài cho phép |

---

## 4. Kịch bản Kiểm thử (Test Cases)

### 4.1. UI Validation (Chỉ test FE, chưa gọi API)

| TC ID | Data ID | Hành động (Action) | Kết quả mong đợi (Expected Result) |
|---|---|---|---|
| `TC_UI_01` | `TD_INV_EMPTY` | Nhập data vào form, click submit | - **UI:** Hiển thị lỗi [Message].<br>- **API:** KHÔNG gọi API. |

### 4.2. Happy Path (Luồng thành công FE + BE)

| TC ID | Data ID | Hành động (Action) | Kết quả mong đợi (Expected Result) |
|---|---|---|---|
| `TC_HP_01` | `TD_VALID_01` | Nhập data vào form, click submit | - **API:** Gọi `[METHOD] [ENDPOINT]` với payload khớp `TD_VALID_01`. Trả về `[STATUS_CODE]`.<br>- **UI:** Hiển thị toast thành công. Chuyển hướng về `[URL]`.<br>- **DB:** Có record mới trong bảng `[table_name]`. |

### 4.3. Negative Path (Luồng lỗi từ Server)

| TC ID | Data ID | Hành động (Action) | Kết quả mong đợi (Expected Result) |
|---|---|---|---|
| `TC_NP_01` | `[TD_ID]` | (Bypass FE) Gửi thẳng API payload | - **API:** Trả về `[STATUS_CODE]` kèm message lỗi.<br>- **DB:** Không có thay đổi. |
