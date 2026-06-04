---
name: doc-fe-review
description: "FE screen design doc review workflow for Blog Hoi An/Da Nang. Use when reviewing a frontend screen specification document for correctness, completeness, and format compliance. Produces a scored checklist (0-100) and PASS/FAIL release verdict. Trigger phrases: review screen doc, check doc format, validate screen spec, doc review, review design doc, kiểm tra tài liệu, review fe doc."
argument-hint: "ScreenCode hoặc đường dẫn file cần review (e.g. ADMIN_LOGIN, hoặc demo_docs/fe/[Design][SCREEN] HOME_TrangChu.md)"
---

# Doc FE Review Skill

## Mục tiêu
Review một FE screen design doc để đảm bảo đúng format, đủ nội dung, đồng bộ với API spec và code thực tế. Đầu ra là điểm số, danh sách findings, và verdict PASS/FAIL.

## Khi nào dùng
- Kiểm tra doc trước khi merge
- Review hàng loạt sau khi update format
- Validate doc mới vừa tạo bằng skill `doc-fe-implement`

## Procedure

### Bước 1 — Xác định file cần review
1. Tìm file trong `demo_docs/fe/[Design][SCREEN] {ScreenCode}_{ScreenName}.md`
2. Xem danh sách tại `demo_docs/fe/[Design][LIST] SCREEN_DanhSachManHinh.md` nếu không rõ tên file
3. Đọc file `demo_docs/fe/[Design][LIST] COMPONENT_DanhSach.md` để đối chiếu các component được sử dụng trong Section 4.
4. Đọc file `demo_docs/fe/[Design][LIST] UTILS_DanhSach.md` để đối chiếu các hàm logic được sử dụng trong Section 10.

### Bước 2 — Chạy checklist
Xem đầy đủ tại [review-checklist.md](./references/review-checklist.md).

Chia làm 4 nhóm:
- **F — Format** (tên file, frontmatter, Change Log, heading structure, đủ 12 sections)
- **C — Content** (12 sections + Change Log, nội dung từng section, Event ID nhất quán, Message List)
- **A — API Sync** (link đến API docs, Request/Response Mapping accuracy)
- **Q — Quality** (phong cách viết, Event ID nhất quán xuyên suốt, không để trống, không thừa nội dung cũ)

### Bước 3 — Tính điểm và chấm verdict

Xem thang điểm tại [scoring.md](./references/scoring.md).

- Tổng điểm tối đa: **100 điểm**
- **≥ 90**: ✅ PASS — Release được
- **75–89**: ⚠️ CONDITIONAL PASS — Release được nếu các finding Medium được ghi backlog
- **< 75**: ❌ FAIL — Phải fix trước khi release

### Bước 4 — Xuất báo cáo
Format chuẩn xem tại [report-template.md](./references/report-template.md).

## Output
```
## Doc Review: [ScreenCode]
File: demo_docs/fe/[Design][SCREEN] ...md
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
