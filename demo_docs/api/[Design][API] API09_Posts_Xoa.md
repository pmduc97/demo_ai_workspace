---
version: 1.1
created: 2026-06-03
updated: 2026-06-05
status: stable
---

# [Design][API] API09_Posts_Xoa

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|---|---|---|---|
| 1.1 | 2026-06-05 | Chuẩn hóa 10 sections, đồng bộ code `remove` | docs-agent |

## 1. Tổng quan
Xóa bài viết theo ID của user hiện tại. Contract code hiện là hard delete. Tham chiếu: API List, UTILS, MESSAGE_Catalog, DB Schema, `posts.controller.js`, `posts.routes.js`.

## 2. Thông tin chung
| Method | Endpoint | Auth | Role | Controller |
|---|---|---|---|---|
| DELETE | `/api/posts/:id` | Bearer JWT | member/admin | `posts.controller.js#remove` |

| Bảng DB | Mục đích |
|---|---|
| `posts` | Select quyền sở hữu và delete |

## 3. Request
| Vị trí | Field | Kiểu | Bắt buộc | Mặc định | Mô tả |
|---|---|---|---|---|---|
| Header | Authorization | string | Có | - | `Bearer <token>` |
| Param | id | number/string | Có | - | ID bài viết; code chưa validate number |

| Logical Name | Physical Field | Kiểu | Bắt buộc | Ràng buộc | Chuẩn hóa input | Mô tả |
|---|---|---|---|---|---|---|
| Không có | - | - | - | - | - | DELETE không có body |

```json
{}
```

## 4. Validation Rules
| ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---|---|---|---|---|
| V-01 | Authorization | Token hợp lệ | POST-E-001 | 401 |
| V-02 | id | Tồn tại bài viết | POST-E-003 | 404 |
| V-03 | ownership | Member chỉ xóa bài của mình; admin được phép | POST-E-002 | 403 |

## 5. Response
| HTTP | Mô tả |
|---|---|
| 200 | `{ "message": "Deleted" }` |

```json
{ "message": "Deleted" }
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
  participant A as auth
  participant P as remove
  participant DB as DB
  C->>A: DELETE /api/posts/:id
  A->>P: req.user
  P->>DB: [Q1] find post
  P-->>C: 404/403 nếu lỗi
  P->>DB: [Q2] delete post
  P-->>C: 200 {message}
```

## 7. Logic xử lý
1. `auth` xác thực JWT.
2. [Q1] Tìm bài theo ID.
3. Nếu không có trả 404; nếu member không phải chủ bài trả 403.
4. [Q2] Xóa bằng `.del()`.
5. Trả `{ message: 'Deleted' }`.

## 8. Database Queries & Mapping
| Query ID | Điều kiện OK | Điều kiện NG | Knex.js snippet |
|---|---|---|---|
| Q1 | Có post | Không có → 404 | `db('posts').where({ id: req.params.id }).first()` |
| Q2 | Delete thành công | DB error → 500 mặc định | `db('posts').where({ id: req.params.id }).del()` |

| Source | Target |
|---|---|
| `req.params.id` | `posts.id` |
| `req.user` | ownership check |

## 9. Message List
| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|---|---|---|---|---|
| POST-E-001 | Error | 401 | `Unauthorized` | Token lỗi |
| POST-E-002 | Error | 403 | `Forbidden` | Không sở hữu |
| POST-E-003 | Error | 404 | `Post not found` | Không tìm thấy |
| POST-S-003 | Success | 200 | `Deleted` | Xóa thành công |

## 10. Side Effects
Xóa cứng record khỏi `posts`; không dùng `deleted_at/deleted_by` dù DB schema có soft-delete columns.# DELETE /api/posts/:id — Xóa Bài Viết (Member)

## Thông tin
- **Method**: DELETE
- **Endpoint**: `/api/posts/:id`
- **Auth**: Bearer token (Member+)
- **Controller**: `src/controllers/postController.js` → `remove`

## Path Parameters
| Param | Type | Mô tả |
|---|---|---|
| id | number | ID bài viết |

## Response

**200 OK**:
```json
{ "message": "Xóa bài viết thành công" }
```

**403 Forbidden** (không phải bài của mình):
```json
{ "message": "Bạn không có quyền xóa bài viết này" }
```

**404 Not Found**:
```json
{ "message": "Bài viết không tồn tại" }
```

## Logic xử lý
1. Query bài theo `id`
2. Nếu không tìm thấy → 404
3. Nếu `post.author_id != req.user.id` và `req.user.role != 'admin'` → 403
4. DELETE FROM `posts` WHERE `id = :id`
