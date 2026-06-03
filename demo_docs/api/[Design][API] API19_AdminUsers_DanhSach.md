---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][API] API19_AdminUsers_DanhSach

## 1. Tổng quan
> API dùng để lấy danh sách tất cả người dùng trong hệ thống kèm theo số lượng bài viết họ đã đăng. Chỉ Admin mới có quyền truy cập.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `GET` |
| Endpoint | `/api/admin/users` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Admin |
| Controller | `src/controllers/adminUserController.js` -> `list` |

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
| (root) | Array | ❌ | Mảng các user |
| id | Number | ❌ | ID người dùng |
| name | String | ❌ | Tên hiển thị |
| email | String | ❌ | Email đăng nhập |
| role | String | ❌ | Role (`admin` hoặc `member`) |
| postCount | Number | ❌ | Tổng số bài viết đã đăng |
| created_at | String | ❌ | Ngày tham gia (ISO 8601) |

**Ví dụ Response:**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@hoianblog.vn",
    "role": "admin",
    "postCount": 3,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Nguyễn Văn A",
    "email": "member@hoianblog.vn",
    "role": "member",
    "postCount": 2,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 4.2 Lỗi & Exceptions
| HTTP Code | Message / Error Code | Điều kiện xảy ra |
|-----------|----------------------|------------------|
| 403 | `Forbidden` | User không phải Admin |

## 5. Logic xử lý (Business Logic)
1. Thực hiện **[Q1]** để lấy danh sách user, kết hợp đếm số lượng bài viết của từng user.
2. Trả về mảng user (đảm bảo không trả về `password_hash`).

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `users`, `posts` | `SELECT` | `LEFT JOIN posts ON posts.author_id = users.id GROUP BY users.id` | `knex('users').select('users.id', 'users.name', 'users.email', 'users.role', 'users.created_at').count('posts.id as postCount').leftJoin('posts', 'posts.author_id', 'users.id').groupBy('users.id')` |

## 7. Side Effects (Tác động phụ)
> Không có.
