---
id: ITb_[SCENARIO_CODE]
name: Kiểm thử Luồng [Tên luồng nghiệp vụ]
target_screens: 
  - [Screen 1]
  - [Screen 2]
target_apis: 
  - [API 1]
  - [API 2]
status: DRAFT
---

# ITb: Kiểm thử Luồng [Tên luồng nghiệp vụ]

## 1. Mục đích (Overview)
[Mô tả ngắn gọn mục đích của kịch bản này. Ví dụ: Kiểm tra luồng xuất bản bài viết từ lúc Admin tạo nháp, duyệt bài, cho đến khi User bình thường nhìn thấy trên trang chủ.]

## 2. Điều kiện tiền quyết (Pre-conditions)
- [Điều kiện 1, ví dụ: Hệ thống đã có sẵn 1 tài khoản Admin và 1 tài khoản Member]
- [Điều kiện 2, ví dụ: Đã có sẵn danh mục "Tin tức"]

---

## 3. Dữ liệu Test (Test Data)

### 3.1. Dữ liệu nền (Setup Data - DB State)
*Dữ liệu bắt buộc phải được insert vào DB trước khi chạy test suite này.*
```sql
-- Xóa data cũ để clean state
DELETE FROM [table_name] WHERE [condition];

-- Tạo dữ liệu mẫu (Users, Categories...)
INSERT INTO [table_name] (col1, col2) VALUES 
(val1, val2);
```

### 3.2. Dữ liệu luân chuyển (Flow Data)
*Các dữ liệu được tạo ra ở bước trước và dùng lại ở bước sau.*

| Biến (Variable) | Nguồn tạo (Source Step) | Nơi sử dụng (Target Step) | Ghi chú |
|---|---|---|---|
| `[post_id]` | Bước 2 (Tạo bài viết) | Bước 3 (Duyệt bài), Bước 4 (Xem bài) | ID của bài viết vừa tạo |

---

## 4. Kịch bản Kiểm thử (Scenario Steps)

*Kịch bản này mô phỏng một luồng thao tác liên tục của một hoặc nhiều người dùng.*

| Bước | Actor (Role) | Màn hình (Screen) | Hành động (Action) | Kết quả mong đợi (Expected Result) |
|---|---|---|---|---|
| `Step_01` | `[Role]` | `[URL/Screen]` | [Mô tả hành động, VD: Đăng nhập với tài khoản Admin] | - **UI:** Chuyển hướng vào Dashboard.<br>- **State:** Lưu token vào context. |
| `Step_02` | `[Role]` | `[URL/Screen]` | [Mô tả hành động, VD: Tạo bài viết mới trạng thái Draft] | - **API:** Gọi `POST /api/posts` thành công (201).<br>- **DB:** Record được tạo với status='draft'. Lấy `[post_id]`. |
| `Step_03` | `[Role]` | `[URL/Screen]` | [Mô tả hành động, VD: Đăng xuất Admin, đăng nhập Member] | - **UI:** Chuyển hướng đúng, xóa token cũ. |
| `Step_04` | `[Role]` | `[URL/Screen]` | [Mô tả hành động, VD: Member vào trang chủ tìm bài viết `[post_id]`] | - **UI:** KHÔNG nhìn thấy bài viết (vì đang là draft).<br>- **API:** `GET /api/posts` không trả về bài này. |
