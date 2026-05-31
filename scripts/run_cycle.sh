#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"
STATE_DIR="$ROOT_DIR/.agents"
REPORT_DIR="$ROOT_DIR/reports"
TASKS_FILE="$STATE_DIR/tasks.json"
STATUS_FILE="$STATE_DIR/task_status.json"
FINDINGS_FILE="$STATE_DIR/findings.json"
GATE_FILE="$STATE_DIR/gate_decision.json"
GATE_DIR="$STATE_DIR/gates"
OVERALL_GATE_FILE="$STATE_DIR/overall_gate_decision.json"
LOG_FILE="$STATE_DIR/cycle.log"
MAX_ATTEMPTS_DEFAULT=3

mkdir -p "$STATE_DIR" "$REPORT_DIR" "$GATE_DIR"

now() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }
phase_banner() { echo; echo "============================================================"; echo "[cycle] TASK=$1 DOMAIN=$2 ATTEMPT=$4 PHASE=$3"; echo "============================================================"; }
log() { echo "[$(now)] $1" | tee -a "$LOG_FILE"; }
validate_json() { node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));" "$1" >/dev/null; }

append_status() {
  node -e "const fs=require('fs');const p=process.argv[1];const d=JSON.parse(fs.readFileSync(p,'utf8'));d.history=d.history||[];d.history.push({timestamp:new Date().toISOString(),task_id:process.argv[2],domain:process.argv[3],phase:process.argv[4],status:process.argv[5],detail:process.argv[6],attempt:Number(process.argv[7])});fs.writeFileSync(p,JSON.stringify(d,null,2));" \
    "$STATUS_FILE" "$1" "$2" "$3" "$4" "$5" "$6"
}

init_files() {
  [[ -f "$TASKS_FILE" ]] || cat > "$TASKS_FILE" <<JSON
{"tasks":[]}
JSON
  [[ -f "$FINDINGS_FILE" ]] || echo '{"findings":[]}' > "$FINDINGS_FILE"
  [[ -f "$STATUS_FILE" ]] || echo '{"history":[]}' > "$STATUS_FILE"
  validate_json "$STATUS_FILE" || { echo "[cycle] ERROR: $STATUS_FILE is corrupt. Delete it to reset: rm '$STATUS_FILE'" >&2; exit 1; }
}

get_tasks_len() { node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));process.stdout.write(String((d.tasks||[]).length));" "$TASKS_FILE"; }
get_task_json() { node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));process.stdout.write(JSON.stringify(d.tasks[Number(process.argv[2])]));" "$TASKS_FILE" "$1"; }
get_field() { node -e "const t=JSON.parse(process.argv[1]);const k=process.argv[2];const v=t[k];process.stdout.write(v===undefined?'':String(v));" "$1" "$2"; }
get_lines() { node -e "const t=JSON.parse(process.argv[1]);const k=process.argv[2];console.log((t[k]||[]).join('\\n'));" "$1" "$2"; }
count_blockers_for_task() { node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));const id=process.argv[2];const n=(d.findings||[]).filter(f=>f.task_id===id && ['Critical','High'].includes(f.severity)).length;process.stdout.write(String(n));" "$FINDINGS_FILE" "$1"; }

run_cmd_list() {
  local task_id="$1" domain="$2" phase="$3" task_json="$4" attempt="$5"
  local cmds failed=false cmd
  cmds=$(get_lines "$task_json" "$phase")
  [[ -z "$cmds" ]] && return 0
  while IFS= read -r cmd; do
    [[ -z "$cmd" ]] && continue
    echo "[$phase] $cmd"
    if bash -lc "$cmd"; then
      append_status "$task_id" "$domain" "$phase" "done" "$cmd" "$attempt"
    else
      append_status "$task_id" "$domain" "$phase" "failed" "$cmd" "$attempt"
      failed=true
    fi
  done <<< "$cmds"
  [[ "$failed" == false ]]
}

run_phase() {
  local task_id="$1" domain="$2" phase="$3" task_json="$4" attempt="$5"
  phase_banner "$task_id" "$domain" "$phase" "$attempt"
  log "task=$task_id domain=$domain phase=$phase attempt=$attempt"
  append_status "$task_id" "$domain" "$phase" "started" "phase started" "$attempt"
  run_cmd_list "$task_id" "$domain" "$phase" "$task_json" "$attempt"
}

