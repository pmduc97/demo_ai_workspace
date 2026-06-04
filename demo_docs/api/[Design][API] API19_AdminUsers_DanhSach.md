---
version: 2.0
created: 2026-06-03
updated: 2026-06-04
status: draft
---

# [Design][API] API19_AdminUsers_DanhSach

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|-----|------|----------|----------|
| 1.0 | 2026-06-03 | Tạo tài liệu ban đầu | GitHub Copilot |
| 2.0 | 2026-06-04 | Chuẩn hóa 10 sections, bổ sung filter/sort/pagination, fields mở rộng và Query IDs | GitHub Copilot |

## 1. Tổng quan
API lấy danh sách người dùng cho màn `ADMIN_USER_LIST_QuanLyNguoiDung`, hỗ trợ search/filter/sort/pagination và trả đủ field để render table, detail modal và export CSV. Chỉ Admin được gọi API.

| Tài liệu tham chiếu | Đường dẫn |
|---|---|
| FE Screen | `demo_docs/fe/[Design][SCREEN] ADMIN_USER_LIST_QuanLyNguoiDung.md` |
| Message Catalog | `demo_docs/[Design][COMMON] MESSAGE_Catalog.md` |
| DB Schema | `demo_docs/[Design][DB] DATABASE_Schema.md` |
| Target Controller | `demo_source_be/src/controllers/users.controller.js` |

## 2. Thông tin chung
| Thuộc tính | Giá trị |
|---|---|
| Method | `GET` |
| Endpoint | `/api/admin/users` |
| Auth yêu cầu | Có (`Bearer Token`) |
| Role cho phép | `admin` |
| Controller | `src/controllers/users.controller.js` -> `list` / `listAdminUsers` (target) |

| DB liên quan | Mục đích |
|---|---|
| `users` | Lấy thông tin user, profile, role, status, audit |
| `posts` | Đếm tổng bài viết, bài published, bài draft theo `author_id` |

## 3. Request
### 3.1 Headers & Parameters
| Logical Name | Physical Field | Vị trí | Kiểu | Bắt buộc | Ràng buộc | Chuẩn hóa input | Mô tả |
|---|---|---|---|---|---|---|---|
| Token | `Authorization` | Header | String | ✅ | `Bearer <token>` | Trim | JWT của admin |
| Từ khóa | `keyword` | Query | String | ❌ | Tối đa 100 ký tự | Trim; empty -> bỏ lọc | Tìm theo `name`, `email`, `phone` |
| Role | `role` | Query | String | ❌ | `all`, `admin`, `member` | Trim/lowercase; default `all` | Lọc theo role |
| Trạng thái | `status` | Query | String | ❌ | `all`, `active`, `locked` | Trim/lowercase; default `all` | Lọc trạng thái tài khoản |
| Sắp xếp | `sort` | Query | String | ❌ | `created_at_desc`, `name_asc`, `post_count_desc`, `last_login_desc` | Trim/lowercase; default `created_at_desc` | Sort server-side |
| Trang | `page` | Query | Number | ❌ | Integer >= 1 | Parse int; default `1` | Trang hiện tại |
| Số dòng/trang | `limit` | Query | Number | ❌ | Integer 1..100 | Parse int; default `10` | Số bản ghi mỗi trang |

### 3.2 Body Payload
| Logical Name | Physical Field | Kiểu | Bắt buộc | Ràng buộc | Chuẩn hóa input | Mô tả |
|---|---|---|---|---|---|---|
| Không có | N/A | N/A | ❌ | N/A | N/A | GET không có body |

**Ví dụ Request:** `GET /api/admin/users?keyword=nguyen&role=member&status=active&sort=post_count_desc&page=1&limit=10`

## 4. Validation Rules
| Rule ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---|---|---|---|---|
| V-01 | Auth | Thiếu/sai token | COMMON-E-001 | 401 |
| V-02 | Role caller | Caller phải là admin | USER-E-004 | 403 |
| V-03 | `keyword` | Tối đa 100 ký tự | USER-E-001 | 422 |
| V-04 | `role` | Chỉ nhận `all`, `admin`, `member` | USER-E-001 | 422 |
| V-05 | `status` | Chỉ nhận `all`, `active`, `locked` | USER-E-001 | 422 |
| V-06 | `sort` | Chỉ nhận `created_at_desc`, `name_asc`, `post_count_desc`, `last_login_desc` | USER-E-001 | 422 |
| V-07 | `page` | Integer >= 1 | USER-E-001 | 422 |
| V-08 | `limit` | Integer trong khoảng 1..100 | USER-E-001 | 422 |

## 5. Response
### 5.1 Thành công (HTTP 200)
Response root là `{ items, pagination }`. Mỗi item có đúng các field: `id`, `name`, `email`, `phone`, `address`, `avatar_url`, `role`, `status`, `bio`, `birthdate`, `gender`, `locked_reason`, `last_login_at`, `created_at`, `updated_at`, `postCount`, `publishedPostCount`, `draftPostCount`.

```json
{
  "items": [
    { "id": 2, "name": "Nguyễn Văn A", "email": "member@hoianblog.vn", "phone": "0912345678", "address": "Đà Nẵng", "avatar_url": null, "role": "member", "status": "active", "bio": "Yêu du lịch Việt Nam", "birthdate": "1995-01-20", "gender": "male", "locked_reason": null, "last_login_at": null, "created_at": "2026-06-03T00:00:00.000Z", "updated_at": "2026-06-04T00:00:00.000Z", "postCount": 3, "publishedPostCount": 2, "draftPostCount": 1 }
  ],
  "pagination": { "page": 1, "limit": 10, "totalItems": 1, "totalPages": 1 }
}
```

### 5.2 Lỗi
| Error Code | HTTP Status | MessageId | Điều kiện |
|---|---|---|---|
| ERR_UNAUTHORIZED | 401 | COMMON-E-001 | Thiếu/sai token |
| ERR_FORBIDDEN | 403 | USER-E-004 | Không phải admin |
| ERR_VALIDATION | 422 | USER-E-001 | Query params không hợp lệ |
| ERR_INTERNAL | 500 | COMMON-E-001 | Lỗi hệ thống |

## 6. Sequence Diagram
```mermaid
sequenceDiagram
  participant FE as Admin User List
  participant API as users.controller.list
  participant DB as PostgreSQL
  FE->>API: GET /api/admin/users?keyword&role&status&sort&page&limit
  API->>API: Validate auth/admin/query
  alt Query invalid
    API-->>FE: 422 USER-E-001
  else Valid
    API->>DB: [Q1] Count users after filters
    API->>DB: [Q2] Select users + post counters
    ## 10. Side Effects
    Không có. API chỉ đọc dữ liệu.
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
