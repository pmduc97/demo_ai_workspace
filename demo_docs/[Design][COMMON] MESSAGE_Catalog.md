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
| AUTH-S-001 | Auth | S | 200 | `Đăng nhập thành công` | Router redirect | `demo_source_fe/src/pages/admin/LoginPage.jsx` | API login thành công, redirect dashboard |
| AUTH-I-001 | Auth | I | N/A | `Tự động chuyển tới dashboard` | Router redirect | `demo_source_fe/src/pages/admin/LoginPage.jsx` | User đã tồn tại trong `AuthContext` khi mở `/admin/login` |
| AUTH-C-001 | Auth | C | N/A | `Xác nhận gửi thông tin đăng nhập` | Không hiển thị confirm | `demo_source_fe/src/pages/admin/LoginPage.jsx` | User submit form đăng nhập |
| COMMON-E-001 | Common | E | N/A | `Có lỗi xảy ra` | ErrorBanner / Toast | `demo_source_fe/src/services/api.js` | Fallback chung khi không xác định được domain |
