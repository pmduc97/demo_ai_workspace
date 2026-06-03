# GET /api/categories — Danh Sách Danh Mục

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/categories`
- **Auth**: Không cần
- **Controller**: `src/controllers/categoryController.js` → `list`

## Query Parameters
Không có.

## Response

**200 OK**:
```json
[
  {
    "id": 1,
    "name": "Du lịch",
    "slug": "du-lich",
    "description": "Tin tức du lịch Hội An - Đà Nẵng",
    "postCount": 5
  },
  {
    "id": 2,
    "name": "Ẩm thực",
    "slug": "am-thuc",
    "description": "Ẩm thực đặc sắc miền Trung",
    "postCount": 3
  }
]
```

## Logic xử lý
1. Query `categories` LEFT JOIN `posts` ON `posts.category_id = categories.id` AND `posts.status = 'published'`
2. GROUP BY `categories.id`
3. COUNT posts → `postCount`
4. Trả về tất cả danh mục kể cả danh mục chưa có bài
