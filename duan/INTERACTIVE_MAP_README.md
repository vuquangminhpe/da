# Interactive Journey Map - README

## Tính năng mới / New Features

### 1. **Bản đồ thế giới với D3 + TopoJSON**

- Sử dụng dữ liệu TopoJSON chính thức để hiển thị bản đồ thế giới chi tiết
- Zoom và pan tương tác giống như ví dụ D3 bạn cung cấp
- Click vào quốc gia để tương tác, click background để reset zoom

### 2. **Hệ thống Animation tự động**

- Click nút **"▶️ Xem hành trình"** để bắt đầu animation tự động
- Map sẽ tự động zoom vào từng điểm dừng theo thứ tự thời gian
- Hiển thị thông tin chi tiết về mỗi điểm dừng
- Nhân vật Bác Hồ sẽ già đi theo thời gian hành trình

### 3. **Nhân vật SVG động**

- **Bác Hồ trẻ tuổi**: Khi khởi hành (1911-1917)
- **Bác Hồ trung niên**: Giai đoạn hoạt động chính trị (1917-1930)
- **Bác Hồ có râu bạc**: Trở về Việt Nam (1933-1941)
- **Thuyền buồm**: Animation khói và sóng nước
- **Lính Việt Nam**: 3 tư thế - đứng, chiến đấu, ăn mừng
- **Cờ Việt Nam**: Animation phấp phới tung bay

### 4. **Victory Sequence - Điện Biên Phủ**

Khi đến điểm dừng cuối cùng (Việt Nam 1941), sẽ xuất hiện:

- Lính Việt Nam xuất hiện và ăn mừng chiến thắng
- Cờ đỏ sao vàng được kéo lên
- Animation ăn mừng chiến thắng lịch sử

### 5. **Character Aging System**

Nhân vật Bác Hồ sẽ tự động thay đổi tuổi tác:

- Stops 1-7: `young` (trẻ, không râu)
- Stops 8-16: `middle` (trung niên, có râu đen)
- Stops 17-20: `old` (già, râu bạc)

## Cách sử dụng / How to Use

### Khởi động dự án

```bash
npm install
npm run dev
```

### Tương tác với bản đồ

1. **Xem tự động**: Click "▶️ Xem hành trình" để xem toàn bộ animation
2. **Click marker**: Click vào các điểm đỏ trên bản đồ để xem thông tin
3. **Zoom thủ công**: Sử dụng chuột scroll để zoom in/out
4. **Pan**: Click và kéo để di chuyển bản đồ
5. **Reset**: Click vào vùng nền đen để reset zoom

### Các component nhân vật

#### HoChiMinhCharacter

```tsx
<HoChiMinhCharacter
  age="young" // hoặc "middle", "old"
  x={0}
  y={0}
  scale={1}
/>
```

#### BoatCharacter

```tsx
<BoatCharacter x={0} y={0} scale={1} />
```

#### SoldierCharacter

```tsx
<SoldierCharacter
  x={0}
  y={0}
  scale={1}
  action="standing" // hoặc "fighting", "celebrating"
/>
```

#### VietnamFlag

```tsx
<VietnamFlag
  x={0}
  y={0}
  scale={1}
  waving={true} // animation phấp phới
/>
```

## Công nghệ sử dụng / Technologies

- **React + TypeScript**: Framework chính
- **D3.js**: Xử lý bản đồ và zoom
- **TopoJSON**: Dữ liệu bản đồ thế giới
- **GSAP**: Timeline và character animations
- **TailwindCSS**: Styling

## Cấu trúc code

```
src/
├── components/
│   ├── characters/          # SVG character components
│   │   ├── HoChiMinhCharacter.tsx
│   │   ├── BoatCharacter.tsx
│   │   ├── SoldierCharacter.tsx
│   │   ├── VietnamFlag.tsx
│   │   └── index.ts
│   └── sections/
│       └── Section1Journey.tsx  # Main map component
├── data/
│   └── journeyData.ts      # Journey stops data
└── public/
    └── world-110m.json     # TopoJSON world map data
```

## Tùy chỉnh / Customization

### Thay đổi tốc độ animation

Trong `Section1Journey.tsx`, tìm hàm `playJourney()`:

```tsx
tl.to({}, { duration: 3 }); // Thay đổi số 3 (giây) để điều chỉnh thời gian dừng
```

### Thay đổi zoom level

Trong `Section1Journey.tsx`, tìm hàm `zoomToStop()`:

```tsx
const scale = 3; // Thay đổi để zoom nhiều hơn hoặc ít hơn
```

### Thêm điểm dừng mới

Chỉnh sửa file `src/data/journeyData.ts`:

```typescript
{
  id: 21,
  date: 'DD/MM/YYYY',
  location: 'Tên địa điểm',
  city: 'Tên thành phố',
  country: 'Tên quốc gia',
  coordinates: [longitude, latitude],
  event: 'Sự kiện',
  details: 'Chi tiết',
  significance: 'Ý nghĩa'
}
```

## Lưu ý kỹ thuật / Technical Notes

1. **TopoJSON Data**: File `world-110m.json` được tải từ CDN chính thức
2. **Performance**: Với 20 điểm dừng, animation chạy mượt mà
3. **Responsive**: Map tự động điều chỉnh theo kích thước màn hình
4. **TypeScript**: Một số type assertion cần thiết cho D3/TopoJSON complex types

## Các cải tiến có thể thêm / Future Enhancements

- [ ] Thêm âm thanh nền và sound effects
- [ ] Animation đi bộ cho nhân vật Bác Hồ
- [ ] Timeline slider để điều khiển thủ công
- [ ] Nhiều character biến thể hơn (áo khác nhau theo giai đoạn)
- [ ] Animation battle scene chi tiết cho Điện Biên Phủ
- [ ] Export video của animation
- [ ] Multilingual support (Vietnamese + English)

## Credits

- Dữ liệu lịch sử: Tài liệu chính thống về Chủ tịch Hồ Chí Minh
- World Map: World Atlas TopoJSON
- Animations: GSAP + D3.js
- Character Design: Custom SVG illustrations

---

**Developed with ❤️ for Vietnamese History Education**
