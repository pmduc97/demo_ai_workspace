---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][LIST] UTILS_DanhSach

Tài liệu này đóng vai trò là **Registry cho các hàm tiện ích (Utils), Custom Hooks và Quy chuẩn Framework** của dự án Frontend.
Khi thiết kế logic xử lý hoặc sinh code, **BẮT BUỘC** phải tra cứu tài liệu này để tái sử dụng hàm và tuân thủ đúng cú pháp import của dự án.

## 0. Quy chuẩn Import & Framework (Common Framework)
> Các quy tắc bắt buộc khi viết code Frontend để đảm bảo tính nhất quán.

| Thành phần | Cú pháp Import chuẩn | Ghi chú |
|---|---|---|
| **API Client (Axios)** | `import api from '../../services/api';` | **Tuyệt đối không dùng** `axios.get(...)` trực tiếp. Phải dùng instance `api` đã được cấu hình sẵn interceptor. |
| **Routing** | `import { Link, useNavigate, useParams } from 'react-router-dom';` | Sử dụng React Router v6. |
| **Auth Context** | `import { useAuth } from '../../context/AuthContext';` | Lấy thông tin user và token từ Context. |

## 1. String & Format Helpers (`src/utils/format.js`)
> Các hàm xử lý chuỗi, định dạng hiển thị. *(Thư mục và file sẽ được tạo khi implement code thực tế).*

| Tên hàm | Tham số đầu vào | Kết quả trả về | Mô tả & Cách dùng |
|---------|-----------------|----------------|-------------------|
| `toSlug` | `(text: string)` | `string` | Chuyển chuỗi tiếng Việt có dấu thành slug URL (vd: "Du lịch Việt Nam" -> "du-lich-viet-nam"). Dùng khi tạo Category/Post. |
| `formatDate` | `(isoString: string)` | `string` | Chuyển đổi chuỗi ngày tháng ISO sang định dạng `DD/MM/YYYY`. |
| `truncateText` | `(text: string, maxLength: number)` | `string` | Cắt ngắn chuỗi và thêm `...` ở cuối nếu vượt quá độ dài. |

## 2. API & Error Helpers (`src/services/api.js`)
> Các hàm liên quan đến gọi API và xử lý lỗi.

| Tên hàm | Tham số đầu vào | Kết quả trả về | Mô tả & Cách dùng |
|---------|-----------------|----------------|-------------------|
| `api` | N/A | `AxiosInstance` | Instance của Axios đã được config sẵn `baseURL` và interceptor gắn token. Dùng cho mọi API call (`api.get`, `api.post`...). |
| `parseApiError` | `(error: any)` | `string` | Trích xuất message lỗi an toàn từ object error của Axios (`error.response?.data?.message`). |

## 3. Custom Hooks (`src/hooks/`)
> Các React hooks dùng chung. *(Thư mục sẽ được tạo khi implement).*

| Tên Hook | Tham số đầu vào | Kết quả trả về | Mô tả & Cách dùng |
|----------|-----------------|----------------|-------------------|
| `useDebounce` | `(value: any, delay: number)` | `any` | Trì hoãn việc cập nhật value, dùng cho ô tìm kiếm (Search input) để tránh gọi API liên tục. |
| `useClickOutside` | `(ref: RefObject, handler: Function)` | `void` | Lắng nghe sự kiện click ra ngoài một element (dùng để đóng Dropdown, Modal). |
