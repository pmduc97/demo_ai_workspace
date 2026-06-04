---
version: 1.0
created: 2026-06-03
updated: 2026-06-04
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
| Controller | `src/controllers/auth.controller.js` -> `login` |
| Message Catalog | [`[Design][COMMON] MESSAGE_Catalog.md`](../[Design][COMMON]%20MESSAGE_Catalog.md) |

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
| HTTP Code | Message ID | Message | Điều kiện xảy ra |
|-----------|------------|---------|------------------|
| 400 | `AUTH-E-001` | `Email và mật khẩu là bắt buộc` | Thiếu field `email` hoặc `password` |
| 401 | `AUTH-E-002` | `Email hoặc mật khẩu không đúng` | Không tìm thấy user theo email, hoặc sai mật khẩu |

**Ví dụ Response lỗi 400:**
```json
{
  "messageId": "AUTH-E-001",
  "message": "Email và mật khẩu là bắt buộc"
}
```

**Ví dụ Response lỗi 401:**
```json
{
  "messageId": "AUTH-E-002",
  "message": "Email hoặc mật khẩu không đúng"
}
```

## 5. Logic xử lý (Business Logic)
1. Validate request body (`email`, `password` không được rỗng).
  - Nếu thiếu -> trả `400 Bad Request` với `messageId=AUTH-E-001`.
2. Thực hiện **[Q1]** để tìm user theo `email`.
  - Nếu không tìm thấy -> trả `401 Unauthorized` với `messageId=AUTH-E-002`.
3. Dùng `bcrypt.compare(password, user.password_hash)` để kiểm tra mật khẩu.
  - Nếu sai -> trả `401 Unauthorized` với `messageId=AUTH-E-002`.
4. Tạo JWT token: `jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })`.
5. Trả về `token` và thông tin `user` (loại bỏ `password_hash`).

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `users` | `SELECT` | `WHERE email = ?` | `knex('users').where({ email }).first()` |

## 7. Side Effects (Tác động phụ)
> Không có.
