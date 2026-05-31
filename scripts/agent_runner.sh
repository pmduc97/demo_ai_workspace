#!/usr/bin/env bash
set -euo pipefail

# v5 AI phase runner: executes structured action plans produced by phase files.
# This runner is model-agnostic; any AI can generate the plan JSON.

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <phase_plan_json> <status_jsonl>" >&2
  exit 1
fi

PLAN_FILE="$1"
STATUS_FILE="$2"

jq_bin="jq"
command -v "$jq_bin" >/dev/null 2>&1 || { echo "jq is required" >&2; exit 1; }

phase=$(jq -r '.phase' "$PLAN_FILE")
task_id=$(jq -r '.task_id' "$PLAN_FILE")
domain=$(jq -r '.domain' "$PLAN_FILE")
attempt=$(jq -r '.attempt' "$PLAN_FILE")

log_status() {
  local status="$1" detail="$2"
  printf '{"ts":"%s","task_id":"%s","domain":"%s","phase":"%s","attempt":%s,"status":"%s","detail":%s}\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$task_id" "$domain" "$phase" "$attempt" "$status" "$(jq -Rn --arg d "$detail" '$d')" >> "$STATUS_FILE"
}

log_status "started" "phase plan loaded"

# Execute actions sequentially; each action is explicit command + purpose.
idx=0
jq -c '.actions[]?' "$PLAN_FILE" | while read -r action; do
  idx=$((idx + 1))
  purpose=$(echo "$action" | jq -r '.purpose // ""')
  cmd=$(echo "$action" | jq -r '.cmd')
  log_status "running" "action#$idx: $purpose"
  if bash -lc "$cmd"; then
    log_status "done" "action#$idx succeeded"
  else
    log_status "failed" "action#$idx failed: $cmd"
    exit 2
  fi
done

log_status "completed" "phase actions completed"
