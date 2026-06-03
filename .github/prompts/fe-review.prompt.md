---
mode: agent
description: Review frontend code — UX, auth flow, API state handling
agent: fe-agent
tools: [read, search]
---
# FE Review — Frontend Code Review

## Yêu cầu đầu vào
Hãy cho biết:
1. Component/page cần review
2. Screen spec tương ứng trong `demo_docs/fe/`

## Quy trình review

1. Đọc code cần review
2. Đọc screen spec tương ứng để so sánh
3. Đánh giá theo checklist:

- Guard route có hoạt động — không vào được admin khi chưa login
- AuthContext cập nhật đúng sau login/logout
- Form không submit khi đang loading (double submit)
- Lỗi API hiển thị rõ cho user
- Không hardcode URL/token trong component
- Tên field đồng bộ với API response
- Empty state được xử lý
- Responsive không bị vỡ layout

## Output format
```
[Critical] src/pages/admin/PostForm.jsx:32
Vấn đề: ...
Fix: ...

[High] ...
[Medium] ...

Tổng kết: X Critical, Y High, Z Medium, W Low
Gate: PASS | FAIL
```
