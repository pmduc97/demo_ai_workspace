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

### 5.1 LoginCard
- Card trắng, `shadow-lg`, `rounded-xl`, padding `40px`
- Width `400px` trên desktop, full-width với margin `16px` trên mobile

### 5.2 Logo
- Tên blog: **"Blog Hội An"** — `font-bold text-2xl text-amber-600`
- Tagline: "Quản lý nội dung" — `text-sm text-gray-500 mt-1`

### 5.3 LoginForm
| Field | Type | Placeholder | Required |
|-------|------|------------|---------|
| Email | `email` | `admin@hoianblog.vn` | ✅ |
| Mật khẩu | `password` | `••••••••` | ✅ |

- Nút submit: "Đăng Nhập" — full width, `bg-amber-500 hover:bg-amber-600 text-white`
- Loading state: spinner thay thế text nút
- Error banner: hiển thị phía trên form — `bg-red-50 text-red-700 rounded p-3`

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

## Route & Navigation
- **Route**: `/admin/login`
- Redirect sau login: `/admin/dashboard`
- Nếu đã đăng nhập: tự động redirect đến `/admin/dashboard`

## Layout & Components

```
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <LoginCard>
    <Logo />
    <LoginForm />
  </LoginCard>
</div>
```

## Chi tiết UI

### LoginCard
- Card trắng, shadow-lg, border-radius, padding 40px
- Width: 400px (desktop) / full width với margin (mobile)

### Logo
- Tên blog: "Blog Hội An" (font-bold, text-2xl, màu vàng/amber)
- Tagline: "Quản lý nội dung"

### LoginForm
- Fields:

| Field | Type | Required | Validation |
|---|---|---|---|
| Email | email input | Có | Format email hợp lệ |
| Mật khẩu | password input | Có | Tối thiểu 6 ký tự |

- Nút submit: "Đăng Nhập" — full width, màu amber
- Loading state: spinner trong nút
- Error message: hiển thị trên đầu form (nền đỏ nhạt) khi sai credentials

## API Calls

```js
POST /api/auth/login
Body: { email, password }
Response 200: { token, user: { id, name, email, role } }
Response 401: { message: "Email hoặc mật khẩu không đúng" }
```

## State Management

```js
const [form, setForm] = useState({ email: '', password: '' });
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const { login } = useContext(AuthContext);

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const { data } = await api.post('/auth/login', form);
    login(data.token, data.user); // lưu vào context + localStorage
    navigate('/admin/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Đăng nhập thất bại');
  } finally {
    setLoading(false);
  }
}
```

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
