# GET /api/admin/stats — Thống Kê Tổng Quan

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/admin/stats`
- **Auth**: Bearer token (Member+)
- **Controller**: `src/controllers/adminController.js` → `stats`

## Response

**Admin** — thống kê toàn hệ thống:
```json
{
  "totalPosts": 50,
  "publishedPosts": 35,
  "draftPosts": 15,
  "totalCategories": 3
}
```

**Member** — chỉ thống kê bài của mình:
```json
{
  "totalPosts": 5,
  "publishedPosts": 3,
  "draftPosts": 2,
  "totalCategories": 3
}
```

## Logic xử lý
1. Middleware `auth`
2. Nếu `req.user.role == 'admin'`:
   - `totalPosts`: COUNT(*) FROM posts
   - `publishedPosts`: COUNT(*) WHERE status = 'published'
   - `draftPosts`: COUNT(*) WHERE status = 'draft'
   - `totalCategories`: COUNT(*) FROM categories
3. Nếu `req.user.role == 'member'`:
   - Tương tự nhưng thêm WHERE `author_id = req.user.id` cho posts
   - `totalCategories` vẫn là tổng toàn hệ thống
