---
mode: agent
description: QA Gate — kiem tra toan bo truoc khi chot vong phat trien
agent: qa-agent
tools: [read, search]
---
# QA Gate — Final Verification

## Quy trinh

Kiem tra toan bo theo checklist sau. Moi item FAIL phai ghi ro severity.

## Checklist Public Flow
- [ ] Home load duoc danh sach bai viet published
- [ ] Category filter dung (chi hien bai thuoc category do)
- [ ] Post detail hien thi du noi dung
- [ ] About / Contact render dung

## Checklist Auth Flow
- [ ] Register tao duoc user moi
- [ ] Login tra JWT, luu vao AuthContext
- [ ] `/api/auth/me` tra dung user khi co token hop le
- [ ] Logout xoa token khoi context, redirect ve home

## Checklist Member Flow
- [ ] Tao bai viet moi (draft)
- [ ] Sua bai viet cua minh
- [ ] Khong sua/xoa duoc bai cua nguoi khac (403)

## Checklist Admin Flow
- [ ] Dashboard stats load duoc
- [ ] Duyet/publish bai viet
- [ ] CRUD categories
- [ ] List/doi role users

## Checklist Upload
- [ ] Upload anh tra URL hop le
- [ ] URL render duoc trong bai viet

## Checklist Docs Sync
- [ ] Khong co endpoint trong code ma thieu trong docs
- [ ] Response fields trong docs khop voi code thuc te

## Output format
```
QA Gate: PASS | FAIL
---
Critical:
  - ...
High:
  - ...
Medium:
  - ...
Residual risks:
  - ...
```

Gate chi PASS khi khong con Critical/High mo.
