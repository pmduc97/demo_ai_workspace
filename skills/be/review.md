# BE Skill - REVIEW

## Mục tiêu
Phát hiện lỗi logic, phân quyền, contract mismatch, regression risk và thiếu test.

## Checklist review
- [ ] So endpoint với docs: method/path/status/response fields.
- [ ] Kiểm tra permission bypass (member làm việc admin?).
- [ ] Kiểm tra validation thiếu hoặc quá lỏng.
- [ ] Kiểm tra conflict/not-found/duplicate scenarios.
- [ ] Kiểm tra query edge-case: page âm, limit lớn, filter rỗng.
- [ ] Kiểm tra consistency error message.
- [ ] Kiểm tra nguy cơ SQL injection (raw query, interpolate).
- [ ] Kiểm tra backward compatibility API cũ.
- [ ] Kiểm tra test coverage cho code mới.

## Output format
- Severity (Critical/High/Medium/Low)
- File ref (`path:line`)
- Tác động
- Đề xuất fix cụ thể
