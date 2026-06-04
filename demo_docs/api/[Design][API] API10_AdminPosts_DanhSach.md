---
version: 1.1
created: 2026-06-03
updated: 2026-06-05
status: stable
---

# [Design][API] API10_AdminPosts_DanhSach

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.1 | 2026-06-05 | Chuẩn hóa 10 sections, đồng bộ code `listAdmin` | docs-agent |

## 1. Tổng quan
Admin lấy toàn bộ bài viết. Code hiện không phân trang/filter. Tham chiếu: API List, UTILS, MESSAGE_Catalog, DB Schema, `posts.controller.js`, `admin.routes.js`.

## 2. Thông tin chung
| Method | Endpoint | Auth | Role | Controller |
|---|---|---|---|---|
| GET | `/api/admin/posts` | Bearer JWT | admin | `posts.controller.js#listAdmin` |

| Bảng DB | Mục đích |
|---|---|
| `posts` | Select toàn bộ bài viết |

## 3. Request
| Vị trí | Field | Kiểu | Bắt buộc | Mặc định | Mô tả |
|---|---|---|---|---|---|
| Header | Authorization | string | Có | - | `Bearer <token>` |

| Logical Name | Physical Field | Kiểu | Bắt buộc | Ràng buộc | Chuẩn hóa input | Mô tả |
|---|---|---|---|---|---|---|
| Không có | - | - | - | - | - | GET không có body |

```json
{}
```

## 4. Validation Rules
| ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---|---|---|---|---|
| V-01 | Authorization | Token hợp lệ | POST-E-001 | 401 |
| V-02 | Role | Phải là admin | POST-E-002 | 403 |

## 5. Response
| HTTP | Mô tả |
|---|---|
| 200 | `{ items: Post[] }` |

```json
{ "items": [{ "id": 1, "title": "Bài viết", "slug": "bai-viet", "status": "published", "author_id": 1, "category_id": 1 }] }
```

| Error Code | HTTP | Contract hiện tại | Chuẩn messageId |
|---|---|---|---|
| ERR_UNAUTHORIZED | 401 | `{ "message": "Unauthorized" }` | POST-E-001 |
| ERR_FORBIDDEN | 403 | `{ "message": "Forbidden" }` | POST-E-002 |

## 6. Sequence Diagram
```mermaid
sequenceDiagram
  participant C as Client
  participant A as auth/role
  participant P as listAdmin
  participant DB as DB
  C->>A: GET /api/admin/posts
  A-->>C: 401/403 nếu lỗi
  A->>P: pass
  P->>DB: [Q1] select posts
  P-->>C: 200 {items}
```

## 7. Logic xử lý
1. `auth` xác thực JWT.
2. `role('admin')` kiểm tra quyền.
3. [Q1] Select toàn bộ `posts`, order `created_at desc`.
4. Trả `{ items }`.

## 8. Database Queries & Mapping
| Query ID | Điều kiện OK | Điều kiện NG | Knex.js snippet |
|---|---|---|---|
| Q1 | Trả list, có thể rỗng | DB error → 500 mặc định | `db('posts').orderBy('created_at', 'desc')` |

| Source | Target |
|---|---|
| `posts.*` | `items[]` |

## 9. Message List
| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|---|---|---|---|---|
| POST-E-001 | Error | 401 | `Unauthorized` | Token lỗi |
| POST-E-002 | Error | 403 | `Forbidden` | Không phải admin |
| POST-I-001 | Info | N/A | `Chưa có bài viết nào.` | Empty state |

## 10. Side Effects
Không có.# GET /api/admin/posts — Danh Sách Tất Cả Bài Viết (Admin)

## Thông tin
- **Method**: GET
- **Endpoint**: `/api/admin/posts`
- **Auth**: Bearer token (Admin only)
- **Controller**: `src/controllers/adminPostController.js` → `list`

## Query Parameters

| Param | Type | Default | Mô tả |
|---|---|---|---|
| page | number | 1 | Trang hiện tại |
| limit | number | 10 | Số bài mỗi trang |
| status | string | — | `published` hoặc `draft` |
| category | string | — | Slug danh mục |
| search | string | — | Tìm theo tiêu đề |
| sort | string | newest | `newest` hoặc `oldest` |

## Response

**200 OK**:
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Khám phá điểm đến du lịch Việt Nam",
      "slug": "kham-pha-pho-co-hoi-an",
      "thumbnail_url": "/uploads/thumb.jpg",
      "status": "published",
      "created_at": "2024-01-01T00:00:00.000Z",
      "author": { "id": 1, "name": "Admin" },
      "category": { "id": 1, "name": "Du lịch", "slug": "du-lich" }
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

## Logic xử lý
1. Middleware `auth` + `role('admin')`
2. Query tất cả bài (không filter theo status mặc định)
3. Áp dụng filter nếu có: status, category slug, search (ILIKE)
4. Pagination + sort
