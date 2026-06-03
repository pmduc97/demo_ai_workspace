# Report Template — Doc BE Review

## Format chuẩn

```markdown
## Doc Review: {API_Name}
File: `demo_docs/api/[Design][API] {API_ID}_{Group}_{Name}.md`
Reviewed: YYYY-MM-DD
Score: XX/100
Verdict: ✅ PASS | ⚠️ CONDITIONAL PASS | ❌ FAIL

---

### Checklist Results

| Nhóm | Điểm đạt | Tối đa | % |
|------|---------|--------|---|
| F — Format | X | 25 | X% |
| C — Content | X | 35 | X% |
| D — DB & Logic | X | 30 | X% |
| Q — Quality | X | 10 | X% |
| **Tổng** | **XX** | **100** | **XX%** |

---

### Findings

> Chỉ liệt kê các mục KHÔNG đạt. Nếu không có finding → ghi "Không có finding."

**[Critical]**
- {ID}: {Mô tả ngắn gọn vấn đề}

**[High]**
- {ID}: {Mô tả ngắn gọn vấn đề}

**[Medium]**
- {ID}: {Mô tả ngắn gọn vấn đề}

**[Low]**
- {ID}: {Mô tả ngắn gọn vấn đề}

---

### Summary

> 2–4 câu đánh giá tổng thể: điểm mạnh, điểm yếu chính, khuyến nghị.

---

### Action Items

| Mức | Mục | Deadline |
|-----|-----|---------|
| Must fix | ... | Trước release |
| Should fix | ... | Sprint tiếp theo |
| Nice to have | ... | Backlog |
```

## Ví dụ thực tế

```markdown
## Doc Review: API01_Auth_DangNhap
File: `demo_docs/api/[Design][API] API01_Auth_DangNhap.md`
Reviewed: 2026-06-03
Score: 88/100
Verdict: ⚠️ CONDITIONAL PASS

---

### Checklist Results

| Nhóm | Điểm đạt | Tối đa | % |
|------|---------|--------|---|
| F — Format | 25 | 25 | 100% |
| C — Content | 31 | 35 | 88% |
| D — DB & Logic | 22 | 30 | 73% |
| Q — Quality | 10 | 10 | 100% |
| **Tổng** | **88** | **100** | **88%** |

---

### Findings

**[Critical]**
Không có.

**[High]**
- D4: Section 5 có nhắc đến `[Q2]` (update last_login) nhưng Section 6 không có định nghĩa cho `[Q2]`.

**[Medium]**
- C5: Section 7 (Side Effects) đang để trống hoàn toàn thay vì ghi "Không có".

**[Low]**
Không có.

---

### Summary

Tài liệu API01_Auth_DangNhap có cấu trúc tốt, định nghĩa Request/Response rõ ràng. Tuy nhiên, phần Database Mapping đang bị thiếu sót (thiếu định nghĩa Q2) dẫn đến rủi ro BE Dev code thiếu logic update last_login. Cần bổ sung Q2 vào Section 6 trước khi release.

---

### Action Items

| Mức | Mục | Deadline |
|-----|-----|---------|
| Must fix | D4: Bổ sung định nghĩa `[Q2]` vào bảng Section 6 | Trước release |
| Should fix | C5: Ghi rõ "Không có" vào Section 7 | Sprint tiếp theo |
```
