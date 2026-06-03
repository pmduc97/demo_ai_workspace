---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][API] API01_Auth_DangNhap

## 1. Tổng quan
> API dùng để xác thực người dùng (Admin và Member) khi đăng nhập vào hệ thống quản trị. Trả về JWT token để sử dụng cho các request yêu cầu xác thực.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `POST` |
| Endpoint | `/api/auth/login` |
| Auth yêu cầu | Không |
| Role cho phép | Public |
| Controller | `src/controllers/authController.js` -> `login` |

## 3. Request

### 3.1 Headers & Parameters
> Không có.

### 3.2 Body Payload

| Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc (Min/Max/Format) | Mô tả |
|-------|--------------|----------|----------------------------|-------|
| email | String | ✅ | Format email hợp lệ | Email đăng nhập của user |
| password | String | ✅ | Min 6 ký tự | Mật khẩu chưa hash |

**Ví dụ Request Body:**
```json
{
  "email": "admin@hoianblog.vn",
  "password": "password123"
}
```

## 4. Response

### 4.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| token | String | ❌ | JWT Access Token (hết hạn sau 7 ngày) |
| user.id | Number | ❌ | ID người dùng |
| user.name | String | ❌ | Tên hiển thị |
| user.email | String | ❌ | Email người dùng |
| user.role | String | ❌ | Role (`admin` hoặc `member`) |

**Ví dụ Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@hoianblog.vn",
    "role": "admin"
  }
}
```

### 4.2 Lỗi & Exceptions
| HTTP Code | Message / Error Code | Điều kiện xảy ra |
|-----------|----------------------|------------------|
| 400 | `Email và mật khẩu là bắt buộc` | Thiếu field `email` hoặc `password` |
| 401 | `Email hoặc mật khẩu không đúng` | Không tìm thấy user theo email, hoặc sai mật khẩu |

## 5. Logic xử lý (Business Logic)
1. Validate request body (`email`, `password` không được rỗng).
   - Nếu thiếu -> throw `400 Bad Request`.
2. Thực hiện **[Q1]** để tìm user theo `email`.
   - Nếu không tìm thấy -> throw `401 Unauthorized`.
3. Dùng `bcrypt.compare(password, user.password_hash)` để kiểm tra mật khẩu.
   - Nếu sai -> throw `401 Unauthorized`.
4. Tạo JWT token: `jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })`.
5. Trả về `token` và thông tin `user` (loại bỏ `password_hash`).

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `users` | `SELECT` | `WHERE email = ?` | `knex('users').where({ email }).first()` |

## 7. Side Effects (Tác động phụ)
> Không có.
