# Scoring Guide — Doc FE Review

## Thang điểm

| Nhóm | Điểm tối đa |
|------|------------|
| F — Format | 20 |
| C — Content | 50 |
| A — API Sync | 20 |
| Q — Quality | 10 |
| **Tổng** | **100** |

## Verdict

| Điểm | Verdict | Ý nghĩa |
|------|---------|---------|
| ≥ 90 | ✅ **PASS** | Release được ngay |
| 75–89 | ⚠️ **CONDITIONAL PASS** | Release được nếu Medium findings ghi backlog |
| < 75 | ❌ **FAIL** | Bắt buộc fix Critical/High trước khi release |

## Quy tắc override

Dù điểm cao đến đâu, nếu có bất kỳ finding `Critical` nào → **tự động FAIL**.

| Finding | Tác động |
|--------|---------|
| Critical | Auto FAIL bất kể tổng điểm |
| High | Trừ điểm theo checklist, khuyến nghị fix |
| Medium | Ghi backlog, không block release |
| Low | Defer, chỉ ghi note |

## Cách tính điểm từng mục

- Đạt đầy đủ: **full điểm**
- Đạt một phần (ví dụ: thiếu 1/4 trường trong bảng): **50% điểm**
- Không đạt: **0 điểm**
