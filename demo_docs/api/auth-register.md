# POST /api/auth/register — Đăng Ký

## Thông tin
- **Method**: POST
- **Endpoint**: `/api/auth/register`
- **Auth**: Không cần
- **Controller**: `src/controllers/authController.js` → `register`

## Request

**Body** (`application/json`):
```json
{
  "name": "Nguyễn Văn A",
  "email": "member@hoianblog.vn",
  "password": "password123"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Có | Tối thiểu 2 ký tự |
| email | string | Có | Format email hợp lệ, chưa tồn tại trong DB |
| password | string | Có | Tối thiểu 6 ký tự |

## Response

**201 Created**:
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

**400 Bad Request**:
```json
{ "message": "Email đã được sử dụng" }
```

## Logic xử lý
1. Validate body
2. Kiểm tra email đã tồn tại chưa → nếu có → 400
3. `bcrypt.hash(password, 10)`
4. Insert vào bảng `users` với `role = 'member'`
5. Tạo JWT và trả về (tương tự login)
