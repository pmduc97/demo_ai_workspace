---
version: 1.1
created: 2026-06-03
updated: 2026-06-06
status: stable
---

# [Design][API] API15_Categories_ChiTiet

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|-----|------|----------|-----------|
| 1.0 | 2026-06-03 | Tạo tài liệu ban đầu | GitHub Copilot |
| 1.1 | 2026-06-06 | Chuẩn hóa 10 sections | docs-agent |

## 1. Tổng quan
API lấy chi tiết một danh mục dựa vào slug. Dùng cho trang danh sách bài viết theo danh mục.

## 2. Thông tin chung
| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `GET` |
| Endpoint | `/api/categories/:slug` |
| Auth yêu cầu | Không |
| Role cho phép | Public |
| Controller | `src/controllers/categories.controller.js` -> `getBySlug` |

**Bảng DB liên quan:**
| Bảng | Hành động | Mục đích |
|------|-----------|----------|
| `categories` | READ | Lấy thông tin danh mục |
| `posts` | READ | Đếm số bài viết trong danh mục |

## 3. Request
### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| `slug` | Path | String | ✅ | Không | Slug của danh mục |

### 3.2 Body Payload
Không có.

## 4. Validation Rules
| Rule ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---------|----------|---------|-----------|-------------|
| V-01 | `slug` | Danh mục phải tồn tại và đang active | `CATEGORY-E-003` | 404 |

## 5. Response
### 5.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| `id` | Number | ❌ | ID danh mục |
| `name` | String | ❌ | Tên danh mục |
| `slug` | String | ❌ | Slug danh mục |
| `description` | String | ✅ | Mô tả |
| `postCount` | Number | ❌ | Số bài viết published |

### 5.2 Lỗi
| HTTP Code | Error Code | MessageId | Mô tả |
|-----------|------------|-----------|-------|
| 404 | `NOT_FOUND` | `CATEGORY-E-003` | Không tìm thấy danh mục |

## 6. Sequence Diagram
Không có.

## 7. Logic xử lý
1. Thực hiện **[Q1]** lấy thông tin danh mục theo `slug` (chỉ lấy danh mục active).
2. Nếu không tìm thấy -> throw 404.
3. Thực hiện **[Q2]** đếm số bài viết published thuộc danh mục này.
4. Trả về thông tin danh mục kèm `postCount`.

## 8. Database Queries & Mapping
| Query ID | Bảng | Hành động | Điều kiện / Data | Knex.js Snippet |
|----------|------|-----------|------------------|-----------------|
| **[Q1]** | `categories` | `SELECT` | `WHERE slug = ? AND status = 'active' AND deleted_at IS NULL` | `knex('categories').where({ slug, status: 'active' }).whereNull('deleted_at').first()` |
| **[Q2]** | `posts` | `COUNT` | `WHERE category_id = ? AND status = 'published' AND deleted_at IS NULL` | `knex('posts').count('* as count').where({ category_id: id, status: 'published' }).whereNull('deleted_at')` |

## 9. Message List
| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|-----------|------|-------------|----------|-----------|
| `CATEGORY-E-003` | E | 404 | Danh mục không tồn tại | Sai slug hoặc bị ẩn/xóa |

## 10. Side Effects
Không có.
