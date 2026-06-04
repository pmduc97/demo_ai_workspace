# HOME — Trang Chủ

## Tổng quan
Trang chủ là điểm vào chính của blog. Hiển thị banner giới thiệu, 1 bài viết nổi bật và lưới bài mới nhất. Người dùng có thể điều hướng đến danh mục hoặc đọc chi tiết bài viết.

## Route & Navigation
- **Route**: `/`
- Điều hướng đến: `/post/:slug`, `/category/:slug`

## Layout & Components

```
<Navbar />
<main>
  <HeroBanner />
  <FeaturedPost />
  <section> <!-- Bài mới nhất -->
    <PostCard /> × N
    <Pagination />
  </section>
</main>
<Footer />
```

## Chi tiết UI từng section

### Navbar
- Logo bên trái: "Blog Du Lịch"
- Menu: Trang chủ | Giới thiệu | Liên hệ
- Không hiển thị nút "Đăng nhập" trên public header khi chưa đăng nhập vì login chỉ phục vụ khu vực quản trị.
- Nếu đã đăng nhập, hiển thị nút "Quản trị" và "Đăng xuất".
- Sticky top, nền trắng mờ, border amber nhẹ, backdrop blur.

### HeroBanner
- Ảnh nền full-width, chiều cao 400px (desktop) / 250px (mobile)
- Overlay tối 40%
- Tiêu đề: "Khám Phá Du Lịch Việt Nam"
- Tagline: "Tin tức du lịch, ẩm thực và văn hóa các điểm đến"
- Nội dung tĩnh (không gọi API)

### FeaturedPost
- Lấy bài published mới nhất có thumbnail
- Layout 2 cột: ảnh trái (60%) + nội dung phải (40%)
- Nội dung: category badge (màu theo danh mục), tiêu đề (h2), excerpt (150 ký tự), tên tác giả, ngày đăng, nút "Đọc tiếp →"
- Nền màu vàng nhạt (#FEF9C3) để nổi bật

### Lưới bài mới nhất
- Tiêu đề section: "Bài Viết Mới Nhất"
- Grid 3 cột desktop / 2 cột tablet / 1 cột mobile
- Mỗi PostCard gồm:
  - Thumbnail (aspect-ratio 16/9, object-cover)
  - Category badge (top-left overlay)
  - Tiêu đề (2 dòng, truncate)
  - Excerpt (3 dòng, truncate)
  - Avatar tác giả + tên + ngày đăng
- Hover: shadow tăng, thumbnail scale nhẹ (transition)
- Phân trang: hiển thị số trang, nút Trước/Sau

### Footer
- Logo + mô tả ngắn
- Links: Trang chủ, Giới thiệu, Liên hệ
- Danh mục nhanh
- Copyright

## API Calls

```js
// Lấy bài nổi bật (1 bài mới nhất có thumbnail)
GET /api/posts?status=published&limit=1&sort=newest
// Response: { posts: [Post], total: number }

// Lấy danh sách bài mới nhất (phân trang)
GET /api/posts?status=published&limit=9&page=1&sort=newest
// Response: { posts: [Post], total: number, page: number, totalPages: number }

// Lấy danh sách category cho Navbar dropdown
GET /api/categories
// Response: [Category]
```

## State Management

```js
const [featured, setFeatured] = useState(null);
const [posts, setPosts] = useState([]);
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
```

## Xử lý lỗi & Edge Cases
- Loading: skeleton card (3 card placeholder với animate-pulse)
- Lỗi API: hiển thị thông báo "Không thể tải bài viết. Vui lòng thử lại."
- Không có bài: "Chưa có bài viết nào. Hãy quay lại sau!"
- Bài không có thumbnail: dùng ảnh placeholder mặc định `/placeholder.jpg`
- FeaturedPost không có bài: ẩn section, PostGrid chiếm toàn bộ

## Responsive
| Breakpoint | PostGrid | FeaturedPost |
|---|---|---|
| mobile (<640px) | 1 cột | Stack dọc |
| tablet (640-1024px) | 2 cột | Stack dọc |
| desktop (>1024px) | 3 cột | 2 cột ngang |
