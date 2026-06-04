# Checklist Báo cáo Kết quả Kiểm thử ITa (Test Report)

Sử dụng checklist này để đánh giá chất lượng của một Test Report sau khi thực thi các Test Case ITa (bằng tay hoặc qua Playwright).

## 1. Thông tin chung & Môi trường (Meta Data)
- [ ] Ghi rõ ngày thực hiện, người/hệ thống thực hiện (VD: Playwright Bot).
- [ ] Ghi rõ môi trường test (URL, Branch, Commit Hash, DB Version).
- [ ] Ghi rõ ID của Test Case ITa được thực thi.
- [ ] **Xác nhận Test Data:** Đã chạy thành công các câu lệnh SQL Setup/Teardown trước khi test để đảm bảo môi trường "sạch".

## 2. Kết quả Tổng quan & Thống kê (Summary)
- [ ] Tổng số Test Cases đã chạy.
- [ ] Số lượng PASS / FAIL / SKIPPED.
- [ ] Tỉ lệ Pass Rate (%).
- [ ] **Thống kê theo Viewpoint:** Phân tích lỗi tập trung nhiều nhất ở Viewpoint nào (VD: TV-02 Validation, TV-12 Concurrency) để rút kinh nghiệm.

## 3. Chi tiết Lỗi (Defect Details) - Bắt buộc nếu có FAIL
- [ ] Ghi rõ `TC ID` bị fail.
- [ ] **Phân loại Bug (UI vs API):** Xác định rõ bug thuộc về `[UI]` (lỗi hiển thị, FE không chặn lỗi) hay `[API]` (BE lưu sai, logic sai, status code sai) để assign đúng Dev.
- [ ] **Expected vs Actual:** Mô tả rõ kết quả mong đợi và kết quả thực tế.
- [ ] **Evidence:** Có đính kèm Screenshot, Video record, hoặc Terminal Log.
- [ ] **API/DB Log:** Có log payload request, response body, hoặc trạng thái DB lúc xảy ra lỗi.
- [ ] Đánh giá mức độ nghiêm trọng (Severity: Critical, High, Medium, Low).

## 4. Kết luận (Verdict)
- [ ] Đưa ra quyết định cuối cùng: PASS (Đủ điều kiện release) hay FAIL (Cần fix bug và re-test).
