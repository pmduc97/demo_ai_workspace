# Báo cáo Kết quả Automation Test ITa: Quản lý danh mục (Smoke Test)

## 1. Tổng quan
- **Tính năng:** Quản lý danh mục (admin_categories)
- **Ngày chạy:** 2026-06-05
- **Tổng số Test Cases đã chạy:** 3
- **Kết quả:** 2 PASS / 1 FAIL
- **Verdict:** FAIL

## 2. Environment Gate
- **FE URL:** `http://localhost:5173/` - PASS
- **BE URL:** `http://localhost:3000/api/categories` - PASS

## 3. Smoke Test Results
| TC ID | Tên Test Case | Kết quả |
|-------|---------------|---------|
| `TC_PER_01` | Truy cập trang quản lý danh mục với role member | FAIL |
| `TC_HP_04` | Tìm kiếm, lọc, sắp xếp và phân trang danh sách | PASS |
| `TC_HP_01` | Tạo danh mục thành công với đầy đủ thông tin | PASS |

## 4. Lỗi Test Code đã tự fix
- Đã sửa locator text từ "Bạn không có quyền truy cập" thành "Bạn không có quyền quản lý danh mục" theo đúng tài liệu thiết kế.

## 5. Bug App phát hiện được
**Bug 1: Thiếu thông báo lỗi khi truy cập sai quyền (TC_PER_01)**
- **Mô tả:** Khi user có role `member` truy cập vào `/admin/categories`, hệ thống redirect về trang chủ `/` nhưng không hiển thị toast thông báo lỗi "Bạn không có quyền quản lý danh mục" như thiết kế.
- **Root Cause:** Lỗi UI. Component `ProtectedRoute.jsx` chỉ thực hiện `<Navigate to="/" replace />` mà không gọi hàm hiển thị toast.
- **Viewpoint vi phạm:** TV-04 (Negative Path & Error Handling).
