const request = require('supertest');
const app = require('../app');
const db = require('../db');
const bcrypt = require('bcryptjs');

describe('POST /api/auth/login', () => {
  const testUser = {
    email: 'testlogin@hoianblog.vn',
    password: 'password123',
    name: 'Test Login User',
    role: 'admin'
  };

  beforeAll(async () => {
    // Cleanup if exists
    await db('users').where({ email: testUser.email }).del();
    
    // Create test user
    const password_hash = await bcrypt.hash(testUser.password, 10);
    await db('users').insert({
      email: testUser.email,
      password_hash,
      name: testUser.name,
      role: testUser.role
    });
  });

  afterAll(async () => {
    // Cleanup
    await db('users').where({ email: testUser.email }).del();
    await db.destroy();
  });

  it('should return 200 and token on successful login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      email: testUser.email,
      name: testUser.name,
      role: testUser.role
    });
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        password: testUser.password
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email và mật khẩu là bắt buộc');
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email và mật khẩu là bắt buộc');
  });

  it('should return 401 if email is incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@hoianblog.vn',
        password: testUser.password
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Email hoặc mật khẩu không đúng');
  });

  it('should return 401 if password is incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Email hoặc mật khẩu không đúng');
  });
});
