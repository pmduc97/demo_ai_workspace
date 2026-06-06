---
version: 1.1
created: 2026-06-03
updated: 2026-06-06
status: stable
---

# [Design][API] API21_Upload_AnhBai

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|-----|------|----------|-----------|
| 1.0 | 2026-06-03 | Tạo tài liệu ban đầu | GitHub Copilot |
| 1.1 | 2026-06-06 | Chuẩn hóa 10 sections | docs-agent |

## 1. Tổng quan
API upload ảnh bài viết. Sử dụng Multer để lưu file vào thư mục `uploads/`.

## 2. Thông tin chung
| Thuộc tính | Giá trị |
|-----------|---------|
| Method | `POST` |
| Endpoint | `/api/upload` |
| Auth yêu cầu | Có (Bearer Token) |
| Role cho phép | Member, Admin |
| Controller | `src/controllers/upload.controller.js` -> `upload` |

**Bảng DB liên quan:**
Không có.

## 3. Request
### 3.1 Headers & Parameters
| Tên | Vị trí | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Mô tả |
|-----|--------|--------------|----------|-----------|-------|
| Content-Type | Header | String | ✅ | `multipart/form-data` | Định dạng upload file |

### 3.2 Body Payload
| Logical Name | Physical Field | Kiểu dữ liệu | Bắt buộc | Ràng buộc | Chuẩn hóa input | Mô tả |
|-------------|---------------|--------------|----------|-----------|----------------|-------|
| File ảnh | `file` | File | ✅ | Max 5MB, jpg/png/webp | Đổi tên file ngẫu nhiên | File ảnh cần upload |

## 4. Validation Rules
| Rule ID | Đối tượng | Quy tắc | MessageId | HTTP Status |
|---------|----------|---------|-----------|-------------|
| V-01 | `file` | Phải là file ảnh (jpeg, png, webp) | `COMMON-E-001` | 400 |
| V-02 | `file` | Kích thước không vượt quá 5MB | `COMMON-E-001` | 400 |

## 5. Response
### 5.1 Thành công (HTTP 200)
| Field | Kiểu dữ liệu | Có thể Null | Mô tả |
|-------|--------------|-------------|-------|
| `url` | String | ❌ | Đường dẫn tương đối của ảnh (vd: `/uploads/123.jpg`) |

### 5.2 Lỗi
| HTTP Code | Error Code | MessageId | Mô tả |
|-----------|------------|-----------|-------|
| 400 | `BAD_REQUEST` | `COMMON-E-001` | Lỗi định dạng hoặc kích thước file |

## 6. Sequence Diagram
Không có.

## 7. Logic xử lý
1. Middleware `auth` xác thực token.
2. Middleware `multer` kiểm tra định dạng và kích thước file.
3. Lưu file vào thư mục `uploads/` với tên ngẫu nhiên (timestamp + random string).
4. Trả về URL dạng `/uploads/<filename>`.

## 8. Database Queries & Mapping
Không có.

## 9. Message List
| MessageId | Loại | HTTP Status | Nội dung | Điều kiện |
|-----------|------|-------------|----------|-----------|
| `COMMON-E-001` | E | 400 | Chỉ chấp nhận file ảnh (jpg, png, webp) | Sai định dạng |
| `COMMON-E-001` | E | 400 | File không được vượt quá 5MB | Quá dung lượng |

## 10. Side Effects
Lưu file vật lý vào ổ cứng server tại thư mục `uploads/`.
