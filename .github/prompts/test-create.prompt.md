---
mode: agent
description: Viet test suite cho backend API
agent: test-agent
tools: [read, edit, search]
---
# Test Create — Viet Backend Test Suite

## Yeu cau dau vao
Hay cho biet module can viet test (auth / posts / categories / admin / upload)

## Quy trinh thuc hien

1. Doc spec API tuong ung trong `demo_docs/api/`
2. Doc controller tuong ung trong `demo_source_be/src/controllers/`
3. Doc cac test da co trong `demo_source_be/src/__tests__/` de giu nhat quan

Implement theo checklist:
- Moi endpoint co test happy path
- Co test: 401 unauthorized, 403 forbidden, 422 validation, 404 not found
- Test data doc lap — khong phu thuoc thu tu chay
- Co cleanup sau moi suite
- Assertions check ca status code lan response body

## Cau truc file test chuan
```javascript
const request = require('supertest');
const app = require('../../app');

describe('MODULE /api/path', () => {
  beforeAll(async () => { /* setup */ });
  afterAll(async () => { /* cleanup */ });

  describe('POST /api/path', () => {
    it('201 - happy path', async () => { ... });
    it('422 - validation error', async () => { ... });
    it('401 - unauthorized', async () => { ... });
  });
});
```

## Output mong doi
- File test da tao
- Lenh chay: `cd demo_source_be && npm test`
- Coverage hien tai
