---
version: 1.0
created: 2026-06-03
updated: 2026-06-06
status: stable
---

# [Design][SCREEN] CONTACT_LienHe

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|-----|------|----------|-----------|
| 1.0 | 2026-06-03 | Tạo tài liệu ban đầu | GitHub Copilot |
| 1.1 | 2026-06-06 | Chuẩn hóa 12 sections, loại bỏ emoji, thêm YAML frontmatter | docs-agent |

## 1. Tổng quan
Trang liên hệ với form gửi tin nhắn và thông tin liên lạc của blog. Form submit hiển thị thông báo thành công (không gọi API backend).

## 2. Thông tin chung
| Thuộc tính | Giá trị |
|-----------|---------|
| Route | `/contact` |
| Auth yêu cầu | Không |
| Redirect nếu chưa login | Không |
| URL Params | Không có |

## 3. Navigation

### Vào từ đâu
| Nguồn | Điều kiện |
|-------|----------|
| Navbar | Click "Liên Hệ" |
| Footer | Click link "Liên Hệ" |

### Đi đến đâu
| Hành động | Destination |
|-----------|-------------|
| Submit thành công | Ở lại trang, hiện thông báo |

## 4. Layout & Components
```jsx
<Navbar />
<main className="min-h-[100dvh]">
  <PageHeader />       {/* Tiêu đề + mô tả */}
  <section className="grid grid-cols-1 lg:grid-cols-2">
    <ContactForm />    {/* Form gửi tin nhắn */}
    <ContactInfo />    {/* Thông tin liên lạc */}
  </section>
</main>
<Footer />
```
Components dùng lại: `Navbar`, `Footer`.

## 5. Ma trận trạng thái UI
| Trạng thái | Form fields | Submit button | Success card | Error banner |
|-----------|------------|--------------|-------------|-------------|
| Idle | Enable | Enable | Ẩn | Ẩn |
| Submitting | Disable | Disable + spinner | Ẩn | Ẩn |
| Success | Ẩn | Ẩn | Hiển thị | Ẩn |
| Error | Enable | Enable | Ẩn | Hiển thị |

## 6. Chi tiết UI từng section

### 6.1 PageHeader
- Tiêu đề: "Liên Hệ" (h1)
- Mô tả: "Hãy để lại tin nhắn, chúng tôi sẽ phản hồi sớm nhất có thể"
- Không có ảnh banner (nền trắng đơn giản)

### 6.2 ContactForm
| Control | Loại | I/O | Ràng buộc | Giá trị khởi tạo | Nguồn dữ liệu | Event ID | JSON Field | Ghi chú |
|---------|------|-----|-----------|------------------|---------------|----------|------------|---------|
| Họ và tên | Input text | Input | Bắt buộc, min 2 ký tự | '' | User | E01 | `name` | |
| Email | Input email | Input | Bắt buộc, format email | '' | User | E01 | `email` | |
| Chủ đề | Input text | Input | Tối đa 100 ký tự | '' | User | E01 | `subject` | |
| Nội dung | Textarea (5 rows) | Input | Bắt buộc, min 10, max 1000 ký tự | '' | User | E01 | `message` | |
| Gửi Tin Nhắn | Button | Input | Disable khi submitting | N/A | N/A | E01 | N/A | |
| Error message | Text | Output | Màu đỏ, text-sm, dưới field | N/A | Validation | N/A | N/A | Hiển thị trên từng field |
| Success card | Card | Output | N/A | Ẩn | Submit success | N/A | N/A | Icon xanh + "Cảm ơn!..." |

### 6.3 ContactInfo
- Tiêu đề: "Thông Tin Liên Hệ"
- Các mục (icon SVG + label + value):
  - Địa chỉ: Việt Nam
  - Email: contact@blogdulich.vn
  - Giờ làm việc: Thứ 2 - Thứ 6, 8:00 - 17:00
- Mạng xã hội: Facebook, Instagram (icon + link, href="#")
- Nền xám nhạt (`bg-gray-50`), padding 32px, border-radius

## 7. API Calls
Không có API call. Form sử dụng `setTimeout` giả lập 1 giây.

## 8. State Management
```js
const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
const [errors, setErrors] = useState({});
const [submitStatus, setSubmitStatus] = useState('idle');
// 'idle' | 'submitting' | 'success' | 'error'
```

## 9. Xử lý lỗi & Edge Cases
| Tình huống | Component | Xử lý |
|-----------|-----------|--------|
| Submit khi form chưa hợp lệ | Inline error | Hiển thị tất cả lỗi, không submit |
| Double submit | Button disabled | Nút disabled khi `submitting` |
| Sau khi success | Success card | Nút "Gửi tin nhắn khác" reset form về idle |

## 10. Responsive
| Element | Mobile | Desktop |
|---------|--------|---------|
| Form + Info | Stack dọc (form trên) | 2 cột ngang |

## 11. Events & Actions
| Event ID | Tên | Control | Trigger | Mô tả |
|----------|-----|---------|---------|-------|
| E01 | Submit form | Nút "Gửi Tin Nhắn" | Click | Validate form, giả lập 1s, hiển success |

## 12. Message List
| MessageId | Loại | Nội dung | Component | Điều kiện |
|-----------|------|----------|-----------|-----------|
| N/A | E | Họ tên tối thiểu 2 ký tự | Inline error | Validation fail |
| N/A | E | Email không hợp lệ | Inline error | Validation fail |
| N/A | E | Nội dung tối thiểu 10 ký tự | Inline error | Validation fail |
| N/A | S | Cảm ơn! Chúng tôi đã nhận được tin nhắn của bạn. | Success card | Submit success |
