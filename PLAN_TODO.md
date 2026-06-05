# Kế Hoạch Refactor Common UI cho Admin Master Pages

Mục tiêu: Giảm thiểu code lặp lại (boilerplate), tăng tính nhất quán UI/UX và dễ bảo trì cho các trang danh sách trong Admin (User, Category, Post).

## Giai đoạn 1: Xây dựng các thành phần Common (Core)

- [x] **1. Tạo Custom Hook: `useMasterData`**
  - File: `demo_source_fe/src/hooks/useMasterData.js`
  - Nhiệm vụ: Quản lý toàn bộ state vòng đời của một trang danh sách (data, loading, error, pagination, filters, sort, selectedIds).
  - Hàm trả về: `fetchData`, `handlePageChange`, `handleFilterChange`, `handleSortChange`, `handleSelectRow`, `handleSelectAll`, `clearSelection`.

- [x] **2. Tạo Component: `DataTable`**
  - File: `demo_source_fe/src/components/ui/DataTable.jsx`
  - Nhiệm vụ: Render bảng dữ liệu động dựa trên cấu hình cột.
  - Tính năng: Tự động render Header (có sort), Checkbox chọn nhiều dòng, Skeleton loading, Empty State.

- [x] **3. Tạo Component: `DataToolbar`**
  - File: `demo_source_fe/src/components/ui/DataToolbar.jsx`
  - Nhiệm vụ: Khu vực chứa công cụ tìm kiếm, lọc và thao tác hàng loạt.
  - Tính năng: Ô Search text, các nút Bulk Actions (hiện ra khi có dòng được chọn), Dropdown filters.

- [x] **4. Tạo Component: `AdminPageLayout`**
  - File: `demo_source_fe/src/components/layout/AdminPageLayout.jsx`
  - Nhiệm vụ: Chuẩn hóa bố cục chung của một trang Admin (Header -> Toolbar -> Table -> Pagination).

## Giai đoạn 2: Refactor các trang hiện tại

- [x] **1. Refactor `UserListPage.jsx`**
  - File: `demo_source_fe/src/pages/admin/UserListPage.jsx`
  - Áp dụng `useMasterData`, `AdminPageLayout`, `DataToolbar`, `DataTable`.
  - Định nghĩa `userColumns`.

- [x] **2. Refactor `CategoryListPage.jsx`**
  - File: `demo_source_fe/src/pages/admin/CategoryListPage.jsx`
  - Áp dụng các component common.
  - Định nghĩa `categoryColumns`.

- [x] **3. Refactor `PostListPage.jsx`**
  - File: `demo_source_fe/src/pages/admin/PostListPage.jsx`
  - Áp dụng các component common.
  - Định nghĩa `postColumns`.

## Giai đoạn 3: Kiểm thử (QA)
- [ ] Kiểm tra phân trang, tìm kiếm, lọc, sắp xếp trên cả 3 trang.
- [ ] Kiểm tra tính năng chọn nhiều dòng (Bulk selection) và thao tác hàng loạt.
- [ ] Đảm bảo UI responsive.