# POST /api/posts — Tạo Bài Viết

## Thông tin
- **Method**: POST
- **Endpoint**: `/api/posts`
- **Auth**: Bearer token (Member+)
- **Controller**: `src/controllers/postController.js` → `create`

## Request

**Body** (`application/json`):
```json
{
  "title": "Khám phá điểm đến du lịch Việt Nam",
  "slug": "kham-pha-pho-co-hoi-an",
  "content": "<p>Nội dung bài viết...</p>",
  "thumbnail_url": "/uploads/abc.jpg",
  "status": "draft",
  "category_id": 1
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| title | string | Có | Tối thiểu 5 ký tự |
| slug | string | Có | Chỉ a-z, 0-9, dấu `-`, unique |
| content | string | Có | Không rỗng |
| thumbnail_url | string | Không | URL hợp lệ hoặc null |
| status | string | Không | `draft` (default) hoặc `published` |
| category_id | number | Có | ID danh mục tồn tại |

## Response

**201 Created**:
```json
{
  "id": 10,
  "title": "Khám phá điểm đến du lịch Việt Nam",
  "slug": "kham-pha-pho-co-hoi-an",
  "status": "draft",
  "created_at": "2024-01-10T00:00:00.000Z"
}
```

**400 Bad Request**:
```json
{ "message": "Tiêu đề là bắt buộc" }
```

**409 Conflict** (slug trùng):
```json
{ "message": "Slug đã tồn tại, vui lòng chọn slug khác" }
```

## Logic xử lý
1. Validate body
2. Kiểm tra slug unique trong bảng `posts`
3. Kiểm tra `category_id` tồn tại
4. Insert vào `posts` với `author_id = req.user.id`
5. Trả về bài vừa tạo
