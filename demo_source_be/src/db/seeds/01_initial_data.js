const bcrypt = require('bcryptjs');

exports.seed = async function (knex) {
  await knex('posts').del();
  await knex('categories').del();
  await knex('users').del();

  const hash = await bcrypt.hash('password123', 10);

  const userRows = await knex('users').insert([
    { email: 'admin@hoianblog.vn', password_hash: hash, name: 'Admin', role: 'admin' },
    { email: 'member@hoianblog.vn', password_hash: hash, name: 'Nguyễn Văn A', role: 'member' },
  ]).returning('id');
  const [adminId, memberId] = userRows.map((row) => row.id ?? row);

  const categories = [
    { name: 'Du lịch', slug: 'du-lich', description: 'Tin tức du lịch Việt Nam và các điểm đến nổi bật', status: 'active' },
    { name: 'Ẩm thực', slug: 'am-thuc', description: 'Ẩm thực đặc sắc miền Trung', status: 'active' },
    { name: 'Văn hóa', slug: 'van-hoa', description: 'Văn hóa và lịch sử các vùng miền Việt Nam', status: 'active' },
    { name: 'Lễ hội', slug: 'le-hoi', description: 'Sự kiện và lễ hội nổi bật trong năm', status: 'active' },
    { name: 'Biển đảo', slug: 'bien-dao', description: 'Tin tức biển Mỹ Khê, Cù Lao Chàm và các đảo lân cận', status: 'active' },
    { name: 'Địa điểm check-in', slug: 'dia-diem-check-in', description: 'Gợi ý góc chụp ảnh đẹp tại các điểm đến du lịch', status: 'active' },
    { name: 'Khách sạn', slug: 'khach-san', description: 'Đánh giá lưu trú, resort và homestay', status: 'active' },
    { name: 'Cẩm nang', slug: 'cam-nang', description: 'Kinh nghiệm di chuyển, lịch trình và mẹo du lịch', status: 'active' },
    { name: 'Tin địa phương', slug: 'tin-dia-phuong', description: 'Tin tức đời sống tại các điểm đến du lịch', status: 'active' },
    { name: 'Kiến trúc', slug: 'kien-truc', description: 'Nhà cổ, chùa cầu và công trình đặc trưng', status: 'active' },
    { name: 'Nghề truyền thống', slug: 'nghe-truyen-thong', description: 'Làng nghề, thủ công mỹ nghệ và ký ức phố Hội', status: 'active' },
    { name: 'Mua sắm', slug: 'mua-sam', description: 'Chợ, cửa hàng lưu niệm và đặc sản mang về', status: 'active' },
    { name: 'Ẩm thực đường phố', slug: 'am-thuc-duong-pho', description: 'Các món ngon bình dân nên thử', status: 'active' },
    { name: 'Cafe đẹp', slug: 'cafe-dep', description: 'Quán cafe có view đẹp và phong cách riêng', status: 'active' },
    { name: 'Gia đình', slug: 'gia-dinh', description: 'Gợi ý lịch trình phù hợp cho gia đình có trẻ nhỏ', status: 'active' },
    { name: 'Du lịch xanh', slug: 'du-lich-xanh', description: 'Hoạt động bền vững, thân thiện môi trường', status: 'active' },
    { name: 'Lịch trình 1 ngày', slug: 'lich-trinh-1-ngay', description: 'Gợi ý khám phá nhanh trong một ngày', status: 'active' },
    { name: 'Lịch trình cuối tuần', slug: 'lich-trinh-cuoi-tuan', description: 'Kế hoạch 2 ngày 1 đêm tại miền Trung', status: 'active' },
    { name: 'Ẩn thử nghiệm', slug: 'an-thu-nghiem', description: 'Danh mục ẩn để kiểm thử filter status', status: 'hidden' },
    { name: 'Sự kiện nội bộ', slug: 'su-kien-noi-bo', description: 'Danh mục ẩn cho nội dung chưa công bố', status: 'hidden' },
    { name: 'Review dịch vụ', slug: 'review-dich-vu', description: 'Đánh giá tour, xe đưa đón và dịch vụ du lịch', status: 'active' },
    { name: 'Bản đồ du lịch', slug: 'ban-do-du-lich', description: 'Gợi ý điểm đến theo khu vực và bản đồ', status: 'active' },
    { name: 'Mùa đẹp nhất', slug: 'mua-dep-nhat', description: 'Thời điểm đẹp nhất để khám phá các điểm đến du lịch', status: 'active' },
    { name: 'Ảnh đẹp', slug: 'anh-dep', description: 'Bộ sưu tập hình ảnh đẹp về miền Trung', status: 'active' },
  ].map((category) => ({
    ...category,
    thumbnail_url: `/uploads/categories/${category.slug}.jpg`,
    seo_title: `${category.name} du lịch Việt Nam`,
    seo_description: category.description,
    created_by: adminId,
    updated_by: adminId,
  }));

  const categoryRows = await knex('categories').insert(categories).returning(['id', 'slug']);
  const categoryMap = Object.fromEntries(categoryRows.map((row) => [row.slug, row.id]));
  const dulichId = categoryMap['du-lich'];
  const amthucId = categoryMap['am-thuc'];
  const vanhoadId = categoryMap['van-hoa'];

  await knex('posts').insert([
    {
      title: 'Khám phá điểm đến du lịch về đêm',
      slug: 'kham-pha-pho-co-hoi-an-ve-dem',
      content: '<p>Các điểm đến du lịch về đêm luôn có nét đẹp riêng với ánh sáng, ẩm thực và nhịp sống địa phương...</p>',
      status: 'published',
      author_id: adminId,
      category_id: dulichId,
      view_count: 248,
      created_by: adminId,
      updated_by: adminId,
    },
    {
      title: 'Ẩm thực địa phương - Hương vị khó quên',
      slug: 'cao-lau-mon-an-dac-trung-hoi-an',
      content: '<p>Mỗi vùng miền đều có món ăn đặc trưng, gắn với văn hóa và câu chuyện bản địa...</p>',
      status: 'published',
      author_id: memberId,
      category_id: amthucId,
      view_count: 186,
      created_by: memberId,
      updated_by: memberId,
    },
    {
      title: 'Lễ hội địa phương đầu năm',
      slug: 'le-hoi-den-long-hoi-an-thang-gieng',
      content: '<p>Các lễ hội địa phương đầu năm mang đến trải nghiệm văn hóa đặc sắc cho du khách...</p>',
      status: 'draft',
      author_id: memberId,
      category_id: vanhoadId,
      view_count: 42,
      created_by: memberId,
      updated_by: memberId,
    },
  ]);
};
