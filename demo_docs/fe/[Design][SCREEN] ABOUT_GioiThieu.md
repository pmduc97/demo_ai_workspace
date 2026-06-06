---
version: 1.0
created: 2026-06-03
updated: 2026-06-06
status: stable
---

# [Design][SCREEN] ABOUT_GioiThieu

## Change Log
| Ver | Ngày | Nội dung | Người tạo |
|-----|------|----------|-----------|
| 1.0 | 2026-06-03 | Tạo tài liệu ban đầu | GitHub Copilot |
| 1.1 | 2026-06-06 | Chuẩn hóa 12 sections, loại bỏ emoji, thêm YAML frontmatter | docs-agent |

## 1. Tổng quan
Trang tĩnh giới thiệu về blog, sứ mệnh và các chủ đề nội dung. Không có API call.

## 2. Thông tin chung
| Thuộc tính | Giá trị |
|-----------|---------|
| Route | `/about` |
| Auth yêu cầu | Không |
| Redirect nếu chưa login | Không |
| URL Params | Không có |

## 3. Navigation

### Vào từ đâu
| Nguồn | Điều kiện |
|-------|----------|
| Navbar | Click link "Giới Thiệu" |
| Nhập URL | Public |

### Đi đến đâu
| Hành động | Destination |
|-----------|-------------|
| Click Navbar link khác | Trang tương ứng |

## 4. Layout & Components
```jsx
<Navbar />
<main className="min-h-[100dvh]">
  <PageHeader />      {/* Banner + tiêu đề */}
  <MissionSection />  {/* 2 cột: ảnh trái + text phải */}
  <TopicsSection />   {/* Grid 3 cột chủ đề */}
  <TeamSection />     {/* Grid 2-3 cột thành viên */}
</main>
<Footer />
```
Components dùng lại: `Navbar`, `Footer`.

## 5. Ma trận trạng thái UI
| Trạng thái | PageHeader | MissionSection | TopicsSection | TeamSection |
|-----------|-----------|---------------|--------------|------------|
| Loaded | Hiển thị | Hiển thị | Hiển thị | Hiển thị |

## 6. Chi tiết UI từng section

### 6.1 PageHeader
- Ảnh banner du lịch (ảnh tĩnh trong `/public/images/about-banner.jpg`)
- Overlay tối 50%
- Tiêu đề: "Về Chúng Tôi" (h1, trắng, căn giữa)
- Tagline: "Chia sẻ vẻ đẹp du lịch Việt Nam đến mọi người"

### 6.2 MissionSection
- Layout 2 cột: ảnh trái + text phải (desktop) / stack dọc (mobile)
- Tiêu đề: "Sứ Mệnh Của Chúng Tôi"
- Nội dung: đoạn văn giới thiệu blog, mục tiêu chia sẻ văn hóa và điểm đến du lịch Việt Nam
- Ảnh minh họa điểm đến du lịch

### 6.3 TopicsSection
- Tiêu đề: "Chủ Đề Nội Dung"
- Grid 3 cột, mỗi ô gồm: icon (SVG) + tên chủ đề + mô tả ngắn
  - Du lịch: Khám phá địa điểm, lịch trình, kinh nghiệm du lịch
  - Ẩm thực: Món ăn đặc sản, nhà hàng, công thức nấu ăn
  - Văn hóa: Lịch sử, lễ hội, phong tục tập quán
- Nền mỗi ô: màu pastel khác nhau

### 6.4 TeamSection
- Tiêu đề: "Đội Ngũ Biên Tập"
- Grid 2-3 cột, mỗi thành viên: avatar (ảnh tròn 80px) + tên + vai trò + mô tả ngắn
- Dữ liệu tĩnh (hardcode trong component)

## 7. API Calls
Không có API call. Toàn bộ nội dung là static.

## 8. State Management
Không có state động.

## 9. Xử lý lỗi & Edge Cases
Không có (trang tĩnh).

## 10. Responsive
| Section | Mobile | Desktop |
|---------|--------|---------|
| MissionSection | Stack dọc | 2 cột |
| TopicsSection | 1 cột | 3 cột |
| TeamSection | 1 cột | 3 cột |

## 11. Events & Actions
Không có event động.

## 12. Message List
Không có message (trang tĩnh).
