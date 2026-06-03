# [Design][LIST] SCREEN_DanhSachManHinh — Danh Sách Màn Hình

---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable

**Quy ước tên file tài liệu:**
- Screen design: `[Design][SCREEN] {ScreenCode}_{ScreenName}.md`
- API design: `[Design][API] API{ID}_{Group}_{Name}.md`
- List/Index: `[Design][LIST] {Name}.md`
- Database: `[Design][DB] {Name}.md`

---

# Danh Sách Màn Hình - Blog Hội An / Đà Nẵng

## Public Site

| Mã | Tên màn hình | Route | Mô tả | Role | File component |
|---|---|---|---|---|---|
| HOME | Trang chủ | `/` | Banner, bài nổi bật, bài mới nhất | Tất cả | `src/pages/public/Home.jsx` | [[Design][SCREEN] HOME_TrangChu.md]([Design][SCREEN] HOME_TrangChu.md) |
| CATEGORY | Trang danh mục | `/category/:slug` | Danh sách bài theo danh mục | Tất cả | `src/pages/public/Category.jsx` | [[Design][SCREEN] CATEGORY_DanhMuc.md]([Design][SCREEN] CATEGORY_DanhMuc.md) |
| POST_DETAIL | Chi tiết bài viết | `/post/:slug` | Nội dung bài, bài liên quan | Tất cả | `src/pages/public/PostDetail.jsx` | [[Design][SCREEN] POST_DETAIL_ChiTietBai.md]([Design][SCREEN] POST_DETAIL_ChiTietBai.md) |
| ABOUT | Giới thiệu | `/about` | Giới thiệu blog, sứ mệnh | Tất cả | `src/pages/public/About.jsx` | [[Design][SCREEN] ABOUT_GioiThieu.md]([Design][SCREEN] ABOUT_GioiThieu.md) |
| CONTACT | Liên hệ | `/contact` | Form liên hệ | Tất cả | `src/pages/public/Contact.jsx` | [[Design][SCREEN] CONTACT_LienHe.md]([Design][SCREEN] CONTACT_LienHe.md) |

## Admin Panel

| Mã | Tên màn hình | Route | Mô tả | Role | File component | Design doc |
|---|---|---|---|---|---|---|
| ADMIN_LOGIN | Đăng nhập admin | `/admin/login` | Form đăng nhập | Chưa đăng nhập | `src/pages/admin/Login.jsx` | [[Design][SCREEN] ADMIN_LOGIN_DangNhap.md]([Design][SCREEN] ADMIN_LOGIN_DangNhap.md) |
| ADMIN_DASHBOARD | Dashboard | `/admin/dashboard` | Thống kê tổng quan | Admin, Member | `src/pages/admin/Dashboard.jsx` | [[Design][SCREEN] ADMIN_DASHBOARD_TongQuan.md]([Design][SCREEN] ADMIN_DASHBOARD_TongQuan.md) |
| ADMIN_POST_LIST | Danh sách bài viết | `/admin/posts` | Quản lý bài viết | Admin, Member | `src/pages/admin/PostList.jsx` | [[Design][SCREEN] ADMIN_POST_LIST_DanhSachBai.md]([Design][SCREEN] ADMIN_POST_LIST_DanhSachBai.md) |
| ADMIN_POST_FORM | Tạo/Sửa bài viết | `/admin/posts/new`, `/admin/posts/:id/edit` | Form soạn thảo bài | Admin, Member | `src/pages/admin/PostForm.jsx` | [[Design][SCREEN] ADMIN_POST_FORM_TaoSuaBai.md]([Design][SCREEN] ADMIN_POST_FORM_TaoSuaBai.md) |
| ADMIN_CATEGORY_LIST | Quản lý danh mục | `/admin/categories` | CRUD danh mục | Admin | `src/pages/admin/CategoryList.jsx` | [[Design][SCREEN] ADMIN_CATEGORY_LIST_QuanLyDanhMuc.md]([Design][SCREEN] ADMIN_CATEGORY_LIST_QuanLyDanhMuc.md) |
| ADMIN_USER_LIST | Quản lý người dùng | `/admin/users` | Danh sách, đổi role | Admin | `src/pages/admin/UserList.jsx` | [[Design][SCREEN] ADMIN_USER_LIST_QuanLyNguoiDung.md]([Design][SCREEN] ADMIN_USER_LIST_QuanLyNguoiDung.md) |

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
