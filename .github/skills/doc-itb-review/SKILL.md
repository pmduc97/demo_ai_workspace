---
name: doc-itb-review
description: "Workflow review tài liệu Test Case ITb. Sử dụng khi cần đánh giá, chấm điểm và kiểm tra tính liên tục của kịch bản luồng ITb. Trigger phrases: review test case itb, chấm điểm doc itb."
argument-hint: "Đường dẫn file Test Case ITb cần review"
---

# Skill: doc-itb-review

## Mục đích
Review và chấm điểm tài liệu Test Case ITb (Scenario Integration) dựa trên Checklist chuẩn của dự án. Đảm bảo kịch bản luồng nghiệp vụ chặt chẽ, logic, không bị đứt gãy dữ liệu và có thể dùng để tự động hóa (E2E Playwright).

## Khi nào sử dụng
- Khi user yêu cầu review một file Test Case ITb.
- Khi user gõ lệnh `/doc-itb-review`.

## Hướng dẫn thực hiện (Workflow)
1. **Thu thập thông tin**:
   - Đọc file Test Case ITb cần review.
   - Đọc file `demo_docs/tests/ITb/CHECKLIST_TC_ITb.md` để lấy tiêu chí đánh giá.
   - Đọc file `demo_docs/tests/ITb/VIEWPOINT_ITb.md` để đối chiếu độ bao phủ luồng.

2. **Đánh giá theo Checklist**:
   - Chấm điểm từng mục trong Checklist (Cấu trúc 20%, Dữ liệu Test & Luân chuyển 30%, Kịch bản Luồng 50%).
   - Ghi nhận các lỗi (Findings) và phân loại mức độ:
     - **Critical**: Sai format hoàn toàn, thiếu SQL Setup Data, luồng bị đứt gãy (dữ liệu bước trước không truyền được sang bước sau).
     - **High**: Thiếu kiểm tra trạng thái (State Verification) ở các bước quan trọng, kịch bản chỉ có 1 role (thiếu Multi-Actor).
     - **Medium**: Thiếu Flow Data table, các bước mô tả hành động không rõ ràng.
     - **Low**: Sai chính tả, format bảng chưa đẹp.

3. **Xuất Báo cáo Review (Output Format)**:
   - Trình bày kết quả review theo format sau:

```markdown
# Báo cáo Review Test Case ITb: [Tên file]

## 1. Điểm số: [X]/100

## 2. Chi tiết Checklist
- [x/ ] Cấu trúc & Format (20/20)
- [x/ ] Dữ liệu Test & Luân chuyển (30/30)
- [x/ ] Kịch bản Luồng (Scenario Steps) (50/50)

## 3. Findings (Các vấn đề cần sửa)
- **[Critical]** ...
- **[High]** ...
- **[Medium]** ...

## 4. Kết luận (Verdict)
- **[PASS]** (Nếu điểm >= 80 và không có lỗi Critical/High)
- **[FAIL]** (Nếu điểm < 80 hoặc có lỗi Critical/High)
```
