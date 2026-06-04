# CONTACT — Trang Liên Hệ

## Tổng quan
Trang liên hệ với form gửi tin nhắn và thông tin liên lạc của blog. Form submit hiển thị thông báo thành công (không gọi API backend).

## Route & Navigation
- **Route**: `/contact`
- Điều hướng từ: Navbar menu, Footer

## Layout & Components

```
<Navbar />
<main>
  <PageHeader />
  <div className="grid grid-cols-1 lg:grid-cols-2">
    <ContactForm />
    <ContactInfo />
  </div>
</main>
<Footer />
```

## Chi tiết UI từng section

### PageHeader
- Tiêu đề: "Liên Hệ" (h1)
- Mô tả: "Hãy để lại tin nhắn, chúng tôi sẽ phản hồi sớm nhất có thể"
- Không có ảnh banner (nền trắng đơn giản)

### ContactForm
- Tiêu đề: "Gửi Tin Nhắn"
- Fields:

| Field | Type | Required | Validation |
|---|---|---|---|
| Họ và tên | text input | Có | Tối thiểu 2 ký tự |
| Email | email input | Có | Format email hợp lệ |
| Chủ đề | text input | Không | Tối đa 100 ký tự |
| Nội dung | textarea (5 rows) | Có | Tối thiểu 10 ký tự, tối đa 1000 ký tự |

- Validation: validate khi blur (onBlur) và khi submit
- Error message hiển thị dưới mỗi field, màu đỏ, text-sm
- Nút submit: "Gửi Tin Nhắn" — disabled khi đang submitting
- Submit state:
  - `idle`: nút bình thường
  - `submitting`: nút disabled + spinner + text "Đang gửi..."
  - `success`: ẩn form, hiển thị card thành công (icon ✓ xanh + "Cảm ơn! Chúng tôi đã nhận được tin nhắn của bạn.")
  - `error`: hiển thị thông báo lỗi trên đầu form

- Submit action: `setTimeout` giả lập 1 giây rồi chuyển sang `success` (không gọi API thực)

### ContactInfo
- Tiêu đề: "Thông Tin Liên Hệ"
- Các mục (icon + label + value):
  - 📍 Địa chỉ: Việt Nam
  - ✉️ Email: contact@blogdulich.vn
  - 🕐 Giờ làm việc: Thứ 2 - Thứ 6, 8:00 - 17:00
- Mạng xã hội: Facebook, Instagram (icon + link, href="#" placeholder)
- Nền xám nhạt (#F9FAFB), padding 32px, border-radius

## State Management

```js
const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
const [errors, setErrors] = useState({});
const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

function validate() {
  const errs = {};
  if (form.name.trim().length < 2) errs.name = 'Họ tên tối thiểu 2 ký tự';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email không hợp lệ';
  if (form.message.trim().length < 10) errs.message = 'Nội dung tối thiểu 10 ký tự';
  return errs;
}
```

## Xử lý lỗi & Edge Cases
- Submit khi form chưa hợp lệ: hiển thị tất cả lỗi, không submit
- Double submit: nút disabled khi `submitting`
- Sau khi success: nút "Gửi tin nhắn khác" reset form về `idle`

## Responsive
| Element | Mobile | Desktop |
|---|---|---|
| Form + Info | Stack dọc (form trên) | 2 cột ngang |
