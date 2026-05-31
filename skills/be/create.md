# BE Skill - CREATE

## Mục tiêu
Triển khai API/backend behavior đúng đặc tả, an toàn phân quyền, dễ test, và tương thích với dữ liệu hiện có.

## Input bắt buộc
- Task ID + mô tả nghiệp vụ
- API spec liên quan (`demo_docs/api/*.md`)
- DB constraints (`demo_docs/database.md`)
- Phạm vi file được phép sửa

## Checklist thực thi
- [ ] Route đúng method/path/version prefix.
- [ ] Controller trả đúng status code theo spec.
- [ ] Validate đầy đủ body/query/params; trả `422` khi sai dữ liệu.
- [ ] Auth + role guard đúng (`public/member/admin`).
- [ ] Không trả dữ liệu nhạy cảm (`password_hash`, secret).
- [ ] Query có pagination/filter/sort đúng yêu cầu.
- [ ] Lỗi chuẩn hóa format `{ message, details? }`.
- [ ] Cập nhật migration/seed nếu đổi schema.
- [ ] Cập nhật docs API khi đổi contract.
- [ ] Thêm test case cho happy path + lỗi chính.

## Output
- Danh sách file sửa
- Tóm tắt behavior mới/đổi
- Lệnh verify đã chạy
