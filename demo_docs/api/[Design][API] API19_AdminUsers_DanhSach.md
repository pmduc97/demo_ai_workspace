# GET /api/admin/users — Danh Sách Người Dùng

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/admin/users`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/adminUserController.js` → `list`

## Query Parameters
Không có (trả về tất cả, không phân trang — số lượng user thường nhỏ).

## Response

**200 OK**:
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@hoianblog.vn",
    "role": "admin",
    "postCount": 3,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Nguyễn Văn A",
    "email": "member@hoianblog.vn",
    "role": "member",
    "postCount": 2,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Query `users` LEFT JOIN `posts` ON `posts.author_id = users.id`
3. GROUP BY `users.id`, COUNT posts → `postCount`
4. Không trả về `password_hash`
