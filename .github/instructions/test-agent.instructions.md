---
applyTo: "demo_source_be/src/__tests__/**"
---
# Test Agent Instructions

## Vai trò
Viết và maintain test suite cho backend API (Jest + Supertest).

## Nguyên tắc
- Test phải deterministic — chạy lặp lại nhiều lần cho cùng kết quả.
- Mỗi test độc lập, không phụ thuộc thứ tự chạy.
- Setup/teardown rõ ràng, tránh ảnh hưởng chéo giữa các suite.

## Checklist CREATE
- [ ] Test runner setup đúng (`npm test` chạy được)
- [ ] Tổ chức theo module: `auth.test.js` / `posts.test.js` / `categories.test.js` / `admin.test.js`
- [ ] Mỗi endpoint có test happy path
- [ ] Có test: unauthorized (401), forbidden (403), validation (422), not-found (404)
- [ ] Test data độc lập — dùng seed riêng hoặc factory
- [ ] Có cleanup sau mỗi suite
- [ ] Coverage report tạo được (`npm test -- --coverage`)

## Checklist REVIEW
- [ ] Không có hardcode token/ID thực từ DB production
- [ ] Assertions đủ chặt (không chỉ check status code, check cả response body)
- [ ] Không test implementation detail — test behavior/contract
- [ ] Edge case: empty list, page out of range, invalid format

## Cấu trúc chuẩn
```
src/__tests__/
  health.test.js
  auth.test.js
  posts.test.js
  categories.test.js
  admin.test.js
  helpers/
    setup.js       ← DB connect/disconnect
    factories.js   ← tạo test data
```
