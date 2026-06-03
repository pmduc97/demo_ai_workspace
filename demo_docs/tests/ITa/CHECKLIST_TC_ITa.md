# Checklist Đánh giá Test Case ITa

Sử dụng checklist này để review các file Test Case ITa được sinh ra, đảm bảo đạt chuẩn Enterprise.

## 1. Cấu trúc & Format (20%)
- [ ] File sử dụng đúng định dạng Markdown theo `TEMPLATE_ITa.md`.
- [ ] Có đầy đủ YAML frontmatter (id, name, target_screen, target_api, status).
- [ ] Các ID (TC ID, Data ID) được đánh số rõ ràng, không trùng lặp.

## 2. Dữ liệu Test (Test Data) (30%)
- [ ] **Setup Data (SQL):** Có câu lệnh `DELETE` để dọn dẹp data cũ (Teardown/Clean state).
- [ ] **Setup Data (SQL):** Có câu lệnh `INSERT` để tạo data nền cần thiết.
- [ ] **Input Data Sets:** Có ít nhất 1 bộ data hợp lệ (Happy Path).
- [ ] **Input Data Sets:** Có các bộ data không hợp lệ bao phủ các Viewpoint (Empty, Max Length, Invalid Format, v.v.).

## 3. Kịch bản Kiểm thử (Test Cases) (50%)
- [ ] **Design Coverage (FE):** Bao phủ đầy đủ 100% các trường dữ liệu, quy tắc validation (required, min/max, format, test biên) và các sự kiện (events) được mô tả trong tài liệu Screen Design.
- [ ] **Design Coverage (BE):** Bao phủ đầy đủ 100% các tham số request, các HTTP status code và error message được mô tả trong tài liệu API Design.
- [ ] **UI Validation:** Các case test lỗi FE không được gọi API. Map đúng với Input Data Sets.
- [ ] **Happy Path:** Mô tả rõ payload gửi đi, HTTP Status Code mong đợi (200/201), sự thay đổi trên UI và trạng thái DB sau khi gọi.
- [ ] **Negative Path:** Bao phủ các mã lỗi API (400/422, 401, 403, 404).
- [ ] **Security/Network:** Có ít nhất 1 case test XSS/SQLi hoặc Network Timeout/Offline (nếu áp dụng).
- [ ] **Cross-reference:** Mọi `TC ID` đều sử dụng đúng `Data ID` đã định nghĩa ở phần 3.
