---
id: ITa_ADMIN_USER_LIST
name: Kiểm thử chức năng quản lý người dùng
target_screen: demo_docs/fe/[Design][SCREEN] ADMIN_USER_LIST_QuanLyNguoiDung.md
target_api:
  - demo_docs/api/[Design][API] API19_AdminUsers_DanhSach.md
  - demo_docs/api/[Design][API] API20_AdminUsers_DoiRole.md
  - demo_docs/api/[Design][API] API23_AdminUsers_ChiTiet.md
  - demo_docs/api/[Design][API] API24_AdminUsers_CapNhat.md
  - demo_docs/api/[Design][API] API25_AdminUsers_DoiStatus.md
  - demo_docs/api/[Design][API] API26_AdminUsers_Tao.md
  - demo_docs/api/[Design][API] API27_AdminUsers_Xoa.md
status: DRAFT
---

# ITa: Kiểm thử chức năng quản lý người dùng

## 1. Mục đích (Overview)
Kiểm thử tích hợp chức năng màn `ADMIN_USER_LIST_QuanLyNguoiDung`, đảm bảo Admin xem danh sách, tìm kiếm/lọc/sắp xếp/phân trang/export, xem chi tiết, tạo mới, cập nhật profile, đổi role, khóa/mở khóa và xóa mềm người dùng đúng theo FE/API design, dữ liệu DB và phân quyền.

## 2. Điều kiện tiền quyết (Pre-conditions)
- PostgreSQL database `hoian_blog` đã migrate và seed.
- Admin đăng nhập thành công bằng `admin@hoianblog.vn` / `password123` và có JWT hợp lệ.
- Member test tồn tại bằng `member@hoianblog.vn` / `password123`.
- Đang đứng tại route `/admin/users`.
- Dữ liệu kiểm thử được setup theo mục 5.1 trước khi chạy suite.

---

## 3. Validation Field Inventory (Bảng kiểm kê Validate)

| Field ID | Field Name | Data Type | Validation Type | Rule/Constraint | Message Code | TC cần tạo |
|---|---|---|---|---|---|---|
| `keyword` | Tìm kiếm | String | MaxLength/Sanitization | Optional, trim, max 100 ký tự | `USER-E-001` | `TC_UI_001`, `TC_API_001`, `TC_API_002` |
| `role` | Role filter / Role mới | String | Enum | `all/admin/member` ở query; `admin/member` ở body update role | `USER-E-001` | `TC_API_003`, `TC_UI_010` |
| `status` | Status filter / Trạng thái mới | String | Enum | `all/active/locked` ở query; `active/locked` ở body update status | `USER-E-001` | `TC_API_004`, `TC_UI_011`, `TC_API_014` |
| `sort` | Sắp xếp | String | Enum | `created_at_desc/name_asc/post_count_desc/last_login_desc` | `USER-E-001` | `TC_API_005` |
| `page` | Trang | Number | Range | Integer >= 1 | `USER-E-001` | `TC_API_006`, `TC_UI_008` |
| `limit` | Số dòng/trang | Number | Range/Boundary | Integer 1..100 | `USER-E-001` | `TC_API_007`, `TC_API_008` |
| `id` | User ID | Number | Required/Range | Path param integer > 0, user chưa soft delete | `USER-E-001`, `USER-E-003` | `TC_API_009`, `TC_API_010` |
| `name` | Họ tên | String | Required/Length/Boundary | Required, trim, min 2, max 100 | `USER-E-001` | `TC_UI_002`, `TC_UI_003`, `TC_UI_004`, `TC_API_011`, `TC_API_012` |
| `email` | Email tạo mới | String | Required/Format/Unique | Required, valid email, không trùng user active | `USER-E-001`, `USER-E-002` | `TC_UI_012`, `TC_API_016`, `TC_API_017` |
| `password` | Mật khẩu tạo mới | String | Required/MinLength | Required, min 6 | `USER-E-001` | `TC_UI_013`, `TC_API_018` |
| `phone` | Số điện thoại | String | Format/MaxLength | Optional, max 20, format phone Việt Nam | `USER-E-001` | `TC_UI_005`, `TC_API_013` |
| `address` | Địa chỉ | String | MaxLength | Optional, max 255 | `USER-E-001` | `TC_UI_006` |
| `avatar_url` | Avatar URL | String | MaxLength/Format | Optional, max 255, URL hợp lệ theo UI design | `USER-E-001` | `TC_UI_007` |
| `bio` | Giới thiệu | String | MaxLength | Optional, max 500 | `USER-E-001` | `TC_UI_014` |
| `birthdate` | Ngày sinh | Date | Format/Range | `YYYY-MM-DD`, không lớn hơn hôm nay | `USER-E-001` | `TC_UI_015`, `TC_API_019` |
| `gender` | Giới tính | String | Enum | `male/female/other/unknown` | `USER-E-001` | `TC_API_020` |
| `locked_reason` | Lý do khóa | String | Conditional Required/Length | Required khi `status=locked`, 5..255 ký tự | `USER-E-001` | `TC_UI_016`, `TC_API_015` |
| `Authorization` | Token | String | Required/Auth | `Bearer <token>` của admin | `COMMON-E-001`, `USER-E-004` | `TC_API_021`, `TC_API_022`, `TC_UI_017` |

