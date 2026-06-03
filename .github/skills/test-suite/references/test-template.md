## Test Template — Jest + Supertest

### Template co ban cho mot module

```javascript
const request = require('supertest');
const app = require('../../app');
const db = require('../../db');

describe('MODULE /api/path', () => {
  let authToken;
  let adminToken;

  beforeAll(async () => {
    // Lay token cho test (login truoc)
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'member@test.com', password: 'password123' });
    authToken = loginRes.body.token;

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    adminToken = adminRes.body.token;
  });

  afterAll(async () => {
    // Cleanup data da tao trong test nay
    await db('posts').where('title', 'like', '__test__%').delete();
    await db.destroy();
  });

  // --- GET list ---
  describe('GET /api/posts', () => {
    it('200 - tra ve danh sach', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty('pagination');
    });

    it('200 - filter theo category', async () => {
      const res = await request(app).get('/api/posts?category=hoi-an');
      expect(res.status).toBe(200);
    });
  });

  // --- POST create ---
  describe('POST /api/posts', () => {
    it('201 - tao bai viet moi', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '__test__ New Post',
          content: 'Content here',
          category_id: 1
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.status).toBe('draft');
    });

    it('401 - khong co token', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Test', content: 'Test' });
      expect(res.status).toBe(401);
    });

    it('422 - thieu required field', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: '' });
      expect(res.status).toBe(422);
      expect(res.body).toHaveProperty('message');
    });
  });

  // --- Admin only ---
  describe('PATCH /api/admin/posts/:id/status', () => {
    it('403 - member khong duoc dung admin endpoint', async () => {
      const res = await request(app)
        .patch('/api/admin/posts/1/status')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'published' });
      expect(res.status).toBe(403);
    });

    it('200 - admin doi duoc status', async () => {
      const res = await request(app)
        .patch('/api/admin/posts/1/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'published' });
      expect(res.status).toBe(200);
    });
  });
});
```

### Naming convention cho test data
Prefix `__test__` cho moi data tao trong test de de cleanup:
```javascript
await db('posts').where('title', 'like', '__test__%').delete();
```
