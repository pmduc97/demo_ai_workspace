---
version: 1.1
created: 2026-06-03
updated: 2026-06-06
status: stable
---

# [Design][API] API02_Auth_DangKy

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|-----|------|----------|-----------|
| 1.0 | 2026-06-03 | Tạo tài liệu ban đầu | GitHub Copilot |
| 1.1 | 2026-06-06 | Chuẩn hóa 10 sections, bổ sung Validation Rules, Sequence Diagram | docs-agent |

## 1. Tổng quan
API dùng để đăng ký tài khoản mới. Mặc định tài khoản mới tạo sẽ có role là `member`. Trả về JWT token để tự động đăng nhập sau khi đăng ký thành công.

## 2. Thông tin chung
| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `POST` |
| Endpoint | `/api/auth/register` |
| Auth yêu cầu | Không |
| Role cho phép | Public |
| Controller | `src/controllers/auth.controller.js` -> `register` |

**Bảng DB liên quan:**
| Bảng | Hành động | Mục đích |
|------|-----------|----------|
| `users` | READ, INSERT | Kiểm tra email tồn tại và tạo user mới |

## 3. Request
### 3.1 Headers & Parameters
Không có.

### 3.2 Body Payload
| Logical Name | Physical Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Chuẩn hóa input | Mô tả |
|-------------|---------------|--------------|----------|-----------|----------------|-------|
| Tên hiển thị | `name` | String | ✅ | Min 2 ký tự | Trim khoảng trắng | Tên người dùng |
| Email | `email` | String | ✅ | Format email | Trim, toLowerCase | Email đăng nhập |
| Mật khẩu | `password` | String | ✅ | Min 6 ký tự | Không | Mật khẩu chưa hash |

## 4. Validation Rules
| Rule ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---------|----------|---------|-----------|-------------|
| V-01 | `name`, `email`, `password` | Bắt buộc nhập, đúng định dạng | `AUTH-E-001` | 400 |
| V-02 | `email` | Email không được trùng trong DB | `AUTH-E-002` | 409 |

## 5. Response
### 5.1 Thành công (HTTP 201)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| `token` | String | ❌ | JWT Access Token |
| `user.id` | Number | ❌ | ID người dùng |
| `user.name` | String | ❌ | Tên hiển thị |
| `user.email` | String | ❌ | Email người dùng |
| `user.role` | String | ❌ | Role (mặc định `member`) |

### 5.2 Lỗi
| HTTP Code | Error Code | MessageId | Mô tả |
|-----------|------------|-----------|-------|
| 400 | `VALIDATION_ERROR` | `AUTH-E-001` | Lỗi validation input |
| 409 | `CONFLICT` | `AUTH-E-002` | Email đã tồn tại |

## 6. Sequence Diagram
Không có (Luồng đơn giản).

## 7. Logic xử lý
1. Validate request body.
2. Thực hiện **[Q1]** để kiểm tra xem `email` đã tồn tại chưa. Nếu có -> throw 409.
3. Hash mật khẩu: `bcrypt.hash(password, 10)`.
4. Thực hiện **[Q2]** để tạo user mới với `role = 'member'`.
5. Tạo JWT token.
6. Trả về `token` và thông tin `user`.

## 8. Database Queries & Mapping
| Query ID | Bảng | Hành động | Điều kiện / Data | Knex.js Snippet |
|----------|------|-----------|------------------|-----------------|
| **[Q1]** | `users` | `SELECT` | `WHERE email = ?` | `knex('users').where({ email }).first()` |
| **[Q2]** | `users` | `INSERT` | `name, email, password_hash, role: 'member'` | `knex('users').insert({...}).returning('*')` |

## 9. Message List
| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|-----------|------|-------------|----------|-----------|
| `AUTH-E-001` | E | 400 | Dữ liệu không hợp lệ | Lỗi validation |
| `AUTH-E-002` | E | 409 | Email đã được sử dụng | Trùng email |

## 10. Side Effects
Không có.
