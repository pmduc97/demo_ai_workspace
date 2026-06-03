---
name: qa-gate
description: "QA gate verification workflow for Blog Hoi An/Da Nang. Use when running final cross-domain check before merging, verifying all flows work end-to-end, checking docs sync, producing PASS/FAIL verdict. Trigger phrases: QA gate, final check, ready to merge, smoke test, end-to-end verify, check all flows, docs sync."
argument-hint: "Scope to verify: all | public | auth | admin | upload | docs"
---

# QA Gate Skill

## Muc tieu
Cross-domain verification va dua ra verdict PASS/FAIL truoc khi chot vong phat trien.

## Khi nao dung
- Cuoi moi vong phat trien truoc khi merge
- Sau khi implement xong nhieu domain (BE + FE + test)
- Khi can xac nhan docs con khop voi code thuc te

## Gate Rules (khong ngoai le)

| Severity | Quy tac |
|----------|---------|
| Critical | FAIL — bat buoc fix truoc |
| High | FAIL — bat buoc fix truoc |
| Medium | Tam pass neu khong anh huong luong chinh — ghi backlog |
| Low | Defer — ghi backlog |

## Procedure

### Buoc 1 — Verify BE contracts
Doc cac file trong `demo_docs/api/` va so sanh voi code thuc te trong `demo_source_be/src/`:
- Method/path/status code co khop?
- Response fields co du/khong thua?
- Auth/role guard co dung?

### Buoc 2 — Verify FE flows
Doc cac file trong `demo_docs/fe/` va so sanh voi code trong `demo_source_fe/src/`:
- Route co day du?
- ProtectedRoute co wrap dung admin routes?
- API call co xu ly loading/error/empty?

### Buoc 3 — Checklist dau y

Xem day du tai [qa-checklist](./references/qa-checklist.md).

### Buoc 4 — Docs sync check
- Moi endpoint trong code co file docs tuong ung?
- Response shape trong docs khop voi controller thuc te?

### Buoc 5 — Xuat verdict

```
QA Gate: PASS | FAIL
---
Critical: (none) | [list]
High: (none) | [list]
Medium: [list]
Low: [list]
Residual risks: [list]
Recommendation: PASS san sang merge | FAIL can fix [...]
```

## Output
Verdict cuoi cung theo format tren. Neu FAIL, liet ke ro tung finding de agent tuong ung (be-agent/fe-agent) fix.
