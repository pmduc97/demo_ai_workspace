# Checklist Đánh giá Test Case ITb (Scenario)

Sử dụng checklist này để review các file Test Case ITb được sinh ra, đảm bảo kịch bản luồng nghiệp vụ chặt chẽ và logic.

## 1. Cấu trúc & Format (20%)
- [ ] File sử dụng đúng định dạng Markdown theo `TEMPLATE_ITb.md`.
- [ ] Có đầy đủ YAML frontmatter (id, name, target_screens, target_apis, status).
- [ ] Các bước (Steps) được đánh số thứ tự rõ ràng, logic.

## 2. Dữ liệu Test & Luân chuyển (30%)
- [ ] **Setup Data (SQL):** Có câu lệnh `DELETE` và `INSERT` để chuẩn bị môi trường sạch trước khi chạy luồng.
- [ ] **Flow Data:** Định nghĩa rõ các biến dữ liệu luân chuyển (VD: `[post_id]`, `[token]`) được tạo ra ở bước nào và dùng lại ở bước nào.

## 3. Kịch bản Luồng (Scenario Steps) (50%)
- [ ] **Design Coverage (FE & BE):** Kịch bản bao phủ đầy đủ tất cả các màn hình, action chuyển trang, và API được liệt kê trong phần target_screens và target_apis.
- [ ] **Tính liên tục:** Các bước nối tiếp nhau hợp lý, tạo thành một luồng nghiệp vụ hoàn chỉnh (End-to-End).
- [ ] **Đa vai trò (Multi-Actor):** Kịch bản có sự tham gia của ít nhất 2 role khác nhau (VD: Admin và Guest) để kiểm tra phân quyền và hiển thị.
- [ ] **Xác minh trạng thái (State Verification):** Tại các bước quan trọng, có kiểm tra sự thay đổi trạng thái trong DB hoặc API response, không chỉ nhìn UI.
- [ ] **Bao phủ Viewpoint:** Kịch bản có bao phủ các yếu tố như Data Consistency (tạo xong phải thấy) và State Transition (đổi trạng thái thì UI đổi theo).
