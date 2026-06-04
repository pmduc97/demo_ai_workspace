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
   - Chấm điểm từng mục trong Checklist (Cấu trúc 20%, Golden Rules 30%, Độ bao phủ Viewpoint 50%).
   - Ghi nhận các lỗi (Findings) và phân loại mức độ:
     - **Critical**: Thiếu bảng Validation Inventory, thiếu ITa Checklist, gộp nhiều condition vào 1 TC (vi phạm Golden Rule), thiếu Happy Path.
     - **High**: Không tách bạch `[UI]` và `[API]`, không tách riêng Boundary test, thiếu SQL Setup Data, thiếu các Viewpoint cốt lõi (TV-01 đến TV-04).
     - **Medium**: Thiếu các Advanced Viewpoints (TV-07 đến TV-12), đánh số Step/Expected Result không khớp.
     - **Low**: Sai chính tả, format bảng chưa đẹp.

3. **Xuất Báo cáo Review (Output Format)**:
   - Trình bày kết quả review theo format sau:

```markdown
# Báo cáo Review Test Case ITa: [Tên file]

## 1. Điểm số: [X]/100

## 2. Chi tiết Checklist
- [x/ ] Cấu trúc & Format (20/20)
- [x/ ] Tuân thủ Golden Rules (30/30)
- [x/ ] Độ bao phủ Viewpoint & Dữ liệu (50/50)

## 3. Findings (Các vấn đề cần sửa)
- **[Critical]** ...
- **[High]** ...
- **[Medium]** ...

## 4. Kết luận (Verdict)
- **[PASS]** (Nếu điểm >= 80 và không có lỗi Critical/High)
- **[FAIL]** (Nếu điểm < 80 hoặc có lỗi Critical/High)
```
