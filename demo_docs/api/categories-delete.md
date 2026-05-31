# DELETE /api/categories/:id — Xóa Danh Mục

## Thông tin
- **Method**: DELETE
- **Endpoint**: `/api/categories/:id`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/categoryController.js` → `remove`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| id | number | ID danh mục |

## Response

**200 OK**:
```json
{ "message": "Xóa danh mục thành công" }
```

**404 Not Found**:
```json
{ "message": "Danh mục không tồn tại" }
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Query danh mục theo `id` → 404 nếu không có
3. DELETE FROM `categories` WHERE `id = :id`
4. Do migration có `ON DELETE SET NULL`, các bài viết thuộc danh mục này sẽ có `category_id = NULL`
