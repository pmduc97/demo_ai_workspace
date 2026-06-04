---
version: 1.0
created: 2026-06-04
updated: 2026-06-04
status: stable
---

# [Design][COMMON] MESSAGE_Catalog

## 1. Mục đích

Message Catalog là nguồn chuẩn dùng chung cho Backend, Frontend, API docs và Screen docs. Khi một luồng cần hiển thị message cho user hoặc trả lỗi API, phải tra cứu catalog này trước.

## 2. Quy ước Message ID

Format: `{DOMAIN}-{TYPE}-{NUMBER}`

| Thành phần | Ý nghĩa | Ví dụ |
|------------|---------|-------|
| `DOMAIN` | Nhóm nghiệp vụ hoặc common | `AUTH`, `POST`, `CATEGORY`, `USER`, `COMMON` |
| `TYPE` | Loại message | `E`, `S`, `I`, `C`, `W` |
| `NUMBER` | Số thứ tự 3 chữ số trong domain/type | `001` |

| Type | Ý nghĩa |
|------|---------|
| `E` | Error |
| `S` | Success |
| `I` | Info |
| `C` | Confirm |
| `W` | Warning |

## 3. Contract API

Backend phải trả message theo format chuẩn:

```json
{
  "messageId": "AUTH-E-001",
  "message": "Email hoặc mật khẩu không đúng",
  "details": {}
}
```

Quy tắc:
- `messageId` là khóa chuẩn để FE map text.
- `message` là fallback text để debug API và hỗ trợ FE khi chưa có mapping.
- `details` là optional, dùng cho validation hoặc field-level error.

## 4. Quy tắc sử dụng trong tài liệu

Khi tạo hoặc cập nhật API docs / FE screen docs:
1. Phải đọc file này trước khi định nghĩa message.
2. Nếu message đã tồn tại, dùng lại đúng `Message ID`.
3. Nếu message chưa tồn tại, thêm mới vào catalog này trước.
4. FE Screen `Message List` phải reference `Message ID` từ catalog, không tự tạo ID local dạng `MSG-E-001` nếu message dùng chung với API.
5. API docs phải mô tả response lỗi có cả `messageId` và `message`.

## 5. Message List

