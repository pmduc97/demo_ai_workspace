const request = require('supertest');
const app = require('../app');
const db = require('../db');
const bcrypt = require('bcryptjs');

describe('GET /api/admin/stats', () => {
  const adminUser = {
    email: 'admin_stats@hoianblog.vn',
    password: 'password123',
    name: 'Admin Stats',
    role: 'admin'
  };

  const memberUser = {
    email: 'member_stats@hoianblog.vn',
    password: 'password123',
    name: 'Member Stats',
    role: 'member'
  };

  let adminToken;
  let memberToken;
  let adminId;
  let memberId;
  let categoryId;

  beforeAll(async () => {
    // Cleanup
    await db('posts').whereIn('author_id', function() {
      this.select('id').from('users').whereIn('email', [adminUser.email, memberUser.email]);
    }).del();
    await db('users').whereIn('email', [adminUser.email, memberUser.email]).del();
    await db('categories').where('slug', 'stats-category').del();

    // Create users
    const password_hash = await bcrypt.hash('password123', 10);
    const { password: _p1, ...adminData } = adminUser;
    const { password: _p2, ...memberData } = memberUser;
    const [admin] = await db('users').insert({ ...adminData, password_hash }).returning('id');
    const [member] = await db('users').insert({ ...memberData, password_hash }).returning('id');
    adminId = admin.id || admin;
    memberId = member.id || member;

    // Login to get tokens
    const adminRes = await request(app).post('/api/auth/login').send({ email: adminUser.email, password: 'password123' });
    adminToken = adminRes.body.token;

    const memberRes = await request(app).post('/api/auth/login').send({ email: memberUser.email, password: 'password123' });
    memberToken = memberRes.body.token;

    // Create category
    const [cat] = await db('categories').insert({ name: 'Stats Category', slug: 'stats-category' }).returning('id');
    categoryId = cat.id || cat;

    // Create posts
    await db('posts').insert([
      { title: 'Admin Post 1', slug: 'admin-post-1', content: 'Content', status: 'published', category_id: categoryId, author_id: adminId },
      { title: 'Admin Post 2', slug: 'admin-post-2', content: 'Content', status: 'draft', category_id: categoryId, author_id: adminId },
      { title: 'Member Post 1', slug: 'member-post-1', content: 'Content', status: 'published', category_id: categoryId, author_id: memberId },
    ]);
  });

  afterAll(async () => {
    if (adminId && memberId) {
      await db('posts').whereIn('author_id', [adminId, memberId]).del();
      await db('users').whereIn('id', [adminId, memberId]).del();
    }
    if (categoryId) {
      await db('categories').where('id', categoryId).del();
    }
    await db.destroy();
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.statusCode).toBe(401);
  });

  it('should return stats for all posts if admin', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalPosts');
    expect(res.body).toHaveProperty('publishedPosts');
    expect(res.body).toHaveProperty('draftPosts');
    expect(res.body).toHaveProperty('totalCategories');
    
    expect(res.body.totalPosts).toBeGreaterThanOrEqual(3);
    expect(res.body.publishedPosts).toBeGreaterThanOrEqual(2);
    expect(res.body.draftPosts).toBeGreaterThanOrEqual(1);
    expect(res.body.totalCategories).toBeGreaterThanOrEqual(1);
  });

  it('should return stats for own posts if member', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${memberToken}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.totalPosts).toBe(1);
    expect(res.body.publishedPosts).toBe(1);
    expect(res.body.draftPosts).toBe(0);
    expect(res.body.totalCategories).toBeGreaterThanOrEqual(1);
  });
});
