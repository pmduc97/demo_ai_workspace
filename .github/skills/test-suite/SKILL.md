---
name: test-suite
description: "Test writing workflow for Blog Hoi An/Da Nang backend. Use when writing Jest + Supertest tests, adding test cases for new endpoints, creating test helpers or factories, checking coverage. Trigger phrases: write test, add test, test suite, jest, supertest, coverage, unit test, integration test, test auth, test posts."
argument-hint: "Module to test: auth | posts | categories | admin | upload"
---

# Test Suite Skill

## Muc tieu
Viet va maintain test suite cho backend API (Jest + Supertest), bao phu luong chinh va loi quan trong.

## Khi nao dung
- Viet test cho module moi (auth, posts, categories, admin, upload)
- Them test case cho endpoint vua implement
- Fix flaky test
- Check coverage

## Procedure

### Buoc 1 — Doc truoc khi viet
1. Doc API spec cua module tai `demo_docs/api/`
2. Doc controller tuong ung tai `demo_source_be/src/controllers/`
3. Doc test hien co de giu nhat quan structure

### Buoc 2 — Setup (neu chua co)
Tao hoac check file `src/__tests__/helpers/setup.js`:
```javascript
const db = require('../../db');
beforeAll(async () => { /* verify DB connection */ });
afterAll(async () => { await db.destroy(); });
```

### Buoc 3 — Viet test theo template
Xem [test template](./references/test-template.md) de co structure chuan.

Bat buoc cho moi endpoint:
- Happy path (2xx)
- 401 Unauthorized (khong co token)
- 403 Forbidden (sai role)
- 422 Validation error (thieu/sai field)
- 404 Not found (resource khong ton tai)

### Buoc 4 — Chay va verify
```powershell
cd demo_source_be
npm test
npm test -- --coverage
```

## Output
```
### Test files
- src/__tests__/auth.test.js — X test cases added

### Run
cd demo_source_be && npm test

### Coverage
Statements: X% | Branches: X% | Functions: X% | Lines: X%
```
