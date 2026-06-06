---
version: 1.0
created: 2026-06-06
updated: 2026-06-06
status: draft
---

# [Design][API] API32_AdminTags_Xoa

## Lịch sử thay đổi

| Ver | Ngày | Nội dung thay đổi | Người tạo |
|-----|------|-------------------|-----------|
| 1.0 | 2026-06-06 | Tạo mới | GitHub Copilot |

## 1. Tổng quan
> API xóa tag dành cho Admin (Soft delete).

**Tài liệu tham chiếu:**

| Loại | File | Mục đích |
|------|------|----------|
| API List | `demo_docs/api/[Design][LIST] API_DanhSachEndpoint.md` | Danh sách toàn bộ endpoint |
| DB Schema | `demo_docs/[Design][DB] DATABASE_Schema.md` | Cấu trúc bảng |

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `DELETE` |
| Endpoint | `/api/admin/tags/:id` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Admin |
| Controller | `src/controllers/admin.tags.controller.js` → `deleteTag` |

**Bảng DB liên quan:**

| Bảng | Hành động | Mục đích |
|------|-----------|----------|
| `tags` | READ | Kiểm tra tồn tại tag |
| `tags` | WRITE | Cập nhật `deleted_at`, `deleted_by` |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |
| id | Path | Number | ✅ | `> 0` | ID của tag cần xóa |

### 3.2 Body Payload
> Không có

## 4. Validation Rules

| Rule ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---------|----------|---------|-----------|-------------|
| V-01 | Auth | Token hợp lệ và chưa hết hạn | E-401 | 401 |
| V-02 | Auth | Role có quyền thực hiện (Admin) | E-403 | 403 |
| V-03 | `id` | Phải là số nguyên dương | E-003 | 400 |

## 5. Response

### 5.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| `message` | String | ❌ | Thông báo thành công |

**Ví dụ Response:**
```json
{
  "message": "Xóa tag thành công"
}
```

### 5.2 Lỗi & Exceptions
| HTTP Code | Error Code | Message | Điều kiện xảy ra |
|-----------|-----------|---------|------------------|
| 400 | `ERR_VALIDATION` | `"Validation failed"` | ID không hợp lệ |
| 401 | `ERR_UNAUTHORIZED` | `"Unauthorized"` | Token không hợp lệ hoặc hết hạn |
| 403 | `ERR_FORBIDDEN` | `"Forbidden"` | Không đủ quyền truy cập |
| 404 | `ERR_NOT_FOUND` | `"Not found"` | Không tìm thấy tag |

## 6. Sequence Diagram

```mermaid
sequenceDiagram
  actor Client
  participant Controller
  participant DB

  Client->>Controller: DELETE /api/admin/tags/:id
  Controller->>Controller: Validate input (V-03)
  alt Validation fail
    Controller-->>Client: 400 { message }
  else Validation pass
    Controller->>DB: [Q1] SELECT tag by id
    alt Not found
      Controller-->>Client: 404 { message }
    else Found
      Controller->>DB: [Q2] UPDATE deleted_at, deleted_by
      alt DB error
        Controller-->>Client: 500 { message }
      else Success
        Controller-->>Client: 200 { message }
      end
    end
  end
```

## 7. Logic xử lý (Business Logic)
1. Validate `id` (V-03).
2. Thực hiện **[Q1]** để kiểm tra tag có tồn tại và chưa bị xóa không.
   - Nếu không tìm thấy hoặc đã bị xóa → throw `404 Not Found`.
3. Thực hiện **[Q2]** để soft delete tag (cập nhật `deleted_at` là thời gian hiện tại, `deleted_by` là ID của Admin đang đăng nhập).
4. Trả về response thành công.

## 8. Database Queries & Mapping

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Điều kiện OK/NG | Knex.js Snippet |
|----------|--------------|-----------|--------------------------|----------------|----------------|
| **[Q1]** | `tags` | `SELECT` | `WHERE id = :id AND deleted_at IS NULL` | 0 record → 404 | `knex('tags').where({ id }).whereNull('deleted_at').first()` |
| **[Q2]** | `tags` | `UPDATE` | `deleted_at`, `deleted_by` | Lỗi DB → 500 | `knex('tags').where({ id }).update({ deleted_at: knex.fn.now(), deleted_by: userId })` |

**Data Mapping — Request → SQL:**

| API Field | SQL Param | Transform |
|-----------|-----------|-----------|
| `user.id` | `deleted_by` | Lấy từ token |

**Data Mapping — DB Column → Response:**
Không có

## 9. Message List

| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|-----------|------|-------------|----------|-----------|
| E-003 | Error | 400 | `"Tham số không hợp lệ"` | ID không hợp lệ |
| E-401 | Error | 401 | `"Unauthorized"` | Token không hợp lệ |
| E-403 | Error | 403 | `"Forbidden"` | Không có quyền Admin |
| E-404 | Error | 404 | `"Không tìm thấy dữ liệu"` | Tag không tồn tại |
| S-001 | Success | 200 | `"Xóa tag thành công"` | API thành công |

## 10. Side Effects (Tác động phụ)
- Không có.