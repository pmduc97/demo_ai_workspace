# ADMIN_POST_LIST — Danh Sách Bài Viết

## Tổng quan
Trang quản lý bài viết. Admin thấy tất cả bài, Member chỉ thấy bài của mình. Có filter, search và phân trang.

## Route & Navigation
- **Route**: `/admin/posts`
- Role: Admin, Member
- Điều hướng đến: `/admin/posts/new`, `/admin/posts/:id/edit`

## Layout & Components

```
<AdminLayout>
  <PageHeader /> <!-- Tiêu đề + nút Tạo bài mới -->
  <FilterBar />
  <PostTable />
  <Pagination />
</AdminLayout>
```

## Chi tiết UI từng section

### PageHeader
- Tiêu đề: "Quản Lý Bài Viết"
- Nút "＋ Tạo bài mới" (màu amber, góc phải) → `/admin/posts/new`

### FilterBar
- Search input: tìm theo tiêu đề (debounce 400ms)
- Dropdown trạng thái: Tất cả | Đã xuất bản | Bản nháp
- Dropdown danh mục: Tất cả | [danh sách category]
- Nút "Đặt lại" khi có filter đang áp dụng

### PostTable
- Bảng với các cột:

| Cột | Mô tả |
|---|---|
| Thumbnail | Ảnh nhỏ 60×40px |
| Tiêu đề | Tên bài + excerpt ngắn (1 dòng) |
| Danh mục | Badge tên danh mục |
| Tác giả | Tên tác giả (admin thấy, member không thấy cột này) |
| Trạng thái | Badge: "Đã xuất bản" (xanh) / "Bản nháp" (xám) |
| Ngày tạo | DD/MM/YYYY |
| Hành động | Nút Sửa + Nút Xóa |

- Admin: thấy cột Tác giả, có thể sửa/xóa bất kỳ bài nào, có thể đổi trạng thái
- Member: không thấy cột Tác giả, chỉ sửa/xóa bài của mình

### Xóa bài
- Click Xóa: hiển thị modal confirm "Bạn có chắc muốn xóa bài này không?"
- Confirm: gọi API xóa, reload danh sách
- Cancel: đóng modal

### Đổi trạng thái (admin)
- Click badge trạng thái: toggle published ↔ draft ngay (optimistic update)

## API Calls

```js
// Lấy danh sách (admin)
GET /api/admin/posts?page=1&limit=10&status=&category=&search=
// Response: { posts: [Post], total, page, totalPages }

// Lấy danh sách (member - chỉ bài của mình)
GET /api/posts/my?page=1&limit=10&status=&search=
// Response: { posts: [Post], total, page, totalPages }

// Xóa bài
DELETE /api/posts/:id  (member - bài của mình)
DELETE /api/admin/posts/:id  (admin - bất kỳ)

// Đổi trạng thái (admin)
PUT /api/admin/posts/:id/status
Body: { status: 'published' | 'draft' }
```

## State Management

```js
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [filters, setFilters] = useState({ search: '', status: '', category: '' });
const [deleteModal, setDeleteModal] = useState({ open: false, postId: null });
const { user } = useContext(AuthContext);
```

- Khi filter thay đổi: reset page = 1, fetch lại
- Search: debounce 400ms trước khi fetch

## Xử lý lỗi & Edge Cases
- Không có bài: "Chưa có bài viết nào. Hãy tạo bài đầu tiên!"
- Xóa thất bại: hiển thị toast lỗi, không xóa khỏi danh sách
- Loading: skeleton table rows
