---
id: ITa_AUTH_LOGIN
name: Kiểm thử chức năng Đăng nhập
target_screen: demo_docs/fe/[Design][SCREEN] ADMIN_LOGIN_DangNhap.md
target_api: demo_docs/api/[Design][API] API01_Auth_DangNhap.md
status: DRAFT
---

# ITa: Kiểm thử chức năng Đăng nhập

## 1. Mục đích (Overview)
Kiểm tra tính năng đăng nhập cho Admin và Member trên giao diện quản trị. Đảm bảo form validate đúng, gọi API `/api/auth/login` chính xác, xử lý đúng các phản hồi từ server (thành công, sai thông tin) và lưu JWT vào context/localStorage, sau đó chuyển hướng đúng.

## 2. Điều kiện tiền quyết (Pre-conditions)
- User chưa đăng nhập (không có token trong localStorage).
- Đang đứng tại trang `/admin/login`.

---

## 3. Dữ liệu Test (Test Data)

### 3.1. Dữ liệu nền (Setup Data - DB State)
*Dữ liệu bắt buộc phải được insert vào DB trước khi chạy test suite này.*
```sql
-- Xóa data cũ để clean state
DELETE FROM users WHERE email IN ('admin@hoianblog.vn', 'member@hoianblog.vn');

-- Tạo dữ liệu mẫu (password đã được hash bằng bcrypt cho 'password123')
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin', 'admin@hoianblog.vn', '$2b$10$X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w', 'admin'),
('Member', 'member@hoianblog.vn', '$2b$10$X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w.X7/w', 'member');
```

### 3.2. Dữ liệu đầu vào (Input Data Sets)
*Các bộ dữ liệu dùng để nhập vào form hoặc gọi API.*

| Data ID | `email` | `password` | Ghi chú (Mục đích) |
|---|---|---|---|
| `TD_VALID_ADMIN` | `admin@hoianblog.vn` | `password123` | Dữ liệu chuẩn, đăng nhập thành công với role admin |
| `TD_VALID_MEMBER` | `member@hoianblog.vn` | `password123` | Dữ liệu chuẩn, đăng nhập thành công với role member |
| `TD_INV_EMPTY_EMAIL` | `""` (Rỗng) | `password123` | Test lỗi bỏ trống email |
| `TD_INV_EMPTY_PASS` | `admin@hoianblog.vn` | `""` (Rỗng) | Test lỗi bỏ trống password |
| `TD_INV_FORMAT_EMAIL` | `admin_hoianblog.vn` | `password123` | Test lỗi sai format email |
| `TD_INV_SHORT_PASS` | `admin@hoianblog.vn` | `12345` | Test lỗi password dưới 6 ký tự |
| `TD_INV_WRONG_PASS` | `admin@hoianblog.vn` | `wrongpassword` | Test lỗi sai mật khẩu |
| `TD_INV_NOT_FOUND` | `notfound@hoianblog.vn` | `password123` | Test lỗi email không tồn tại |
| `TD_SEC_SQLI` | `' OR 1=1 --` | `password123` | Test bảo mật SQL Injection |

---

## 4. Kịch bản Kiểm thử (Test Cases)

### 4.1. UI Validation (Chỉ test FE, chưa gọi API)

| TC ID | Data ID | Hành động (Action) | Kết quả mong đợi (Expected Result) |
|---|---|---|---|
| `TC_UI_01` | `TD_INV_EMPTY_EMAIL` | Nhập data vào form, click submit | - **UI:** Trình duyệt chặn submit (HTML5 required) hoặc hiển thị lỗi "Vui lòng nhập đầy đủ email và mật khẩu."<br>- **API:** KHÔNG gọi API. |
| `TC_UI_02` | `TD_INV_EMPTY_PASS` | Nhập data vào form, click submit | - **UI:** Trình duyệt chặn submit (HTML5 required) hoặc hiển thị lỗi "Vui lòng nhập đầy đủ email và mật khẩu."<br>- **API:** KHÔNG gọi API. |
| `TC_UI_03` | `TD_INV_FORMAT_EMAIL` | Nhập data vào form, click submit | - **UI:** Trình duyệt chặn submit (HTML5 type="email").<br>- **API:** KHÔNG gọi API. |
| `TC_UI_04` | `TD_INV_SHORT_PASS` | Nhập data vào form, click submit | - **UI:** Trình duyệt chặn submit (HTML5 minLength=6).<br>- **API:** KHÔNG gọi API. |

### 4.2. Happy Path (Luồng thành công FE + BE)

| TC ID | Data ID | Hành động (Action) | Kết quả mong đợi (Expected Result) |
|---|---|---|---|
| `TC_HP_01` | `TD_VALID_ADMIN` | Nhập data vào form, click submit | - **API:** Gọi `POST /api/auth/login` với payload khớp `TD_VALID_ADMIN`. Trả về `200 OK` kèm token và user info.<br>- **UI:** Nút submit hiển thị loading. Sau đó chuyển hướng về `/admin/dashboard`.<br>- **Context:** Token được lưu vào localStorage, user state được cập nhật. |
| `TC_HP_02` | `TD_VALID_MEMBER` | Nhập data vào form, click submit | - **API:** Gọi `POST /api/auth/login` với payload khớp `TD_VALID_MEMBER`. Trả về `200 OK` kèm token và user info.<br>- **UI:** Chuyển hướng về `/admin/dashboard`. |
| `TC_HP_03` | N/A | Truy cập `/admin/login` khi đã có token hợp lệ | - **UI:** Tự động chuyển hướng về `/admin/dashboard` mà không cần hiển thị form đăng nhập. |

### 4.3. Negative Path (Luồng lỗi từ Server)

| TC ID | Data ID | Hành động (Action) | Kết quả mong đợi (Expected Result) |
|---|---|---|---|
| `TC_NP_01` | `TD_INV_WRONG_PASS` | Nhập data vào form, click submit | - **API:** Trả về `401 Unauthorized` với message "Email hoặc mật khẩu không đúng".<br>- **UI:** Hiển thị Error Banner với nội dung "Email hoặc mật khẩu không đúng". Nút submit hết trạng thái loading. |
| `TC_NP_02` | `TD_INV_NOT_FOUND` | Nhập data vào form, click submit | - **API:** Trả về `401 Unauthorized` với message "Email hoặc mật khẩu không đúng".<br>- **UI:** Hiển thị Error Banner với nội dung "Email hoặc mật khẩu không đúng". |
| `TC_NP_03` | `TD_SEC_SQLI` | Nhập data vào form, click submit | - **API:** Trả về `401 Unauthorized` (hoặc 400). Không bị lỗi SQL syntax.<br>- **UI:** Hiển thị Error Banner. |
| `TC_NP_04` | N/A | Ngắt kết nối mạng, click submit | - **UI:** Hiển thị Error Banner "Đăng nhập thất bại" (hoặc lỗi network tương ứng). |
