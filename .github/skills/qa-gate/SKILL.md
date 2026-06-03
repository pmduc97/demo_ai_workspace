---
name: qa-gate
description: "QA gate verification workflow for Blog Hoi An/Da Nang. Use when running final cross-domain check before merging, verifying all flows work end-to-end, checking docs sync, producing PASS/FAIL verdict. Trigger phrases: QA gate, final check, ready to merge, smoke test, end-to-end verify, check all flows, docs sync."
argument-hint: "Scope to verify: all | public | auth | admin | upload | docs"
---

# QA Gate Skill

## Mục tiêu
Cross-domain verification và đưa ra verdict PASS/FAIL trước khi chốt vòng phát triển.

## Khi nào dùng
- Cuối mỗi vòng phát triển trước khi merge
- Sau khi implement xong nhiều domain (BE + FE + test)
- Khi cần xác nhận docs còn khớp với code thực tế

## Gate Rules (không ngoại lệ)

| Severity | Quy tắc |
|----------|---------|
| Critical | FAIL — bắt buộc fix trước |
| High | FAIL — bắt buộc fix trước |
| Medium | Tạm pass nếu không ảnh hưởng luồng chính — ghi backlog |
| Low | Defer — ghi backlog |

## Procedure

### Bước 1 — Đọc PROJECT_MANIFEST.yml
Xác định các features đang ở `cycle_checkpoint` cần verify. Không scan repo từ đầu.

### Bước 2 — Verify BE contracts
Đọc các file trong `demo_docs/api/` và so sánh với code thực tế trong `demo_source_be/src/`:
- Method/path/status code có khớp?
- Response fields có đủ/không thừa?
- Auth/role guard có đúng?

### Bước 3 — Verify FE flows
Đọc các file trong `demo_docs/fe/` và so sánh với code trong `demo_source_fe/src/`:
- Route có đầy đủ?
- ProtectedRoute có wrap đúng admin routes?
- API call có xử lý loading/error/empty?

### Bước 4 — Chạy checklist đầy đủ
Xem đầy đủ tại [qa-checklist](./references/qa-checklist.md).

Checklist nhanh:
- [ ] Public flow: Home, Category, Post Detail, About, Contact render được
- [ ] Auth flow: Register, Login, /api/auth/me, Logout hoạt động đúng
- [ ] Member flow: Tạo/sửa bài của mình, 403 khi sửa bài người khác
- [ ] Admin flow: Dashboard stats, publish bài, CRUD categories, list/đổi role users
- [ ] Upload flow: Upload ảnh → URL hợp lệ, render được trong bài
- [ ] Playwright tests (ITa/ITb) chạy PASS 100%

### Bước 5 — Docs sync check
- Mọi endpoint trong code có file docs tương ứng?
- Response shape trong docs khớp với controller thực tế?

### Bước 6 — Xuất verdict

```
QA Gate: PASS | FAIL
---
Critical: (none) | [list]
High: (none) | [list]
Medium: [list]
Low: [list]
Residual risks: [list]
Recommendation: PASS sẵn sàng merge | FAIL cần fix [...]
```

## Output
Verdict cuối cùng theo format trên. Nếu FAIL, liệt kê rõ từng finding để agent tương ứng (be-agent/fe-agent) fix.

> ⚠️ QA Gate là read-only — KHÔNG tự sửa code. Báo cáo findings cho Orchestrator.
