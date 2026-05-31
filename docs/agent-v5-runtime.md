# Agent Runtime v5

## Muc tieu
V5 chuyen tu command pipeline thu cong sang AI-driven phase execution thong qua plan JSON cho moi phase.

## Thanh phan
- `scripts/run_cycle_v5.sh`: dieu phoi retry, gate, va report.
- `scripts/agent_runner.sh`: thuc thi phase plan co cau truc (actions co purpose + cmd).
- `.agents/tasks.v5.json`: task contract tai su dung cho tinh nang moi.
- `.agents/ai_status.jsonl`: event log theo phase, phu hop de tong hop AI report.

## Cach mo rong cho feature moi
1. Them task moi vao `.agents/tasks.v5.json`.
2. Dinh nghia day du actions cho `create/review/correct/verify`.
3. Chay `bash scripts/run_cycle_v5.sh`.
4. Review report `reports/ai-cycle-*.md`.
