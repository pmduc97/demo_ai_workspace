# CATEGORY — Trang Danh Mục

## Tổng quan
Hiển thị danh sách bài viết thuộc một danh mục cụ thể. Người dùng có thể lọc, sắp xếp và phân trang.

## Route & Navigation
- **Route**: `/category/:slug`
- Params: `slug` — slug của danh mục (vd: `du-lich`, `am-thuc`)
- Điều hướng đến: `/post/:slug`
- Điều hướng từ: Navbar dropdown, PostCard category badge

## Layout & Components

```
<Navbar />
<main>
  <CategoryHeader />
  <FilterBar />
  <PostGrid>
    <PostCard /> × N
  </PostGrid>
  <Pagination />
</main>
<Footer />
```

## Chi tiết UI từng section

### CategoryHeader
- Breadcrumb: Trang chủ > [Tên danh mục]
- Tên danh mục (h1, font lớn)
- Mô tả danh mục (text-gray-600)
- Số lượng bài: "X bài viết"
- Nền gradient nhẹ theo màu danh mục

### FilterBar
- Dropdown sắp xếp: "Mới nhất" (default) | "Cũ nhất"
- Hiển thị inline bên phải, không chiếm nhiều không gian

### PostGrid
- Grid 3 cột desktop / 2 cột tablet / 1 cột mobile
- PostCard giống trang chủ (thumbnail, category badge, title, excerpt, author, date)
- Không hiển thị category badge (đã ở trong danh mục rồi)

### Pagination
- Hiển thị: "Trang X / Y"
- Nút Trước / Sau
- Số trang (hiển thị tối đa 5 số, dùng "..." nếu nhiều hơn)

## API Calls

```js
// Lấy thông tin danh mục
GET /api/categories/:slug
// Response: { id, name, slug, description } | 404

// Lấy bài viết theo danh mục
GET /api/posts?category=:slug&status=published&page=1&limit=9&sort=newest
// Response: { posts: [Post], total, page, totalPages }
```

## State Management

```js
const { slug } = useParams();
const [category, setCategory] = useState(null);
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [sort, setSort] = useState('newest'); // 'newest' | 'oldest'
```

- Khi `slug` thay đổi (navigate giữa các category): reset `page = 1`, fetch lại
- Khi `sort` thay đổi: reset `page = 1`, fetch lại

## Xử lý lỗi & Edge Cases
- Slug không tồn tại: hiển thị trang 404 inline ("Danh mục không tồn tại")
- Không có bài trong danh mục: "Chưa có bài viết nào trong danh mục này"
- Loading: skeleton 9 card
- Lỗi API: thông báo lỗi + nút thử lại

## Responsive
| Breakpoint | PostGrid |
|---|---|
| mobile (<640px) | 1 cột |
| tablet (640-1024px) | 2 cột |
| desktop (>1024px) | 3 cột |
