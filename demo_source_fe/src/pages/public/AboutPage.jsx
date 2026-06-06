import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-white">
      {/* PageHeader */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Về Chúng Tôi</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Chia sẻ vẻ đẹp du lịch Việt Nam đến mọi người
          </p>
        </div>
      </section>

      {/* MissionSection */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1557425955-df376b5903c8?auto=format&fit=crop&w=800&q=80" 
              alt="Sứ mệnh" 
              className="rounded-lg shadow-lg w-full h-[400px] object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Blog Du Lịch ra đời với mong muốn trở thành một cuốn cẩm nang trực tuyến, nơi lưu giữ và chia sẻ những trải nghiệm tuyệt vời nhất về các điểm đến trên khắp mọi miền đất nước Việt Nam.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi tin rằng mỗi chuyến đi không chỉ là việc đặt chân đến một vùng đất mới, mà còn là hành trình khám phá văn hóa, ẩm thực và con người. Qua từng bài viết, chúng tôi hy vọng sẽ truyền cảm hứng xê dịch đến bạn đọc.
            </p>
          </div>
        </div>
      </section>

      {/* TopicsSection */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Chủ Đề Nội Dung</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl text-center">
              <div className="text-5xl mb-4">🏖️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Du lịch</h3>
              <p className="text-gray-600">Khám phá địa điểm, lịch trình, kinh nghiệm du lịch chi tiết cho từng vùng miền.</p>
            </div>
            <div className="bg-orange-50 p-8 rounded-xl text-center">
              <div className="text-5xl mb-4">🍜</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Ẩm thực</h3>
              <p className="text-gray-600">Món ăn đặc sản, nhà hàng nổi bật và những công thức nấu ăn mang đậm hương vị địa phương.</p>
            </div>
            <div className="bg-green-50 p-8 rounded-xl text-center">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Văn hóa</h3>
              <p className="text-gray-600">Tìm hiểu lịch sử, lễ hội truyền thống và phong tục tập quán độc đáo của người Việt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TeamSection */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Đội Ngũ Biên Tập</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Nguyễn Văn A',
              role: 'Tổng Biên Tập',
              desc: 'Đam mê xê dịch và nhiếp ảnh, đã đặt chân đến 63 tỉnh thành.',
              avatar: 'https://i.pravatar.cc/150?img=11'
            },
            {
              name: 'Trần Thị B',
              role: 'Biên Tập Viên Ẩm Thực',
              desc: 'Chuyên gia review ẩm thực với tình yêu mãnh liệt dành cho món ăn đường phố.',
              avatar: 'https://i.pravatar.cc/150?img=5'
            },
            {
              name: 'Lê Văn C',
              role: 'Biên Tập Viên Văn Hóa',
              desc: 'Nhà nghiên cứu văn hóa, luôn tìm kiếm những câu chuyện lịch sử thú vị.',
              avatar: 'https://i.pravatar.cc/150?img=12'
            }
          ].map((member, idx) => (
            <div key={idx} className="text-center">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-md"
              />
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
