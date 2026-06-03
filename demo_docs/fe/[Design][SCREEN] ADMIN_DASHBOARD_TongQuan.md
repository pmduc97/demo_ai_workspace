# ADMIN_DASHBOARD — Dashboard Quản Trị

## Tổng quan
Trang tổng quan sau khi đăng nhập. Hiển thị thống kê nhanh và danh sách bài viết gần đây.

## Route & Navigation
- **Route**: `/admin/dashboard`
- Role: Admin, Member
- Điều hướng đến: `/admin/posts`, `/admin/posts/:id/edit`

## Layout & Components

```
<AdminLayout>
  <StatsRow />
  <RecentPosts />
</AdminLayout>
```

### AdminLayout (dùng chung cho tất cả trang admin)
- Sidebar trái (240px): Logo + menu điều hướng
  - Dashboard
  - Bài viết
  - Danh mục (chỉ admin)
  - Người dùng (chỉ admin)
  - Dấu phân cách + Đăng xuất
- Header top: tên trang hiện tại + avatar user + tên + role badge
- Main content: phần còn lại
- Mobile: sidebar ẩn, có nút hamburger mở sidebar dạng overlay

## Chi tiết UI từng section

### StatsRow
- Grid 4 cột (desktop) / 2 cột (tablet) / 1 cột (mobile)
- Mỗi stat card: icon + label + số lượng + màu nền khác nhau

| Card | Icon | Label | API |
|---|---|---|---|
| Tổng bài viết | 📄 | Tổng bài | count từ GET /api/admin/stats |
| Đã xuất bản | ✅ | Đã xuất bản | count published |
| Bản nháp | 📝 | Bản nháp | count draft |
| Danh mục | 🏷️ | Danh mục | count categories |

- Admin thấy tất cả stats
- Member chỉ thấy stats bài của mình

### RecentPosts
- Tiêu đề: "Bài Viết Gần Đây"
- Nút "Xem tất cả" → `/admin/posts`
- Bảng 5 bài mới nhất: Tiêu đề | Danh mục | Trạng thái | Ngày tạo | Hành động
- Hành động: nút Sửa (→ edit page)
- Status badge: "Đã xuất bản" (xanh) / "Bản nháp" (xám)

## API Calls

```js
// Thống kê
GET /api/admin/stats
// Response: { totalPosts, publishedPosts, draftPosts, totalCategories }
// Member: chỉ trả về stats bài của mình

// Bài viết gần đây
GET /api/posts?limit=5&sort=newest (member: tự động filter theo author)
// Admin: GET /api/admin/posts?limit=5&sort=newest
```

## State Management

```js
const [stats, setStats] = useState(null);
const [recentPosts, setRecentPosts] = useState([]);
const [loading, setLoading] = useState(true);
const { user } = useContext(AuthContext);
```

## Xử lý lỗi & Edge Cases
- Loading: skeleton cho stats cards và bảng
- Lỗi API: hiển thị thông báo lỗi, không crash trang
