---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][API] API18_Categories_Xoa

## 1. Tổng quan
> API dùng để xóa một danh mục. Các bài viết thuộc danh mục này sẽ bị set `category_id = NULL` (do cấu hình ON DELETE SET NULL trong DB). Chỉ Admin mới có quyền thực hiện.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `DELETE` |
| Endpoint | `/api/categories/:id` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Admin |
| Controller | `src/controllers/categoryController.js` -> `remove` |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |
| id | Path | Number | ✅ | `> 0` | ID danh mục cần xóa |

### 3.2 Body Payload
> Không có.

## 4. Response

### 4.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| message | String | ❌ | Thông báo thành công |

**Ví dụ Response:**
```json
{
  "message": "Xóa danh mục thành công"
}
```

### 4.2 Lỗi & Exceptions
| HTTP Code | Message / Error Code | Điều kiện xảy ra |
|-----------|----------------------|------------------|
| 403 | `Forbidden` | User không phải Admin |
| 404 | `Danh mục không tồn tại` | Không tìm thấy danh mục theo ID |

## 5. Logic xử lý (Business Logic)
1. Thực hiện **[Q1]** để kiểm tra danh mục có tồn tại không.
   - Nếu không -> throw `404 Not Found`.
2. Thực hiện **[Q2]** để xóa danh mục khỏi DB.
3. Trả về thông báo thành công.

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `categories` | `SELECT` | `WHERE id = ?` | `knex('categories').where({ id }).first()` |
| **[Q2]** | `categories` | `DELETE` | `WHERE id = ?` | `knex('categories').where({ id }).del()` |

## 7. Side Effects (Tác động phụ)
> Các bài viết thuộc danh mục này sẽ tự động bị set `category_id = NULL` bởi Database Constraint (`ON DELETE SET NULL`). Không cần xử lý bằng code Node.js.
