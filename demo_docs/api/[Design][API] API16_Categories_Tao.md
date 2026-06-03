# POST /api/categories — Tạo Danh Mục

## Thông tin
- **Method**: POST
- **Endpoint**: `/api/categories`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/categoryController.js` → `create`

## Request

**Body** (`application/json`):
```json
{
  "name": "Lễ hội",
  "slug": "le-hoi",
  "description": "Các lễ hội đặc sắc tại Hội An và Đà Nẵng"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| name | string | Có | Tối thiểu 2 ký tự |
| slug | string | Có | Chỉ a-z, 0-9, `-`, unique |
| description | string | Không | Tối đa 500 ký tự |

## Response

**201 Created**:
```json
{
  "id": 4,
  "name": "Lễ hội",
  "slug": "le-hoi",
  "description": "Các lễ hội đặc sắc tại Hội An và Đà Nẵng"
}
```

**409 Conflict** (slug trùng):
```json
{ "message": "Slug đã tồn tại" }
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Validate body
3. Kiểm tra slug unique
4. INSERT INTO `categories`
