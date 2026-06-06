---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][LIST] UTILS_DanhSach (Backend)

Tài liệu này đóng vai trò là **Registry cho các hàm tiện ích (Utils), Middlewares và Quy chuẩn Framework** của dự án Backend.
Khi thiết kế logic xử lý hoặc sinh code, **BẮT BUỘC** phải tra cứu tài liệu này để tái sử dụng hàm/middleware và tuân thủ đúng cú pháp import của dự án.

## 0. Quy chuẩn Import & Framework (Common Framework)
> Các quy tắc bắt buộc khi viết code Backend để tránh lỗi `MODULE_NOT_FOUND` hoặc sai kiến trúc.

| Thành phần | Cú pháp Import chuẩn | Ghi chú |
|---|---|---|
| **Database (Knex)** | `const db = require('../db');` | **Tuyệt đối không dùng** `require('../db/knex')`. File cấu hình DB nằm tại `src/db/index.js`. |
| **Middlewares** | `const { auth, role } = require('../middlewares/auth');` | Import từ đúng file middleware tương ứng. |
| **Validation** | `const { validate } = require('../middlewares/validate');` | Dùng chung hàm validate cho mọi request. |

## 1. Middlewares (`src/middlewares/`)
> Các hàm trung gian xử lý request trước khi vào Controller. *(Đã có sẵn trong source code).*

| Tên Middleware | Tham số đầu vào | Chức năng | Mô tả & Cách dùng |
|----------------|-----------------|-----------|-------------------|
| `auth` | N/A | Xác thực JWT | Kiểm tra header `Authorization`, verify token. Nếu hợp lệ, gắn `req.user`. Nếu không, ném lỗi 401. |
| `role` | `(allowedRoles: string[])` | Phân quyền | Kiểm tra `req.user.role` có nằm trong danh sách cho phép không. Nếu không, ném lỗi 403. Phải dùng sau middleware `auth`. |
| `validate` | `(schema: Object)` | Validate Input | Kiểm tra `req.body`, `req.query`, `req.params` theo schema định sẵn. Nếu lỗi, ném lỗi 400/422. |

## 2. Auth & Crypto Helpers (`src/utils/crypto.js`)
> Các hàm xử lý mã hóa và token. *(Thư mục và file sẽ được tạo khi implement code thực tế).*

| Tên hàm | Tham số đầu vào | Kết quả trả về | Mô tả & Cách dùng |
|---------|-----------------|----------------|-------------------|
| `hashPassword` | `(password: string)` | `Promise<string>` | Băm mật khẩu bằng `bcrypt` với salt rounds chuẩn (vd: 10). |
| `comparePassword` | `(password: string, hash: string)` | `Promise<boolean>` | So sánh mật khẩu plain text với hash trong DB. |
| `generateToken` | `(payload: object, expiresIn: string)` | `string` | Tạo JWT token với secret key từ biến môi trường. |

## 3. Response & Error Helpers (`src/utils/response.js`)
> Các hàm chuẩn hóa format trả về cho client. *(Thư mục sẽ được tạo khi implement).*

| Tên hàm | Tham số đầu vào | Kết quả trả về | Mô tả & Cách dùng |
|---------|-----------------|----------------|-------------------|
| `successResponse` | `(res, data, message, statusCode = 200)` | `Response` | Trả về JSON format chuẩn cho success: `{ success: true, message, data }`. |
| `errorResponse` | `(res, error, statusCode = 500)` | `Response` | Trả về JSON format chuẩn cho error: `{ success: false, message, details }`. |
