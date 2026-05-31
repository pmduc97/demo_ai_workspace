# Agent Playbook (Full Auto v4)

## Muc tieu
Van hanh full auto cho project theo vong lap: `create -> review -> correct -> verify -> qa_gate` den khi PASS hoac het retry.

## Pham vi tu dong hoa
- Backend: implement/fix API, middleware, controllers, routes.
- Frontend: implement/fix pages, components, auth flow, route guard.
- Test: unit/integration tests, test data.
- DB: migrations, seeds, schema sync khi can.
- Docs: cap nhat design/API/huong dan chay.

## Runtime files
- `.agents/tasks.json`: queue task + command theo phase
- `.agents/findings.json`: findings theo task
- `.agents/task_status.json`: lich su phase
- `.agents/gate_decision.json`: gate task gan nhat
- `.agents/overall_gate_decision.json`: gate tong
- `reports/cycle-<timestamp>.md`: report tong hop

## Tasks schema (v4)
Moi task co the khai bao command cho tung phase:
- `create`: tao/chinh code
- `review`: chay check nhanh
- `correct`: auto-fix sau fail
- `verify`: gate command bat buoc pass

## Gate rules
- FAIL neu con blocker `Critical/High` trong `findings.json` cua task.
- FAIL neu bat ky command `verify` nao fail.
- PASS khi verify pass va khong con blocker.

## Cach dung
```bash
./scripts/run_cycle.sh
```
