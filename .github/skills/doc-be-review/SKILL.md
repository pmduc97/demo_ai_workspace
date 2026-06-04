---
name: doc-be-review
description: "BE API design doc review workflow for Blog Du Lịch. Use when reviewing a backend API specification document for correctness, completeness, and format compliance. Produces a scored checklist (0-100) and PASS/FAIL release verdict. Trigger phrases: review api doc, check api format, validate api spec, doc review, review be design doc, kiểm tra tài liệu api."
argument-hint: "Tên file API cần review (e.g. API01_Auth_DangNhap, hoặc demo_docs/api/[Design][API] API01_Auth_DangNhap.md)"
---

# Doc BE Review Skill

## Mục tiêu
Review một BE API design doc để đảm bảo đúng format 10 sections + Change Log, đủ nội dung, Validation Rules có ID, Sequence Diagram cho luồng phức tạp, và đặc biệt là logic xử lý map chính xác với Database thông qua Query IDs. Đầu ra là điểm số, danh sách findings, và verdict PASS/FAIL.

## Khi nào dùng
- Kiểm tra doc API trước khi merge.
- Review hàng loạt sau khi update format.
- Validate doc mới vừa tạo bằng skill `doc-be-implement`.

## Procedure

### Bước 1 — Xác định file cần review
1. Tìm file trong `demo_docs/api/[Design][API] API{ID}_{Group}_{Name}.md`.
2. Xem danh sách tại `demo_docs/api/[Design][LIST] API_DanhSachEndpoint.md` nếu không rõ tên file.
3. Đọc file `demo_docs/api/[Design][LIST] UTILS_DanhSach.md` để đối chiếu các hàm logic và middlewares được sử dụng trong Section 5.

### Bước 2 — Chạy checklist
Xem đầy đủ tại [review-checklist.md](./references/review-checklist.md).

Chia làm 4 nhóm:
- **F — Format** (tên file, frontmatter, Change Log, heading structure, đủ 10 sections).
- **C — Content** (thông tin chung + DB liên quan, request 7 cột, validation rules V-xx, response + Error Code, sequence diagram, message list).
- **D — Database & Logic Sync** (logic step-by-step, Query IDs mapping, Knex.js snippet, Điều kiện OK/NG, Data Mapping).
- **Q — Quality** (phong cách viết, Error Code nhất quán giữa Section 4 và 9, không để trống, không thừa nội dung cũ).

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
## Doc Review: [API_Name]
File: demo_docs/api/[Design][API] ...md
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
