# DELETE /api/admin/posts/:id — Xóa Bài Viết (Admin)

## Thông tin
- **Method**: DELETE
- **Endpoint**: `/api/admin/posts/:id`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/adminPostController.js` → `remove`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| id | number | ID bài viết |

## Response

**200 OK**:
```json
{ "message": "Xóa bài viết thành công" }
```

**404 Not Found**:
```json
{ "message": "Bài viết không tồn tại" }
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Query bài theo `id` → 404 nếu không có
3. DELETE FROM `posts` WHERE `id = :id`
4. Admin có thể xóa bài của bất kỳ ai
