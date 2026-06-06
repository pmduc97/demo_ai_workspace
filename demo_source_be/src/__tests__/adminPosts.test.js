const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../db');

const admin = { id: 93001, email: 'admin-posts-admin@test.local', password_hash: 'x', name: 'Admin Posts Admin', role: 'admin' };
const member = { id: 93002, email: 'admin-posts-member@test.local', password_hash: 'x', name: 'Admin Posts Member', role: 'member' };
const category = { id: 93001, name: 'Admin Test Category', slug: 'admin-test-category', status: 'active' };

const tokenFor = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'test-secret');

describe('Admin Posts API', () => {
  beforeAll(async () => {
    await db('posts').whereIn('slug', ['admin-test-post-1', 'admin-test-post-2']).del();
    await db('categories').where('id', category.id).del();
    await db('users').whereIn('id', [admin.id, member.id]).del();
    
    await db('users').insert([admin, member]);
    await db('categories').insert([category]);
  });

  afterAll(async () => {
    await db('posts').whereIn('slug', ['admin-test-post-1', 'admin-test-post-2']).del();
    await db('categories').where('id', category.id).del();
    await db('users').whereIn('id', [admin.id, member.id]).del();
    await db.destroy();
  });

  let postId1, postId2;

  beforeAll(async () => {
    const [p1] = await db('posts').insert({
      title: 'Admin Test Post 1',
      slug: 'admin-test-post-1',
      content: 'Content 1',
      category_id: category.id,
      author_id: member.id,
      status: 'draft'
    }).returning('id');
    postId1 = p1.id || p1;

    const [p2] = await db('posts').insert({
      title: 'Admin Test Post 2',
      slug: 'admin-test-post-2',
      content: 'Content 2',
      category_id: category.id,
      author_id: admin.id,
      status: 'published'
    }).returning('id');
    postId2 = p2.id || p2;
  });

  describe('GET /api/admin/posts', () => {
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/api/admin/posts');
      expect(res.statusCode).toBe(401);
    });

    it('should return 403 if not admin', async () => {
      const res = await request(app)
        .get('/api/admin/posts')
        .set('Authorization', `Bearer ${tokenFor(member)}`);
      expect(res.statusCode).toBe(403);
    });

    it('should list posts for admin', async () => {
      const res = await request(app)
        .get('/api/admin/posts')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('limit');
      expect(res.body).toHaveProperty('total_pages');
      expect(Array.isArray(res.body.items)).toBe(true);
      
      const ids = res.body.items.map(p => p.id);
      expect(ids).toContain(postId1);
      expect(ids).toContain(postId2);
    });

    it('should filter posts by status', async () => {
      const res = await request(app)
        .get('/api/admin/posts?status=draft')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(200);
      const ids = res.body.items.map(p => p.id);
      expect(ids).toContain(postId1);
      expect(ids).not.toContain(postId2);
    });
  });

  describe('GET /api/admin/posts/:id', () => {
    it('should return 403 if not admin', async () => {
      const res = await request(app)
        .get(`/api/admin/posts/${postId1}`)
        .set('Authorization', `Bearer ${tokenFor(member)}`);
      expect(res.statusCode).toBe(403);
    });

    it('should return post details for admin', async () => {
      const res = await request(app)
        .get(`/api/admin/posts/${postId1}`)
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(postId1);
      expect(res.body.title).toBe('Admin Test Post 1');
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app)
        .get('/api/admin/posts/999999')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/admin/posts/:id/status', () => {
    it('should return 403 if not admin', async () => {
      const res = await request(app)
        .put(`/api/admin/posts/${postId1}/status`)
        .set('Authorization', `Bearer ${tokenFor(member)}`)
        .send({ status: 'published' });
      expect(res.statusCode).toBe(403);
    });

    it('should update post status', async () => {
      const res = await request(app)
        .put(`/api/admin/posts/${postId1}/status`)
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ status: 'published' });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('published');

      // Verify in DB
      const post = await db('posts').where({ id: postId1 }).first();
      expect(post.status).toBe('published');
    });

    it('should return 422 for invalid status', async () => {
      const res = await request(app)
        .put(`/api/admin/posts/${postId1}/status`)
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ status: 'invalid_status' });
      expect(res.statusCode).toBe(422);
    });
  });

  describe('DELETE /api/admin/posts/:id', () => {
    it('should return 403 if not admin', async () => {
      const res = await request(app)
        .delete(`/api/admin/posts/${postId2}`)
        .set('Authorization', `Bearer ${tokenFor(member)}`);
      expect(res.statusCode).toBe(403);
    });

    it('should delete post', async () => {
      const res = await request(app)
        .delete(`/api/admin/posts/${postId2}`)
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Deleted');

      // Verify in DB
      const post = await db('posts').where({ id: postId2 }).first();
      expect(post).toBeUndefined();
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app)
        .delete('/api/admin/posts/999999')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);
      expect(res.statusCode).toBe(404);
    });
  });
});
