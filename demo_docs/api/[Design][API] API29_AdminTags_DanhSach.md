---
version: 1.0
created: 2026-06-06
updated: 2026-06-06
status: draft
---

# [Design][API] API29_AdminTags_DanhSach

## Lịch sử thay đổi

| Ver | Ngày | Nội dung thay đổi | Người tạo |
|-----|------|-------------------|-----------|
| 1.0 | 2026-06-06 | Tạo mới | GitHub Copilot |

## 1. Tổng quan
> API lấy danh sách tags dành cho Admin (bao gồm cả tag đã xóa nếu cần, hoặc quản lý toàn bộ).

**Tài liệu tham chiếu:**

| Loại | File | Mục đích |
|------|------|----------|
| API List | `demo_docs/api/[Design][LIST] API_DanhSachEndpoint.md` | Danh sách toàn bộ endpoint |
| DB Schema | `demo_docs/[Design][DB] DATABASE_Schema.md` | Cấu trúc bảng |

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `GET` |
| Endpoint | `/api/admin/tags` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Admin |
| Controller | `src/controllers/admin.tags.controller.js` → `getTags` |

**Bảng DB liên quan:**

| Bảng | Hành động | Mục đích |
|------|-----------|----------|
| `tags` | READ | Lấy danh sách tags |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |
| page | Query | Number | ❌ | Default: `1` | Phân trang |
| limit | Query | Number | ❌ | Default: `10` | Số lượng trên 1 trang |
| search | Query | String | ❌ | | Tìm kiếm theo tên |

### 3.2 Body Payload
> Không có

## 4. Validation Rules

| Rule ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---------|----------|---------|-----------|-------------|
| V-01 | Auth | Token hợp lệ và chưa hết hạn | E-401 | 401 |
| V-02 | Auth | Role có quyền thực hiện (Admin) | E-403 | 403 |
| V-03 | `page` | Phải là số nguyên dương | E-003 | 400 |
| V-04 | `limit` | Phải là số nguyên dương | E-003 | 400 |

## 5. Response

### 5.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| `message` | String | ❌ | Thông báo thành công |
| `data` | Array | ❌ | Danh sách tags |
| `data[].id` | Number | ❌ | ID tag |
| `data[].name` | String | ❌ | Tên tag |
| `data[].slug` | String | ❌ | Slug tag |
| `data[].description` | String | ✅ | Mô tả tag |
| `data[].created_at` | String | ❌ | Ngày tạo |
| `meta` | Object | ❌ | Thông tin phân trang |
| `meta.total` | Number | ❌ | Tổng số tags |
| `meta.page` | Number | ❌ | Trang hiện tại |
| `meta.limit` | Number | ❌ | Số lượng trên trang |

**Ví dụ Response:**
```json
{
  "message": "Lấy danh sách tags thành công",
  "data": [
    {
      "id": 1,
      "name": "Du lịch biển",
      "slug": "du-lich-bien",
      "description": "Các bài viết về du lịch biển",
      "created_at": "2026-06-06T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

### 5.2 Lỗi & Exceptions
| HTTP Code | Error Code | Message | Điều kiện xảy ra |
|-----------|-----------|---------|------------------|
| 400 | `ERR_VALIDATION` | `"Validation failed"` | Sai format query params |
| 401 | `ERR_UNAUTHORIZED` | `"Unauthorized"` | Token không hợp lệ hoặc hết hạn |
| 403 | `ERR_FORBIDDEN` | `"Forbidden"` | Không đủ quyền truy cập |

## 6. Sequence Diagram
> Không có

## 7. Logic xử lý (Business Logic)
1. Lấy `page`, `limit`, `search` từ query params, gán giá trị mặc định nếu không có.
2. Validate `page` và `limit` (V-03, V-04).
3. Thực hiện **[Q1]** để đếm tổng số tags (có thể lọc theo `search`).
4. Thực hiện **[Q2]** để lấy danh sách tags theo phân trang và `search`.
5. Chuẩn hóa response và trả về.

## 8. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Điều kiện OK/NG | Knex.js Snippet |
|----------|--------------|-----------|--------------------------|----------------|----------------|
| **[Q1]** | `tags` | `SELECT` | `name ILIKE %search%` | Luôn OK | `knex('tags').where('name', 'ilike', \`%\${search}%\`).count('id as total').first()` |
| **[Q2]** | `tags` | `SELECT` | `name ILIKE %search%` + LIMIT/OFFSET | Luôn OK | `knex('tags').where('name', 'ilike', \`%\${search}%\`).limit(limit).offset(offset)` |

**Data Mapping — Request → SQL:**
| API Field | SQL Param | Transform |
|-----------|-----------|-----------|
| `search` | `search` | `trim()` |

**Data Mapping — DB Column → Response:**

| DB Column | Response Field | Transform/Format |
|-----------|---------------|-----------------|
| `id` | `data[].id` | Không |
| `name` | `data[].name` | Không |
| `slug` | `data[].slug` | Không |
| `description` | `data[].description` | Không |
| `created_at` | `data[].created_at` | ISO 8601 string |

## 9. Message List

| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|-----------|------|-------------|----------|-----------|
| E-003 | Error | 400 | `"Tham số không hợp lệ"` | Sai format query params |
| E-401 | Error | 401 | `"Unauthorized"` | Token không hợp lệ |
| E-403 | Error | 403 | `"Forbidden"` | Không có quyền Admin |
| S-001 | Success | 200 | `"Lấy danh sách tags thành công"` | API thành công |

## 10. Side Effects (Tác động phụ)
- Không có.