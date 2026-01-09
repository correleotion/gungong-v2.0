# GunGong Browser Extension

Browser Extension สำหรับตรวจสอบหมายเลขโทรศัพท์ บัญชีธนาคาร และวิเคราะห์ความเสี่ยงจากข้อความด้วย AI

## ✨ ฟีเจอร์หลัก

### 🔍 สแกนและตรวจจับอัตโนมัติ
- **สแกนหน้าเว็บอัตโนมัติ** - ตรวจจับหมายเลขโทรศัพท์และบัญชีธนาคารในหน้าเว็บที่เปิด
- **ไฮไลท์ข้อมูลที่พบ** - แสดงข้อมูลที่ตรวจพบด้วยสีและเส้นใต้
- **คลิกเพื่อตรวจสอบ** - คลิกที่ข้อมูลที่ไฮไลท์เพื่อตรวจสอบทันที

### ✅ ตรวจสอบกับฐานข้อมูล Blacklist
- ตรวจสอบหมายเลขโทรศัพท์และบัญชีธนาคารกับฐานข้อมูล blacklist
- แสดงรายละเอียดการรายงาน ระดับความเสี่ยง
- บันทึกประวัติการตรวจสอบ

### 🤖 วิเคราะห์ความเสี่ยงด้วย AI
- วิเคราะห์ข้อความเพื่อตรวจจับลักษณะของการฉ้อโกง
- แสดงระดับความเสี่ยง (สูง/ปานกลาง/ต่ำ)
- ให้คำแนะนำและสัญญาณเตือน

### 🔔 การแจ้งเตือน
- แจ้งเตือนเมื่อพบข้อมูลในบัญชีดำ
- แจ้งเตือนเมื่อตรวจพบความเสี่ยงสูง
- ปรับแต่งการแจ้งเตือนได้ตามต้องการ

### 📊 ประวัติการตรวจสอบ
- เก็บบันทึกการตรวจสอบทั้งหมด
- ดูย้อนหลังได้ง่าย
- ข้อมูลเก็บไว้ในเครื่องของคุณ (ไม่ส่งไปเซิร์ฟเวอร์)

### ⚙️ Context Menu
- คลิกขวาบนข้อความที่เลือก → ตรวจสอบด้วย GunGong
- วิเคราะห์ความเสี่ยงจากข้อความที่เลือก
- สแกนทั้งหน้า

## 🚀 การติดตั้ง

### 1. ติดตั้งบน Chrome/Edge/Brave

#### แบบ Developer Mode (สำหรับทดสอบ)

1. โคลนหรือดาวน์โหลดโปรเจกต์
   ```bash
   git clone https://github.com/your-repo/gungong-v2.0.git
   cd gungong-v2.0/browser-extension
   ```

2. เปิด Chrome และไปที่ `chrome://extensions/`

3. เปิด **Developer mode** (สวิตช์มุมขวาบน)

4. คลิก **Load unpacked**

5. เลือกโฟลเดอร์ `browser-extension`

6. Extension จะปรากฏในแถบเครื่องมือ ✅

#### แบบ Package (.crx)

