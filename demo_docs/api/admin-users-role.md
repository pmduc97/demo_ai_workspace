# PUT /api/admin/users/:id/role — Đổi Role Người Dùng

## Thông tin
- **Method**: PUT
- **Endpoint**: `/api/admin/users/:id/role`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/adminUserController.js` → `updateRole`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| id | number | ID người dùng |

## Request

**Body** (`application/json`):
```json
{ "role": "admin" }
```

| Field | Type | Required | Validation |
|---|---|---|---|
| role | string | Có | `admin` hoặc `member` |

## Response

**200 OK**:
```json
{ "id": 2, "role": "admin" }
```

**400 Bad Request** (tự đổi role của mình):
```json
{ "message": "Không thể đổi role của chính mình" }
```

**400 Bad Request** (role không hợp lệ):
```json
{ "message": "Role không hợp lệ" }
```

**404 Not Found**:
```json
{ "message": "Người dùng không tồn tại" }
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Nếu `req.user.id == id` → 400 (không tự đổi role mình)
3. Validate `role` ∈ ['admin', 'member']
4. Query user theo `id` → 404 nếu không có
5. UPDATE `users` SET `role = :role` WHERE `id = :id`
