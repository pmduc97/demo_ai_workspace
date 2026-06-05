---
id: ITa_ADMIN_POST_LIST
name: Kiểm thử chức năng Quản lý bài viết
target_screen: demo_docs/fe/[Design][SCREEN] ADMIN_POST_LIST_DanhSachBai.md
target_api: 
  - demo_docs/api/[Design][API] API10_AdminPosts_DanhSach.md
  - demo_docs/api/[Design][API] API12_AdminPosts_DoiStatus.md
  - demo_docs/api/[Design][API] API13_AdminPosts_Xoa.md
status: DRAFT
---

# ITa: Kiểm thử chức năng Quản lý bài viết

## 1. Mục đích (Overview)
Kiểm thử tích hợp chức năng Quản lý bài viết trên giao diện Admin, đảm bảo Admin/Member xem danh sách bài viết (có phân trang, tìm kiếm, lọc, sắp xếp), thay đổi trạng thái (Publish/Draft) và xóa bài viết. Đảm bảo phân quyền đúng (Member chỉ thấy/sửa bài của mình, Admin thấy/sửa tất cả).

## 2. Điều kiện tiền quyết (Pre-conditions)
- PostgreSQL database `hoian_blog` đã migrate và seed.
- User đã đăng nhập với role `admin` hoặc `member`.
- Đang đứng tại trang `/admin/posts`.
- Dữ liệu kiểm thử được setup theo mục 5.1 trước khi chạy suite.

---

## 3. Validation Field Inventory (Bảng kiểm kê Validate)

| Field ID | Field Name | Data Type | Validation Type | Rule/Constraint | Message Code | TC cần tạo |
|---|---|---|---|---|---|---|
| `search` | Tìm kiếm | String | Optional | Tìm theo tiêu đề | `POST-E-001` | `TC_API_001` |
| `category_id` | Lọc danh mục | Number | Optional | ID danh mục hợp lệ | `POST-E-001` | `TC_API_002` |
| `status` | Lọc trạng thái | String | Enum | `draft`, `published` | `POST-E-005` | `TC_API_003` |
| `author_id` | Lọc tác giả | Number | Optional | Chỉ Admin mới được dùng | `POST-E-001` | `TC_API_004` |
| `page` | Trang | Number | Range | Integer >= 1 | `POST-E-003` | `TC_API_005` |
| `limit` | Số dòng/trang | Number | Range | Integer >= 1 | `POST-E-004` | `TC_API_006` |

---

## 4. ITa Checklist (Danh sách Test Case)

| TC ID | Scenario | Test Target | Title | Viewpoint (TV) | Priority | Type |
|---|---|---|---|---|---|---|
| `TC_API_001` | Happy Path | `search` | Tìm kiếm bài viết theo tiêu đề | TV-01 | High | `[API]` |
| `TC_API_002` | Happy Path | `category_id` | Lọc bài viết theo danh mục | TV-01 | High | `[API]` |
| `TC_API_003` | Happy Path | `status` | Lọc bài viết theo trạng thái | TV-01 | High | `[API]` |
| `TC_API_004` | Permission | `author_id` | Admin lọc bài viết theo tác giả | TV-03 | High | `[API]` |
| `TC_API_005` | Permission | List | Member chỉ thấy bài viết của mình | TV-03 | High | `[API]` |
| `TC_API_006` | Happy Path | Pagination | Phân trang danh sách bài viết | TV-01 | Medium | `[API]` |
| `TC_API_007` | Happy Path | Action | Đổi trạng thái bài viết (Draft <-> Published) | TV-01 | High | `[API]` |
| `TC_API_008` | Happy Path | Action | Xóa bài viết | TV-01 | High | `[API]` |
| `TC_API_009` | Permission | Action | Member không thể xóa bài của người khác | TV-03 | High | `[API]` |

---

## 5. Dữ liệu Test (Test Data)

### 5.1. Dữ liệu nền (Setup Data - DB State)
```sql
-- Xóa data cũ
DELETE FROM posts;
DELETE FROM categories WHERE slug IN ('cat-1', 'cat-2');
DELETE FROM users WHERE email IN ('admin_post@hoianblog.vn', 'member_post@hoianblog.vn');

-- Tạo Users
INSERT INTO users (id, name, email, password_hash, role, status) VALUES 
(101, 'Admin Post', 'admin_post@hoianblog.vn', 'hash', 'admin', 'active'),
(102, 'Member Post', 'member_post@hoianblog.vn', 'hash', 'member', 'active');

-- Tạo Categories
INSERT INTO categories (id, name, slug) VALUES 
(101, 'Category 1', 'cat-1'),
(102, 'Category 2', 'cat-2');

-- Tạo Posts
INSERT INTO posts (id, title, slug, content, author_id, category_id, status) VALUES 
(101, 'Admin Post 1', 'admin-post-1', 'Content', 101, 101, 'published'),
(102, 'Member Post 1', 'member-post-1', 'Content', 102, 101, 'draft'),
(103, 'Member Post 2', 'member-post-2', 'Content', 102, 102, 'published');
```

---

## 6. Kịch bản Kiểm thử Chi tiết (TC Detail)

| TC ID | Viewpoint | Test Target | Precondition | Procedure (Các bước) | Expected Result (Kết quả mong đợi) |
|---|---|---|---|---|---|
| `TC_API_001` | TV-01 | `search` | Đăng nhập Admin | 1. Nhập "Admin Post 1" vào ô tìm kiếm<br>2. Nhấn Enter | 1. **[UI]** Danh sách chỉ hiển thị bài viết "Admin Post 1" |
| `TC_API_003` | TV-01 | `status` | Đăng nhập Admin | 1. Chọn filter Status = "Draft" | 1. **[UI]** Danh sách chỉ hiển thị bài "Member Post 1" |
| `TC_API_005` | TV-03 | List | Đăng nhập Member | 1. Truy cập `/admin/posts` | 1. **[UI]** Danh sách chỉ hiển thị 2 bài của Member (ID 102, 103) |
| `TC_API_007` | TV-01 | Action | Đăng nhập Admin | 1. Click nút Toggle Status của bài ID 102 | 1. **[API]** Gọi API PUT thành công<br>2. **[UI]** Trạng thái bài viết đổi thành "Published" |
| `TC_API_008` | TV-01 | Action | Đăng nhập Admin | 1. Click nút Delete của bài ID 101<br>2. Xác nhận xóa | 1. **[API]** Gọi API DELETE thành công<br>2. **[UI]** Bài viết biến mất khỏi danh sách |
| `TC_API_009` | TV-03 | Action | Đăng nhập Member | 1. Gọi trực tiếp API DELETE với ID 101 (bài của Admin) | 1. **[API]** API trả về lỗi 403 Forbidden |
