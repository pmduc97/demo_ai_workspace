---
name: doc-workflow-review
description: "Workflow review tài liệu Workflow Design. Sử dụng để kiểm tra tính hợp lý của luồng nghiệp vụ, phát hiện các dead-end, thiếu sót rẽ nhánh hoặc mâu thuẫn với tài liệu FE/BE. Trigger phrases: review workflow, kiểm tra luồng nghiệp vụ."
argument-hint: "Đường dẫn file Workflow cần review"
---

# Skill: doc-workflow-review

## Mục đích
Đánh giá chất lượng của tài liệu Workflow Design, đảm bảo luồng nghiệp vụ logic, chặt chẽ, không có ngõ cụt (dead-end) và sẵn sàng làm đầu vào cho việc tạo Test Case ITb.

## Tiêu chí Review (Checklist)

1. **Format & Cấu trúc (20%)**
   - Có đủ 7 sections theo `TEMPLATE_WORKFLOW.md` không?
   - Có YAML frontmatter và Change Log không?

2. **Tính Logic của Main Flow (30%)**
   - Các bước có liên kết chặt chẽ với nhau không?
   - Có mapping đúng với các API/Screen đã thiết kế không?
   - Pre-conditions và Post-conditions có hợp lý không?

3. **Sơ đồ Mermaid (20%)**
   - Sơ đồ có khớp 100% với các bước mô tả trong Main Flow không?
   - Syntax Mermaid có hợp lệ không?

4. **Bao phủ rẽ nhánh & Ngoại lệ (30%)**
   - Có bỏ sót Alternative Flow nào hiển nhiên không?
   - Các Exception Flows có chỉ rõ Message ID hoặc cách xử lý của hệ thống không?
   - Có bước nào dẫn đến "dead-end" (người dùng không biết làm gì tiếp theo) không?

## Output Format
Xuất báo cáo ra màn hình chat:
```
## Doc Review: [Tên Workflow]
File: demo_docs/workflow/...
Score: XX/100
Verdict: ✅ PASS | ⚠️ CONDITIONAL PASS | ❌ FAIL

### Findings
[Critical] ...
[High] ...
[Medium] ...
[Low] ...

### Summary
...
```
