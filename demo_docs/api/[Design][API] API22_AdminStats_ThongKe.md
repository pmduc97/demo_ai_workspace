---
version: 1.1
created: 2026-06-03
updated: 2026-06-06
status: stable
---

# [Design][API] API22_AdminStats_ThongKe

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|-----|------|----------|-----------|
| 1.0 | 2026-06-03 | Tạo tài liệu ban đầu | GitHub Copilot |
| 1.1 | 2026-06-06 | Chuẩn hóa 10 sections | docs-agent |

## 1. Tổng quan
API lấy thống kê tổng quan cho Dashboard. Admin thấy toàn bộ hệ thống, Member chỉ thấy thống kê bài viết của mình.

## 2. Thông tin chung
| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `GET` |
| Endpoint | `/api/admin/stats` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Member, Admin |
| Controller | `src/controllers/admin.controller.js` -> `stats` |

**Bảng DB liên quan:**
| Bảng | Hành động | Mục đích |
|------|-----------|----------|
| `posts` | READ | Đếm số bài viết (tổng, published, draft) |
| `categories` | READ | Đếm số danh mục |

## 3. Request
### 3.1 Headers & Parameters
Không có.

### 3.2 Body Payload
Không có.

## 4. Validation Rules
Không có.

## 5. Response
### 5.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| `totalPosts` | Number | ❌ | Tổng số bài viết |
| `publishedPosts` | Number | ❌ | Số bài viết đã xuất bản |
| `draftPosts` | Number | ❌ | Số bài viết nháp |
| `totalCategories` | Number | ❌ | Tổng số danh mục |

### 5.2 Lỗi
| HTTP Code | Error Code | MessageId | Mô tả |
|-----------|------------|-----------|-------|
| 401 | `UNAUTHORIZED` | `AUTH-E-001` | Token không hợp lệ |

## 6. Sequence Diagram
Không có.

## 7. Logic xử lý
1. Middleware `auth` xác thực token.
2. Nếu `req.user.role == 'admin'`:
   - Thực hiện **[Q1]** đếm tổng bài viết, bài published, bài draft.
   - Thực hiện **[Q2]** đếm tổng danh mục.
3. Nếu `req.user.role == 'member'`:
   - Thực hiện **[Q3]** đếm tổng bài viết, bài published, bài draft của `req.user.id`.
   - Thực hiện **[Q2]** đếm tổng danh mục.
4. Trả về kết quả thống kê.

## 8. Database Queries & Mapping
| Query ID | Bảng | Hành động | Điều kiện / Data | Knex.js Snippet |
|----------|------|-----------|------------------|-----------------|
| **[Q1]** | `posts` | `COUNT` | `WHERE deleted_at IS NULL` | `knex('posts').count('*').whereNull('deleted_at')` |
| **[Q2]** | `categories` | `COUNT` | `WHERE deleted_at IS NULL` | `knex('categories').count('*').whereNull('deleted_at')` |
| **[Q3]** | `posts` | `COUNT` | `WHERE author_id = ? AND deleted_at IS NULL` | `knex('posts').count('*').where({ author_id: req.user.id }).whereNull('deleted_at')` |

## 9. Message List
Không có message đặc thù.

## 10. Side Effects
Không có.
