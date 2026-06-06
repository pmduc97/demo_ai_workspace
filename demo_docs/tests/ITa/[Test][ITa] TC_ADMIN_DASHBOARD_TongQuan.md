---
id: ITa_ADMIN_DASHBOARD
name: Kiểm thử chức năng Dashboard Tổng Quan
target_screen: demo_docs/fe/[Design][SCREEN] ADMIN_DASHBOARD_TongQuan.md
target_api: demo_docs/api/[Design][API] API22_AdminStats_ThongKe.md
status: DRAFT
---

# ITa: Kiểm thử chức năng Dashboard Tổng Quan

## 1. Mục đích (Overview)
Kiểm tra tính năng hiển thị Dashboard tổng quan của Admin/Member, đảm bảo hiển thị đúng thống kê (số lượng bài viết, danh mục) và danh sách bài viết gần đây theo đúng phân quyền (Admin thấy toàn bộ, Member chỉ thấy của mình).

## 2. Điều kiện tiền quyết (Pre-conditions)
> **Lưu ý:** Quá trình test phải sử dụng Condition-Based Waiting (chờ element, chờ API response), tuyệt đối không dùng hard sleep (`waitForTimeout`).
- User đã đăng nhập với role `admin` hoặc `member`.
- Đang đứng tại trang `/admin/dashboard`.

---

## 3. Validation Field Inventory (Bảng kiểm kê Validate)
*Trang Dashboard chủ yếu hiển thị dữ liệu, không có form nhập liệu.*

| Field ID | Field Name | Data Type | Validation Type | Rule/Constraint | Message Code | TC cần tạo |
|---|---|---|---|---|---|---|
| `stats.totalPosts` | Tổng bài viết | Number | Display | Hiển thị số lượng tổng bài viết | N/A | `TC_DB_01`, `TC_DB_02` |
| `stats.publishedPosts` | Đã xuất bản | Number | Display | Hiển thị số lượng bài viết published | N/A | `TC_DB_01`, `TC_DB_02` |
| `stats.draftPosts` | Bản nháp | Number | Display | Hiển thị số lượng bài viết draft | N/A | `TC_DB_01`, `TC_DB_02` |
| `stats.totalCategories`| Danh mục | Number | Display | Hiển thị số lượng danh mục | N/A | `TC_DB_01`, `TC_DB_02` |
| `recentPosts` | Bài viết gần đây | Array | Display | Hiển thị tối đa 5 bài viết mới nhất | N/A | `TC_DB_01`, `TC_DB_02` |

## 4. ITa Checklist (Danh sách Test Case)

| TC ID | Scenario | Test Target | Title | Viewpoint (TV) | Priority | Type |
|---|---|---|---|---|---|---|
| `TC_DB_01` | Happy | Dashboard | Admin xem Dashboard hiển thị toàn bộ thống kê và bài viết | TV-01 | High | `[UI][API]` |
| `TC_DB_02` | Happy | Dashboard | Member xem Dashboard chỉ hiển thị thống kê và bài viết của mình | TV-01 | High | `[UI][API]` |
| `TC_DB_03` | UI | Loading | Hiển thị Skeleton loading khi đang gọi API | TV-02 | Medium | `[UI]` |
| `TC_DB_04` | Error | API Stats | Xử lý khi API `/api/admin/stats` lỗi 500 | TV-03 | Medium | `[UI][API]` |
| `TC_DB_05` | Error | API Posts | Xử lý khi API `/api/posts` lỗi 500 | TV-03 | Medium | `[UI][API]` |
| `TC_DB_06` | UI | Navigation | Click "Xem tất cả" chuyển hướng đến `/admin/posts` | TV-04 | Low | `[UI]` |
| `TC_DB_07` | UI | Navigation | Click "Sửa" trên bài viết chuyển hướng đến `/admin/posts/:id/edit` | TV-04 | Low | `[UI]` |
| `TC_DB_08` | UI | Empty State | Hiển thị Empty state khi không có bài viết gần đây | TV-05 | Low | `[UI]` |

---

## 5. Dữ liệu Test (Test Data)

> **Lưu ý:** Test Data được lấy trực tiếp từ DB thật qua MCP (không dùng data giả hardcode). Các câu lệnh SQL dưới đây mang tính chất tham khảo cấu trúc.