## 4. ITa Checklist (Danh sách Test Case)

| TC ID | Scenario | Test Target | Title | Viewpoint (TV) | Priority | Type |
|---|---|---|---|---|---|---|
| `TC_UI_001` | Validate | `keyword` | Chặn tìm kiếm khi keyword vượt 100 ký tự | TV-02 | High | `[UI]` |
| `TC_UI_002` | Validate | `name` | Hiển thị lỗi khi bỏ trống họ tên trong EditUserModal | TV-02 | High | `[UI]` |
| `TC_UI_003` | Validate | `name` | Hiển thị lỗi khi họ tên dưới 2 ký tự | TV-02 | High | `[UI]` |
| `TC_UI_004` | Boundary | `name` | Cho phép họ tên đúng 100 ký tự | TV-03 | High | `[UI]` |
| `TC_UI_005` | Validate | `phone` | Hiển thị lỗi khi số điện thoại sai format | TV-02 | High | `[UI]` |
| `TC_UI_006` | Boundary | `address` | Chặn địa chỉ vượt 255 ký tự | TV-02 | Medium | `[UI]` |
| `TC_UI_007` | Boundary | `avatar_url` | Chặn Avatar URL vượt 255 ký tự | TV-02 | Medium | `[UI]` |
| `TC_UI_008` | Pagination | `page` | Chuyển trang giữ điều kiện search/filter/sort | TV-08 | High | `[UI]` |
| `TC_UI_009` | Happy | Form | Cập nhật profile user thành công và reload list | TV-03 | High | `[UI]` |
| `TC_UI_010` | Permission | `role` | Disabled đổi role chính mình | TV-04 | High | `[UI]` |
| `TC_UI_011` | Permission | `status` | Disabled khóa tài khoản chính mình | TV-04 | High | `[UI]` |
| `TC_UI_012` | Validate | `email` | Chặn email tạo mới sai format | TV-02 | High | `[UI]` |
| `TC_UI_013` | Validate | `password` | Chặn mật khẩu tạo mới dưới 6 ký tự | TV-02 | High | `[UI]` |
| `TC_UI_014` | Boundary | `bio` | Chặn giới thiệu vượt 500 ký tự | TV-02 | Medium | `[UI]` |
| `TC_UI_015` | Validate | `birthdate` | Chặn ngày sinh lớn hơn hôm nay | TV-02 | Medium | `[UI]` |
| `TC_UI_016` | Validate | `locked_reason` | Bắt nhập lý do khi khóa user | TV-02 | High | `[UI]` |
| `TC_UI_017` | Permission | Auth | Member truy cập bị redirect/ẩn màn quản lý | TV-04 | High | `[UI]` |
| `TC_UI_018` | Initial/Empty | List | Hiển thị empty state khi không có kết quả | TV-07 | Medium | `[UI]` |
| `TC_UI_019` | Error | Network | Hiển thị ErrorBanner khi API lỗi hệ thống | TV-06 | Medium | `[UI]` |
| `TC_UI_020` | Usability | Submit | Ngăn double-click khi lưu profile | TV-10 | Medium | `[UI]` |
| `TC_API_001` | Boundary | `keyword` | GET list với keyword đúng 100 ký tự trả 200 | TV-03 | High | `[API]` |
| `TC_API_002` | Validate | `keyword` | GET list với keyword 101 ký tự trả 422 | TV-02 | High | `[API]` |
| `TC_API_003` | Validate | `role` | GET list với role invalid trả 422 | TV-02 | High | `[API]` |
| `TC_API_004` | Validate | `status` | GET list với status invalid trả 422 | TV-02 | High | `[API]` |
| `TC_API_005` | Validate | `sort` | GET list với sort invalid trả 422 | TV-02 | Medium | `[API]` |
| `TC_API_006` | Validate | `page` | GET list với page < 1 trả 422 | TV-02 | Medium | `[API]` |
| `TC_API_007` | Boundary | `limit` | GET list với limit=100 trả 200 | TV-03 | Medium | `[API]` |
| `TC_API_008` | Boundary | `limit` | GET list với limit=101 trả 422 | TV-02 | Medium | `[API]` |
| `TC_API_009` | Happy | `id` | GET chi tiết user tồn tại trả đủ field và post counters | TV-01 | High | `[API]` |
| `TC_API_010` | Error | `id` | GET chi tiết user không tồn tại trả 404 | TV-04 | High | `[API]` |
| `TC_API_011` | Validate | `name` | PUT profile thiếu name trả 422 | TV-02 | High | `[API]` |
| `TC_API_012` | Boundary | `name` | PUT profile name 101 ký tự trả 422 | TV-02 | High | `[API]` |
| `TC_API_013` | Validate | `phone` | PUT profile phone sai format trả 422 | TV-02 | Medium | `[API]` |
| `TC_API_014` | Happy | `status` | PUT khóa user hợp lệ trả 200 và DB cập nhật locked | TV-03 | High | `[API]` |
| `TC_API_015` | Validate | `locked_reason` | PUT status locked thiếu reason trả 422 | TV-02 | High | `[API]` |
| `TC_API_016` | Happy | Create user | POST tạo user hợp lệ trả 201 | TV-03 | High | `[API]` |
| `TC_API_017` | Validate | `email` | POST email trùng trả 409 | TV-04 | High | `[API]` |
| `TC_API_018` | Validate | `password` | POST password dưới 6 ký tự trả 422 | TV-02 | High | `[API]` |
| `TC_API_019` | Validate | `birthdate` | PUT birthdate tương lai trả 422 | TV-02 | Medium | `[API]` |
| `TC_API_020` | Validate | `gender` | PUT gender invalid trả 422 | TV-02 | Medium | `[API]` |
| `TC_API_021` | Auth | Authorization | Không có token gọi API19 trả 401 | TV-04 | High | `[API]` |
| `TC_API_022` | Permission | Authorization | Member gọi API19 trả 403 | TV-04 | High | `[API]` |
| `TC_API_023` | Permission | Self role | Admin tự đổi role trả 400 | TV-04 | High | `[API]` |
| `TC_API_024` | Permission | Self lock | Admin tự khóa chính mình trả 400 | TV-04 | High | `[API]` |
| `TC_API_025` | Happy | Delete user | DELETE user hợp lệ trả 200 và set `deleted_at` | TV-03 | High | `[API]` |
| `TC_API_026` | Security | Search | Keyword SQL injection không phá query và trả 200/empty | TV-05 | Medium | `[API]` |
| `TC_API_027` | Security | `name` | XSS trong name được lưu/render an toàn, không thực thi script | TV-05 | Medium | `[API]` |
| `TC_API_028` | Concurrency | Update profile | Hai admin cập nhật cùng user theo cơ chế last write wins/updated_at | TV-12 | Low | `[API]` |