1. ดาวน์โหลดไฟล์ `.crx` จาก [Releases](https://github.com/your-repo/gungong/releases)

2. ลากไฟล์ `.crx` ไปวางในหน้า `chrome://extensions/`

3. คลิก **Add Extension**

### 2. ติดตั้งบน Firefox

1. โคลนหรือดาวน์โหลดโปรเจกต์

2. เปิด Firefox และไปที่ `about:debugging#/runtime/this-firefox`

3. คลิก **Load Temporary Add-on**

4. เลือกไฟล์ `manifest.json` ในโฟลเดอร์ `browser-extension`

5. Extension จะทำงานจนกว่าจะปิด Firefox

## ⚙️ การตั้งค่า

### การตั้งค่า Backend API

1. คลิกขวาที่ไอคอน Extension → **Options** หรือ **ตั้งค่า**

2. ใส่ URL ของ GunGong Backend API
   ```
   https://your-api-domain.com
   ```

   หรือสำหรับ local development:
   ```
   http://localhost:8000
   ```

3. คลิก **ทดสอบการเชื่อมต่อ** เพื่อตรวจสอบ

4. คลิก **บันทึกการตั้งค่า**

### ตัวเลือกอื่นๆ

- **สแกนหน้าเว็บอัตโนมัติ** - เปิด/ปิดการสแกนอัตโนมัติเมื่อโหลดหน้า
- **ตรวจสอบอัตโนมัติ** - ตรวจสอบข้อมูลที่พบกับ blacklist ทันที
- **ไฮไลท์ข้อมูลในหน้าเว็บ** - แสดงเส้นใต้และสีพื้นหลังสำหรับข้อมูลที่พบ
- **การแจ้งเตือน** - เปิด/ปิดการแจ้งเตือน
- **บันทึกประวัติ** - เปิด/ปิดการเก็บประวัติการตรวจสอบ

## 📖 วิธีใช้งาน

### 1. ตรวจสอบหมายเลขโทรศัพท์/บัญชีธนาคาร

#### จาก Popup
1. คลิกที่ไอคอน Extension
2. เลือกแท็บ **ตรวจสอบ**
3. ใส่หมายเลขที่ต้องการตรวจสอบ
4. คลิก **ตรวจสอบ**

#### จาก Context Menu
1. เลือกข้อความที่มีหมายเลขโทรศัพท์/บัญชีธนาคาร
2. คลิกขวา → **GunGong** → **ตรวจสอบข้อมูลที่เลือก**

#### จากข้อมูลที่ไฮไลท์
1. Extension จะสแกนและไฮไลท์ข้อมูลอัตโนมัติ
2. คลิกที่ข้อมูลที่ไฮไลท์เพื่อตรวจสอบ

### 2. วิเคราะห์ข้อความ

#### จาก Popup
1. คลิกที่ไอคอน Extension
2. เลือกแท็บ **วิเคราะห์ข้อความ**
3. วางข้อความที่ต้องการวิเคราะห์
4. คลิก **วิเคราะห์**

#### จาก Context Menu
1. เลือกข้อความที่ต้องการวิเคราะห์
2. คลิกขวา → **GunGong** → **วิเคราะห์ความเสี่ยง**

### 3. สแกนหน้าเว็บ

#### จาก Popup
1. คลิกที่ไอคอน Extension
2. คลิก **🔍 สแกนหน้าเว็บนี้**

#### จาก Context Menu
1. คลิกขวาบนหน้าเว็บ → **GunGong** → **สแกนหน้านี้**

### 4. ดูประวัติ

1. คลิกที่ไอคอน Extension
2. เลือกแท็บ **ประวัติ**
3. คลิกที่รายการเพื่อดูรายละเอียด

## 🔧 การพัฒนา

### โครงสร้างโปรเจกต์

```
browser-extension/
├── manifest.json           # Manifest V3 configuration
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
├── content/
│   └── content.js         # Content script (runs on web pages)
├── background/
│   └── background.js      # Background service worker
├── options/
│   ├── options.html       # Options page
│   ├── options.css        # Options styles
│   └── options.js         # Options logic
├── styles/
│   └── content.css        # Styles for content script
├── utils/
│   ├── api.js             # API helper functions
│   └── patterns.js        # RegEx patterns for detection
└── assets/
    └── icons/             # Extension icons
```

### การพัฒนาเพิ่มเติม

1. **แก้ไขโค้ด** - แก้ไขไฟล์ในโฟลเดอร์ที่ต้องการ

2. **รีโหลด Extension**
   - ไปที่ `chrome://extensions/`
   - คลิกปุ่ม refresh ที่ Extension

3. **ดู Console Log**
   - **Popup**: คลิกขวาที่ popup → Inspect
   - **Background**: ใน `chrome://extensions/` → Service Worker → Inspect
   - **Content Script**: F12 บนหน้าเว็บ → Console

### API Endpoints ที่ใช้

Extension เชื่อมต่อกับ Backend ผ่าน REST API:

- `POST /blacklist/check` - ตรวจสอบ blacklist
- `POST /fraud-v2/analyze` - วิเคราะห์ความเสี่ยง
- `GET /health` - ตรวจสอบสถานะเซิร์ฟเวอร์

## 🔒 ความเป็นส่วนตัว

- **ข้อมูลเก็บในเครื่อง** - ประวัติและการตั้งค่าเก็บไว้ในเครื่องของคุณ
- **ไม่มีการติดตาม** - Extension ไม่ส่งข้อมูลการใช้งานไปยังที่อื่น
- **API Calls** - มีเพียงข้อมูลที่คุณตรวจสอบเท่านั้นที่ส่งไป Backend

## 📝 Permissions

Extension ต้องการสิทธิ์ดังนี้:

- `storage` - เก็บการตั้งค่าและประวัติ
- `activeTab` - เข้าถึงหน้าเว็บปัจจุบัน
- `contextMenus` - สร้าง context menu
- `notifications` - แสดงการแจ้งเตือน
- `host_permissions: <all_urls>` - สแกนหน้าเว็บทุกเว็บไซต์

## 🐛 การรายงานปัญหา

พบปัญหาหรือมีข้อเสนอแนะ?
- สร้าง Issue ที่ [GitHub Issues](https://github.com/your-repo/gungong/issues)
- ติดต่อทีมพัฒนา

## 📄 License

[ใส่ License ของคุณที่นี่]

## 🙏 Credits

Developed with ❤️ by [Your Team Name]

---

**⚠️ คำเตือน**: Extension นี้เป็นเครื่องมือช่วยในการตรวจสอบเบื้องต้นเท่านั้น ไม่สามารถรับประกันความถูกต้อง 100% โปรดใช้วิจารณญาณในการตัดสินใจ
