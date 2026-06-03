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

1. Đọc code cần review
2. Đọc API spec tương ứng để so sánh contract
3. Đánh giá theo checklist:

- So endpoint với docs: method/path/status/response fields
- Kiểm tra permission bypass (member làm được việc của admin?)
- Kiểm tra validation thiếu hoặc quá lỏng
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
