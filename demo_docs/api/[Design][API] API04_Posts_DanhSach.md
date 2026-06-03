# GET /api/posts — Danh Sách Bài Viết (Public)

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/posts`
- **Auth**: Không cần
- **Controller**: `src/controllers/postController.js` → `listPublic`

## Query Parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| page | number | 1 | Trang hiện tại |
| limit | number | 9 | Số bài mỗi trang (max 50) |
| category | string | — | Slug của danh mục để lọc |
| sort | string | newest | `newest` hoặc `oldest` |
| exclude | number | — | ID bài cần loại trừ (dùng cho related posts) |

Chỉ trả về bài có `status = 'published'`.

## Response

**200 OK**:
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Khám phá phố cổ Hội An về đêm",
      "slug": "kham-pha-pho-co-hoi-an-ve-dem",
      "thumbnail_url": "/uploads/thumbnail.jpg",
      "excerpt": "Hội An về đêm lung linh với hàng nghìn chiếc đèn lồng...",
      "created_at": "2024-01-01T00:00:00.000Z",
      "author": { "id": 1, "name": "Admin" },
      "category": { "id": 1, "name": "Du lịch", "slug": "du-lich" }
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

## Logic xử lý
1. Build query Knex: `posts` JOIN `users` JOIN `categories`
2. Filter: `status = 'published'`
3. Nếu có `category`: JOIN categories, filter theo slug
4. Nếu có `exclude`: thêm `WHERE posts.id != exclude`
5. Sort: `created_at DESC` (newest) hoặc `ASC` (oldest)
6. Pagination: `limit` + `offset = (page-1) * limit`
7. `excerpt`: cắt content (strip HTML) lấy 150 ký tự đầu
