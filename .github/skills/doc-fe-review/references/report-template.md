# Report Template — Doc FE Review

## Format chuẩn

```markdown
## Doc Review: {ScreenCode}
File: `demo_docs/fe/[Design][SCREEN] {ScreenCode}_{ScreenName}.md`
Reviewed: YYYY-MM-DD
Score: XX/100
Verdict: ✅ PASS | ⚠️ CONDITIONAL PASS | ❌ FAIL

---

### Checklist Results

| Nhóm | Điểm đạt | Tối đa | % |
|------|---------|--------|---|
| F — Format | X | 25 | X% |
| C — Content | X | 45 | X% |
| A — API Sync | X | 20 | X% |
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
## Doc Review: ADMIN_LOGIN
File: `demo_docs/fe/[Design][SCREEN] ADMIN_LOGIN_DangNhap.md`
Reviewed: 2026-06-03
Score: 94/100
Verdict: ✅ PASS

---

### Checklist Results

| Nhóm | Điểm đạt | Tối đa | % |
|------|---------|--------|---|
| F — Format | 25 | 25 | 100% |
| C — Content | 42 | 45 | 93% |
| A — API Sync | 17 | 20 | 85% |
| Q — Quality | 10 | 10 | 100% |
| **Tổng** | **94** | **100** | **94%** |

---

### Findings

**[Critical]**
Không có.

**[High]**
Không có.

**[Medium]**
- C3: Bảng "Đi đến đâu" chỉ có 2 rows, thiếu case redirect khi token hết hạn.

**[Low]**
- A4: Response shape chưa mô tả trường hợp 422 validation error.

---

### Summary

Doc ADMIN_LOGIN đạt format chuẩn, đủ 9 sections, API link chính xác. Điểm trừ nhỏ ở navigation và response shape. Không có finding Critical/High — sẵn sàng release.

---

### Action Items

| Mức | Mục | Deadline |
|-----|-----|---------|
| Should fix | C3: Thêm case token hết hạn vào Navigation | Sprint tiếp theo |
| Nice to have | A4: Bổ sung 422 response | Backlog |
```
