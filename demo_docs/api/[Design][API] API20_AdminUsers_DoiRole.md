---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][API] API20_AdminUsers_DoiRole

## 1. Tổng quan
> API dùng để thay đổi quyền (role) của một người dùng. Chỉ Admin mới có quyền thực hiện và không được phép tự đổi role của chính mình.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `PUT` |
| Endpoint | `/api/admin/users/:id/role` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Admin |
| Controller | `src/controllers/adminUserController.js` -> `updateRole` |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |
| id | Path | Number | ✅ | `> 0` | ID người dùng cần đổi role |

### 3.2 Body Payload

| Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc (Min/Max/Format) | Mô tả |
|-------|--------------|----------|----------------------------|-------|
| role | String | ✅ | `admin` hoặc `member` | Role mới |

**Ví dụ Request Body:**
```json
{
  "role": "admin"
}
```

## 4. Response

### 4.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| id | Number | ❌ | ID người dùng |
| role | String | ❌ | Role mới sau khi đổi |

**Ví dụ Response:**
```json
{
  "id": 2,
  "role": "admin"
}
```

### 4.2 Lỗi & Exceptions
| HTTP Code | Message / Error Code | Điều kiện xảy ra |
|-----------|----------------------|------------------|
| 400 | `Role không hợp lệ` | Role gửi lên không phải `admin` hoặc `member` |
| 400 | `Không thể đổi role của chính mình` | `id` truyền vào trùng với `req.user.id` |
| 403 | `Forbidden` | User gọi API không phải Admin |
| 404 | `Người dùng không tồn tại` | Không tìm thấy user theo ID |

## 5. Logic xử lý (Business Logic)
1. Kiểm tra `id` truyền vào có trùng với `req.user.id` không.
   - Nếu trùng -> throw `400 Bad Request` (Không thể đổi role của chính mình).
2. Validate request body (`role` phải là `admin` hoặc `member`).
3. Thực hiện **[Q1]** để kiểm tra user có tồn tại không.
   - Nếu không -> throw `404 Not Found`.
4. Thực hiện **[Q2]** để cập nhật role mới cho user.
5. Trả về ID và role mới.

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `users` | `SELECT` | `WHERE id = ?` | `knex('users').where({ id }).first()` |
| **[Q2]** | `users` | `UPDATE` | `WHERE id = ?` | `knex('users').where({ id }).update({ role }).returning(['id', 'role'])` |

## 7. Side Effects (Tác động phụ)
> Không có. (Lưu ý: Nếu user đang đăng nhập bị giáng cấp xuống member, token cũ của họ vẫn còn hạn. Việc xử lý token blacklist nằm ngoài phạm vi API này).
4. Query user theo `id` → 404 nếu không có
5. UPDATE `users` SET `role = :role` WHERE `id = :id`
