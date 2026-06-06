const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../db');

const admin = { id: 92001, email: 'tags-admin@test.local', password_hash: 'x', name: 'Tags Admin', role: 'admin' };
const member = { id: 92002, email: 'tags-member@test.local', password_hash: 'x', name: 'Tags Member', role: 'member' };
const tokenFor = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'test-secret');

describe('Tags API', () => {
  beforeAll(async () => {
    await db('tags').whereIn('slug', ['test-tag-1', 'test-tag-2', 'test-tag-3', 'test-tag-new', 'test-tag-update']).del();
    await db('users').whereIn('id', [admin.id, member.id]).del();
    await db('users').insert([admin, member]);
    
    await db('tags').insert([
      { id: 92001, name: 'Test Tag 1', slug: 'test-tag-1', description: 'Desc 1', created_by: admin.id },
      { id: 92002, name: 'Test Tag 2', slug: 'test-tag-2', description: 'Desc 2', created_by: admin.id },
      { id: 92003, name: 'Test Tag 3', slug: 'test-tag-3', description: 'Desc 3', created_by: admin.id, deleted_at: new Date(), deleted_by: admin.id }
    ]);
  });

  afterAll(async () => {
    await db('tags').whereIn('slug', ['test-tag-1', 'test-tag-2', 'test-tag-3', 'test-tag-new', 'test-tag-update']).del();
    await db('users').whereIn('id', [admin.id, member.id]).del();
    await db.destroy();
  });

  describe('GET /api/tags', () => {
    it('should return list of active tags for public', async () => {
      const res = await request(app).get('/api/tags');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Lấy danh sách tags thành công');
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.meta).toHaveProperty('total');
      
      const slugs = res.body.data.map(t => t.slug);
      expect(slugs).toContain('test-tag-1');
      expect(slugs).not.toContain('test-tag-3');
    });

    it('should return 422 for invalid pagination', async () => {
      const res = await request(app).get('/api/tags?page=-1');
      expect(res.statusCode).toBe(422);
    });
  });

  describe('GET /api/admin/tags', () => {
    it('should return 401 if no token', async () => {
      const res = await request(app).get('/api/admin/tags');
      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if not admin', async () => {
      const res = await request(app)
        .get('/api/admin/tags')
        .set('Authorization', `Bearer ${tokenFor(member)}`);
      expect(res.statusCode).toBe(403);
    });

    it('should return list of tags for admin excluding soft deleted', async () => {
      const res = await request(app)
        .get('/api/admin/tags')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      
      const slugs = res.body.data.map(t => t.slug);
      expect(slugs).toContain('test-tag-1');
      expect(slugs).not.toContain('test-tag-3');
    });
  });

  describe('POST /api/admin/tags', () => {
    it('should return 401 if no token', async () => {
      const res = await request(app).post('/api/admin/tags').send({ name: 'New', slug: 'new' });
      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if not admin', async () => {
      const res = await request(app)
        .post('/api/admin/tags')
        .set('Authorization', `Bearer ${tokenFor(member)}`)
        .send({ name: 'New', slug: 'new' });
      expect(res.statusCode).toBe(403);
    });

    it('should return 422 if missing required fields', async () => {
      const res = await request(app)
        .post('/api/admin/tags')
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ name: 'New' });
      expect(res.statusCode).toBe(422);
    });

    it('should return 409 if slug already exists', async () => {
      const res = await request(app)
        .post('/api/admin/tags')
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ name: 'Test Tag 1', slug: 'test-tag-1' });
      expect(res.statusCode).toBe(409);
    });

    it('should create a new tag successfully', async () => {
      const res = await request(app)
        .post('/api/admin/tags')
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ name: 'Test Tag New', slug: 'test-tag-new', description: 'New desc' });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Tạo tag thành công');
      expect(res.body.data).toHaveProperty('id');
    });
  });

  describe('PUT /api/admin/tags/:id', () => {
    it('should return 422 for invalid ID', async () => {
      const res = await request(app)
        .put('/api/admin/tags/abc')
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ name: 'Update', slug: 'update' });
      expect(res.statusCode).toBe(422);
    });

    it('should return 404 if tag not found', async () => {
      const res = await request(app)
        .put('/api/admin/tags/999999')
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ name: 'Update', slug: 'update' });
      expect(res.statusCode).toBe(404);
    });

    it('should return 409 if new slug already exists', async () => {
      const res = await request(app)
        .put('/api/admin/tags/92002')
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ name: 'Update', slug: 'test-tag-1' });
      expect(res.statusCode).toBe(409);
    });

    it('should update tag successfully', async () => {
      const res = await request(app)
        .put('/api/admin/tags/92002')
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ name: 'Test Tag Update', slug: 'test-tag-update', description: 'Updated desc' });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Cập nhật tag thành công');
      
      const check = await db('tags').where({ id: 92002 }).first();
      expect(check.slug).toBe('test-tag-update');
    });
  });

  describe('DELETE /api/admin/tags/:id', () => {
    it('should return 422 for invalid ID', async () => {
      const res = await request(app)
        .delete('/api/admin/tags/abc')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(422);
    });

    it('should return 404 if tag not found', async () => {
      const res = await request(app)
        .delete('/api/admin/tags/999999')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(404);
    });

    it('should soft delete tag successfully', async () => {
      const res = await request(app)
        .delete('/api/admin/tags/92001')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Xóa tag thành công');

      const check = await db('tags').where({ id: 92001 }).first();
      expect(check.deleted_at).not.toBeNull();
    });
  });
});