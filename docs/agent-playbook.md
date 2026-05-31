# Agent Playbook (Full Auto v4)

## Mục tiêu
Vận hành full auto cho project theo vòng lặp: `create -> review -> correct -> verify -> qa_gate` đến khi PASS hoặc hết retry.

## Phạm vi tự động hóa
- Backend: implement/fix API, middleware, controllers, routes.
- Frontend: implement/fix pages, components, auth flow, route guard.
- Test: unit/integration tests, test data.
- DB: migrations, seeds, schema sync khi cần.
- Docs: cập nhật design/API/hướng dẫn chạy.

## Runtime files
- `.agents/tasks.json`: queue task + command theo phase
- `.agents/findings.json`: findings theo task
- `.agents/task_status.json`: lịch sử phase
- `.agents/gate_decision.json`: gate task gần nhất
- `.agents/overall_gate_decision.json`: gate tổng
- `reports/cycle-<timestamp>.md`: report tổng hợp

## Tasks schema (v4)
Mỗi task có thể khai báo command cho từng phase:
- `create`: tạo/chỉnh code
- `review`: chạy check nhanh
- `correct`: auto-fix sau fail
- `verify`: gate command bắt buộc pass

## Gate rules
- FAIL nếu còn blocker `Critical/High` trong `findings.json` của task.
- FAIL nếu bất kỳ command `verify` nào fail.
- PASS khi verify pass và không còn blocker.

## Cách dùng
```bash
./scripts/run_cycle.sh
```
