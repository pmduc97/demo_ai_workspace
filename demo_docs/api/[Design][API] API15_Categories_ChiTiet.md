# GET /api/categories/:slug — Chi Tiết Danh Mục

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/categories/:slug`
- **Auth**: Không cần
- **Controller**: `src/controllers/categoryController.js` → `getBySlug`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| slug | string | Slug của danh mục |

## Response

**200 OK**:
```json
{
  "id": 1,
  "name": "Du lịch",
  "slug": "du-lich",
  "description": "Tin tức du lịch Hội An - Đà Nẵng",
  "postCount": 5
}
```

**404 Not Found**:
```json
{ "message": "Danh mục không tồn tại" }
```

## Logic xử lý
1. Query `categories` WHERE `slug = :slug`
2. Nếu không tìm thấy → 404
3. Đếm số bài published trong danh mục
