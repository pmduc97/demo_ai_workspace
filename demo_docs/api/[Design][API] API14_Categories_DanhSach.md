---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][API] API14_Categories_DanhSach

## 1. Tổng quan
> API dùng để lấy danh sách tất cả các danh mục bài viết. Trả về kèm theo số lượng bài viết đã xuất bản (`published`) thuộc từng danh mục.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `GET` |
| Endpoint | `/api/categories` |
| Auth yêu cầu | Không |
| Role cho phép | Public |
| Controller | `src/controllers/categoryController.js` -> `list` |

## 3. Request

### 3.1 Headers & Parameters
> Không có.

### 3.2 Body Payload
> Không có.

## 4. Response

### 4.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| (root) | Array | ❌ | Mảng các danh mục |
| id | Number | ❌ | ID danh mục |
| name | String | ❌ | Tên danh mục |
| slug | String | ❌ | Slug URL |
| description | String | ✅ | Mô tả danh mục |
| postCount | Number | ❌ | Số lượng bài viết đã xuất bản |

**Ví dụ Response:**
```json
[
  {
    "id": 1,
    "name": "Du lịch",
    "slug": "du-lich",
    "description": "Tin tức du lịch Hội An - Đà Nẵng",
    "postCount": 5
  },
  {
    "id": 2,
    "name": "Ẩm thực",
    "slug": "am-thuc",
    "description": "Ẩm thực đặc sắc miền Trung",
    "postCount": 3
  }
]
```

### 4.2 Lỗi & Exceptions
> Không có lỗi đặc thù (luôn trả về mảng, rỗng nếu không có data).

## 5. Logic xử lý (Business Logic)
1. Thực hiện **[Q1]** để lấy danh sách danh mục, kết hợp đếm số lượng bài viết có `status = 'published'`.
2. Trả về mảng danh mục.

## 6. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `categories`, `posts` | `SELECT` | `LEFT JOIN posts ON posts.category_id = categories.id AND posts.status = 'published' GROUP BY categories.id` | `knex('categories').select('categories.*').count('posts.id as postCount').leftJoin('posts', function() { this.on('posts.category_id', '=', 'categories.id').andOn('posts.status', '=', knex.raw('?', ['published'])) }).groupBy('categories.id')` |

## 7. Side Effects (Tác động phụ)
> Không có.
