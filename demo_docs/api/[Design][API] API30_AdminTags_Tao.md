---
version: 1.0
created: 2026-06-06
updated: 2026-06-06
status: draft
---

# [Design][API] API30_AdminTags_Tao

## Lịch sử thay đổi

| Ver | Ngày | Nội dung thay đổi | Người tạo |
|-----|------|-------------------|-----------|
| 1.0 | 2026-06-06 | Tạo mới | GitHub Copilot |

## 1. Tổng quan
> API tạo mới tag dành cho Admin.

**Tài liệu tham chiếu:**

| Loại | File | Mục đích |
|------|------|----------|
| API List | `demo_docs/api/[Design][LIST] API_DanhSachEndpoint.md` | Danh sách toàn bộ endpoint |
| DB Schema | `demo_docs/[Design][DB] DATABASE_Schema.md` | Cấu trúc bảng |

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `POST` |
| Endpoint | `/api/admin/tags` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Admin |
| Controller | `src/controllers/admin.tags.controller.js` → `createTag` |

**Bảng DB liên quan:**

| Bảng | Hành động | Mục đích |
|------|-----------|----------|
| `tags` | READ | Kiểm tra slug tồn tại |
| `tags` | WRITE | Lưu tag mới |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |

### 3.2 Body Payload

| Logical Name | Physical Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc (Min/Max/Format) | Chuẩn hóa input | Mô tả |
|-------------|---------------|--------------|----------|----------------------------|----------------|-------|
| Tên tag | `name` | String | ✅ | Max 255 ký tự | `trim()` | Tên hiển thị của tag |
| Slug | `slug` | String | ✅ | Max 255 ký tự, format slug | `trim()`, `toLowerCase()` | Đường dẫn thân thiện |
| Mô tả | `description` | String | ❌ | | `trim()` | Mô tả chi tiết |

**Ví dụ Request Body:**
```json
{
  "name": "Du lịch biển",
  "slug": "du-lich-bien",
  "description": "Các bài viết về du lịch biển"
}
```

## 4. Validation Rules

| Rule ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---------|----------|---------|-----------|-------------|
| V-01 | Auth | Token hợp lệ và chưa hết hạn | E-401 | 401 |
| V-02 | Auth | Role có quyền thực hiện (Admin) | E-403 | 403 |
| V-03 | `name` | Bắt buộc, không được rỗng | E-001 | 400 |
| V-04 | `slug` | Bắt buộc, không được rỗng | E-001 | 400 |
| V-05 | `slug` | Không trùng với tag đã tồn tại | E-409 | 409 |

## 5. Response

### 5.1 Thành công (HTTP 201)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| `message` | String | ❌ | Thông báo thành công |
| `data` | Object | ❌ | Dữ liệu tag vừa tạo |
| `data.id` | Number | ❌ | ID tag |

**Ví dụ Response:**
```json
{
  "message": "Tạo tag thành công",
  "data": {
    "id": 1
  }
}
```

### 5.2 Lỗi & Exceptions
| HTTP Code | Error Code | Message | Điều kiện xảy ra |
|-----------|-----------|---------|------------------|
| 400 | `ERR_VALIDATION` | `"Validation failed"` | Thiếu field bắt buộc |
| 401 | `ERR_UNAUTHORIZED` | `"Unauthorized"` | Token không hợp lệ hoặc hết hạn |
| 403 | `ERR_FORBIDDEN` | `"Forbidden"` | Không đủ quyền truy cập |
| 409 | `ERR_CONFLICT` | `"Already exists"` | Slug đã tồn tại |

## 6. Sequence Diagram

```mermaid
sequenceDiagram
  actor Client
  participant Controller
  participant DB

  Client->>Controller: POST /api/admin/tags { body }
  Controller->>Controller: Validate input (V-03, V-04)
  alt Validation fail
    Controller-->>Client: 400 { message }
  else Validation pass
    Controller->>DB: [Q1] SELECT slug
    alt Found
      Controller-->>Client: 409 { message }
    else Not found
      Controller->>DB: [Q2] INSERT tag
      alt DB error
        Controller-->>Client: 500 { message }
      else Success
        Controller-->>Client: 201 { data }
      end
    end
  end
```

## 7. Logic xử lý (Business Logic)
1. Chuẩn hóa input: `trim` các field, `toLowerCase` cho `slug`.
2. Validate theo thứ tự V-03 → V-04.
3. Thực hiện **[Q1]** để kiểm tra `slug` đã tồn tại chưa (V-05).
   - Nếu đã tồn tại → throw `409 Conflict`.
4. Thực hiện **[Q2]** để thêm mới tag vào database, lưu `created_by` là ID của Admin đang đăng nhập.
5. Chuẩn hóa response và trả về.

## 8. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Điều kiện OK/NG | Knex.js Snippet |
|----------|--------------|-----------|--------------------------|----------------|----------------|
| **[Q1]** | `tags` | `SELECT` | `WHERE slug = :slug` | > 0 record → 409 | `knex('tags').where({ slug }).first()` |
| **[Q2]** | `tags` | `INSERT` | Data từ body + `created_by` | Lỗi DB → 500 | `knex('tags').insert(data).returning('id')` |

**Data Mapping — Request → SQL:**

| API Field | SQL Param | Transform |
|-----------|-----------|-----------|
| `name` | `name` | `trim()` |
| `slug` | `slug` | `trim()`, `toLowerCase()` |
| `description` | `description` | `trim()` |
| `user.id` | `created_by` | Lấy từ token |

**Data Mapping — DB Column → Response:**

| DB Column | Response Field | Transform/Format |
|-----------|---------------|-----------------|
| `id` | `data.id` | Không |

## 9. Message List

| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|-----------|------|-------------|----------|-----------|
| E-001 | Error | 400 | `"Field {field} là bắt buộc"` | Thiếu field required |
| E-401 | Error | 401 | `"Unauthorized"` | Token không hợp lệ |
| E-403 | Error | 403 | `"Forbidden"` | Không có quyền Admin |
| E-409 | Error | 409 | `"Slug đã tồn tại"` | Duplicate slug |
| S-001 | Success | 201 | `"Tạo tag thành công"` | API thành công |

## 10. Side Effects (Tác động phụ)
- Không có.