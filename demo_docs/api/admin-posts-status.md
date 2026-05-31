# PUT /api/admin/posts/:id/status — Đổi Trạng Thái Bài Viết

## Thông tin
- **Method**: PUT
- **Endpoint**: `/api/admin/posts/:id/status`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/adminPostController.js` → `updateStatus`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| id | number | ID bài viết |

## Request

**Body** (`application/json`):
```json
{ "status": "published" }
```

| Field | Type | Required | Validation |
|---|---|---|---|
| status | string | Có | `published` hoặc `draft` |

## Response

**200 OK**:
```json
{
  "id": 3,
  "status": "published",
  "updated_at": "2024-01-10T00:00:00.000Z"
}
```

**400 Bad Request**:
```json
{ "message": "Trạng thái không hợp lệ" }
```

**404 Not Found**:
```json
{ "message": "Bài viết không tồn tại" }
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Validate `status` ∈ ['published', 'draft']
3. Query bài theo `id` → 404 nếu không có
4. UPDATE `posts` SET `status = :status`, `updated_at = NOW()` WHERE `id = :id`