| Message ID | Domain | Type | HTTP Status | Default Text | FE Component | BE Source | Điều kiện |
|------------|--------|------|-------------|--------------|--------------|-----------|-----------|
| AUTH-E-001 | Auth | E | 400 | `Email và mật khẩu là bắt buộc` | ErrorBanner | `demo_source_be/src/controllers/auth.controller.js` | Login thiếu `email` hoặc `password` |
| AUTH-E-002 | Auth | E | 401 | `Email hoặc mật khẩu không đúng` | ErrorBanner | `demo_source_be/src/controllers/auth.controller.js` | Login sai email hoặc password |
| AUTH-E-003 | Auth | E | 500 | `Đăng nhập thất bại` | ErrorBanner | `demo_source_fe/src/services/api.js` | Lỗi login không có message hợp lệ từ API hoặc network error |
| AUTH-E-004 | Auth | E | N/A | `Email không đúng định dạng` | ErrorBanner | `demo_source_fe/src/pages/admin/LoginPage.jsx` | Login nhập email sai định dạng phía client |
| AUTH-E-005 | Auth | E | N/A | `Mật khẩu tối thiểu 6 ký tự` | ErrorBanner | `demo_source_fe/src/pages/admin/LoginPage.jsx` | Login nhập mật khẩu dưới 6 ký tự phía client |
| AUTH-S-001 | Auth | S | 200 | `Đăng nhập thành công` | Router redirect | `demo_source_fe/src/pages/admin/LoginPage.jsx` | API login thành công, redirect dashboard |
| AUTH-I-001 | Auth | I | N/A | `Tự động chuyển tới dashboard` | Router redirect | `demo_source_fe/src/pages/admin/LoginPage.jsx` | User đã tồn tại trong `AuthContext` khi mở `/admin/login` |
| AUTH-C-001 | Auth | C | N/A | `Xác nhận gửi thông tin đăng nhập` | Không hiển thị confirm | `demo_source_fe/src/pages/admin/LoginPage.jsx` | User submit form đăng nhập |
| COMMON-E-001 | Common | E | N/A | `Có lỗi xảy ra` | ErrorBanner / Toast | `demo_source_fe/src/services/api.js` | Fallback chung khi không xác định được domain |
| CATEGORY-E-001 | Category | E | 400/422 | `Dữ liệu danh mục không hợp lệ` | InlineError / Toast | `categories.controller.js` | Validate request fail |
| CATEGORY-E-002 | Category | E | 409 | `Slug danh mục đã tồn tại` | InlineError | `categories.controller.js` | Slug trùng với danh mục chưa xóa |
| CATEGORY-E-003 | Category | E | 404 | `Danh mục không tồn tại` | Toast | `categories.controller.js` | Không tìm thấy danh mục active theo ID |
| CATEGORY-E-004 | Category | E | 403 | `Bạn không có quyền quản lý danh mục` | Toast / Redirect | `role.js` | User không phải admin |
| CATEGORY-S-001 | Category | S | 201 | `Tạo danh mục thành công` | Toast | `CategoryListPage.jsx` | Tạo danh mục thành công |
| CATEGORY-S-002 | Category | S | 200 | `Cập nhật danh mục thành công` | Toast | `CategoryListPage.jsx` | Cập nhật danh mục thành công |
| CATEGORY-S-003 | Category | S | 200 | `Xóa danh mục thành công` | Toast | `CategoryListPage.jsx` | Soft delete danh mục thành công |
| CATEGORY-C-001 | Category | C | N/A | `Xóa mềm danh mục này? Danh mục sẽ bị ẩn khỏi danh sách public nhưng dữ liệu bài viết vẫn được giữ.` | ConfirmModal | `CategoryListPage.jsx` | Admin click nút xóa |
| CATEGORY-I-001 | Category | I | N/A | `Chưa có danh mục nào. Hãy thêm danh mục đầu tiên!` | EmptyState | `CategoryListPage.jsx` | Danh sách rỗng |
| USER-E-001 | User | E | 400/422 | `Dữ liệu người dùng không hợp lệ` | InlineError / Toast | `users.controller.js` | Validate request fail |
| USER-E-002 | User | E | 409 | `Email người dùng đã tồn tại` | InlineError | `users.controller.js` | Email trùng nếu API cho sửa email sau này |
| USER-E-003 | User | E | 404 | `Người dùng không tồn tại` | Toast | `users.controller.js` | Không tìm thấy user theo ID |
| USER-E-004 | User | E | 403 | `Bạn không có quyền quản lý người dùng` | Toast / Redirect | `role.js` | User không phải admin |
| USER-E-005 | User | E | 400 | `Không thể đổi role của chính mình` | Tooltip / Toast | `users.controller.js` | Admin tự đổi role của chính mình |
| USER-E-006 | User | E | 400 | `Không thể khóa tài khoản của chính mình` | Tooltip / Toast | `users.controller.js` | Admin tự khóa tài khoản chính mình |
| USER-S-001 | User | S | 200 | `Cập nhật người dùng thành công` | Toast | `UserListPage.jsx` | Cập nhật profile thành công |
| USER-S-002 | User | S | 200 | `Cập nhật role thành công` | Toast | `UserListPage.jsx` | Cập nhật role thành công |
| USER-S-003 | User | S | 200 | `Cập nhật trạng thái tài khoản thành công` | Toast | `UserListPage.jsx` | Khóa/mở khóa tài khoản thành công |
| USER-C-001 | User | C | N/A | `Đổi role của người dùng này? Quyền truy cập của họ sẽ thay đổi ở lần xác thực tiếp theo.` | ConfirmModal | `UserListPage.jsx` | Admin click đổi role |
| USER-C-002 | User | C | N/A | `Khóa tài khoản này? Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.` | ConfirmModal | `UserListPage.jsx` | Admin click khóa user |
| USER-C-003 | User | C | N/A | `Mở khóa tài khoản này? Người dùng có thể đăng nhập lại.` | ConfirmModal | `UserListPage.jsx` | Admin click mở khóa user |
| USER-I-001 | User | I | N/A | `Chưa có người dùng nào.` | EmptyState | `UserListPage.jsx` | Danh sách rỗng |
| USER-I-002 | User | I | N/A | `Không tìm thấy người dùng phù hợp` | EmptyState | `UserListPage.jsx` | Filter/search không có kết quả |
