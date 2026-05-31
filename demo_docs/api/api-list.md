# Danh Sách API - Blog Hội An / Đà Nẵng

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
| 1 | POST | `/auth/login` | Đăng nhập | Public | [auth-login.md](auth-login.md) |
| 2 | POST | `/auth/register` | Đăng ký tài khoản member | Public | [auth-register.md](auth-register.md) |
| 3 | GET | `/auth/me` | Lấy thông tin user hiện tại | Member | [auth-me.md](auth-me.md) |

## Posts — Public

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 4 | GET | `/posts` | Danh sách bài viết (published) | Public | [posts-list.md](posts-list.md) |
| 5 | GET | `/posts/:slug` | Chi tiết bài viết | Public | [posts-get-by-slug.md](posts-get-by-slug.md) |

## Posts — Member

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 6 | GET | `/posts/my` | Danh sách bài của mình | Member | [posts-my.md](posts-my.md) |
| 7 | POST | `/posts` | Tạo bài viết mới | Member | [posts-create.md](posts-create.md) |
| 8 | PUT | `/posts/:id` | Cập nhật bài của mình | Member | [posts-update.md](posts-update.md) |
| 9 | DELETE | `/posts/:id` | Xóa bài của mình | Member | [posts-delete.md](posts-delete.md) |

## Posts — Admin

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 10 | GET | `/admin/posts` | Danh sách tất cả bài viết | Admin | [admin-posts-list.md](admin-posts-list.md) |
| 11 | GET | `/admin/posts/:id` | Chi tiết bài (kể cả draft) | Admin | [admin-posts-get.md](admin-posts-get.md) |
| 12 | PUT | `/admin/posts/:id/status` | Đổi trạng thái bài | Admin | [admin-posts-status.md](admin-posts-status.md) |
| 13 | DELETE | `/admin/posts/:id` | Xóa bất kỳ bài | Admin | [admin-posts-delete.md](admin-posts-delete.md) |

## Categories

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 14 | GET | `/categories` | Danh sách danh mục | Public | [categories-list.md](categories-list.md) |
| 15 | GET | `/categories/:slug` | Chi tiết danh mục | Public | [categories-get.md](categories-get.md) |
| 16 | POST | `/categories` | Tạo danh mục | Admin | [categories-create.md](categories-create.md) |
| 17 | PUT | `/categories/:id` | Cập nhật danh mục | Admin | [categories-update.md](categories-update.md) |
| 18 | DELETE | `/categories/:id` | Xóa danh mục | Admin | [categories-delete.md](categories-delete.md) |

## Users — Admin

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 19 | GET | `/admin/users` | Danh sách người dùng | Admin | [admin-users-list.md](admin-users-list.md) |
| 20 | PUT | `/admin/users/:id/role` | Đổi role người dùng | Admin | [admin-users-role.md](admin-users-role.md) |

## Upload

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 21 | POST | `/upload` | Upload ảnh | Member | [upload.md](upload.md) |

## Stats

| # | Method | Endpoint | Mô tả | Role | File |
|---|---|---|---|---|---|
| 22 | GET | `/admin/stats` | Thống kê tổng quan | Member | [admin-stats.md](admin-stats.md) |
