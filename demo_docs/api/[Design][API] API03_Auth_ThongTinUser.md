# GET /api/auth/me — Thông Tin User Hiện Tại

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/auth/me`
- **Auth**: Bearer token (Member+)
- **Controller**: `src/controllers/authController.js` → `me`

## Request
Không có body. Token trong header `Authorization: Bearer <token>`.

## Response

**200 OK**:
```json
{
  "id": 1,
  "name": "Admin",
  "email": "admin@hoianblog.vn",
  "role": "admin",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**401 Unauthorized** (token thiếu hoặc không hợp lệ):
```json
{ "message": "Không có quyền truy cập" }
```

## Logic xử lý
1. Middleware `auth.js` verify JWT, gắn `req.user = { id, role }`
2. Query `users` theo `req.user.id`
3. Trả về user info (không trả password_hash)
