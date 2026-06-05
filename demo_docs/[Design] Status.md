# Trạng Thái Tài Liệu Design (Status)

Tài liệu này theo dõi tiến độ chuẩn hóa và review các tài liệu thiết kế (FE Screens & BE APIs) theo chuẩn mới nhất (10 sections cho FE, 7 sections cho BE).

## 1. Frontend Screens (FE)

| Nhóm | Mã Màn Hình | Tên Màn Hình | Trạng Thái Implement | Trạng Thái Review | Ghi chú |
|------|-------------|--------------|----------------------|-------------------|---------|
| **1. Public** | `HOME` | Trang Chủ | 📝 Draft | ⏳ Pending | Cần update lên 10 sections |
| | `CATEGORY` | Danh Mục | 📝 Draft | ⏳ Pending | Cần update lên 10 sections |
| | `POST_DETAIL` | Chi Tiết Bài | 📝 Draft | ⏳ Pending | Cần update lên 10 sections |
| | `ABOUT` | Giới Thiệu | 📝 Draft | ⏳ Pending | Cần update lên 10 sections |
| | `CONTACT` | Liên Hệ | 📝 Draft | ⏳ Pending | Cần update lên 10 sections |
| **2. Auth** | `ADMIN_LOGIN` | Đăng Nhập | ✅ Stable | ✅ Pass | Đã chuẩn hóa 10 sections |
| **3. Admin Content** | `ADMIN_DASHBOARD` | Tổng Quan | 📝 Draft | ⏳ Pending | Cần update lên 10 sections |
| | `ADMIN_POST_LIST` | Danh Sách Bài | ✅ Stable | ✅ Pass | Đã chuẩn hóa 12 sections |
| | `ADMIN_POST_FORM` | Tạo/Sửa Bài | 📝 Draft | ⏳ Pending | Cần update lên 10 sections |
| **4. Admin Master** | `ADMIN_CATEGORY_LIST` | Quản Lý Danh Mục | ✅ Stable | ✅ Pass | Đã chuẩn hóa 10 sections |
| | `ADMIN_USER_LIST` | Quản Lý Người Dùng | ✅ Stable | ✅ Pass | Đã chuẩn hóa 10 sections |

---

## 2. Backend APIs (BE)

| Nhóm | Mã API | Tên API | Trạng Thái Implement | Trạng Thái Review | Ghi chú |
|------|--------|---------|----------------------|-------------------|---------|
| **1. Public** | `API04` | Posts_DanhSach | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API05` | Posts_ChiTiet | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| **2. Auth** | `API01` | Auth_DangNhap | ✅ Stable | ✅ Pass | Đã chuẩn hóa 7 sections |
| | `API02` | Auth_DangKy | ✅ Stable | ✅ Pass | Đã chuẩn hóa 7 sections |
| | `API03` | Auth_ThongTinUser | ✅ Stable | ✅ Pass | Đã chuẩn hóa 7 sections |
| **3. Admin Content** | `API06` | Posts_CuaToi | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API07` | Posts_TaoBai | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API08` | Posts_CapNhat | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API09` | Posts_Xoa | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API10` | AdminPosts_DanhSach | ✅ Stable | ✅ Pass | Đã chuẩn hóa 10 sections |
| | `API11` | AdminPosts_ChiTiet | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API12` | AdminPosts_DoiStatus | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API13` | AdminPosts_Xoa | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API21` | Upload_AnhBai | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API22` | AdminStats_ThongKe | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| **4. Admin Master** | `API14` | Categories_DanhSach | ✅ Stable | ✅ Pass | Đã chuẩn hóa 7 sections |
| | `API15` | Categories_ChiTiet | 📝 Draft | ⏳ Pending | Cần update lên 7 sections |
| | `API16` | Categories_Tao | ✅ Stable | ✅ Pass | Đã chuẩn hóa 7 sections |
| | `API17` | Categories_CapNhat | ✅ Stable | ✅ Pass | Đã chuẩn hóa 7 sections |
| | `API18` | Categories_Xoa | ✅ Stable | ✅ Pass | Đã chuẩn hóa 7 sections |
| | `API19` | AdminUsers_DanhSach | ✅ Stable | ✅ Pass | Đã chuẩn hóa 7 sections |
| | `API20` | AdminUsers_DoiRole | ✅ Stable | ✅ Pass | Đã chuẩn hóa 7 sections |

---

## 3. Database Schema

| Tài liệu | Trạng Thái Implement | Trạng Thái Review | Ghi chú |
|----------|----------------------|-------------------|---------|
| `DATABASE_Schema.md` | ✅ Stable | ✅ Pass | Đã chốt 3 bảng (users, categories, posts) |
