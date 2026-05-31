# Skills Mapping (Full Cycle)

## Nguyên tắc
- Mỗi task phải có `domain` để map skill.
- Mỗi domain bắt buộc đi qua đủ phase theo thứ tự.

## Mapping theo domain
- BE:
  - create -> `skills/be/create.md`
  - review -> `skills/be/review.md`
  - correct -> `skills/be/correct.md`
- FE:
  - create -> `skills/fe/create.md`
  - review -> `skills/fe/review.md`
  - correct -> `skills/fe/correct.md`
- Docs:
  - create -> `skills/docs/create.md`
  - review -> `skills/docs/review.md`
  - correct -> `skills/docs/correct.md`
- Test:
  - create -> `skills/test/create.md`
  - review -> `skills/test/review.md`
  - correct -> `skills/test/correct.md`
- QA:
  - create -> `skills/qa/create.md`
  - review -> `skills/qa/review.md`
  - correct -> `skills/qa/correct.md`

## Ready for production checklist
- [ ] tasks.json và tasks.v5.json có verify commands hợp lệ cho từng task.
- [ ] findings.json được cập nhật theo output review thực tế.
- [ ] run_cycle.sh và run_cycle_v5.sh chạy pass trên sample tasks.
- [ ] reports/ được tạo và lưu đầy đủ audit.
- [ ] Tất cả domain (BE/FE/Test/Docs/QA) đều có task tương ứng trong contract.
