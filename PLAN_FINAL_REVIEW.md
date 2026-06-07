# Kế hoạch Final Comprehensive Review (Round 3)

## 1. Mục tiêu
Rà soát toàn diện lần cuối toàn bộ artifacts của dự án Blog Du Lịch, đảm bảo 100% tuân thủ các tiêu chuẩn mới nhất của dự án.

## 2. Phạm vi Review
Dựa trên `PROJECT_MANIFEST.yml`, các hạng mục cần review bao gồm:

### 2.1. FE Docs (`demo_docs/fe/*.md`)
- Kiểm tra format 12-section.
- Kiểm tra YAML frontmatter.
- Đảm bảo tiếng Việt có dấu chuẩn xác.
- Chống Slop (Anti-Slop).

### 2.2. BE Docs (`demo_docs/api/*.md`)
- Kiểm tra format 10-section.
- Kiểm tra Validation Rules.
- Kiểm tra Sequence Diagram.
- Kiểm tra Query IDs.

### 2.3. Workflow Docs (`demo_docs/workflow/*.md`)
- Kiểm tra Exception flows.
- Đảm bảo không có dead-end.

### 2.4. Test Docs (`demo_docs/tests/ITa/*.md`, `demo_docs/tests/ITb/*.md`)
- Kiểm tra MCP data.
- Kiểm tra Condition-Based Waiting.

### 2.5. FE Code (`demo_source_fe/src/**/*.jsx`)
- Kiểm tra `min-h-[100dvh]`.
- Kiểm tra `useEffect` cleanup.
- Đảm bảo không dùng `transition-all/colors`.

### 2.6. BE Code (`demo_source_be/src/**/*.js`)
- Kiểm tra `messageId` đầy đủ.
- Kiểm tra HTTP status chuẩn (422 cho validation, 403 cho business rule).

### 2.7. Unit Tests (`demo_source_be/src/__tests__/*.js`)
- Kiểm tra assertions khớp với controller (đặc biệt 422/403).
- Kiểm tra có cleanup `afterAll`.

### 2.8. E2E Tests (`demo_playwright/tests/**/*.ts`)
- Kiểm tra `captureEvidence`.
- Đảm bảo không dùng `waitForTimeout`.
- Kiểm tra chuẩn POM.

## 3. Các bước thực hiện
1. **Review Docs**: FE Docs, BE Docs, Workflow Docs, Test Docs.
2. **Review Code**: FE Code, BE Code.
3. **Review Tests**: Unit Tests, E2E Tests.
4. **Verify Hệ thống**: Chạy Unit Tests, FE Build, QA Gate.
5. **Tổng hợp & Báo cáo**: Ghi log và tạo `FINAL_REVIEW_REPORT.md`.