---

## 5. Dữ liệu Test (Test Data)

### 5.1. Dữ liệu nền (Setup Data - DB State)
Dữ liệu dưới đây dựa trên schema và sample thật từ MCP: bảng `users` có các user seed `id=3` admin, `id=4` member; bảng `posts` có bài của `author_id=3` và `author_id=4` để test counter.

```sql
-- Clean state cho dữ liệu ITa quản lý người dùng
DELETE FROM posts WHERE slug LIKE 'ita-admin-users-%';
DELETE FROM users WHERE email LIKE 'ita.%@hoianblog.vn';

-- Bảo toàn seed admin/member nếu đã tồn tại, cập nhật profile/status về trạng thái chuẩn
UPDATE users
SET role = 'admin', status = 'active', deleted_at = NULL, deleted_by = NULL, updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@hoianblog.vn';

UPDATE users
SET role = 'member', status = 'active', deleted_at = NULL, deleted_by = NULL, phone = '0912345678', address = 'Đà Nẵng', bio = 'Yêu du lịch Việt Nam', birthdate = '1995-01-20', gender = 'male', locked_reason = NULL, updated_at = CURRENT_TIMESTAMP
WHERE email = 'member@hoianblog.vn';

-- Tạo thêm user phục vụ update/lock/delete, password_hash dùng hash seed password123 lấy từ DB sample
INSERT INTO users (email, password_hash, name, phone, address, avatar_url, role, status, bio, birthdate, gender, locked_reason, created_at, updated_at)
VALUES
('ita.member.lock@hoianblog.vn', '$2b$10$mE4nV3NvH3qXesQfboQsse45vfcC3ZuAatqN4z01I5CtoQlCefVK.', 'ITa Member Lock', '0987654321', 'Hội An', NULL, 'member', 'active', 'User để test khóa tài khoản', '1996-02-02', 'female', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ita.member.delete@hoianblog.vn', '$2b$10$mE4nV3NvH3qXesQfboQsse45vfcC3ZuAatqN4z01I5CtoQlCefVK.', 'ITa Member Delete', '0900000001', 'Huế', NULL, 'member', 'active', 'User để test xóa mềm', '1994-03-03', 'other', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ita.admin2@hoianblog.vn', '$2b$10$mE4nV3NvH3qXesQfboQsse45vfcC3ZuAatqN4z01I5CtoQlCefVK.', 'ITa Admin Two', '0900000002', 'Đà Nẵng', NULL, 'admin', 'active', 'Admin thứ hai cho concurrency', '1990-04-04', 'unknown', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Tạo bài viết để API19/API23 trả postCount/publishedPostCount/draftPostCount
INSERT INTO posts (title, slug, content, status, author_id, created_by, updated_by, view_count, created_at, updated_at)
SELECT 'ITa Admin Users Published', 'ita-admin-users-published', '<p>Published test post</p>', 'published', u.id, u.id, u.id, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ita.member.lock@hoianblog.vn';

INSERT INTO posts (title, slug, content, status, author_id, created_by, updated_by, view_count, created_at, updated_at)
SELECT 'ITa Admin Users Draft', 'ita-admin-users-draft', '<p>Draft test post</p>', 'draft', u.id, u.id, u.id, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u WHERE u.email = 'ita.member.lock@hoianblog.vn';
```

