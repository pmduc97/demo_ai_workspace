# DELETE /api/posts/:id — Xóa Bài Viết (Member)

## Thông tin
- **Method**: DELETE
- **Endpoint**: `/api/posts/:id`
- **Auth**: Bearer token (Member+)
- **Controller**: `src/controllers/postController.js` → `remove`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| id | number | ID bài viết |

## Response

**200 OK**:
```json
{ "message": "Xóa bài viết thành công" }
```

**403 Forbidden** (không phải bài của mình):
```json
{ "message": "Bạn không có quyền xóa bài viết này" }
```

**404 Not Found**:
```json
{ "message": "Bài viết không tồn tại" }
```

## Logic xử lý
1. Query bài theo `id`
2. Nếu không tìm thấy → 404
3. Nếu `post.author_id != req.user.id` và `req.user.role != 'admin'` → 403
4. DELETE FROM `posts` WHERE `id = :id`
