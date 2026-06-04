const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const db = require('../db');

const admin = { id: 91001, email: 'category-admin@test.local', password_hash: 'x', name: 'Category Admin', role: 'admin' };
const member = { id: 91002, email: 'category-member@test.local', password_hash: 'x', name: 'Category Member', role: 'member' };
const tokenFor = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'test-secret');

describe('categories admin enhancement', () => {
  beforeAll(async () => {
    await db('posts').whereIn('slug', ['category-enhancement-post']).del();
    await db('categories').whereIn('slug', ['category-enhancement', 'category-enhancement-hidden']).del();
    await db('users').whereIn('id', [admin.id, member.id]).del();
    await db('users').insert([admin, member]);
  });

  afterAll(async () => {
    await db('posts').whereIn('slug', ['category-enhancement-post']).del();
    await db('categories').whereIn('slug', ['category-enhancement', 'category-enhancement-hidden']).del();
    await db('users').whereIn('id', [admin.id, member.id]).del();
    await db.destroy();
  });

  it('creates, lists, updates, and soft deletes category with audit fields', async () => {
    const createRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${tokenFor(admin)}`)
      .send({
        name: 'Category Enhancement',
        slug: 'category-enhancement',
        status: 'hidden',
        thumbnail_url: '/uploads/categories/enhancement.jpg',
        seo_title: 'Category Enhancement',
        seo_description: 'Category enhancement description'
      });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.messageId).toBe('CATEGORY-S-001');
    expect(createRes.body.created_by).toBe(admin.id);

    const publicList = await request(app).get('/api/categories?status=hidden');
    expect(publicList.statusCode).toBe(403);
    expect(publicList.body.messageId).toBe('CATEGORY-E-004');

    const adminList = await request(app)
      .get('/api/categories?status=all&keyword=enhancement&sort=name_asc&page=1&limit=10')
      .set('Authorization', `Bearer ${tokenFor(admin)}`);
    expect(adminList.statusCode).toBe(200);
    expect(adminList.body).toHaveProperty('items');
    expect(adminList.body).toHaveProperty('pagination');
    expect(adminList.body.items[0]).toHaveProperty('postCount');
    expect(adminList.body.items[0]).toHaveProperty('publishedPostCount');
    expect(adminList.body.items[0]).toHaveProperty('viewCount');
    expect(adminList.body.items[0]).toHaveProperty('createdByName');

    const updateRes = await request(app)
      .put(`/api/categories/${createRes.body.id}`)
      .set('Authorization', `Bearer ${tokenFor(admin)}`)
      .send({ status: 'active', seo_title: 'Updated Category' });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.messageId).toBe('CATEGORY-S-002');
    expect(updateRes.body.updated_by).toBe(admin.id);

    const deleteRes = await request(app)
      .delete(`/api/categories/${createRes.body.id}`)
      .set('Authorization', `Bearer ${tokenFor(admin)}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.messageId).toBe('CATEGORY-S-003');
    expect(deleteRes.body.deleted_at).toBeTruthy();
  });
});
