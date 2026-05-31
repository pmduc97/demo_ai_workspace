# POST /api/auth/login — Đăng Nhập

## Thông tin
- **Method**: POST
- **Endpoint**: `/api/auth/login`
- **Auth**: Không cần
- **Controller**: `src/controllers/authController.js` → `login`

## Request

**Body** (`application/json`):
```json
{
  "email": "admin@hoianblog.vn",
  "password": "password123"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| email | string | Có | Format email hợp lệ |
| password | string | Có | Tối thiểu 6 ký tự |

## Response

**200 OK**:
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

**400 Bad Request** (thiếu/sai format field):
```json
{ "message": "Email và mật khẩu là bắt buộc" }
```

**401 Unauthorized** (sai credentials):
```json
{ "message": "Email hoặc mật khẩu không đúng" }
```

## Logic xử lý
1. Validate body (email, password không rỗng)
2. Query `users` theo email
3. Nếu không tìm thấy → 401
4. `bcrypt.compare(password, user.password_hash)` → nếu sai → 401
5. Tạo JWT: `jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' })`
6. Trả về token + user info (không trả password_hash)
