# GET /api/posts/:slug — Chi Tiết Bài Viết (Public)

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/posts/:slug`
- **Auth**: Không cần
- **Controller**: `src/controllers/postController.js` → `getBySlug`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| slug | string | Slug của bài viết |

## Response

**200 OK**:
```json
{
  "id": 1,
  "title": "Khám phá điểm đến Việt Nam về đêm",
  "slug": "kham-pha-pho-co-hoi-an-ve-dem",
  "content": "<p>Các điểm đến du lịch Việt Nam về đêm lung linh...</p>",
  "thumbnail_url": "/uploads/thumbnail.jpg",
  "status": "published",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "author": { "id": 1, "name": "Admin" },
  "category": { "id": 1, "name": "Du lịch", "slug": "du-lich" }
}
```

**404 Not Found** (không tồn tại hoặc là draft):
```json
{ "message": "Bài viết không tồn tại" }
```

## Logic xử lý
1. Query `posts` JOIN `users` JOIN `categories` WHERE `slug = :slug`
2. Nếu không tìm thấy hoặc `status != 'published'` → 404
3. Trả về đầy đủ content (không cắt excerpt)
