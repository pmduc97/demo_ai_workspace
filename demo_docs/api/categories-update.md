# PUT /api/categories/:id — Cập Nhật Danh Mục

## Thông tin
- **Method**: PUT
- **Endpoint**: `/api/categories/:id`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/categoryController.js` → `update`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| id | number | ID danh mục |

## Request

**Body** (`application/json`) — các field đều optional:
```json
{
  "name": "Du lịch & Khám phá",
  "slug": "du-lich-kham-pha",
  "description": "Mô tả mới"
}
```

## Response

**200 OK**:
```json
{
  "id": 1,
  "name": "Du lịch & Khám phá",
  "slug": "du-lich-kham-pha",
  "description": "Mô tả mới"
}
```

**404 Not Found**:
```json
{ "message": "Danh mục không tồn tại" }
```

**409 Conflict** (slug trùng với danh mục khác):
```json
{ "message": "Slug đã tồn tại" }
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Query danh mục theo `id` → 404 nếu không có
3. Kiểm tra slug unique (loại trừ danh mục hiện tại)
4. UPDATE `categories` SET ... WHERE `id = :id`
