---
version: 1.0
created: 2026-06-06
updated: 2026-06-06
status: draft
---

# [Design][API] API28_Tags_DanhSach

## Lịch sử thay đổi

| Ver | Ngày | Nội dung thay đổi | Người tạo |
|-----|------|-------------------|-----------|
| 1.0 | 2026-06-06 | Tạo mới | GitHub Copilot |

## 1. Tổng quan
> API lấy danh sách tags dành cho người dùng public (chỉ lấy các tag chưa bị xóa).

**Tài liệu tham chiếu:**

| Loại | File | Mục đích |
|------|------|----------|
| API List | `demo_docs/api/[Design][LIST] API_DanhSachEndpoint.md` | Danh sách toàn bộ endpoint |
| DB Schema | `demo_docs/[Design][DB] DATABASE_Schema.md` | Cấu trúc bảng |

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `GET` |
| Endpoint | `/api/tags` |
| Auth yêu cầu | Không |
| Role cho phép | Public |
| Controller | `src/controllers/tags.controller.js` → `getTags` |

**Bảng DB liên quan:**

| Bảng | Hành động | Mục đích |
|------|-----------|----------|
| `tags` | READ | Lấy danh sách tags |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| page | Query | Number | ❌ | Default: `1` | Phân trang |
| limit | Query | Number | ❌ | Default: `10` | Số lượng trên 1 trang |

### 3.2 Body Payload
> Không có

## 4. Validation Rules

| Rule ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---------|----------|---------|-----------|-------------|
| V-01 | `page` | Phải là số nguyên dương | E-003 | 400 |
| V-02 | `limit` | Phải là số nguyên dương | E-003 | 400 |

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
      "description": "Các bài viết về du lịch biển"
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

## 6. Sequence Diagram
> Không có

## 7. Logic xử lý (Business Logic)
1. Lấy `page` và `limit` từ query params, gán giá trị mặc định nếu không có.
2. Validate `page` và `limit` (V-01, V-02).
3. Thực hiện **[Q1]** để đếm tổng số tags (chưa bị xóa).
4. Thực hiện **[Q2]** để lấy danh sách tags theo phân trang (chưa bị xóa).
5. Chuẩn hóa response và trả về.

## 8. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Điều kiện OK/NG | Knex.js Snippet |
|----------|--------------|-----------|--------------------------|----------------|----------------|
| **[Q1]** | `tags` | `SELECT` | `deleted_at IS NULL` | Luôn OK | `knex('tags').whereNull('deleted_at').count('id as total').first()` |
| **[Q2]** | `tags` | `SELECT` | `deleted_at IS NULL` + LIMIT/OFFSET | Luôn OK | `knex('tags').whereNull('deleted_at').limit(limit).offset(offset)` |

**Data Mapping — Request → SQL:**
Không có

**Data Mapping — DB Column → Response:**

| DB Column | Response Field | Transform/Format |
|-----------|---------------|-----------------|
| `id` | `data[].id` | Không |
| `name` | `data[].name` | Không |
| `slug` | `data[].slug` | Không |
| `description` | `data[].description` | Không |

## 9. Message List

| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|-----------|------|-------------|----------|-----------|
| E-003 | Error | 400 | `"Tham số không hợp lệ"` | Sai format query params |
| S-001 | Success | 200 | `"Lấy danh sách tags thành công"` | API thành công |

## 10. Side Effects (Tác động phụ)
- Không có.