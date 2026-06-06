---
mode: agent
description: Review backend code — phat hien loi, security risk, contract mismatch
agent: be-agent
tools: [read, search]
---
# BE Review — Backend Code Review

## Yêu cầu đầu vào
Hãy cho biết:
1. File hoặc feature cần review
2. Endpoint/API spec tương ứng trong `demo_docs/api/`

## Quy trình review

Thực hiện review theo 2 giai đoạn (Two-Stage Review Process):

### Giai đoạn 1: Spec Compliance Review
Kiểm tra code có đáp ứng đúng 100% tài liệu thiết kế không:
- So endpoint với docs: method/path/status/response fields
- Kiểm tra permission bypass (member làm được việc của admin?)
- Không thừa tính năng, không thiếu logic so với spec.

### Giai đoạn 2: Code Quality Review
Kiểm tra chất lượng code, bảo mật và best practices:
- Kiểm tra validation nhiều lớp (Defense-in-Depth): Boundary -> Business -> Data.
- Kiểm tra edge-case: page âm, limit lớn, filter rỗng
- Kiểm tra SQL injection risk
- Kiểm tra error message consistency
- Kiểm tra backward compatibility

## Output format
```
[Critical] path/to/file.js:line
Vấn đề: mô tả rõ
Tác động: ...
Fix đề xuất: ...

[High] ...
[Medium] ...
[Low] ...

Tổng kết: X Critical, Y High, Z Medium, W Low
Gate: PASS | FAIL
```
