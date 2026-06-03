---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][SCREEN] ADMIN_USER_LIST_QuanLyNguoiDung

## 1. Tổng quan
Trang quản lý tài khoản người dùng. Chỉ Admin mới truy cập. Admin có thể xem danh sách và đổi role của user. Không thể đổi role của chính mình.

## 2. Thông tin chung

| Thuộc tính | Giá trị |
|-----------|---------|
| Route | `/admin/users` |
| Auth yêu cầu | Có (role: admin) |
| Redirect nếu chưa login | `/admin/login` |
| URL Params | Không có |

## 3. Navigation

### Vào từ đâu
| Nguồn | Điều kiện |
|-------|----------|
| Sidebar Admin | Click "Người Dùng" |
| `ProtectedRoute` | Đã login với role `admin` |

### Đi đến đâu
| Hành động | Destination |
|----------|------------|
| Member truy cập | Redirect `/admin/dashboard` (403 guard) |

## 4. Layout & Components

```jsx
<AdminLayout>
  <PageHeader title="Quản Lý Người Dùng" count={users.length} />
  <UserTable>
    <UserRow />         {/* Row bình thường */}
    <RoleBadge />       {/* Badge có dropdown đổi role */}
  </UserTable>
  <ConfirmModal />      {/* Xác nhận đổi role */}
</AdminLayout>
```

Components dùng lại: `AdminLayout`, `ProtectedRoute` (role: admin), `useAuth`.

## 5. Chi tiết UI từng section

### 5.1 PageHeader
- Tiêu đề: "Quản Lý Người Dùng"
- Subtitle: "X người dùng" (tổng số)

### 5.2 UserTable
| Cột | Mô tả |
|-----|-------|
| Avatar | Chữ cái đầu tên, nền màu theo `id % palette` |
| Tên | Tên đầy đủ |
| Email | Địa chỉ email |
| Role | Badge: `admin` (đỏ `bg-red-100 text-red-700`) / `member` (xanh `bg-blue-100 text-blue-700`) |
| Số bài | `postCount` từ API |
| Ngày tham gia | Format `DD/MM/YYYY` từ `created_at` |
| Hành động | Nút đổi role (ẩn nếu là current user) |

### 5.3 Đổi Role
- Click badge Role → dropdown chọn `Admin` / `Member`
- Confirm modal: "Đổi role của [tên] thành [role mới]?"
- Current user: badge disabled, tooltip "Không thể đổi role của chính mình"

## 6. API Calls

| # | Endpoint | Method | Khi nào gọi | Auth |
|---|---------|--------|------------|------|
| 1 | `/api/admin/users` | GET | On mount | Admin |
| 2 | `/api/admin/users/:id/role` | PUT | Confirm đổi role | Admin |

```js
// Load danh sách
const { data } = await api.get('/admin/users');
// data là array: [{ id, name, email, role, postCount, created_at }]

// Đổi role — dùng PUT (không phải PATCH)
await api.put(`/admin/users/${userId}/role`, { role: newRole });
// Response 200: { id, role }
// Response 400: { message: "Không thể đổi role của chính mình" }
```

> API19 Danh sách: [[Design][API] API19_AdminUsers_DanhSach.md](../api/[Design][API]%20API19_AdminUsers_DanhSach.md)
> API20 Đổi Role: [[Design][API] API20_AdminUsers_DoiRole.md](../api/[Design][API]%20API20_AdminUsers_DoiRole.md)

## 7. State Management

```js
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [roleModal, setRoleModal] = useState({ open: false, userId: null, newRole: '' });
const { user: currentUser } = useAuth();
```

## 8. Xử lý lỗi & Edge Cases

| Tình huống | Xử lý |
|-----------|-------|
| Đổi role của chính mình | Nút disabled, tooltip giải thích |
| API 400 (tự đổi role) | Toast lỗi, revert badge |
| API 404 (user không tồn tại) | Toast lỗi |
| Danh sách rỗng | Hiển thị "Chưa có người dùng nào" |
| Loading | Skeleton table rows |

## 9. Responsive

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 768px) | Bảng scroll ngang, ẩn cột Ngày tham gia |
| Tablet (768–1024px) | Bảng đủ cột, sidebar thu gọn |
| Desktop (> 1024px) | Full layout với AdminLayout sidebar |
