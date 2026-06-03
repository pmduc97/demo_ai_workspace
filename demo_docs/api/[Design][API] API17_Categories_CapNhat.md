---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][API] API17_Categories_CapNhat

## 1. Tổng quan
> API dùng để cập nhật thông tin của một danh mục hiện có. Chỉ Admin mới có quyền thực hiện.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `PUT` |
| Endpoint | `/api/categories/:id` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Admin |
| Controller | `src/controllers/categoryController.js` -> `update` |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |
| id | Path | Number | ✅ | `> 0` | ID danh mục cần sửa |

### 3.2 Body Payload

| Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc (Min/Max/Format) | Mô tả |
|-------|--------------|----------|----------------------------|-------|
| name | String | ❌ | Min 2 ký tự | Tên danh mục mới |
| slug | String | ❌ | Chỉ a-z, 0-9, `-`, unique | Slug URL mới |
| description | String | ❌ | Max 500 ký tự | Mô tả mới |

**Ví dụ Request Body:**
```json
{
  "name": "Du lịch & Khám phá",
  "slug": "du-lich-kham-pha",
  "description": "Mô tả mới"
}
```

## 4. Response

### 4.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| id | Number | ❌ | ID danh mục |
| name | String | ❌ | Tên danh mục |
| slug | String | ❌ | Slug URL |
| description | String | ✅ | Mô tả danh mục |

**Ví dụ Response:**
```json
{
  "id": 1,
  "name": "Du lịch & Khám phá",
  "slug": "du-lich-kham-pha",
  "description": "Mô tả mới"
}
```

### 4.2 Lỗi & Exceptions
| HTTP Code | Message / Error Code | Điều kiện xảy ra |
|-----------|----------------------|------------------|
| 400 | `Validation Error` | Sai format dữ liệu gửi lên |
| 403 | `Forbidden` | User không phải Admin |
| 404 | `Danh mục không tồn tại` | Không tìm thấy danh mục theo ID |
| 409 | `Slug đã tồn tại` | Slug gửi lên trùng với một danh mục KHÁC |

## 5. Logic xử lý (Business Logic)
1. Validate request body.
2. Thực hiện **[Q1]** để kiểm tra danh mục có tồn tại không.
   - Nếu không -> throw `404 Not Found`.
3. Nếu có gửi lên `slug`, thực hiện **[Q2]** để kiểm tra slug có bị trùng với danh mục khác không.
   - Nếu trùng -> throw `409 Conflict`.
4. Thực hiện **[Q3]** để cập nhật thông tin danh mục.
5. Trả về thông tin danh mục sau khi cập nhật.

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `categories` | `SELECT` | `WHERE id = ?` | `knex('categories').where({ id }).first()` |
| **[Q2]** | `categories` | `SELECT` | `WHERE slug = ? AND id != ?` | `knex('categories').where({ slug }).andWhere('id', '!=', id).first()` |
| **[Q3]** | `categories` | `UPDATE` | `WHERE id = ?` | `knex('categories').where({ id }).update(data).returning('*')` |

## 7. Side Effects (Tác động phụ)
> Không có.
4. UPDATE `categories` SET ... WHERE `id = :id`
