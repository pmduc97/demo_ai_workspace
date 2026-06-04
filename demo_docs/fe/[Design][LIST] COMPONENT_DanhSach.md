---
version: 1.0
created: 2026-06-03
updated: 2026-06-03
status: stable
---

# [Design][LIST] COMPONENT_DanhSach

Tài liệu này đóng vai trò là **Component Registry** (Thư viện UI nội bộ) của dự án. 
Khi thiết kế (viết spec) hoặc implement màn hình mới, **BẮT BUỘC** phải tra cứu tài liệu này để tái sử dụng component, tránh việc code lặp lại (reinvent the wheel) và đảm bảo tính đồng nhất UI.

## 1. Global UI Components (Dùng chung toàn dự án)
> Các component UI nguyên thủy (Atomic), không chứa business logic cụ thể, có thể dùng ở bất kỳ đâu.
> *(Lưu ý: Một số component hiện đang được code trực tiếp bằng Tailwind trong các page, danh sách dưới đây bao gồm cả các component đã có và dự kiến sẽ tách ra).*

| Tên Component | Đường dẫn (Thực tế / Dự kiến) | Props chính | Mô tả & Cách dùng |
|---------------|-------------------------------|-------------|-------------------|
| `ConfirmModal` | `src/components/ui/ConfirmModal.jsx` | `isOpen`, `title`, `message`, `onConfirm`, `onCancel` | Modal xác nhận hành động nguy hiểm (Xóa danh mục, Đổi role...). |
| `Pagination` | `src/components/ui/Pagination.jsx` | `currentPage`, `totalPages`, `onPageChange` | Thanh phân trang cho danh sách bài viết, danh mục, người dùng. |
| `RichEditor` | `src/components/ui/RichEditor.jsx` | `value`, `onChange` | Trình soạn thảo văn bản (TipTap) dùng cho form tạo/sửa bài viết. |
| `LoadingSpinner`| `src/components/ui/LoadingSpinner.jsx` | `size`, `color` | Icon xoay hiển thị trạng thái đang tải dữ liệu (dùng trong nút bấm hoặc full màn hình). |
| `ErrorBanner` | `src/components/ui/ErrorBanner.jsx` | `message`, `onClose` | Khối cảnh báo lỗi màu đỏ hiển thị phía trên form hoặc danh sách. |

## 2. Layout & Guard Components (Cấu trúc trang & Bảo mật)
> Các component dùng để bọc (wrap) các trang, định hình layout tổng thể hoặc bảo vệ route.

| Tên Component | Đường dẫn | Props chính | Mô tả & Cách dùng |
|---------------|-----------|-------------|-------------------|
| `AdminLayout` | `src/components/AdminLayout.jsx` | `children` | Layout chuẩn cho trang Admin (bao gồm Sidebar trái và Header trên). Tự động ẩn menu Categories/Users nếu user là `member`. |
| `Navbar` | `src/components/Navbar.jsx` | Không có | Thanh điều hướng trên cùng cho các trang Public (Home, Category, About...). |
| `Footer` | `src/components/Footer.jsx` | Không có | Chân trang cho các trang Public. |
| `ProtectedRoute` | `src/components/ProtectedRoute.jsx` | `children`, `role` (optional) | Route Guard. Nếu chưa login -> redirect `/admin/login`. Nếu truyền `role="admin"` mà user là `member` -> redirect `/admin/dashboard`. |

## 3. Feature Components (Đặc thù theo Domain)
> Các component chứa UI phức tạp gắn liền với một domain cụ thể (Bài viết, Danh mục...).

| Tên Component | Đường dẫn | Props chính | Mô tả & Cách dùng |
|---------------|-----------|-------------|-------------------|
| `PostCard` | `src/components/PostCard.jsx` | `post` (object) | Card hiển thị tóm tắt bài viết (Thumbnail, Tiêu đề, Excerpt, Tác giả, Ngày đăng). Dùng ở trang Chủ và trang Danh mục. |
| `UserToolbar` | `src/pages/admin/UserListPage.jsx` hoặc `src/components/admin/UserToolbar.jsx` | `filters`, `onSearch`, `onReset`, `onExport` | Toolbar quản lý người dùng: search, role/status filter, sort và export CSV. Có thể tách component khi implement. |
| `UserTable` | `src/pages/admin/UserListPage.jsx` hoặc `src/components/admin/UserTable.jsx` | `users`, `currentUser`, `onView`, `onEdit`, `onChangeRole`, `onChangeStatus` | Bảng quản lý người dùng với avatar, role/status badge, thống kê bài viết và actions. Có thể tách component khi implement. |
| `UserDetailModal` | `src/pages/admin/UserListPage.jsx` hoặc `src/components/admin/UserDetailModal.jsx` | `user`, `isOpen`, `onClose` | Modal xem đầy đủ thông tin profile và thống kê tài khoản người dùng. |
| `EditUserModal` | `src/pages/admin/UserListPage.jsx` hoặc `src/components/admin/EditUserModal.jsx` | `user`, `isOpen`, `onSubmit`, `onCancel` | Modal chỉnh sửa profile mở rộng của người dùng. |
| `RoleConfirmModal` | `src/components/ui/ConfirmModal.jsx` | `user`, `newRole`, `onConfirm`, `onCancel` | Biến thể ConfirmModal để xác nhận đổi role user. |
| `LockConfirmModal` | `src/components/ui/ConfirmModal.jsx` | `user`, `nextStatus`, `lockedReason`, `onConfirm`, `onCancel` | Biến thể ConfirmModal để xác nhận khóa/mở khóa user. |

## 4. Context & State Management
> Các Provider cung cấp global state cho toàn bộ ứng dụng.

| Tên Context | Đường dẫn | Giá trị cung cấp (Value) | Mô tả & Cách dùng |
|-------------|-----------|--------------------------|-------------------|
| `AuthContext` | `src/context/AuthContext.jsx` | `user`, `login(token, user)`, `logout()` | Quản lý trạng thái đăng nhập. Dùng hook `useAuth()` để lấy thông tin user hiện tại ở bất kỳ component nào. |
