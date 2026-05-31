# GET /api/posts/my — Bài Viết Của Tôi

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/posts/my`
- **Auth**: Bearer token (Member+)
- **Controller**: `src/controllers/postController.js` → `listMy`

**Lưu ý route**: Đăng ký route `/posts/my` TRƯỚC `/posts/:slug` để tránh conflict.

## Query Parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| page | number | 1 | Trang hiện tại |
| limit | number | 10 | Số bài mỗi trang |
| status | string | — | `published` hoặc `draft` để lọc |
| search | string | — | Tìm theo tiêu đề (ILIKE) |

## Response

**200 OK**:
```json
{
  "posts": [
    {
      "id": 2,
      "title": "Cao lầu - Món ăn đặc trưng",
      "slug": "cao-lau-mon-an-dac-trung",
      "thumbnail_url": null,
      "status": "published",
      "created_at": "2024-01-02T00:00:00.000Z",
      "category": { "id": 2, "name": "Ẩm thực", "slug": "am-thuc" }
    }
  ],
  "total": 5,
  "page": 1,
  "totalPages": 1
}
```

## Logic xử lý
1. Middleware auth: lấy `req.user.id`
2. Query `posts` WHERE `author_id = req.user.id`
3. Filter theo `status` nếu có
4. Search: `WHERE title ILIKE '%search%'` nếu có
5. Pagination
