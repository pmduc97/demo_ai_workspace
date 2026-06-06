---
version: 1.1
created: 2026-06-03
updated: 2026-06-06
status: stable
---

# [Design][API] API03_Auth_ThongTinUser

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|-----|------|----------|-----------|
| 1.0 | 2026-06-03 | Tạo tài liệu ban đầu | GitHub Copilot |
| 1.1 | 2026-06-06 | Chuẩn hóa 10 sections | docs-agent |

## 1. Tổng quan
API dùng để lấy thông tin chi tiết của user hiện tại dựa vào JWT token gửi lên trong header. Dùng để khôi phục session khi reload trang.

## 2. Thông tin chung
| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `GET` |
| Endpoint | `/api/auth/me` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Member, Admin |
| Controller | `src/controllers/auth.controller.js` -> `me` |

**Bảng DB liên quan:**
| Bảng | Hành động | Mục đích |
|------|-----------|----------|
| `users` | READ | Lấy thông tin user theo ID từ token |

## 3. Request
### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Authorization | Header | String | ✅ | `Bearer <token>` | Token xác thực |

### 3.2 Body Payload
Không có.

## 4. Validation Rules
| Rule ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---------|----------|---------|-----------|-------------|
| V-01 | Token | Token phải hợp lệ và chưa hết hạn | `AUTH-E-001` | 401 |
| V-02 | User | User ID trong token phải tồn tại trong DB | `AUTH-E-002` | 404 |

## 5. Response
### 5.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| `id` | Number | ❌ | ID người dùng |
| `name` | String | ❌ | Tên hiển thị |
| `email` | String | ❌ | Email người dùng |
| `role` | String | ❌ | Role (`admin` hoặc `member`) |

### 5.2 Lỗi
| HTTP Code | Error Code | MessageId | Mô tả |
|-----------|------------|-----------|-------|
| 401 | `UNAUTHORIZED` | `AUTH-E-001` | Token không hợp lệ |
| 404 | `NOT_FOUND` | `AUTH-E-002` | Không tìm thấy user |

## 6. Sequence Diagram
Không có.

## 7. Logic xử lý
1. Middleware `auth` verify token và gán `req.user`.
2. Thực hiện **[Q1]** lấy thông tin user từ DB theo `req.user.id`.
3. Trả về thông tin user (loại bỏ password).

## 8. Database Queries & Mapping
| Query ID | Bảng | Hành động | Điều kiện / Data | Knex.js Snippet |
|----------|------|-----------|------------------|-----------------|
| **[Q1]** | `users` | `SELECT` | `WHERE id = ?` | `knex('users').where({ id }).first()` |

## 9. Message List
| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|-----------|------|-------------|----------|-----------|
| `AUTH-E-001` | E | 401 | Xác thực thất bại | Token sai/hết hạn |
| `AUTH-E-002` | E | 404 | Người dùng không tồn tại | User bị xóa |

## 10. Side Effects
Không có.
