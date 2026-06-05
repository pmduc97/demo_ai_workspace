---
version: 1.1
created: 2026-06-03
updated: 2026-06-05
status: stable
---

# [Design][API] API11_AdminPosts_ChiTiet

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.1 | 2026-06-05 | Chuẩn hóa 10 sections, đồng bộ code `getAdminById` | docs-agent |

## 1. Tổng quan
Admin xem chi tiết bài theo ID, bao gồm cả draft. Tham chiếu: API List, UTILS, MESSAGE_Catalog, DB Schema, `posts.controller.js`, `admin.routes.js`.

## 2. Thông tin chung
| Method | Endpoint | Auth | Role | Controller |
|---|---|---|---|---|
| GET | `/api/admin/posts/:id` | Bearer JWT | admin | `posts.controller.js#getAdminById` |

| Bảng DB | Mục đích |
|---|---|
| `posts` | Select bài theo ID |

## 3. Request
| Vị trí | Field | Kiểu | Bắt buộc | Mặc định | Mô tả |
|---|---|---|---|---|---|
| Header | Authorization | string | Có | - | `Bearer <token>` |
| Param | id | number/string | Có | - | Code chưa validate number |

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
| V-03 | id | Tồn tại bài viết | POST-E-003 | 404 |

## 5. Response
| HTTP | Mô tả |
|---|---|
| 200 | Trả record `posts` |

```json
{ "id": 1, "title": "Bài viết", "slug": "bai-viet", "content": "...", "status": "draft", "author_id": 2, "category_id": 1 }
```

| Error Code | HTTP | Contract hiện tại | Chuẩn messageId |
|---|---|---|---|
| ERR_UNAUTHORIZED | 401 | `{ "message": "Unauthorized" }` | POST-E-001 |
| ERR_FORBIDDEN | 403 | `{ "message": "Forbidden" }` | POST-E-002 |
| ERR_NOT_FOUND | 404 | `{ "message": "Post not found" }` | POST-E-003 |

## 6. Sequence Diagram
```mermaid
sequenceDiagram
  participant C as Client
  participant A as auth/role
  participant P as getAdminById
  participant DB as DB
  C->>A: GET /api/admin/posts/:id
  A-->>C: 401/403 nếu lỗi
  P->>DB: [Q1] select post
  P-->>C: 404 nếu không có
  P-->>C: 200 row
```

## 7. Logic xử lý
1. `auth` và `role('admin')` kiểm tra quyền.
2. [Q1] Tìm bài theo `req.params.id`.
3. Nếu không có trả 404 `{ message: 'Post not found' }`.
4. Trả row.

## 8. Database Queries & Mapping
| Query ID | Điều kiện OK | Điều kiện NG | Knex.js snippet |
|---|---|---|---|
| Q1 | Có post | Không có → 404 | `db('posts').where({ id: req.params.id }).first()` |

| Source | Target |
|---|---|
| `req.params.id` | `posts.id` |
| `posts.*` | response body |

## 9. Message List
| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|---|---|---|---|---|
| POST-E-001 | Error | 401 | `Unauthorized` | Token lỗi |
| POST-E-002 | Error | 403 | `Forbidden` | Không phải admin |
| POST-E-003 | Error | 404 | `Post not found` | Không tìm thấy |

## 10. Side Effects
Không có.
