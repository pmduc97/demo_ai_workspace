# GET /api/admin/posts/:id — Chi Tiết Bài Viết (Admin)

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/admin/posts/:id`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/adminPostController.js` → `getById`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| id | number | ID bài viết |

## Response

**200 OK**:
```json
{
  "id": 3,
  "title": "Lễ hội đèn lồng",
  "slug": "le-hoi-den-long",
  "content": "<p>Nội dung đầy đủ...</p>",
  "thumbnail_url": null,
  "status": "draft",
  "created_at": "2024-01-03T00:00:00.000Z",
  "updated_at": "2024-01-03T00:00:00.000Z",
  "author": { "id": 2, "name": "Nguyễn Văn A" },
  "category": { "id": 3, "name": "Văn hóa", "slug": "van-hoa" }
}
```

**404 Not Found**:
```json
{ "message": "Bài viết không tồn tại" }
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Query `posts` JOIN `users` JOIN `categories` WHERE `id = :id`
3. Trả về kể cả bài draft
