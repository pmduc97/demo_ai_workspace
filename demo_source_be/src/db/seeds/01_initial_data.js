const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('posts').del();
  await knex('categories').del();
  await knex('users').del();

  const hash = await bcrypt.hash('password123', 10);

  const [adminId, memberId] = await knex('users').insert([
    { email: 'admin@hoianblog.vn', password_hash: hash, name: 'Admin', role: 'admin' },
    { email: 'member@hoianblog.vn', password_hash: hash, name: 'Nguyễn Văn A', role: 'member' },
  ]).returning('id');

  const [dulichId, amthucId, vanhoadId] = await knex('categories').insert([
    { name: 'Du lịch', slug: 'du-lich', description: 'Tin tức du lịch Hội An - Đà Nẵng' },
    { name: 'Ẩm thực', slug: 'am-thuc', description: 'Ẩm thực đặc sắc miền Trung' },
    { name: 'Văn hóa', slug: 'van-hoa', description: 'Văn hóa và lịch sử Hội An' },
  ]).returning('id');

  await knex('posts').insert([
    {
      title: 'Khám phá phố cổ Hội An về đêm',
      slug: 'kham-pha-pho-co-hoi-an-ve-dem',
      content: '<p>Hội An về đêm lung linh với hàng nghìn chiếc đèn lồng rực rỡ...</p>',
      status: 'published',
      author_id: adminId,
      category_id: dulichId,
    },
    {
      title: 'Cao lầu - Món ăn đặc trưng của Hội An',
      slug: 'cao-lau-mon-an-dac-trung-hoi-an',
      content: '<p>Cao lầu là món ăn chỉ có ở Hội An, với sợi mì đặc biệt...</p>',
      status: 'published',
      author_id: memberId,
      category_id: amthucId,
    },
    {
      title: 'Lễ hội đèn lồng Hội An tháng Giêng',
      slug: 'le-hoi-den-long-hoi-an-thang-gieng',
      content: '<p>Vào ngày rằm hàng tháng, phố cổ Hội An tắt điện và thắp đèn lồng...</p>',
      status: 'draft',
      author_id: memberId,
      category_id: vanhoadId,
    },
  ]);
};
