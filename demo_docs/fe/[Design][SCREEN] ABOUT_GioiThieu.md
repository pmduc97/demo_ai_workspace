# ABOUT — Trang Giới Thiệu

## Tổng quan
Trang tĩnh giới thiệu về blog, sứ mệnh và các chủ đề nội dung. Không có API call.

## Route & Navigation
- **Route**: `/about`
- Không có params
- Điều hướng từ: Navbar menu

## Layout & Components

```
<Navbar />
<main>
  <PageHeader />
  <MissionSection />
  <TopicsSection />
  <TeamSection />
</main>
<Footer />
```

## Chi tiết UI từng section

### PageHeader
- Ảnh banner Hội An (ảnh tĩnh trong `/public/images/about-banner.jpg`)
- Overlay tối 50%
- Tiêu đề: "Về Chúng Tôi" (h1, trắng, căn giữa)
- Tagline: "Chia sẻ vẻ đẹp Hội An và Đà Nẵng đến mọi người"

### MissionSection
- Layout 2 cột: ảnh trái + text phải (desktop) / stack dọc (mobile)
- Tiêu đề: "Sứ Mệnh Của Chúng Tôi"
- Nội dung: đoạn văn giới thiệu blog, mục tiêu chia sẻ văn hóa miền Trung
- Ảnh minh họa phố cổ Hội An

### TopicsSection
- Tiêu đề: "Chủ Đề Nội Dung"
- Grid 3 cột, mỗi ô gồm: icon (emoji hoặc SVG) + tên chủ đề + mô tả ngắn
  - 🏖️ Du lịch: Khám phá địa điểm, lịch trình, kinh nghiệm du lịch
  - 🍜 Ẩm thực: Món ăn đặc sản, nhà hàng, công thức nấu ăn
  - 🏛️ Văn hóa: Lịch sử, lễ hội, phong tục tập quán
- Nền mỗi ô: màu pastel khác nhau

### TeamSection
- Tiêu đề: "Đội Ngũ Biên Tập"
- Grid 2-3 cột, mỗi thành viên: avatar (ảnh tròn 80px) + tên + vai trò + mô tả ngắn
- Dữ liệu tĩnh (hardcode trong component)

## API Calls
Không có API call. Toàn bộ nội dung là static.

## State Management
Không có state động.

## Xử lý lỗi & Edge Cases
Không có (trang tĩnh).

## Responsive
| Section | Mobile | Desktop |
|---|---|---|
| MissionSection | Stack dọc | 2 cột |
| TopicsSection | 1 cột | 3 cột |
| TeamSection | 1 cột | 3 cột |
