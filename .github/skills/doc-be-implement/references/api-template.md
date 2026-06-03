---
version: 1.0
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: draft | stable | deprecated
---

# [Design][API] API{ID}_{Group}_{Name}

## 1. Tổng quan
> Mô tả ngắn gọn API dùng để làm gì, được gọi từ màn hình nào (FE) hoặc hệ thống nào.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `GET` / `POST` / `PUT` / `PATCH` / `DELETE` |
| Endpoint | `/api/...` |
| Auth yêu cầu | Không / Có (Bearer Token) |
| Role cho phép | Public / Member / Admin |
| Controller | `src/controllers/{name}Controller.js` -> `functionName` |

## 3. Request

### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |
| id | Path | Number | ✅ | `> 0` | ID của resource |
| page | Query | Number | ❌ | Default: `1` | Phân trang |

### 3.2 Body Payload
> Ghi "Không có" nếu là GET/DELETE request không có body.

| Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc (Min/Max/Format) | Mô tả |
|-------|--------------|----------|----------------------------|-------|
| field_name | String | ✅ | Ràng buộc cụ thể | Mô tả field |

**Ví dụ Request Body:**
```json
{
  "field_name": "value"
}
```

## 4. Response

### 4.1 Thành công (HTTP 200 / 201)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| data | Array/Object | ❌ | Dữ liệu trả về |

**Ví dụ Response:**
```json
{
  "data": []
}
```

### 4.2 Lỗi & Exceptions
| HTTP Code | Message / Error Code | Điều kiện xảy ra |
|-----------|----------------------|------------------|
| 400 | `Validation Error` | Thiếu field bắt buộc hoặc sai format |
| 401 | `Unauthorized` | Token không hợp lệ hoặc hết hạn |
| 403 | `Forbidden` | Không đủ quyền truy cập |
| 404 | `Not Found` | Không tìm thấy resource |

## 5. Logic xử lý (Business Logic)
> Viết step-by-step luồng xử lý. Gắn thẻ **[Q1]**, **[Q2]** vào các bước có tương tác với Database.

1. Validate request body/params.
2. Thực hiện **[Q1]** để kiểm tra dữ liệu tồn tại.
   - Nếu không tìm thấy -> throw `404 Not Found`.
3. Thực hiện **[Q2]** để cập nhật/thêm mới dữ liệu.
4. Trả về response thành công.

## 6. Database Queries & Mapping
> Danh sách chi tiết các câu query được gọi trong API này (tương ứng với các thẻ Q1, Q2... ở trên).

| Query ID | Bảng (Table) | Hành động | Điều kiện (WHERE) / Data | Knex.js Snippet dự kiến |
|----------|--------------|-----------|--------------------------|-------------------------|
| **[Q1]** | `table_name` | `SELECT` | `WHERE id = ?` | `knex('table_name').where({ id }).first()` |
| **[Q2]** | `table_name` | `INSERT` | `Data từ body` | `knex('table_name').insert(data).returning('*')` |

## 7. Side Effects (Tác động phụ)
> Các tác động ngoài Database. Ghi "Không có" nếu không áp dụng.
- Không có.
