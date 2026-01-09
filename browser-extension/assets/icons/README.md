# Icons for GunGong Extension

## Required Icons

สร้างไอคอนในขนาดต่างๆ สำหรับ Extension:

### Main Icon (จำเป็น)
- `icon16.png` - 16x16px - แสดงใน Extension management page
- `icon48.png` - 48x48px - แสดงใน Extension management page และ permissions
- `icon128.png` - 128x128px - แสดงใน Chrome Web Store

### Optional Icons (ทางเลือก)
- `icon32.png` - 32x32px - Alternative size
- `icon64.png` - 64x64px - Alternative size

### Notification Icons (สำหรับ notifications)
- `warning.png` - 48x48px - Icon สำหรับการแจ้งเตือนระดับ warning
- `danger.png` - 48x48px - Icon สำหรับการแจ้งเตือนอันตราย

## การสร้างไอคอน

### แนวทางการออกแบบ

1. **สี**:
   - ใช้โทนสี: #667eea (น้ำเงิน-ม่วง) และ #764ba2 (ม่วง)
   - สำหรับ warning: #ffc107 (เหลือง)
   - สำหรับ danger: #dc3545 (แดง)

2. **สัญลักษณ์**:
   - โล่ (shield) - แทนการปกป้อง
   - เครื่องหมายติ๊ก - แทนการตรวจสอบ
   - ตัวอักษร "G" - ย่อจาก GunGong

3. **รูปแบบ**:
   - Background: Gradient หรือ Solid color
   - Icon: Simple และ recognizable
   - Style: Modern, Flat design

### ตัวอย่างโค้ด SVG (ใช้แปลงเป็น PNG)

```svg
<!-- icon.svg -->
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="24" fill="url(#grad)"/>
  <path d="M64 20 L100 40 L100 70 C100 90 85 105 64 108 C43 105 28 90 28 70 L28 40 Z"
        fill="white" opacity="0.9"/>
  <text x="64" y="75" font-family="Arial" font-size="48" font-weight="bold"
        fill="#667eea" text-anchor="middle">✓</text>
</svg>
```

## การแปลง SVG เป็น PNG

### ใช้ Online Tools
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [SVG to PNG Converter](https://svgtopng.com/)

### ใช้ Command Line (ImageMagick)
```bash
# ติดตั้ง ImageMagick
brew install imagemagick  # macOS
apt-get install imagemagick  # Ubuntu

# แปลง SVG เป็น PNG ในขนาดต่างๆ
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### ใช้ Figma/Adobe Illustrator
1. สร้างไอคอนใน Figma/Illustrator
2. Export เป็น PNG ในขนาดที่ต้องการ
3. ตั้งค่า export:
   - Background: Transparent
   - Format: PNG
   - Quality: High

## Temporary Placeholder Icons

หากยังไม่มีไอคอน สามารถสร้าง placeholder ได้ชั่วคราว:

### ใช้ Text-based Icon
สร้างไอคอนจากตัวอักษรง่ายๆ (ดู `create-placeholder-icons.html` ด้านล่าง)

### Download Free Icons
- [Flaticon](https://www.flaticon.com/)
- [Icons8](https://icons8.com/)
- [Font Awesome](https://fontawesome.com/)

แนะนำคีย์เวิร์ดในการค้นหา:
- "shield check"
- "security check"
- "fraud detection"
- "safety"

## การใช้งาน

หลังจากสร้างไอคอนแล้ว:
1. วางไฟล์ไอคอนทั้งหมดในโฟลเดอร์นี้
2. ตรวจสอบชื่อไฟล์ให้ตรงกับที่ระบุใน `manifest.json`
3. Reload Extension
4. ตรวจสอบว่าไอคอนแสดงผลถูกต้อง

---

**Note**: ไอคอนที่ดีจะช่วยให้ Extension ดูมืออาชีพและน่าเชื่อถือมากขึ้น!
