---
name: doc-ita-review
description: "Workflow review tài liệu Test Case ITa. Sử dụng khi cần đánh giá, chấm điểm và kiểm tra độ bao phủ của file Test Case ITa so với tài liệu thiết kế. Trigger phrases: review test case ita, chấm điểm doc ita."
argument-hint: "Đường dẫn file Test Case ITa cần review"
---

# Skill: doc-ita-review

## Mục đích
Review và chấm điểm tài liệu Test Case ITa (Functional Integration) dựa trên Checklist chuẩn của dự án. Đảm bảo Test Case đủ độ bao phủ, đúng format và có thể dùng để tự động hóa (Data-Driven).

## Khi nào sử dụng
- Khi user yêu cầu review một file Test Case ITa.
- Khi user gõ lệnh `/doc-ita-review`.

## Hướng dẫn thực hiện (Workflow)
1. **Thu thập thông tin**:
   - Đọc file Test Case ITa cần review.
   - Đọc file `demo_docs/tests/ITa/CHECKLIST_TC_ITa.md` để lấy tiêu chí đánh giá.
   - Đọc file `demo_docs/tests/ITa/VIEWPOINT_ITa.md` để đối chiếu độ bao phủ.

2. **Đánh giá theo Checklist**:
   - Chấm điểm từng mục trong Checklist (Cấu trúc 20%, Test Data 30%, Test Cases 50%).
   - Ghi nhận các lỗi (Findings) và phân loại mức độ:
     - **Critical**: Sai format hoàn toàn, thiếu SQL Setup Data, thiếu Happy Path.
     - **High**: Thiếu Input Data Sets cho các Viewpoint quan trọng, UI Validation lại gọi API, Negative Path thiếu mã lỗi quan trọng.
     - **Medium**: Thiếu test case Security/Network, ID không đồng nhất.
     - **Low**: Sai chính tả, format bảng chưa đẹp.

3. **Xuất Báo cáo Review (Output Format)**:
   - Trình bày kết quả review theo format sau:

```markdown
# Báo cáo Review Test Case ITa: [Tên file]

## 1. Điểm số: [X]/100

## 2. Chi tiết Checklist
- [x/ ] Cấu trúc & Format (20/20)
- [x/ ] Dữ liệu Test (Test Data) (30/30)
- [x/ ] Kịch bản Kiểm thử (Test Cases) (50/50)

## 3. Findings (Các vấn đề cần sửa)
- **[Critical]** ...
- **[High]** ...
- **[Medium]** ...

## 4. Kết luận (Verdict)
- **[PASS]** (Nếu điểm >= 80 và không có lỗi Critical/High)
- **[FAIL]** (Nếu điểm < 80 hoặc có lỗi Critical/High)
```
