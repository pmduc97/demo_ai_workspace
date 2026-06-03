---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][API] API02_Auth_DangKy

## 1. Tổng quan
> API dùng để đăng ký tài khoản mới. Mặc định tài khoản mới tạo sẽ có role là `member`. Trả về JWT token để tự động đăng nhập sau khi đăng ký thành công.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `POST` |
| Endpoint | `/api/auth/register` |
| Auth yêu cầu | Không |
| Role cho phép | Public |
| Controller | `src/controllers/authController.js` -> `register` |

## 3. Request

### 3.1 Headers & Parameters
> Không có.

### 3.2 Body Payload

| Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc (Min/Max/Format) | Mô tả |
|-------|--------------|----------|----------------------------|-------|
| name | String | ✅ | Min 2 ký tự | Tên hiển thị |
| email | String | ✅ | Format email hợp lệ | Email đăng nhập |
| password | String | ✅ | Min 6 ký tự | Mật khẩu chưa hash |

**Ví dụ Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "member@hoianblog.vn",
  "password": "password123"
}
```

## 4. Response

### 4.1 Thành công (HTTP 201)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| token | String | ❌ | JWT Access Token |
| user.id | Number | ❌ | ID người dùng |
| user.name | String | ❌ | Tên hiển thị |
| user.email | String | ❌ | Email người dùng |
| user.role | String | ❌ | Role (mặc định `member`) |

**Ví dụ Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Nguyễn Văn A",
    "email": "member@hoianblog.vn",
    "role": "member"
  }
}
```

### 4.2 Lỗi & Exceptions
| HTTP Code | Message / Error Code | Điều kiện xảy ra |
|-----------|----------------------|------------------|
| 400 | `Validation Error` | Thiếu field bắt buộc hoặc sai format |
| 400 | `Email đã được sử dụng` | Email đã tồn tại trong hệ thống |

## 5. Logic xử lý (Business Logic)
1. Validate request body (`name`, `email`, `password`).
2. Thực hiện **[Q1]** để kiểm tra xem `email` đã tồn tại chưa.
   - Nếu có -> throw `400 Bad Request` (Email đã được sử dụng).
3. Hash mật khẩu: `bcrypt.hash(password, 10)`.
4. Thực hiện **[Q2]** để tạo user mới với `role = 'member'`.
5. Tạo JWT token: `jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })`.
6. Trả về `token` và thông tin `user` (loại bỏ `password_hash`).

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `users` | `SELECT` | `WHERE email = ?` | `knex('users').where({ email }).first()` |
| **[Q2]** | `users` | `INSERT` | `name, email, password_hash, role: 'member'` | `knex('users').insert({ name, email, password_hash, role: 'member' }).returning('*')` |

## 7. Side Effects (Tác động phụ)
> Không có.
5. Tạo JWT và trả về (tương tự login)