### 5.2. Dữ liệu đầu vào (Input Data Sets)

| Data ID | `keyword` | `role` | `status` | `sort` | `page` | `limit` | Ghi chú (Mục đích) |
|---|---|---|---|---|---|---|---|
| `TD_LIST_VALID_01` | `Nguyễn` | `member` | `active` | `created_at_desc` | `1` | `10` | Query hợp lệ cho API19 |
| `TD_KEYWORD_MAX_100` | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` | `all` | `all` | `created_at_desc` | `1` | `10` | Boundary exact-max keyword |
| `TD_KEYWORD_OVER_101` | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` | `all` | `all` | `created_at_desc` | `1` | `10` | Boundary over-max keyword |
| `TD_LIST_ROLE_INVALID` | `` | `owner` | `all` | `created_at_desc` | `1` | `10` | Role query invalid |
| `TD_LIST_STATUS_INVALID` | `` | `all` | `disabled` | `created_at_desc` | `1` | `10` | Status query invalid |
| `TD_LIST_SORT_INVALID` | `` | `all` | `all` | `email_desc` | `1` | `10` | Sort invalid |
| `TD_LIST_PAGE_INVALID` | `` | `all` | `all` | `created_at_desc` | `0` | `10` | Page invalid |
| `TD_LIST_LIMIT_MAX_100` | `` | `all` | `all` | `created_at_desc` | `1` | `100` | Boundary exact-max limit |
| `TD_LIST_LIMIT_OVER_101` | `` | `all` | `all` | `created_at_desc` | `1` | `101` | Boundary over-max limit |
| `TD_SQL_INJECTION` | `' OR 1=1 --` | `all` | `all` | `created_at_desc` | `1` | `10` | Security SQL injection search |

