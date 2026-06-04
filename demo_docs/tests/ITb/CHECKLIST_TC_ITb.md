# Checklist Đánh giá Test Case ITb (Scenario)

Sử dụng checklist này để review các file Test Case ITb được sinh ra, đảm bảo kịch bản luồng nghiệp vụ chặt chẽ, logic và đạt chuẩn Enterprise (9 Pattern Taxonomy).

## 1. Cấu trúc & Format (20%)
- [ ] File sử dụng đúng định dạng Markdown theo `TEMPLATE_ITb.md`.
- [ ] Có đầy đủ YAML frontmatter (id, name, target_screens, target_apis, status).
- [ ] **Bắt buộc:** Có sơ đồ luồng `Mermaid Flowchart` trực quan.
- [ ] **Bắt buộc:** Có bảng `DB Confirmation Matrix` để verify dữ liệu.
- [ ] **Bắt buộc:** Có bảng `ITb Checklist` tóm tắt các TC theo Pattern.

## 2. Tuân thủ Nguyên tắc cốt lõi (30%)
- [ ] **Anti-pattern Check:** Mọi TC ITb phải đi qua **>= 2 nodes** (2 màn hình hoặc 2 role). Không có TC nào chỉ test 1 màn hình rồi dừng (đó là ITa).
- [ ] **Đánh số Step:** Procedure và Expected Result trong bảng TC Detail phải được đánh số tương ứng (1-1).
- [ ] **Độ dài TC:** Mỗi TC có độ dài hợp lý (5-10 steps). Nếu quá dài đã được cắt thành các segment.
- [ ] **Flow Data:** Định nghĩa rõ các biến dữ liệu luân chuyển (VD: `[post_id]`) được tạo ra ở bước nào và dùng lại ở bước nào.

## 3. Độ bao phủ 9 Pattern Taxonomy (50%)
- [ ] **Setup Data:** Có câu lệnh SQL `DELETE` và `INSERT` hợp lệ để chuẩn bị môi trường sạch.
- [ ] **Happy Path (`HP`):** Có TC cho luồng chuẩn thành công xuyên màn hình.
- [ ] **Alternative Branch (`ALT`):** Có TC cho các luồng rẽ nhánh hợp lệ (VD: Từ chối duyệt).
- [ ] **Data State & Dependency (`PRE-MISS`, `DEL-CASC`, `STATE-VIO`):** Có TC kiểm tra việc thiếu dữ liệu tiền quyết, hiệu ứng xóa dây chuyền, và vi phạm vòng đời trạng thái.
- [ ] **Concurrency & Isolation (`CONC`, `ISO`):** Có TC kiểm tra tranh chấp dữ liệu (2 người cùng sửa) và cô lập dữ liệu (Role A không thấy data của Role B).
- [ ] **System Failure (`IDEM`, `PIPE-INT`):** Có TC kiểm tra tính lũy đẳng (double-click) và đứt gãy luồng (hết session).
