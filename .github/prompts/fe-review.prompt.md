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

Thực hiện review theo 2 giai đoạn (Two-Stage Review Process):

### Giai đoạn 1: Spec Compliance Review
Kiểm tra code có đáp ứng đúng 100% tài liệu thiết kế không:
- Tên field đồng bộ với API response
- Guard route có hoạt động — không vào được admin khi chưa login
- AuthContext cập nhật đúng sau login/logout
- Không thừa tính năng, không thiếu logic so với spec.

### Giai đoạn 2: Code Quality Review
Kiểm tra chất lượng code, UX và best practices:
- Form không submit khi đang loading (double submit)
- Lỗi API hiển thị rõ cho user
- Không hardcode URL/token trong component
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
