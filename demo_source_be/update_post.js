const knex = require('knex')(require('./knexfile').development);

async function updatePost() {
  try {
    await knex('posts').where('slug', 'admin-post-1').update({
      title: 'Khám phá vẻ đẹp tiềm ẩn của biển miền Trung',
      content: `
        <p>Miền Trung Việt Nam không chỉ nổi tiếng với những di sản văn hóa thế giới mà còn sở hữu những bãi biển tuyệt đẹp, hoang sơ và đầy quyến rũ.</p>
        <h2>1. Biển Mỹ Khê - Đà Nẵng</h2>
        <p>Được tạp chí Forbes bình chọn là một trong sáu bãi biển quyến rũ nhất hành tinh, Mỹ Khê thu hút du khách bởi bãi cát trắng mịn, nước biển trong xanh và hệ thống dịch vụ hoàn hảo.</p>
        <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop" alt="Biển Mỹ Khê" />
        <p>Đến đây, bạn không chỉ được tắm biển mà còn có cơ hội tham gia nhiều hoạt động thể thao dưới nước thú vị như lướt ván, dù lượn...</p>
        <h2>2. Biển Lăng Cô - Huế</h2>
        <p>Nằm lọt thỏm giữa một nhánh rẽ của dãy Trường Sơn đâm ra biển, Lăng Cô mang vẻ đẹp hiền hòa, thơ mộng với bãi cát dài thoai thoải và làn nước trong vắt.</p>
        <blockquote><p>"Lăng Cô đẹp như một bức tranh thủy mặc, nơi giao hòa giữa núi rừng và biển cả."</p></blockquote>
        <p>Hãy đến và tự mình trải nghiệm vẻ đẹp tuyệt vời này nhé!</p>
      `,
      thumbnail_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop'
    });
    console.log('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
  } finally {
    knex.destroy();
  }
}

updatePost();
