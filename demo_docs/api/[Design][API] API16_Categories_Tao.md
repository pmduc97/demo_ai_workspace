---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][API] API16_Categories_Tao

## 1. Tổng quan
> API dùng để tạo mới một danh mục bài viết. Chỉ Admin mới có quyền thực hiện.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `POST` |
| Endpoint | `/api/categories` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Admin |
| Controller | `src/controllers/categoryController.js` -> `create` |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |

### 3.2 Body Payload

| Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc (Min/Max/Format) | Mô tả |
|-------|--------------|----------|----------------------------|-------|
| name | String | ✅ | Min 2 ký tự | Tên danh mục |
| slug | String | ✅ | Chỉ a-z, 0-9, `-`, unique | Slug URL |
| description | String | ❌ | Max 500 ký tự | Mô tả danh mục |

**Ví dụ Request Body:**
```json
{
  "name": "Lễ hội",
  "slug": "le-hoi",
  "description": "Các lễ hội đặc sắc tại Hội An và Đà Nẵng"
}
```

## 4. Response

### 4.1 Thành công (HTTP 201)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| id | Number | ❌ | ID danh mục |
| name | String | ❌ | Tên danh mục |
| slug | String | ❌ | Slug URL |
| description | String | ✅ | Mô tả danh mục |

**Ví dụ Response:**
```json
{
  "id": 4,
  "name": "Lễ hội",
  "slug": "le-hoi",
  "description": "Các lễ hội đặc sắc tại Hội An và Đà Nẵng"
}
```

### 4.2 Lỗi & Exceptions
| HTTP Code | Message / Error Code | Điều kiện xảy ra |
|-----------|----------------------|------------------|
| 400 | `Validation Error` | Thiếu field bắt buộc hoặc sai format |
| 403 | `Forbidden` | User không phải Admin |
| 409 | `Slug đã tồn tại` | Slug gửi lên đã có trong DB |

## 5. Logic xử lý (Business Logic)
1. Validate request body (`name`, `slug`).
2. Thực hiện **[Q1]** để kiểm tra xem `slug` đã tồn tại chưa.
   - Nếu có -> throw `409 Conflict`.
3. Thực hiện **[Q2]** để insert danh mục mới vào DB.
4. Trả về thông tin danh mục vừa tạo.

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `categories` | `SELECT` | `WHERE slug = ?` | `knex('categories').where({ slug }).first()` |
| **[Q2]** | `categories` | `INSERT` | `name, slug, description` | `knex('categories').insert({ name, slug, description }).returning('*')` |

## 7. Side Effects (Tác động phụ)
> Không có.
