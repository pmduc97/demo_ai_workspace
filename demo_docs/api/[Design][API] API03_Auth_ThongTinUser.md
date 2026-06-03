---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][API] API03_Auth_ThongTinUser

## 1. Tổng quan
> API dùng để lấy thông tin chi tiết của user hiện tại dựa vào JWT token gửi lên trong header. Dùng để khôi phục session khi reload trang.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `GET` |
| Endpoint | `/api/auth/me` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Member, Admin |
| Controller | `src/controllers/authController.js` -> `me` |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |

### 3.2 Body Payload
> Không có.

## 4. Response

### 4.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| id | Number | ❌ | ID người dùng |
| name | String | ❌ | Tên hiển thị |
| email | String | ❌ | Email người dùng |
| role | String | ❌ | Role (`admin` hoặc `member`) |
| created_at | String | ❌ | Ngày tạo tài khoản (ISO 8601) |

**Ví dụ Response:**
```json
{
  "id": 1,
  "name": "Admin",
  "email": "admin@hoianblog.vn",
  "role": "admin",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### 4.2 Lỗi & Exceptions
| HTTP Code | Message / Error Code | Điều kiện xảy ra |
|-----------|----------------------|------------------|
| 401 | `Không có quyền truy cập` | Token thiếu, sai format, hoặc đã hết hạn |
| 404 | `Người dùng không tồn tại` | Token hợp lệ nhưng user đã bị xóa khỏi DB |

## 5. Logic xử lý (Business Logic)
1. Middleware `auth.js` verify JWT token từ header.
   - Nếu lỗi -> throw `401 Unauthorized`.
   - Nếu thành công -> gắn `req.user = { id, role }`.
2. Thực hiện **[Q1]** để lấy thông tin chi tiết của user theo `req.user.id`.
   - Nếu không tìm thấy -> throw `404 Not Found`.
3. Trả về thông tin user (loại bỏ `password_hash`).

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `users` | `SELECT` | `WHERE id = ?` | `knex('users').select('id', 'name', 'email', 'role', 'created_at').where({ id: req.user.id }).first()` |

## 7. Side Effects (Tác động phụ)
> Không có.
