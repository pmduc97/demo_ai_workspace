# Agent Runtime v5

## Mục tiêu
V5 chuyển từ command pipeline thủ công sang AI-driven phase execution thông qua plan JSON cho mỗi phase.

## Thành phần
- `scripts/run_cycle_v5.sh`: điều phối retry, gate, và report.
- `scripts/agent_runner.sh`: thực thi phase plan có cấu trúc (actions có purpose + cmd).
- `.agents/tasks.v5.json`: task contract tái sử dụng cho tính năng mới.
- `.agents/ai_status.jsonl`: event log theo phase, phù hợp để tổng hợp AI report.

## Cách mở rộng cho feature mới
1. Thêm task mới vào `.agents/tasks.v5.json`.
2. Định nghĩa đầy đủ actions cho `create/review/correct/verify`.
3. Chạy `bash scripts/run_cycle_v5.sh`.
4. Review report `reports/ai-cycle-*.md`.
