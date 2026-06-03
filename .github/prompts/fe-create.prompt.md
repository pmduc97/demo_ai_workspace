---
mode: agent
description: Implement một màn hình FE theo screen specagent: fe-agent
tools: [read, edit, search]---
# FE Create — Implement Frontend Screen

## Yêu cầu đầu vào
Hãy cho biết:
1. Tên màn hình cần implement (ví dụ: HOME, CATEGORY, ADMIN_POST_FORM)
2. File spec tương ứng trong `demo_docs/fe/`

## Quy trình thực hiện

Trước khi viết code, hãy:
1. Đọc file spec màn hình trong `demo_docs/fe/<SCREEN>.md`
2. Đọc API spec liên quan trong `demo_docs/api/`
3. Đọc `src/services/api.js` để tái dùng hàm đã có
4. Đọc `src/context/AuthContext.jsx` để lấy auth state đúng cách

Sau đó implement theo checklist:
- Route/component đúng theo `demo_docs/fe/screen-list.md`
- Guard auth/role qua `ProtectedRoute` (admin routes)
- Form có validate phía client tối thiểu
- Mọi API call có `loading` / `success` / `error` state
- Xử lý empty state khi list rỗng
- Responsive cơ bản desktop/mobile
- Chỉ dùng TailwindCSS — không dùng inline style

## Output mong đợi
- Danh sách file tạo/sửa
- Route map nếu thêm route mới
- Cách verify thủ công (bước click kiểm tra)
