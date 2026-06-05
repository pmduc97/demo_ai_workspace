---
id: ITa_ADMIN_LOGIN
name: Kiểm thử chức năng Đăng nhập
target_screen: demo_docs/fe/[Design][SCREEN] ADMIN_LOGIN_DangNhap.md
target_api: 
  - demo_docs/api/[Design][API] API01_Auth_DangNhap.md
status: DRAFT
---

# ITa: Kiểm thử chức năng Đăng nhập

## 1. Mục đích (Overview)
Kiểm thử tích hợp chức năng Đăng nhập trên giao diện Admin, đảm bảo form hoạt động đúng, gọi đúng API `/api/auth/login`, xử lý chính xác các phản hồi từ server (thành công, sai thông tin, lỗi server) và lưu trữ JWT/User vào context thành công.

## 2. Điều kiện tiền quyết (Pre-conditions)
- PostgreSQL database `hoian_blog` đã migrate và seed.
- User chưa đăng nhập (không có token trong localStorage/context).
- Đang đứng tại trang `/admin/login`.
- Dữ liệu kiểm thử được setup theo mục 5.1 trước khi chạy suite.

---

## 3. Validation Field Inventory (Bảng kiểm kê Validate)

| Field ID | Field Name | Data Type | Validation Type | Rule/Constraint | Message Code | TC cần tạo |
|---|---|---|---|---|---|---|
| `email` | Email đăng nhập | String | Required, Format | Bắt buộc, đúng định dạng email | `AUTH-E-001`, `AUTH-E-004` | `TC_UI_001`, `TC_UI_002` |
| `password` | Mật khẩu | String | Required, MinLength | Bắt buộc, tối thiểu 6 ký tự | `AUTH-E-001`, `AUTH-E-005` | `TC_UI_003`, `TC_UI_004` |

---

## 4. ITa Checklist (Danh sách Test Case)

| TC ID | Scenario | Test Target | Title | Viewpoint (TV) | Priority | Type |
|---|---|---|---|---|---|---|
| `TC_UI_001` | Validate | `email` | Bỏ trống Email | TV-02 | High | `[UI]` |
| `TC_UI_002` | Validate | `email` | Email sai định dạng | TV-02 | High | `[UI]` |
| `TC_UI_003` | Validate | `password` | Bỏ trống Mật khẩu | TV-02 | High | `[UI]` |
| `TC_UI_004` | Validate | `password` | Mật khẩu dưới 6 ký tự | TV-02 | High | `[UI]` |
| `TC_API_001` | Error | Form | Đăng nhập với email không tồn tại | TV-04 | High | `[API]` |
| `TC_API_002` | Error | Form | Đăng nhập với sai mật khẩu | TV-04 | High | `[API]` |
| `TC_API_003` | Happy Path | Form | Đăng nhập thành công với tài khoản Admin | TV-01 | High | `[API]` |
| `TC_API_004` | Happy Path | Form | Đăng nhập thành công với tài khoản Member | TV-01 | High | `[API]` |

---

## 5. Dữ liệu Test (Test Data)

### 5.1. Dữ liệu nền (Setup Data - DB State)
```sql
-- Xóa data cũ để clean state
DELETE FROM users WHERE email IN ('admin_test@hoianblog.vn', 'member_test@hoianblog.vn');

-- Tạo dữ liệu mẫu (password123 đã hash)
INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at) VALUES 
('Admin Test', 'admin_test@hoianblog.vn', '$2b$10$X7/1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6', 'admin', 'active', NOW(), NOW()),
('Member Test', 'member_test@hoianblog.vn', '$2b$10$X7/1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6', 'member', 'active', NOW(), NOW());
```

### 5.2. Dữ liệu đầu vào (Input Data Sets)

| Data ID | `email` | `password` | Ghi chú (Mục đích) |
|---|---|---|---|
| `TD_VALID_ADMIN` | `admin_test@hoianblog.vn` | `password123` | Đăng nhập thành công Admin |
| `TD_VALID_MEMBER` | `member_test@hoianblog.vn` | `password123` | Đăng nhập thành công Member |
| `TD_INV_EMAIL_NOT_EXIST` | `not_exist@hoianblog.vn` | `password123` | Email không tồn tại |
| `TD_INV_WRONG_PASS` | `admin_test@hoianblog.vn` | `wrongpass` | Sai mật khẩu |

---

## 6. Kịch bản Kiểm thử Chi tiết (TC Detail)

| TC ID | Viewpoint | Test Target | Precondition | Procedure (Các bước) | Expected Result (Kết quả mong đợi) |
|---|---|---|---|---|---|
| `TC_UI_001` | TV-02 | `email` | Đang ở trang Login | 1. Bỏ trống Email<br>2. Nhập Password hợp lệ<br>3. Click Đăng Nhập | 1. **[UI]** Hiển thị lỗi "Vui lòng nhập email" |
| `TC_UI_002` | TV-02 | `email` | Đang ở trang Login | 1. Nhập Email sai định dạng (vd: `abc`)<br>2. Nhập Password hợp lệ<br>3. Click Đăng Nhập | 1. **[UI]** Hiển thị lỗi "Email không hợp lệ" |
| `TC_UI_003` | TV-02 | `password` | Đang ở trang Login | 1. Nhập Email hợp lệ<br>2. Bỏ trống Password<br>3. Click Đăng Nhập | 1. **[UI]** Hiển thị lỗi "Vui lòng nhập mật khẩu" |
| `TC_UI_004` | TV-02 | `password` | Đang ở trang Login | 1. Nhập Email hợp lệ<br>2. Nhập Password dưới 6 ký tự (vd: `12345`)<br>3. Click Đăng Nhập | 1. **[UI]** Hiển thị lỗi "Mật khẩu phải có ít nhất 6 ký tự" |
| `TC_API_001` | TV-04 | Form | Đang ở trang Login | 1. Nhập `TD_INV_EMAIL_NOT_EXIST`<br>2. Click Đăng Nhập | 1. **[API]** Gọi API trả về 401<br>2. **[UI]** Hiển thị lỗi "Email hoặc mật khẩu không chính xác" |
| `TC_API_002` | TV-04 | Form | Đang ở trang Login | 1. Nhập `TD_INV_WRONG_PASS`<br>2. Click Đăng Nhập | 1. **[API]** Gọi API trả về 401<br>2. **[UI]** Hiển thị lỗi "Email hoặc mật khẩu không chính xác" |
| `TC_API_003` | TV-01 | Form | Đang ở trang Login | 1. Nhập `TD_VALID_ADMIN`<br>2. Click Đăng Nhập | 1. **[API]** Gọi API trả về 200 kèm token và user info<br>2. **[UI]** Chuyển hướng sang `/admin/dashboard` |
| `TC_API_004` | TV-01 | Form | Đang ở trang Login | 1. Nhập `TD_VALID_MEMBER`<br>2. Click Đăng Nhập | 1. **[API]** Gọi API trả về 200 kèm token và user info<br>2. **[UI]** Chuyển hướng sang `/admin/dashboard` |
