# ADMIN_USER_LIST — Quản Lý Người Dùng

## Tổng quan
Trang quản lý tài khoản người dùng. Chỉ Admin mới truy cập. Admin có thể xem danh sách và đổi role của user.

## Route & Navigation
- **Route**: `/admin/users`
- Role: **Admin only** (Member bị redirect về `/admin/dashboard`)

## Layout & Components

```
<AdminLayout>
  <PageHeader />
  <UserTable />
</AdminLayout>
```

## Chi tiết UI từng section

### PageHeader
- Tiêu đề: "Quản Lý Người Dùng"
- Hiển thị tổng số user: "X người dùng"

### UserTable
- Bảng với các cột:

| Cột | Mô tả |
|---|---|
| Avatar | Chữ cái đầu tên, nền màu ngẫu nhiên theo id |
| Tên | Tên đầy đủ |
| Email | Địa chỉ email |
| Role | Badge dropdown: Admin (đỏ) / Member (xanh) |
| Số bài | Tổng số bài đã đăng |
| Ngày tham gia | DD/MM/YYYY |

### Đổi Role
- Click vào badge Role: hiển thị dropdown chọn Admin / Member
- Confirm: "Đổi role của [tên] thành [role mới]?"
- Không thể đổi role của chính mình (badge disabled, tooltip "Không thể đổi role của chính mình")

## API Calls

```js
// Lấy danh sách user
GET /api/admin/users
// Response: [{ id, name, email, role, postCount, created_at }]

// Đổi role
PUT /api/admin/users/:id/role
Body: { role: 'admin' | 'member' }
Response 200: { id, role }
```

## State Management

```js
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [roleModal, setRoleModal] = useState({ open: false, userId: null, newRole: '' });
const { user: currentUser } = useContext(AuthContext);
```

## Xử lý lỗi & Edge Cases
- Đổi role thất bại: toast lỗi, revert badge về role cũ
- Danh sách rỗng: "Chưa có người dùng nào"
- Loading: skeleton table rows
