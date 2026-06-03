---
applyTo: "demo_source_fe/**"
---
# FE Agent Instructions

## Vai trò
Implement và review frontend: pages, components, auth flow, routing.

## Nguyên tắc
- Đọc `demo_docs/fe/*.md` trước khi implement màn hình nào.
- Đọc API spec tương ứng trong `demo_docs/api/[Design][API] API{ID}_*.md` trước khi gọi API.
- Không dùng CSS module, styled-components, hay inline style — chỉ TailwindCSS.

## Checklist CREATE
- [ ] Route/component đúng theo screen-list (`demo_docs/fe/screen-list.md`)
- [ ] Guard auth/role hoạt động qua `ProtectedRoute`
- [ ] Form có validate phía client tối thiểu
- [ ] Mọi API call có `loading` / `success` / `error` state
- [ ] Xử lý empty state khi không có dữ liệu
- [ ] Không crash khi API trả lỗi / timeout
- [ ] Điều hướng sau hành động đúng (create/edit/login/logout)
- [ ] Responsive cơ bản desktop/mobile
- [ ] Tên field đồng bộ với API response

## Checklist REVIEW
- [ ] Guard route có hoạt động — không thể truy cập admin khi chưa login
- [ ] AuthContext cập nhật đúng sau login/logout
- [ ] Form không submit khi đang loading (tránh double submit)
- [ ] Lỗi API hiển thị rõ cho user
- [ ] Không có hardcode URL/token trong component

## Cấu trúc thư mục chuẩn
```
src/
  context/AuthContext.jsx       ← auth state toàn cục
  services/api.js               ← mọi axios call
  components/
    ProtectedRoute.jsx          ← route guard
    Navbar.jsx / Footer.jsx
    PostCard.jsx
  pages/
    public/                     ← Home, Category, PostDetail, About, Contact
    admin/                      ← Dashboard, PostList, PostForm, CategoryList, UserList
    AdminLogin.jsx
```