| Data ID | `name` | `phone` | `address` | `avatar_url` | `bio` | `birthdate` | `gender` | Ghi chú (Mục đích) |
|---|---|---|---|---|---|---|---|---|
| `TD_PROFILE_VALID_01` | `Nguyễn Văn A Updated` | `0912345678` | `Đà Nẵng` | `` | `Yêu du lịch Việt Nam` | `1995-01-20` | `male` | Profile hợp lệ |
| `TD_NAME_EMPTY` | `` | `0912345678` | `Đà Nẵng` | `` | `` | `1995-01-20` | `male` | Required name |
| `TD_NAME_MIN_INVALID` | `A` | `0912345678` | `Đà Nẵng` | `` | `` | `1995-01-20` | `male` | Name dưới min 2 |
| `TD_NAME_MAX_100` | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` | `0912345678` | `Đà Nẵng` | `` | `` | `1995-01-20` | `male` | Boundary exact-max name |
| `TD_NAME_OVER_101` | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` | `0912345678` | `Đà Nẵng` | `` | `` | `1995-01-20` | `male` | Boundary over-max name |
| `TD_PHONE_INVALID` | `abc123` | `abc123` | `Đà Nẵng` | `` | `` | `1995-01-20` | `male` | Phone invalid |
| `TD_ADDRESS_OVER_256` | `Nguyễn Văn A` | `0912345678` | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` | `` | `` | `1995-01-20` | `male` | Address over max 255 |
| `TD_AVATAR_OVER_256` | `Nguyễn Văn A` | `0912345678` | `Đà Nẵng` | `https://cdn.hoianblog.vn/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.png` | `` | `1995-01-20` | `male` | Avatar URL over max 255 |
| `TD_BIO_OVER_501` | `Nguyễn Văn A` | `0912345678` | `Đà Nẵng` | `` | `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` | `1995-01-20` | `male` | Bio over max 500 |
| `TD_BIRTHDATE_FUTURE` | `Nguyễn Văn A` | `0912345678` | `Đà Nẵng` | `` | `` | `2999-01-01` | `male` | Birthdate tương lai |
| `TD_GENDER_INVALID` | `Nguyễn Văn A` | `0912345678` | `Đà Nẵng` | `` | `` | `1995-01-20` | `secret` | Gender invalid |
| `TD_XSS_NAME` | `<script>alert(1)</script>` | `0912345678` | `Đà Nẵng` | `` | `` | `1995-01-20` | `male` | Security XSS |

| Data ID | `email` | `password` | `role` | `status` | `locked_reason` | Ghi chú (Mục đích) |
|---|---|---|---|---|---|
| `TD_CREATE_VALID_01` | `ita.new.user@hoianblog.vn` | `password123` | `member` | `active` | `` | Tạo user hợp lệ |
| `TD_CREATE_EMAIL_INVALID` | `invalid-email` | `password123` | `member` | `active` | `` | Email format invalid |
| `TD_CREATE_EMAIL_DUPLICATE` | `member@hoianblog.vn` | `password123` | `member` | `active` | `` | Email trùng seed |
| `TD_CREATE_PASSWORD_SHORT` | `12345` | `12345` | `member` | `active` | `` | Password dưới 6 |
| `TD_ROLE_VALID_ADMIN` | `` | `` | `admin` | `` | `` | Đổi role thành admin |
| `TD_ROLE_INVALID` | `` | `` | `owner` | `` | `` | Role invalid |
| `TD_STATUS_LOCK_VALID` | `` | `` | `` | `locked` | `Vi phạm quy định cộng đồng` | Khóa user hợp lệ |
| `TD_STATUS_LOCK_NO_REASON` | `` | `` | `` | `locked` | `` | Thiếu locked_reason |
| `TD_STATUS_ACTIVE_VALID` | `` | `` | `` | `active` | `` | Mở khóa user hợp lệ |

---

## 6. Kịch bản Kiểm thử Chi tiết (TC Detail)