write_gate(){
  local gate_json; gate_json="{\"task_id\":\"$1\",\"domain\":\"$2\",\"decision\":\"$3\",\"reason\":\"$4\",\"attempt\":$5,\"timestamp\":\"$(now)\"}"
  echo "$gate_json" > "$GATE_FILE"
  echo "$gate_json" > "$GATE_DIR/$1.json"
}
write_overall_gate(){ cat > "$OVERALL_GATE_FILE" <<JSON
{"decision":"$1","reason":"$2","timestamp":"$(now)"}
JSON
}

run_verify(){ run_phase "$1" "$2" verify "$3" "$4"; }

process_task() {
  local task_json="$1" task_id domain title max_attempts attempt blockers
  task_id=$(get_field "$task_json" task_id); domain=$(get_field "$task_json" domain); title=$(get_field "$task_json" title)
  max_attempts=$(get_field "$task_json" max_attempts); [[ -z "$max_attempts" ]] && max_attempts=$MAX_ATTEMPTS_DEFAULT
  log "start task=$task_id domain=$domain title='$title' max_attempts=$max_attempts"
  attempt=1
  while [[ "$attempt" -le "$max_attempts" ]]; do
    run_phase "$task_id" "$domain" create "$task_json" "$attempt" || true
    run_phase "$task_id" "$domain" review "$task_json" "$attempt" || true
    blockers=$(count_blockers_for_task "$task_id")
    if [[ "$blockers" -gt 0 ]]; then run_phase "$task_id" "$domain" correct "$task_json" "$attempt" || true; fi

    if run_verify "$task_id" "$domain" "$task_json" "$attempt"; then
      blockers=$(count_blockers_for_task "$task_id")
      phase_banner "$task_id" "$domain" qa_gate "$attempt"
      if [[ "$blockers" -gt 0 ]]; then
        append_status "$task_id" "$domain" qa_gate failed "Critical/High blockers remain" "$attempt"
        write_gate "$task_id" "$domain" FAIL "Critical/High blockers remain" "$attempt"
      else
        append_status "$task_id" "$domain" qa_gate passed "ready" "$attempt"
        write_gate "$task_id" "$domain" PASS "No blockers and verification passed" "$attempt"
        return 0
      fi
    else
      phase_banner "$task_id" "$domain" qa_gate "$attempt"
      append_status "$task_id" "$domain" qa_gate failed "verification failed" "$attempt"
      write_gate "$task_id" "$domain" FAIL "Verification failed" "$attempt"
      run_phase "$task_id" "$domain" correct "$task_json" "$attempt" || true
    fi
    attempt=$((attempt+1)); echo "[cycle] retrying task=$task_id next_attempt=$attempt"
  done
  return 1
}

write_report(){ local report="$REPORT_DIR/cycle-$(date +%Y%m%d-%H%M%S).md"; {
 echo "# Cycle Report"; echo "- Generated: $(now)"; echo "- Overall Gate: $(tr '\n' ' ' < "$OVERALL_GATE_FILE" 2>/dev/null || echo n/a)"; echo
 echo "## Gate (last task)"; cat "$GATE_FILE" 2>/dev/null || true; echo
 echo "## Recent status entries"; node -e "const fs=require('fs');try{const d=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));const h=d.history||[];console.log(JSON.stringify(h.slice(-20),null,2));}catch(e){console.log('(unreadable)')}" "$STATUS_FILE" 2>/dev/null || true; echo
 echo "## Recent logs"; tail -n 120 "$LOG_FILE" || true; } > "$report"; echo "$report"; }

main(){ init_files; validate_json "$TASKS_FILE"; validate_json "$FINDINGS_FILE"; local len i task_json failed=0
 len=$(get_tasks_len); [[ "$len" -gt 0 ]] || { echo "[cycle] no tasks"; exit 1; }
 for i in $(seq 0 $((len-1))); do task_json=$(get_task_json "$i"); process_task "$task_json" || failed=1; done
 if [[ "$failed" -eq 0 ]]; then write_overall_gate PASS "All tasks passed"; else write_overall_gate FAIL "One or more tasks failed"; fi
 local report_path; report_path=$(write_report); log "report=$report_path"; echo "[cycle] done"; [[ "$failed" -eq 0 ]]
}
main "$@"
