# Checklist Đánh giá Test Case ITa

Sử dụng checklist này để review các file Test Case ITa được sinh ra, đảm bảo đạt chuẩn Enterprise (12 Viewpoints + Golden Rules).

## 1. Cấu trúc & Format (20%)
- [ ] File sử dụng đúng định dạng Markdown theo `TEMPLATE_ITa.md`.
- [ ] Có đầy đủ YAML frontmatter (id, name, target_screen, target_api, status).
- [ ] **Bắt buộc:** Có bảng `Validation Field Inventory` liệt kê đủ các trường.
- [ ] **Bắt buộc:** Có bảng `ITa Checklist` tóm tắt các TC.
- [ ] Bảng `TC Detail` sử dụng đúng format 6 cột (TC ID, Viewpoint, Test Target, Precondition, Procedure, Expected Result).

## 2. Tuân thủ Golden Rules (30%)
- [ ] **Tách bạch UI/API:** Các step kiểm tra UI và API được phân định rõ ràng bằng prefix `[UI]` và `[API]`.
- [ ] **1 Condition = 1 TC:** Không gộp nhiều lỗi validation vào cùng 1 TC.
- [ ] **Tách Boundary:** Giá trị biên hợp lệ (exact-max) và không hợp lệ (over-max) được tách thành 2 TC riêng biệt.
- [ ] **Đánh số Step:** Procedure và Expected Result được đánh số tương ứng (1., 2., 3...).
- [ ] **Thứ tự TC:** Tuân thủ luồng: Validate -> Happy Path -> Permission -> Pagination -> Error.

## 3. Độ bao phủ Viewpoint & Dữ liệu (50%)
- [ ] **Setup Data:** Có câu lệnh SQL `DELETE` (Teardown) và `INSERT` (Setup) hợp lệ.
- [ ] **Input Data Sets:** Các bộ data bao phủ đủ các trường hợp (Valid, Empty, Max Length, Invalid Format).
- [ ] **Design Coverage (TV-01, TV-02):** Bao phủ 100% các trường dữ liệu, quy tắc validation (FE) và tham số request, status code (BE).
- [ ] **Happy & Negative Path (TV-03, TV-04):** Có TC cho luồng thành công (200/201) và luồng lỗi logic từ server (400, 401, 403, 404).
- [ ] **Advanced Viewpoints (TV-07 -> TV-12):** Có TC bao phủ các trường hợp: Trạng thái khởi tạo (Empty state), Phân trang/Lọc, Validate tương quan, Chống Double-click, Upload file (nếu có), và Xử lý đồng thời (Concurrency).
