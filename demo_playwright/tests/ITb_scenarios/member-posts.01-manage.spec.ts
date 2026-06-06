import { test, expect } from '@playwright/test';
import { AdminPostListPage } from '../../page-objects/AdminPostListPage';
import { captureEvidence } from '../../utils/evidence';
import { Client } from 'pg';

const PASSWORD_HASH = '$2b$10$Q/sIfyktWXWUzv9f9JYHqOhbvIXUEWTsRewKBh0oRMukaoAyw1WXC';

test.describe('ITb: Kiểm thử Luồng Member Quản lý Bài viết', () => {
  test.describe.configure({ mode: 'serial' });

  let postListPage: AdminPostListPage;

  test.beforeAll(async () => {
    const client = new Client({
      host: 'db.tvsdhpzpqxobkkotuhkh.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'trteam10T@123',
    });
    await client.connect();
    
    // Clean state
    await client.query(`DELETE FROM posts WHERE slug IN ('bai-viet-member-itb', 'bai-viet-nguoi-khac');`);
    await client.query(`DELETE FROM users WHERE email IN ('member_itb_1@hoianblog.vn', 'member_itb_2@hoianblog.vn');`);
    await client.query(`DELETE FROM categories WHERE slug = 'danh-muc-member-itb';`);

    // Insert test data
    await client.query(`
      INSERT INTO users (id, name, email, password_hash, role, status) VALUES 
      (301, 'Member 1', 'member_itb_1@hoianblog.vn', $1, 'member', 'active'),
      (302, 'Member 2', 'member_itb_2@hoianblog.vn', $1, 'member', 'active')
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        status = EXCLUDED.status;
    `, [PASSWORD_HASH]);

    await client.query(`
      INSERT INTO categories (id, name, slug) VALUES (301, 'Danh mục Member ITb', 'danh-muc-member-itb');
    `);

    await client.query(`
      INSERT INTO posts (id, title, slug, content, category_id, author_id, status) VALUES 
      (301, 'Bài viết người khác', 'bai-viet-nguoi-khac', 'Content', 301, 302, 'draft');
    `);

    await client.end();
  });

  test.beforeEach(async ({ page }) => {
    postListPage = new AdminPostListPage(page);
    page.on('response', async (response) => {
      if (response.url().includes('/api/posts') && response.status() >= 400) {
        console.log('API Error:', response.status(), await response.text());
      }
    });
  });

  test('TC_ITB_MEM_01: Member tạo, sửa, xóa bài viết của chính mình', async ({ page }, testInfo) => {
    // 1. Đăng nhập
    await postListPage.loginAs('member_itb_1@hoianblog.vn', 'password123');
    
    // 2. Truy cập danh sách bài viết
    await page.locator('a[href="/admin/posts"]').first().click();
    await expect(page).toHaveURL(/\/admin\/posts/);
    
    // 3. Tạo bài viết mới
    await postListPage.createPost({
      title: 'Bài viết Member ITb',
      slug: 'bai-viet-member-itb',
      categoryName: 'Danh mục Member ITb',
      content: 'Nội dung bài viết test',
    });
    await captureEvidence(page, testInfo, 'TC_ITB_MEM_01-Create-Success');

    // 4. Sửa bài viết
    await postListPage.editPost('Bài viết Member ITb', {
      title: 'Bài viết Member ITb Updated',
    });
    await expect(postListPage.rowByTitle('Bài viết Member ITb Updated')).toBeVisible();
    await captureEvidence(page, testInfo, 'TC_ITB_MEM_01-Edit-Success');

    // 5. Xóa bài viết
    await postListPage.deletePost('Bài viết Member ITb Updated');
    await expect(page.getByText('Deleted')).toBeVisible();
    await expect(postListPage.rowByTitle('Bài viết Member ITb Updated')).not.toBeVisible();
    await captureEvidence(page, testInfo, 'TC_ITB_MEM_01-Delete-Success');
  });

  test('TC_ITB_MEM_02: Member không thể sửa/xóa bài viết của người khác', async ({ request }) => {
    // 1. Đăng nhập qua API để lấy token
    const loginRes = await request.post('/api/auth/login', {
      data: { email: 'member_itb_1@hoianblog.vn', password: 'password123' }
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    // 2. Gọi API PUT sửa bài viết của người khác (ID 301)
    const putRes = await request.put('/api/posts/301', {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'Hacked Title' }
    });
    expect(putRes.status()).toBe(403);

    // 3. Gọi API DELETE xóa bài viết của người khác
    const delRes = await request.delete('/api/posts/301', {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(delRes.status()).toBe(403);
  });
});
