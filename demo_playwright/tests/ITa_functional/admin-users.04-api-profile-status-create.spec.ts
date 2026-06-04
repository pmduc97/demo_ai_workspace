import { expect, test } from '@playwright/test';
import { API_BASE, authHeaders, expectMessageIdOrMessage, getUserByEmail, normalizeAdminUsersData, td } from '../../utils/adminUsersFixtures';

test.describe('ITa Admin Users - Chunk 04 API profile status create', () => {
  test.beforeEach(async ({ request }) => { await normalizeAdminUsersData(request); });

  for (const tc of [
    ['TC_API_011', { name: '', phone: '0912345678', address: 'Đà Nẵng', birthdate: '1995-01-20', gender: 'male' }],
    ['TC_API_012', { name: td.name101, phone: '0912345678', address: 'Đà Nẵng', birthdate: '1995-01-20', gender: 'male' }],
    ['TC_API_013', { name: 'Nguyễn Văn A', phone: td.phoneInvalid, address: 'Đà Nẵng', birthdate: '1995-01-20', gender: 'male' }],
    ['TC_API_019', { name: 'Nguyễn Văn A', phone: '0912345678', address: 'Đà Nẵng', birthdate: td.futureBirthdate, gender: 'male' }],
    ['TC_API_020', { name: 'Nguyễn Văn A', phone: '0912345678', address: 'Đà Nẵng', birthdate: '1995-01-20', gender: 'secret' }],
  ] as const) {
    test(`${tc[0]} PUT profile invalid trả 422`, async ({ request }) => {
      const headers = await authHeaders(request);
      const target = await getUserByEmail(request, headers, 'ita.member.lock@hoianblog.vn');
      const response = await request.put(`${API_BASE}/admin/users/${target.id}`, { headers, data: tc[1] });
      expect(response.status()).toBe(422);
      await expectMessageIdOrMessage(await response.json(), 'USER-E-001');
    });
  }

  test('TC_API_014 PUT khóa user hợp lệ trả 200 và DB cập nhật locked', async ({ request }) => {
    const headers = await authHeaders(request);
    const target = await getUserByEmail(request, headers, 'ita.member.lock@hoianblog.vn');
    const response = await request.put(`${API_BASE}/admin/users/${target.id}/status`, { headers, data: { status: 'locked', locked_reason: 'Vi phạm quy định cộng đồng' } });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.status).toBe('locked');
    const reloaded = await getUserByEmail(request, headers, 'ita.member.lock@hoianblog.vn');
    expect(reloaded.status).toBe('locked');
  });

  test('TC_API_015 PUT status locked thiếu reason trả 422', async ({ request }) => {
    const headers = await authHeaders(request);
    const target = await getUserByEmail(request, headers, 'ita.member.lock@hoianblog.vn');
    const response = await request.put(`${API_BASE}/admin/users/${target.id}/status`, { headers, data: { status: 'locked', locked_reason: '' } });
    expect(response.status()).toBe(422);
    await expectMessageIdOrMessage(await response.json(), 'USER-E-001');
  });

  test('TC_API_016 POST tạo user hợp lệ trả 201', async ({ request }) => {
    const headers = await authHeaders(request);
    const email = `ita.new.user.${Date.now()}@hoianblog.vn`;
    const response = await request.post(`${API_BASE}/admin/users`, { headers, data: { name: 'ITa New User', email, password: td.createValid.password, role: 'member', status: 'active', gender: 'unknown' } });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain('password_hash');
    expect((await getUserByEmail(request, headers, email)).email).toBe(email);
  });

  test('TC_API_017 POST email trùng trả 409', async ({ request }) => {
    const headers = await authHeaders(request);
    const response = await request.post(`${API_BASE}/admin/users`, { headers, data: { name: 'Duplicate Email', email: 'member@hoianblog.vn', password: 'password123', role: 'member', status: 'active' } });
    expect(response.status()).toBe(409);
    await expectMessageIdOrMessage(await response.json(), 'USER-E-002');
  });

  test('TC_API_018 POST password dưới 6 ký tự trả 422', async ({ request }) => {
    const headers = await authHeaders(request);
    const response = await request.post(`${API_BASE}/admin/users`, { headers, data: { name: 'Short Password', email: `short.${Date.now()}@hoianblog.vn`, password: '12345', role: 'member', status: 'active' } });
    expect(response.status()).toBe(422);
    await expectMessageIdOrMessage(await response.json(), 'USER-E-001');
  });
});
