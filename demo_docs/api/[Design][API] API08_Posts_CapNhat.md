# PUT /api/posts/:id — Cập Nhật Bài Viết

## Thông tin
- **Method**: PUT
- **Endpoint**: `/api/posts/:id`
- **Auth**: Bearer token (Member+)
- **Controller**: `src/controllers/postController.js` → `update`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| id | number | ID bài viết |

## Request

**Body** (`application/json`) — tất cả field đều optional, chỉ gửi field cần cập nhật:
```json
{
  "title": "Tiêu đề mới",
  "slug": "tieu-de-moi",
  "content": "<p>Nội dung mới...</p>",
  "thumbnail_url": "/uploads/new.jpg",
  "status": "published",
  "category_id": 2
}
```

| Field | Validation |
|---|---|
| title | Tối thiểu 5 ký tự nếu có |
| slug | Unique (trừ chính bài này), chỉ a-z, 0-9, `-` |
| status | `draft` hoặc `published` |
| category_id | ID tồn tại |

## Response

**200 OK**:
```json
{
  "id": 10,
  "title": "Tiêu đề mới",
  "slug": "tieu-de-moi",
  "status": "published",
  "updated_at": "2024-01-11T00:00:00.000Z"
}
```

**403 Forbidden** (không phải bài của mình):
```json
{ "message": "Bạn không có quyền chỉnh sửa bài viết này" }
```

**404 Not Found**:
```json
{ "message": "Bài viết không tồn tại" }
```

**409 Conflict** (slug trùng):
```json
{ "message": "Slug đã tồn tại" }
```

## Logic xử lý
1. Query bài theo `id`
2. Nếu không tìm thấy → 404
3. Nếu `post.author_id != req.user.id` và `req.user.role != 'admin'` → 403
4. Validate các field được gửi lên
5. Kiểm tra slug unique (loại trừ bài hiện tại)
6. Update `posts` SET ... WHERE `id = :id`, cập nhật `updated_at = NOW()`
