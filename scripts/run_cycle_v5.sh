#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STATE_DIR="$ROOT_DIR/.agents"
REPORT_DIR="$ROOT_DIR/reports"
TASKS_FILE="$STATE_DIR/tasks.v5.json"
STATUS_JSONL="$STATE_DIR/ai_status.jsonl"
REPORT_FILE="$REPORT_DIR/ai-cycle-$(date +%Y%m%d-%H%M%S).md"
OVERALL_GATE="$STATE_DIR/overall_gate_decision.json"

mkdir -p "$STATE_DIR" "$REPORT_DIR" "$STATE_DIR/plans"
: > "$STATUS_JSONL"

# Build phase plan from task-defined action templates.
make_plan() {
  local task_json="$1" phase="$2" attempt="$3" out="$4"
  jq -n \
    --arg task_id "$(echo "$task_json" | jq -r '.task_id')" \
    --arg domain "$(echo "$task_json" | jq -r '.domain')" \
    --arg phase "$phase" \
    --argjson attempt "$attempt" \
    --argjson actions "$(echo "$task_json" | jq ".phases.$phase.actions")" \
    '{task_id:$task_id,domain:$domain,phase:$phase,attempt:$attempt,actions:$actions}' > "$out"
}

run_phase() {
  local task_json="$1" phase="$2" attempt="$3"
  local task_id; task_id=$(echo "$task_json" | jq -r '.task_id')
  local plan="$STATE_DIR/plans/${task_id}-${phase}-a${attempt}.json"
  make_plan "$task_json" "$phase" "$attempt" "$plan"
  scripts/agent_runner.sh "$plan" "$STATUS_JSONL"
}

pass=true

while IFS= read -r task; do
  task_id=$(echo "$task" | jq -r '.task_id')
  max_attempts=$(echo "$task" | jq -r '.max_attempts // 2')
  ok=false

  for ((a=1; a<=max_attempts; a++)); do
    run_phase "$task" create "$a" || true
    run_phase "$task" review "$a" || true
    if run_phase "$task" verify "$a"; then
      ok=true
      break
    fi
    run_phase "$task" correct "$a" || true
  done

  if [[ "$ok" != true ]]; then
    pass=false
  fi
done < <(jq -c '.tasks[]' "$TASKS_FILE")

if [[ "$pass" == true ]]; then
  echo '{"decision":"PASS","reason":"All AI-driven tasks passed"}' > "$OVERALL_GATE"
else
  echo '{"decision":"FAIL","reason":"At least one AI-driven task failed"}' > "$OVERALL_GATE"
fi

{
  echo "# AI Cycle Report (v5)"
  echo "- Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "- Task file: `$TASKS_FILE`"
  echo "- Overall gate: $(cat "$OVERALL_GATE")"
  echo
  echo "## AI Phase Timeline"
  awk '{print "- " $0}' "$STATUS_JSONL"
} > "$REPORT_FILE"

echo "$REPORT_FILE"
[[ "$pass" == true ]]
