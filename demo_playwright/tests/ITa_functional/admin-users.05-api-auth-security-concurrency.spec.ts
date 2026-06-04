import { expect, test } from '@playwright/test';
import { AdminUserListPage } from '../../page-objects/AdminUserListPage';
import { API_BASE, authHeaders, expectMessageIdOrMessage, getUserByEmail, loginApi, memberCreds, normalizeAdminUsersData, td } from '../../utils/adminUsersFixtures';

test.describe('ITa Admin Users - Chunk 05 API auth security concurrency', () => {
  test.beforeEach(async ({ request }) => { await normalizeAdminUsersData(request); });

  test('TC_API_021 Không có token gọi API19 trả 401', async ({ request }) => {
    const response = await request.get(`${API_BASE}/admin/users`);
    expect(response.status()).toBe(401);
  });

  test('TC_API_022 Member gọi API19 trả 403', async ({ request }) => {
    const { token } = await loginApi(request, memberCreds.email, memberCreds.password);
    const response = await request.get(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
    expect(response.status()).toBe(403);
  });

  test('TC_API_023 Admin tự đổi role trả 400', async ({ request }) => {
    const login = await loginApi(request);
    const response = await request.put(`${API_BASE}/admin/users/${login.user.id}/role`, { headers: { Authorization: `Bearer ${login.token}` }, data: { role: 'member' } });
    expect(response.status()).toBe(400);
    await expectMessageIdOrMessage(await response.json(), 'USER-E-005');
  });

  test('TC_API_024 Admin tự khóa chính mình trả 400', async ({ request }) => {
    const login = await loginApi(request);
    const response = await request.put(`${API_BASE}/admin/users/${login.user.id}/status`, { headers: { Authorization: `Bearer ${login.token}` }, data: { status: 'locked', locked_reason: 'Vi phạm quy định cộng đồng' } });
    expect(response.status()).toBe(400);
    await expectMessageIdOrMessage(await response.json(), 'USER-E-006');
  });

  test('TC_API_025 DELETE user hợp lệ trả 200 và set deleted_at', async ({ request }) => {
    const headers = await authHeaders(request);
    const email = `ita.member.delete.${Date.now()}@hoianblog.vn`;
    await request.post(`${API_BASE}/admin/users`, { headers, data: { name: 'ITa Member Delete', email, password: 'password123', role: 'member', status: 'active' } });
    const target = await getUserByEmail(request, headers, email);
    const response = await request.delete(`${API_BASE}/admin/users/${target.id}`, { headers });
    expect(response.status()).toBe(200);
    await expectMessageIdOrMessage(await response.json(), 'USER-S-005');
    expect(await getUserByEmail(request, headers, email)).toBeUndefined();
  });

  test('TC_API_026 Keyword SQL injection không phá query và trả 200/empty', async ({ request }) => {
    const headers = await authHeaders(request);
    const response = await request.get(`${API_BASE}/admin/users`, { headers, params: { keyword: td.sqlInjection } });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.items).toEqual(expect.any(Array));
  });

  test('TC_API_027 XSS trong name được lưu/render an toàn, không thực thi script', async ({ page, request }) => {
    const headers = await authHeaders(request);
    const target = await getUserByEmail(request, headers, 'ita.member.lock@hoianblog.vn');
    const response = await request.put(`${API_BASE}/admin/users/${target.id}`, { headers, data: { name: td.xssName, phone: '0912345678', address: 'Đà Nẵng', birthdate: '1995-01-20', gender: 'male' } });
    expect([200, 422]).toContain(response.status());
    if (response.status() === 200) {
      let dialogOpened = false;
      page.on('dialog', async (dialog) => { dialogOpened = true; await dialog.dismiss(); });
      const usersPage = new AdminUserListPage(page);
      await usersPage.openWithAdmin();
      await expect(page.getByText(td.xssName)).toBeVisible();
      expect(dialogOpened).toBeFalsy();
    }
  });

  test('TC_API_028 Hai admin cập nhật cùng user theo last write wins/updated_at', async ({ request }) => {
    const headers = await authHeaders(request);
    const target = await getUserByEmail(request, headers, 'ita.member.lock@hoianblog.vn');
    const first = await request.put(`${API_BASE}/admin/users/${target.id}`, { headers, data: { name: 'A update', phone: '0912345678', address: 'Đà Nẵng', birthdate: '1995-01-20', gender: 'male' } });
    const second = await request.put(`${API_BASE}/admin/users/${target.id}`, { headers, data: { name: 'B update', phone: '0912345678', address: 'Đà Nẵng', birthdate: '1995-01-20', gender: 'male' } });
    expect(first.status()).toBe(200);
    expect(second.status()).toBe(200);
    const detail = await request.get(`${API_BASE}/admin/users/${target.id}`, { headers });
    expect((await detail.json()).name).toBe('B update');
  });
});
