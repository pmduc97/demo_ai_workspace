# GET /api/admin/posts — Danh Sách Tất Cả Bài Viết (Admin)

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/admin/posts`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/adminPostController.js` → `list`

## Query Parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| page | number | 1 | Trang hiện tại |
| limit | number | 10 | Số bài mỗi trang |
| status | string | — | `published` hoặc `draft` |
| category | string | — | Slug danh mục |
| search | string | — | Tìm theo tiêu đề |
| sort | string | newest | `newest` hoặc `oldest` |

## Response

**200 OK**:
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Khám phá điểm đến du lịch Việt Nam",
      "slug": "kham-pha-pho-co-hoi-an",
      "thumbnail_url": "/uploads/thumb.jpg",
      "status": "published",
      "created_at": "2024-01-01T00:00:00.000Z",
      "author": { "id": 1, "name": "Admin" },
      "category": { "id": 1, "name": "Du lịch", "slug": "du-lich" }
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Query tất cả bài (không filter theo status mặc định)
3. Áp dụng filter nếu có: status, category slug, search (ILIKE)
4. Pagination + sort