| TC ID | Viewpoint | Test Target | Precondition | Procedure (Các bước) | Expected Result (Kết quả mong đợi) |
|---|---|---|---|---|---|
| `TC_UI_001` | TV-02 | `keyword` | Admin ở `/admin/users` | 1. Nhập `TD_KEYWORD_OVER_101.keyword` vào [Tìm kiếm].<br>2. Click [Nút Search]. | 1. [UI] Field hiển thị inline error `USER-E-001` hoặc không cho submit.<br>2. [UI] Không gọi API19, [Nút Search] disabled hoặc giữ nguyên list hiện tại. |
| `TC_UI_002` | TV-02 | `name` | Admin mở EditUserModal của user member | 1. Xóa trắng [Họ tên].<br>2. Click [Nút Lưu]. | 1. [UI] Field [Họ tên] hiển thị lỗi required `USER-E-001`.<br>2. [UI] Không gọi API24, modal vẫn mở. |
| `TC_UI_003` | TV-02 | `name` | Admin mở EditUserModal | 1. Nhập `TD_NAME_MIN_INVALID.name`.<br>2. Click [Nút Lưu]. | 1. [UI] Hiển thị lỗi min length `USER-E-001`.<br>2. [UI] Không gọi API24. |
| `TC_UI_004` | TV-03 | `name` | Admin mở EditUserModal | 1. Nhập `TD_NAME_MAX_100.name` và dữ liệu profile hợp lệ.<br>2. Click [Nút Lưu]. | 1. [UI] Form hợp lệ, [Nút Lưu] enabled.<br>2. [UI] Gọi API24 và sau success hiển thị `USER-S-001`, đóng modal, reload list. |
| `TC_UI_005` | TV-02 | `phone` | Admin mở EditUserModal | 1. Nhập `TD_PHONE_INVALID.phone`.<br>2. Click [Nút Lưu]. | 1. [UI] Hiển thị lỗi format phone `USER-E-001`.<br>2. [UI] Không gọi API24. |
| `TC_UI_006` | TV-02 | `address` | Admin mở EditUserModal | 1. Nhập `TD_ADDRESS_OVER_256.address`.<br>2. Click [Nút Lưu]. | 1. [UI] Hiển thị lỗi max 255 `USER-E-001`.<br>2. [UI] Không gọi API24. |
| `TC_UI_007` | TV-02 | `avatar_url` | Admin mở EditUserModal | 1. Nhập `TD_AVATAR_OVER_256.avatar_url`.<br>2. Click [Nút Lưu]. | 1. [UI] Hiển thị lỗi max 255 `USER-E-001`.<br>2. [UI] Không gọi API24. |
| `TC_UI_008` | TV-08 | `page` | Có nhiều hơn 1 trang dữ liệu hoặc `limit=1` | 1. Nhập keyword/filter/sort hợp lệ.<br>2. Click [Search].<br>3. Click [Pagination Next]. | 1. [UI] List render theo điều kiện.<br>2. [UI] Page đổi sang trang kế tiếp.<br>3. [API] Gọi API19 với keyword/role/status/sort giữ nguyên và `page` mới. |
| `TC_UI_009` | TV-03 | Form | Admin mở EditUserModal của `ita.member.lock@hoianblog.vn` | 1. Nhập `TD_PROFILE_VALID_01`.<br>2. Click [Nút Lưu]. | 1. [UI] Button chuyển loading/disabled.<br>2. [API] PUT `/api/admin/users/:id` trả 200 `USER-S-001`.<br>3. [UI] Toast success, đóng modal, reload list và row hiển thị dữ liệu mới. |
| `TC_UI_010` | TV-04 | `role` | Row hiện tại là user admin đang đăng nhập | 1. Quan sát action [Đổi role] của chính mình.<br>2. Hover/click nếu button visible. | 1. [UI] Button [Đổi role] disabled hoặc không hiển thị.<br>2. [UI] Tooltip/toast dùng `USER-E-005` nếu có thao tác. |
| `TC_UI_011` | TV-04 | `status` | Row hiện tại là user admin đang đăng nhập | 1. Quan sát action [Khóa/Mở khóa] của chính mình.<br>2. Hover/click nếu button visible. | 1. [UI] Button disabled hoặc không hiển thị.<br>2. [UI] Tooltip/toast dùng `USER-E-006` nếu có thao tác. |
| `TC_UI_012` | TV-02 | `email` | Admin mở modal tạo mới user | 1. Nhập `TD_CREATE_EMAIL_INVALID.email` và các field khác hợp lệ.<br>2. Click [Lưu]. | 1. [UI] Email hiển thị lỗi format `USER-E-001`.<br>2. [UI] Không gọi API26. |
| `TC_UI_013` | TV-02 | `password` | Admin mở modal tạo mới user | 1. Nhập `TD_CREATE_PASSWORD_SHORT.password`.<br>2. Click [Lưu]. | 1. [UI] Password hiển thị lỗi min 6 `USER-E-001`.<br>2. [UI] Không gọi API26. |
| `TC_UI_014` | TV-02 | `bio` | Admin mở EditUserModal | 1. Nhập `TD_BIO_OVER_501.bio`.<br>2. Click [Lưu]. | 1. [UI] Bio hiển thị lỗi max 500.<br>2. [UI] Không gọi API24. |
| `TC_UI_015` | TV-02 | `birthdate` | Admin mở EditUserModal | 1. Nhập `TD_BIRTHDATE_FUTURE.birthdate`.<br>2. Click [Lưu]. | 1. [UI] Ngày sinh hiển thị lỗi không lớn hơn hôm nay.<br>2. [UI] Không gọi API24. |
| `TC_UI_016` | TV-02 | `locked_reason` | Admin mở LockConfirmModal cho user active khác mình | 1. Chọn khóa tài khoản.<br>2. Để trống [Lý do khóa].<br>3. Click [Xác nhận]. | 1. [UI] Hiển thị InlineError `USER-E-001` tại locked_reason.<br>2. [UI] Không gọi API25. |
| `TC_UI_017` | TV-04 | Auth | Đăng nhập member hoặc dùng token member | 1. Điều hướng `/admin/users`.<br>2. Chờ route guard/API trả về. | 1. [UI] Không render UserTable.<br>2. [UI] Redirect `/admin/dashboard` hoặc `/admin/login`, hiển thị `USER-E-004`. |
| `TC_UI_018` | TV-07 | List | Admin ở `/admin/users` | 1. Nhập keyword không khớp, ví dụ `zzzz-no-user`.<br>2. Click [Search]. | 1. [API] API19 trả 200 với `items=[]`.<br>2. [UI] Hiển thị EmptyState `USER-I-002`, ẩn action row, disable Export CSV. |
| `TC_UI_019` | TV-06 | Network | Mock API19 trả 500 hoặc ngắt mạng | 1. Reload `/admin/users`.<br>2. Chờ request list hoàn tất. | 1. [UI] Không trắng trang.<br>2. [UI] Hiển thị ErrorBanner `COMMON-E-001`, loading tắt. |
| `TC_UI_020` | TV-10 | Submit | Admin mở EditUserModal với dữ liệu hợp lệ | 1. Double-click nhanh [Nút Lưu].<br>2. Theo dõi network. | 1. [UI] [Nút Lưu] disabled ngay sau click đầu tiên.<br>2. [API] Chỉ có 1 request API24 được gửi. |
| `TC_API_001` | TV-03 | `keyword` | Có token admin | 1. Gọi GET `/api/admin/users` với `TD_KEYWORD_MAX_100`.<br>2. Kiểm tra response. | 1. [API] Trả 200.<br>2. [API] Body có `{ items, pagination }`. |
| `TC_API_002` | TV-02 | `keyword` | Có token admin | 1. Gọi GET `/api/admin/users` với `TD_KEYWORD_OVER_101`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Body có message/messageId `USER-E-001`. |
| `TC_API_003` | TV-02 | `role` | Có token admin | 1. Gọi GET `/api/admin/users?role=owner`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Không trả dữ liệu danh sách. |
| `TC_API_004` | TV-02 | `status` | Có token admin | 1. Gọi GET `/api/admin/users?status=disabled`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Có `USER-E-001`. |
| `TC_API_005` | TV-02 | `sort` | Có token admin | 1. Gọi GET `/api/admin/users?sort=email_desc`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Có `USER-E-001`. |
| `TC_API_006` | TV-02 | `page` | Có token admin | 1. Gọi GET `/api/admin/users?page=0`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Có `USER-E-001`. |
| `TC_API_007` | TV-03 | `limit` | Có token admin | 1. Gọi GET `/api/admin/users?limit=100`.<br>2. Kiểm tra pagination. | 1. [API] Trả 200.<br>2. [API] `pagination.limit=100`. |
| `TC_API_008` | TV-02 | `limit` | Có token admin | 1. Gọi GET `/api/admin/users?limit=101`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Có `USER-E-001`. |
| `TC_API_009` | TV-01 | `id` | Có token admin, user `member@hoianblog.vn` tồn tại | 1. Lấy `id` của member.<br>2. Gọi GET `/api/admin/users/:id`.<br>3. Kiểm tra fields. | 1. [API] Trả 200.<br>2. [API] Không có `password_hash`.<br>3. [API] Có profile fields và `postCount/publishedPostCount/draftPostCount`. |
| `TC_API_010` | TV-04 | `id` | Có token admin | 1. Gọi GET `/api/admin/users/999999`.<br>2. Kiểm tra response. | 1. [API] Trả 404.<br>2. [API] Có `USER-E-003`. |
| `TC_API_011` | TV-02 | `name` | Có token admin, target user tồn tại | 1. Gọi PUT `/api/admin/users/:id` với `TD_NAME_EMPTY`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] DB không cập nhật `updated_at` cho target do validate fail. |
| `TC_API_012` | TV-02 | `name` | Có token admin | 1. Gọi PUT `/api/admin/users/:id` với `TD_NAME_OVER_101`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Có `USER-E-001`. |
| `TC_API_013` | TV-02 | `phone` | Có token admin | 1. Gọi PUT `/api/admin/users/:id` với `TD_PHONE_INVALID`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Có `USER-E-001`. |
| `TC_API_014` | TV-03 | `status` | Có token admin, target `ita.member.lock@hoianblog.vn` active | 1. Gọi PUT `/api/admin/users/:id/status` với `TD_STATUS_LOCK_VALID`.<br>2. Query DB target user. | 1. [API] Trả 200 `USER-S-003`.<br>2. [API] Response `data.status=locked`.<br>3. [DB] `users.status='locked'`, `locked_reason` đúng input. |
| `TC_API_015` | TV-02 | `locked_reason` | Có token admin, target user khác mình | 1. Gọi PUT `/api/admin/users/:id/status` với `TD_STATUS_LOCK_NO_REASON`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] DB không đổi status target. |
| `TC_API_016` | TV-03 | Create user | Có token admin | 1. Gọi POST `/api/admin/users` với `TD_CREATE_VALID_01`.<br>2. Query DB bằng email. | 1. [API] Trả 201 `USER-S-004`.<br>2. [API] Response không có `password_hash`.<br>3. [DB] User được insert, `password_hash` khác plain password. |
| `TC_API_017` | TV-04 | `email` | Có token admin, seed member tồn tại | 1. Gọi POST `/api/admin/users` với `TD_CREATE_EMAIL_DUPLICATE`.<br>2. Kiểm tra response. | 1. [API] Trả 409.<br>2. [API] Có `USER-E-002`. |
| `TC_API_018` | TV-02 | `password` | Có token admin | 1. Gọi POST `/api/admin/users` với `TD_CREATE_PASSWORD_SHORT`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Có `USER-E-001`. |
| `TC_API_019` | TV-02 | `birthdate` | Có token admin | 1. Gọi PUT `/api/admin/users/:id` với `TD_BIRTHDATE_FUTURE`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Có `USER-E-001`. |
| `TC_API_020` | TV-02 | `gender` | Có token admin | 1. Gọi PUT `/api/admin/users/:id` với `TD_GENDER_INVALID`.<br>2. Kiểm tra response. | 1. [API] Trả 422.<br>2. [API] Có `USER-E-001`. |
| `TC_API_021` | TV-04 | Authorization | Không gửi token | 1. Gọi GET `/api/admin/users` không có `Authorization`.<br>2. Kiểm tra response. | 1. [API] Trả 401.<br>2. [API] Có `COMMON-E-001` hoặc message unauthorized chuẩn. |
| `TC_API_022` | TV-04 | Authorization | Có token member | 1. Gọi GET `/api/admin/users` bằng token member.<br>2. Kiểm tra response. | 1. [API] Trả 403.<br>2. [API] Có `USER-E-004`. |
| `TC_API_023` | TV-04 | Self role | Có token admin, biết admin id | 1. Gọi PUT `/api/admin/users/:adminId/role` với `{role:'member'}`.<br>2. Kiểm tra response. | 1. [API] Trả 400.<br>2. [API] Có `USER-E-005`.<br>3. [DB] Role admin không đổi. |
| `TC_API_024` | TV-04 | Self lock | Có token admin, biết admin id | 1. Gọi PUT `/api/admin/users/:adminId/status` với `TD_STATUS_LOCK_VALID`.<br>2. Kiểm tra response. | 1. [API] Trả 400.<br>2. [API] Có `USER-E-006`.<br>3. [DB] Status admin vẫn `active`. |
| `TC_API_025` | TV-03 | Delete user | Có token admin, target `ita.member.delete@hoianblog.vn` tồn tại | 1. Gọi DELETE `/api/admin/users/:id`.<br>2. Query DB target user. | 1. [API] Trả 200 `USER-S-005`.<br>2. [DB] `deleted_at` khác null, `deleted_by` bằng admin id. |
| `TC_API_026` | TV-05 | Search | Có token admin | 1. Gọi GET `/api/admin/users?keyword=' OR 1=1 --`.<br>2. Kiểm tra response và log lỗi. | 1. [API] Không lỗi SQL, trả 200 với `{items,pagination}` hoặc empty.<br>2. [API] Không trả toàn bộ dữ liệu do injection. |
| `TC_API_027` | TV-05 | `name` | Có token admin, target user tồn tại | 1. Gọi PUT profile với `TD_XSS_NAME`.<br>2. Reload UI detail/list. | 1. [API] Trả 200 hoặc 422 theo policy validate.<br>2. [UI] Nếu được lưu, render text an toàn, script không thực thi. |
| `TC_API_028` | TV-12 | Update profile | Có token admin và `ita.admin2@hoianblog.vn` | 1. Admin A và Admin B cùng GET detail target.<br>2. Admin A PUT name `A update`.<br>3. Admin B PUT name `B update` sau đó.<br>4. GET detail target. | 1. [API] Hai request trả 200 nếu design áp dụng last write wins.<br>2. [DB] Giá trị cuối là `B update`, `updated_at` phản ánh lần cập nhật cuối.<br>3. [UI] Reload list hiển thị dữ liệu mới nhất. |
