---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][SCREEN] ADMIN_LOGIN_DangNhap

## 1. Tổng quan
Trang đăng nhập cho admin và member. Sau khi đăng nhập thành công, lưu JWT vào localStorage thông qua `AuthContext` và redirect vào dashboard. Nếu đã đăng nhập thì tự động chuyển hướng.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Route | `/admin/login` |
| Auth yêu cầu | Không |
| Redirect nếu đã login | `/admin/dashboard` |
| URL Params | Không có |

## 3. Navigation

### Vào từ đâu
| Nguồn | Điều kiện |
|-------|----------|
| `ProtectedRoute` | Chưa đăng nhập, truy cập bất kỳ route `/admin/*` |
| Sidebar / Logout | Sau khi gọi `logout()` |
| Direct URL | Truy cập trực tiếp `/admin/login` |

### Đi đến đâu
| Hành động | Destination |
|----------|------------|
| Đăng nhập thành công | `/admin/dashboard` |
| Đã có session (on mount) | `/admin/dashboard` (auto redirect) |

## 4. Layout & Components

```jsx
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <LoginCard>       {/* Card trắng, shadow-lg, w-[400px] */}
    <Logo />        {/* Tên blog + tagline */}
    <LoginForm />   {/* Form email + password + submit */}
  </LoginCard>
</div>
```

Components dùng lại: `useAuth` (hook từ `AuthContext`), `Navigate` (React Router).

## 5. Chi tiết UI từng section

### 5.1 LoginCard & Logo
- Card trắng, `shadow-lg`, `rounded-xl`, padding `40px`, width `400px` (desktop).
- Logo: "Blog Hội An" (`text-amber-600`), Tagline: "Quản lý nội dung".

### 5.2 LoginForm
| UI Control | Loại | Ràng buộc (Min/Max/Format) | JSON Field mapping | Ghi chú |
|------------|------|----------------------------|--------------------|---------|
| Email | Input text | Format email, bắt buộc | `email` | Placeholder: `admin@hoianblog.vn` |
| Mật khẩu | Input password | Min 6 ký tự, bắt buộc | `password` | Placeholder: `••••••••` |
| Nút Đăng Nhập | Button | Disabled khi loading | N/A | Hiển thị spinner khi loading |
| Error Banner | Alert | N/A | N/A | Hiển thị lỗi từ API (nếu có) |

## 6. API Calls

| # | Endpoint | Method | Khi nào gọi | Auth |
|---|---------|--------|------------|------|
| 1 | `/api/auth/login` | POST | Submit form | Không |

**Request body:**
```js
await api.post('/auth/login', { email, password });
// Response 200: { token, user: { id, name, email, role } }
// Response 401: { message: "Email hoặc mật khẩu không đúng" }
```

> Spec chi tiết: [[Design][API] API01_Auth_DangNhap.md](../api/[Design][API]%20API01_Auth_DangNhap.md)

## 7. State Management

```js
const [form, setForm] = useState({ email: '', password: '' });
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const { login, user } = useAuth();

// Redirect nếu đã login
if (user) return <Navigate to="/admin/dashboard" replace />;

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const { data } = await api.post('/auth/login', form);
    login(data.token, data.user);
    navigate('/admin/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Đăng nhập thất bại');
  } finally {
    setLoading(false);
  }
}
```

## 8. Xử lý lỗi & Edge Cases

| Tình huống | Xử lý |
|-----------|-------|
| Sai email/password (401) | Hiển thị error banner với message từ API |
| Lỗi network / 500 | Hiển thị "Đăng nhập thất bại, thử lại sau" |
| Đã có token hợp lệ | Auto redirect `/admin/dashboard` trước khi render form |
| Submit khi đang loading | Nút disabled, ngăn double submit |

## 9. Responsive

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 768px) | Card full-width, margin `16px` hai bên |
| Tablet (768–1024px) | Card `360px` căn giữa |
| Desktop (> 1024px) | Card `400px` căn giữa |

## 10. Events & Actions

| Control | Event | Logic xử lý |
|---------|-------|-------------|
| Input Email | `onChange` | Cập nhật state `form.email`, clear `error` |
| Input Mật khẩu | `onChange` | Cập nhật state `form.password`, clear `error` |
| Nút Đăng Nhập | `onClick` / `onSubmit` | `e.preventDefault()`, set `loading=true`, gọi API `POST /api/auth/login`. Nếu thành công: gọi `login(token, user)` và redirect `/admin/dashboard`. Nếu lỗi: set `error` message. |

## AuthContext
```js
// src/context/AuthContext.jsx
// Cung cấp: user, token, login(token, user), logout()
// login(): lưu token vào localStorage, set user vào state
// logout(): xóa localStorage, redirect về /admin/login
```

## Xử lý lỗi & Edge Cases
- Sai email/password: hiển thị lỗi từ API
- Network error: "Không thể kết nối. Vui lòng thử lại."
- Đã đăng nhập: redirect ngay, không hiển thị form