### 5.1. Dữ liệu nền (Setup Data - DB State)
```sql
-- Xóa data cũ
DELETE FROM posts;
DELETE FROM categories;
DELETE FROM users;

-- Tạo Users
INSERT INTO users (id, username, email, password, role, created_at, updated_at) VALUES 
(1, 'admin1', 'admin1@test.com', '$2b$10$test', 'admin', NOW(), NOW()),
(2, 'member1', 'member1@test.com', '$2b$10$test', 'member', NOW(), NOW());

-- Tạo Categories
INSERT INTO categories (id, name, slug, created_at, updated_at) VALUES 
(1, 'Du lịch biển', 'du-lich-bien', NOW(), NOW()),
(2, 'Du lịch núi', 'du-lich-nui', NOW(), NOW());

-- Tạo Posts (4 bài của admin, 2 bài của member)
INSERT INTO posts (id, title, slug, content, status, author_id, category_id, created_at, updated_at) VALUES 
(1, 'Admin Post 1', 'admin-post-1', 'Content', 'published', 1, 1, NOW() - INTERVAL '1 day', NOW()),
(2, 'Admin Post 2', 'admin-post-2', 'Content', 'published', 1, 1, NOW() - INTERVAL '2 days', NOW()),
(3, 'Admin Post 3', 'admin-post-3', 'Content', 'draft', 1, 2, NOW() - INTERVAL '3 days', NOW()),
(4, 'Admin Post 4', 'admin-post-4', 'Content', 'draft', 1, 2, NOW() - INTERVAL '4 days', NOW()),
(5, 'Member Post 1', 'member-post-1', 'Content', 'published', 2, 1, NOW() - INTERVAL '5 days', NOW()),
(6, 'Member Post 2', 'member-post-2', 'Content', 'draft', 2, 2, NOW() - INTERVAL '6 days', NOW());
```

### 5.2. Dữ liệu đầu vào (Input Data Sets)
*Không có input data set vì trang này không có form nhập liệu.*

---

## 6. Kịch bản Kiểm thử Chi tiết (TC Detail)

| TC ID | Viewpoint | Test Target | Precondition | Procedure (Các bước) | Expected Result (Kết quả mong đợi) |
|---|---|---|---|---|---|
| `TC_DB_01` | TV-01 | Dashboard | Đăng nhập role `admin` | 1. Truy cập `/admin/dashboard` | 1. **[API]** Gọi GET `/api/admin/stats` và GET `/api/posts?limit=5&sort=newest`<br>2. **[UI]** Hiển thị Stats: Tổng bài (6), Đã xuất bản (3), Bản nháp (3), Danh mục (2)<br>3. **[UI]** Bảng Recent Posts hiển thị 5 bài mới nhất (gồm cả bài của admin và member). |
| `TC_DB_02` | TV-01 | Dashboard | Đăng nhập role `member` | 1. Truy cập `/admin/dashboard` | 1. **[API]** Gọi GET `/api/admin/stats` và GET `/api/posts?limit=5&sort=newest`<br>2. **[UI]** Hiển thị Stats: Tổng bài (2), Đã xuất bản (1), Bản nháp (1), Danh mục (2)<br>3. **[UI]** Bảng Recent Posts hiển thị 2 bài của member1. |
| `TC_DB_03` | TV-02 | Loading | Đăng nhập thành công | 1. Truy cập `/admin/dashboard`<br>2. Quan sát UI trước khi API trả về | 1. **[UI]** Hiển thị Skeleton loading cho 4 thẻ Stats và bảng Recent Posts. |
| `TC_DB_04` | TV-03 | API Stats | Đăng nhập thành công | 1. Chặn API `/api/admin/stats` trả về lỗi 500<br>2. Truy cập `/admin/dashboard` | 1. **[UI]** Không crash trang.<br>2. **[UI]** Hiển thị thông báo lỗi "Không thể tải thống kê". |
| `TC_DB_05` | TV-03 | API Posts | Đăng nhập thành công | 1. Chặn API `/api/posts` trả về lỗi 500<br>2. Truy cập `/admin/dashboard` | 1. **[UI]** Không crash trang.<br>2. **[UI]** Hiển thị thông báo lỗi "Không thể tải danh sách bài viết". |
| `TC_DB_06` | TV-04 | Navigation | Đăng nhập thành công | 1. Truy cập `/admin/dashboard`<br>2. Click nút "Xem tất cả" | 1. **[UI]** Chuyển hướng sang trang `/admin/posts`. |
| `TC_DB_07` | TV-04 | Navigation | Đăng nhập thành công | 1. Truy cập `/admin/dashboard`<br>2. Click nút "Sửa" trên dòng bài viết đầu tiên | 1. **[UI]** Chuyển hướng sang trang `/admin/posts/:id/edit` tương ứng với ID bài viết. |
| `TC_DB_08` | TV-05 | Empty State | Đăng nhập role `member` mới tạo (chưa có bài viết) | 1. Truy cập `/admin/dashboard` | 1. **[UI]** Stats hiển thị: Tổng bài (0), Đã xuất bản (0), Bản nháp (0), Danh mục (2)<br>2. **[UI]** Bảng Recent Posts hiển thị "Chưa có bài viết nào". |