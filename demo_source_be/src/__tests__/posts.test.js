const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../db');

const admin = { id: 92001, email: 'posts-admin@test.local', password_hash: 'x', name: 'Posts Admin', role: 'admin' };
const member = { id: 92002, email: 'posts-member@test.local', password_hash: 'x', name: 'Posts Member', role: 'member' };
const otherMember = { id: 92003, email: 'posts-other@test.local', password_hash: 'x', name: 'Other Member', role: 'member' };
const category = { id: 92001, name: 'Test Category', slug: 'test-category', status: 'active' };

const tokenFor = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'test-secret');

describe('Posts API', () => {
  beforeAll(async () => {
    await db('posts').whereIn('slug', ['test-post-1', 'test-post-2', 'test-post-3']).del();
    await db('categories').where('id', category.id).del();
    await db('users').whereIn('id', [admin.id, member.id, otherMember.id]).del();
    
    await db('users').insert([admin, member, otherMember]);
    await db('categories').insert([category]);
  });

  afterAll(async () => {
    await db('posts').whereIn('slug', ['test-post-1', 'test-post-2', 'test-post-3']).del();
    await db('categories').where('id', category.id).del();
    await db('users').whereIn('id', [admin.id, member.id, otherMember.id]).del();
    await db.destroy();
  });

  let postId1, postId2;

  describe('Member endpoints', () => {
    it('creates a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${tokenFor(member)}`)
        .send({
          title: 'Test Post 1',
          slug: 'test-post-1',
          content: 'Content of test post 1',
          category_id: category.id,
          thumbnail_url: '/uploads/test1.jpg',
          excerpt: 'Excerpt 1'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Test Post 1');
      expect(res.body.status).toBe('draft');
      expect(res.body.author_id).toBe(member.id);
      postId1 = res.body.id;
    });

    it('fails to create post with duplicate slug', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${tokenFor(member)}`)
        .send({
          title: 'Test Post 1 Duplicate',
          slug: 'test-post-1',
          content: 'Content',
          category_id: category.id
        });

      expect(res.statusCode).toBe(500); // DB unique constraint error
    });

    it('lists my posts', async () => {
      const res = await request(app)
        .get('/api/posts/my')
        .set('Authorization', `Bearer ${tokenFor(member)}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('posts');
      expect(res.body.posts.length).toBeGreaterThanOrEqual(1);
      expect(res.body.posts.some(p => p.id === postId1)).toBe(true);
    });

    it('updates own post', async () => {
      const res = await request(app)
        .put(`/api/posts/${postId1}`)
        .set('Authorization', `Bearer ${tokenFor(member)}`)
        .send({
          title: 'Test Post 1 Updated',
          content: 'Updated content'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Test Post 1 Updated');
    });

    it('fails to update someone else post', async () => {
      const res = await request(app)
        .put(`/api/posts/${postId1}`)
        .set('Authorization', `Bearer ${tokenFor(otherMember)}`)
        .send({
          title: 'Hacked'
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('Admin endpoints', () => {
    it('lists all posts', async () => {
      const res = await request(app)
        .get('/api/admin/posts')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(res.body.items.some(p => p.id === postId1)).toBe(true);
    });

    it('gets post detail', async () => {
      const res = await request(app)
        .get(`/api/admin/posts/${postId1}`)
        .set('Authorization', `Bearer ${tokenFor(admin)}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(postId1);
    });

    it('updates post status to published', async () => {
      const res = await request(app)
        .put(`/api/admin/posts/${postId1}/status`)
        .set('Authorization', `Bearer ${tokenFor(admin)}`)
        .send({ status: 'published' });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('published');
    });

    it('gets admin stats', async () => {
      const res = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${tokenFor(admin)}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalPosts');
      expect(res.body).toHaveProperty('publishedPosts');
      expect(res.body).toHaveProperty('draftPosts');
      expect(res.body).toHaveProperty('totalCategories');
    });
  });

  describe('Public endpoints', () => {
    it('lists published posts', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(res.body.items.some(p => p.id === postId1)).toBe(true);
    });

    it('gets published post by slug', async () => {
      const res = await request(app).get('/api/posts/test-post-1');
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(postId1);
    });

    it('fails to get non-existent post', async () => {
      const res = await request(app).get('/api/posts/not-found-slug');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Delete endpoints', () => {
    it('member deletes own post', async () => {
      // Create another post first
      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${tokenFor(member)}`)
        .send({
          title: 'Test Post 2',
          slug: 'test-post-2',
          content: 'Content',
          category_id: category.id
        });
      postId2 = createRes.body.id;

      const delRes = await request(app)
        .delete(`/api/posts/${postId2}`)
        .set('Authorization', `Bearer ${tokenFor(member)}`);

      expect(delRes.statusCode).toBe(200);
    });

    it('admin deletes any post', async () => {
      const delRes = await request(app)
        .delete(`/api/admin/posts/${postId1}`)
        .set('Authorization', `Bearer ${tokenFor(admin)}`);

      expect(delRes.statusCode).toBe(200);
    });
  });
});
