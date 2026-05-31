# Danh Sách Màn Hình - Blog Hội An / Đà Nẵng

## Public Site

| Mã | Tên màn hình | Route | Mô tả | Role | File component |
|---|---|---|---|---|---|
| HOME | Trang chủ | `/` | Banner, bài nổi bật, bài mới nhất | Tất cả | `src/pages/public/Home.jsx` |
| CATEGORY | Trang danh mục | `/category/:slug` | Danh sách bài theo danh mục | Tất cả | `src/pages/public/Category.jsx` |
| POST_DETAIL | Chi tiết bài viết | `/post/:slug` | Nội dung bài, bài liên quan | Tất cả | `src/pages/public/PostDetail.jsx` |
| ABOUT | Giới thiệu | `/about` | Giới thiệu blog, sứ mệnh | Tất cả | `src/pages/public/About.jsx` |
| CONTACT | Liên hệ | `/contact` | Form liên hệ | Tất cả | `src/pages/public/Contact.jsx` |

## Admin Panel

| Mã | Tên màn hình | Route | Mô tả | Role | File component |
|---|---|---|---|---|---|
| ADMIN_LOGIN | Đăng nhập admin | `/admin/login` | Form đăng nhập | Chưa đăng nhập | `src/pages/admin/Login.jsx` |
| ADMIN_DASHBOARD | Dashboard | `/admin/dashboard` | Thống kê tổng quan | Admin, Member | `src/pages/admin/Dashboard.jsx` |
| ADMIN_POST_LIST | Danh sách bài viết | `/admin/posts` | Quản lý bài viết | Admin, Member | `src/pages/admin/PostList.jsx` |
| ADMIN_POST_FORM | Tạo/Sửa bài viết | `/admin/posts/new`, `/admin/posts/:id/edit` | Form soạn thảo bài | Admin, Member | `src/pages/admin/PostForm.jsx` |
| ADMIN_CATEGORY_LIST | Quản lý danh mục | `/admin/categories` | CRUD danh mục | Admin | `src/pages/admin/CategoryList.jsx` |
| ADMIN_USER_LIST | Quản lý người dùng | `/admin/users` | Danh sách, đổi role | Admin | `src/pages/admin/UserList.jsx` |

## Shared Components

| Component | Mô tả | File |
|---|---|---|
| Navbar | Thanh điều hướng public | `src/components/Navbar.jsx` |
| Footer | Footer public | `src/components/Footer.jsx` |
| PostCard | Card bài viết dùng chung | `src/components/PostCard.jsx` |
| AdminLayout | Layout wrapper admin panel | `src/components/AdminLayout.jsx` |
| ProtectedRoute | Guard route theo role | `src/components/ProtectedRoute.jsx` |
| RichEditor | TipTap editor wrapper | `src/components/RichEditor.jsx` |
| Pagination | Component phân trang | `src/components/Pagination.jsx` |

## Navigation Flow

```
/ (HOME)
├── /category/:slug (CATEGORY)
│   └── /post/:slug (POST_DETAIL)
├── /post/:slug (POST_DETAIL)
├── /about (ABOUT)
└── /contact (CONTACT)

/admin/login
└── /admin/dashboard
    ├── /admin/posts → /admin/posts/new | /admin/posts/:id/edit
    ├── /admin/categories
    └── /admin/users (chỉ admin)
```
