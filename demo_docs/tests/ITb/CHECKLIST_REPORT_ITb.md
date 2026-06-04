# Checklist Báo cáo Kết quả Kiểm thử ITb (Test Report)

Sử dụng checklist này để đánh giá chất lượng của một Test Report sau khi thực thi các Test Case ITb (bằng tay hoặc qua Playwright).

## 1. Thông tin chung & Môi trường (Meta Data)
- [ ] Ghi rõ ngày thực hiện, người/hệ thống thực hiện (VD: Playwright Bot).
- [ ] Ghi rõ môi trường test (URL, Branch, Commit Hash, DB Version).
- [ ] Ghi rõ ID của Test Case ITb được thực thi.
- [ ] **Xác nhận Setup:** Đã chạy thành công các câu lệnh SQL Setup Data trước khi test.

## 2. Kết quả Tổng quan & Thống kê (Summary)
- [ ] Tổng số Test Cases (theo Pattern) đã chạy.
- [ ] Trạng thái luồng: PASS (hoàn thành toàn bộ) / FAIL (đứt gãy ở bước nào).
- [ ] **Thống kê theo Pattern:** Phân tích lỗi tập trung nhiều nhất ở Pattern nào (VD: `HP`, `CONC`, `ISO`) để rút kinh nghiệm.

## 3. Chi tiết Lỗi (Defect Details) - Bắt buộc nếu có FAIL
- [ ] Ghi rõ `TC ID` và `Step ID` bị fail làm đứt gãy luồng.
- [ ] **DB Matrix Verification:** Nếu lỗi liên quan đến dữ liệu, phải đối chiếu với `DB Confirmation Matrix` xem sai ở Table/Column nào.
- [ ] **Expected vs Actual:** Mô tả rõ kết quả mong đợi và kết quả thực tế tại bước đó.
- [ ] **Evidence:** Có đính kèm Screenshot, Video record, hoặc Terminal Log tại thời điểm đứt gãy.
- [ ] **State Dump:** Có log trạng thái DB hoặc Flow Data (các biến luân chuyển) ngay trước khi fail để dễ debug.
- [ ] Đánh giá mức độ nghiêm trọng (Severity: Critical - Luồng chính bị chặn hoàn toàn).

## 4. Kết luận (Verdict)
- [ ] Đưa ra quyết định cuối cùng: PASS (Luồng chạy trơn tru) hay FAIL (Luồng bị đứt gãy).
