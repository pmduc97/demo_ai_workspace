# [Design][LIST] API_DanhSachEndpoint — Danh Sách API

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

# Danh Sách API - Blog Du Lịch

## Thông tin chung

- **Base URL**: `http://localhost:3001/api`
- **Auth**: Bearer JWT token trong header `Authorization: Bearer <token>`
- **Content-Type**: `application/json` (trừ upload dùng `multipart/form-data`)
- **Định dạng lỗi chuẩn**:
```json
{ "message": "Mô tả lỗi" }
```

## Phân quyền

| Role | Mô tả |
|---|---|
| Public | Không cần token |
| Member | Cần token, role = member hoặc admin |
| Admin | Cần token, role = admin |

---

## Auth

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 1 | POST | `/auth/login` | Đăng nhập | Public | [[Design][API] API01_Auth_DangNhap.md]([Design][API] API01_Auth_DangNhap.md) |
| 2 | POST | `/auth/register` | Đăng ký tài khoản member | Public | [[Design][API] API02_Auth_DangKy.md]([Design][API] API02_Auth_DangKy.md) |
| 3 | GET | `/auth/me` | Lấy thông tin user hiện tại | Member | [[Design][API] API03_Auth_ThongTinUser.md]([Design][API] API03_Auth_ThongTinUser.md) |

## Posts — Public

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 4 | GET | `/posts` | Danh sách bài viết (published) | Public | [[Design][API] API04_Posts_DanhSach.md]([Design][API] API04_Posts_DanhSach.md) |
| 5 | GET | `/posts/:slug` | Chi tiết bài viết | Public | [[Design][API] API05_Posts_ChiTiet.md]([Design][API] API05_Posts_ChiTiet.md) |

## Posts — Member

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 6 | GET | `/posts/my` | Danh sách bài của mình | Member | [[Design][API] API06_Posts_CuaToi.md]([Design][API] API06_Posts_CuaToi.md) |
| 7 | POST | `/posts` | Tạo bài viết mới | Member | [[Design][API] API07_Posts_TaoBai.md]([Design][API] API07_Posts_TaoBai.md) |
| 8 | PUT | `/posts/:id` | Cập nhật bài của mình | Member | [[Design][API] API08_Posts_CapNhat.md]([Design][API] API08_Posts_CapNhat.md) |
| 9 | DELETE | `/posts/:id` | Xóa bài của mình | Member | [[Design][API] API09_Posts_Xoa.md]([Design][API] API09_Posts_Xoa.md) |

## Posts — Admin

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 10 | GET | `/admin/posts` | Danh sách tất cả bài viết | Admin | [[Design][API] API10_AdminPosts_DanhSach.md]([Design][API] API10_AdminPosts_DanhSach.md) |
| 11 | GET | `/admin/posts/:id` | Chi tiết bài (kể cả draft) | Admin | [[Design][API] API11_AdminPosts_ChiTiet.md]([Design][API] API11_AdminPosts_ChiTiet.md) |
| 12 | PUT | `/admin/posts/:id/status` | Đổi trạng thái bài | Admin | [[Design][API] API12_AdminPosts_DoiStatus.md]([Design][API] API12_AdminPosts_DoiStatus.md) |
| 13 | DELETE | `/admin/posts/:id` | Xóa bất kỳ bài | Admin | [[Design][API] API13_AdminPosts_Xoa.md]([Design][API] API13_AdminPosts_Xoa.md) |

## Categories

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 14 | GET | `/categories` | Danh sách danh mục | Public | [[Design][API] API14_Categories_DanhSach.md]([Design][API] API14_Categories_DanhSach.md) |
| 15 | GET | `/categories/:slug` | Chi tiết danh mục | Public | [[Design][API] API15_Categories_ChiTiet.md]([Design][API] API15_Categories_ChiTiet.md) |
| 16 | POST | `/categories` | Tạo danh mục | Admin | [[Design][API] API16_Categories_Tao.md]([Design][API] API16_Categories_Tao.md) |
| 17 | PUT | `/categories/:id` | Cập nhật danh mục | Admin | [[Design][API] API17_Categories_CapNhat.md]([Design][API] API17_Categories_CapNhat.md) |
| 18 | DELETE | `/categories/:id` | Xóa danh mục | Admin | [[Design][API] API18_Categories_Xoa.md]([Design][API] API18_Categories_Xoa.md) |

## Users — Admin

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 19 | GET | `/admin/users` | Danh sách người dùng | Admin | [[Design][API] API19_AdminUsers_DanhSach.md]([Design][API] API19_AdminUsers_DanhSach.md) |
| 20 | PUT | `/admin/users/:id/role` | Đổi role người dùng | Admin | [[Design][API] API20_AdminUsers_DoiRole.md]([Design][API] API20_AdminUsers_DoiRole.md) |
| 23 | GET | `/admin/users/:id` | Chi tiết người dùng | Admin | [[Design][API] API23_AdminUsers_ChiTiet.md]([Design][API] API23_AdminUsers_ChiTiet.md) |
| 24 | PUT | `/admin/users/:id` | Cập nhật profile người dùng | Admin | [[Design][API] API24_AdminUsers_CapNhat.md]([Design][API] API24_AdminUsers_CapNhat.md) |
| 25 | PUT | `/admin/users/:id/status` | Đổi trạng thái khóa/mở khóa người dùng | Admin | [[Design][API] API25_AdminUsers_DoiStatus.md]([Design][API] API25_AdminUsers_DoiStatus.md) |

## Upload

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 21 | POST | `/upload` | Upload ảnh | Member | [[Design][API] API21_Upload_AnhBai.md]([Design][API] API21_Upload_AnhBai.md) |

## Tags

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 28 | GET | `/tags` | Danh sách tags | Public | [[Design][API] API28_Tags_DanhSach.md]([Design][API] API28_Tags_DanhSach.md) |
| 29 | GET | `/admin/tags` | Danh sách tags (Admin) | Admin | [[Design][API] API29_AdminTags_DanhSach.md]([Design][API] API29_AdminTags_DanhSach.md) |
| 30 | POST | `/admin/tags` | Tạo tag | Admin | [[Design][API] API30_AdminTags_Tao.md]([Design][API] API30_AdminTags_Tao.md) |
| 31 | PUT | `/admin/tags/:id` | Cập nhật tag | Admin | [[Design][API] API31_AdminTags_CapNhat.md]([Design][API] API31_AdminTags_CapNhat.md) |
| 32 | DELETE | `/admin/tags/:id` | Xóa tag | Admin | [[Design][API] API32_AdminTags_Xoa.md]([Design][API] API32_AdminTags_Xoa.md) |

## Stats

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 22 | GET | `/admin/stats` | Thống kê tổng quan | Member | [admin-stats.md](admin-stats.md) |
