# คู่มือการติดตั้ง GunGong Browser Extension

## ข้อกำหนดเบื้องต้น

1. **Browser ที่รองรับ**:
   - Google Chrome 88+
   - Microsoft Edge 88+
   - Brave Browser
   - Chromium-based browsers

2. **GunGong Backend API**:
   - ต้องมี Backend API ที่รันอยู่
   - สามารถเข้าถึงได้ผ่าน HTTP/HTTPS

## การติดตั้งแบบ Developer Mode

### สำหรับ Chrome/Edge/Brave

#### ขั้นตอนที่ 1: เตรียมไฟล์ Extension

```bash
# Clone repository
git clone https://github.com/your-repo/gungong-v2.0.git

# เข้าไปในโฟลเดอร์ extension
cd gungong-v2.0/browser-extension
```

#### ขั้นตอนที่ 2: โหลด Extension

1. เปิด Chrome/Edge/Brave browser

2. ไปที่หน้า Extensions:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

3. เปิดใช้งาน **Developer mode**:
   - มองหาสวิตช์ "Developer mode" ที่มุมขวาบน
   - คลิกเพื่อเปิดใช้งาน

4. คลิกปุ่ม **Load unpacked**

5. เลือกโฟลเดอร์ `browser-extension` ที่คุณโคลนมา

6. Extension จะปรากฏในรายการพร้อมใช้งาน ✅

#### ขั้นตอนที่ 3: ปักหมุด Extension

1. คลิกที่ไอคอน Extensions (รูปชิ้นจิ๊กซอว์) ในแถบเครื่องมือ

2. หา "GunGong - ตรวจสอบการฉ้อโกง"

3. คลิกที่ไอคอนหมุด (📌) เพื่อปักหมุดไว้ในแถบเครื่องมือ

## การตั้งค่าครั้งแรก

### 1. เปิดหน้าตั้งค่า

คลิกขวาที่ไอคอน Extension → **Options** หรือ **ตั้งค่า**

### 2. ตั้งค่า Backend API URL

ใส่ URL ของ GunGong Backend:

**สำหรับ Production:**
```
https://your-api-domain.com
```

**สำหรับ Local Development:**
```
http://localhost:8000
```

### 3. ทดสอบการเชื่อมต่อ

1. คลิกปุ่ม **🔍 ทดสอบการเชื่อมต่อ**

2. ถ้าเห็นข้อความ "✓ เชื่อมต่อสำเร็จ!" แสดงว่าตั้งค่าถูกต้อง

3. ถ้ามีปัญหา:
   - ตรวจสอบว่า Backend กำลังรันอยู่
   - ตรวจสอบ URL ว่าถูกต้อง
   - ตรวจสอบ CORS settings ของ Backend

### 4. ปรับแต่งการตั้งค่า (ตัวเลือก)

- ✅ **สแกนหน้าเว็บอัตโนมัติ** - แนะนำให้เปิด
- ⚠️ **ตรวจสอบอัตโนมัติ** - ปิดไว้หากไม่ต้องการส่ง request บ่อย
- ✅ **ไฮไลท์ข้อมูล** - แนะนำให้เปิด
- ✅ **การแจ้งเตือน** - เปิดเพื่อรับการแจ้งเตือน
- ✅ **บันทึกประวัติ** - เปิดเพื่อเก็บประวัติ

### 5. บันทึกการตั้งค่า

คลิก **💾 บันทึกการตั้งค่า**

Extension จะรีโหลดอัตโนมัติ

## การตรวจสอบการติดตั้ง

### 1. ทดสอบ Popup

1. คลิกที่ไอคอน GunGong
2. ควรเห็นหน้าต่าง popup ที่มี 3 แท็บ:
   - ตรวจสอบ
   - วิเคราะห์ข้อความ
   - ประวัติ

### 2. ทดสอบการตรวจสอบ

1. ใส่หมายเลขโทรศัพท์ทดสอบ เช่น `0812345678`
2. คลิก **ตรวจสอบ**
3. ควรเห็นผลการตรวจสอบ

### 3. ทดสอบการสแกนหน้าเว็บ

1. เปิดหน้าเว็บที่มีหมายเลขโทรศัพท์
2. ดูว่ามีการไฮไลท์หมายเลขหรือไม่
3. คลิกที่หมายเลขที่ไฮไลท์เพื่อตรวจสอบ

### 4. ทดสอบ Context Menu

1. เลือกข้อความในหน้าเว็บ
2. คลิกขวา
3. ควรเห็นเมนู "GunGong - ตรวจสอบการฉ้อโกง"

## การแก้ปัญหา

### ปัญหา: Extension ไม่ปรากฏหลังติดตั้ง

**วิธีแก้:**
1. รีโหลด Extensions page (กด F5)
2. ตรวจสอบว่าเปิด Developer mode แล้ว
3. ลองโหลด Extension ใหม่

### ปัญหา: ไม่สามารถเชื่อมต่อ API ได้

**วิธีแก้:**
1. ตรวจสอบว่า Backend รันอยู่:
   ```bash
   curl http://localhost:8000/health
   ```

2. ตรวจสอบ CORS settings ใน Backend:
   - Backend ต้อง allow origins จาก `chrome-extension://`
   - ใน FastAPI:
     ```python
     from fastapi.middleware.cors import CORSMiddleware

     app.add_middleware(
         CORSMiddleware,
         allow_origins=["*"],  # สำหรับ dev เท่านั้น
         allow_methods=["*"],
         allow_headers=["*"],
     )
     ```

3. เช็ค Console Logs:
   - คลิกขวาที่ popup → Inspect
   - ดู error ใน Console tab

### ปัญหา: Content Script ไม่ทำงาน

**วิธีแก้:**
1. รีโหลด Extension
2. รีเฟรชหน้าเว็บ (F5)
3. เช็ค Console ของหน้าเว็บ (F12)
4. ตรวจสอบว่า content script inject แล้ว:
   - ใน Console พิมพ์: `console.log(document.querySelector('.gungong-highlight'))`

### ปัญหา: Service Worker หยุดทำงาน

**วิธีแก้:**
1. ไปที่ `chrome://extensions/`
2. หา GunGong Extension
3. คลิก "Service worker" → "Inspect"
4. ดู error ใน Console
5. คลิก "Reload" ที่ Service Worker

### ปัญหา: Notification ไม่แสดง

**วิธีแก้:**
1. ตรวจสอบ notification permission:
   - ไปที่ `chrome://settings/content/notifications`
   - ตรวจสอบว่าเปิดใช้งานอยู่

2. เช็คการตั้งค่าใน Extension:
   - Options → เปิด "การแจ้งเตือน"

## การอัปเดต Extension

### การอัปเดตแบบ Manual

1. Pull โค้ดใหม่จาก repository:
   ```bash
   cd gungong-v2.0
   git pull origin main
   ```

2. ไปที่ `chrome://extensions/`

3. คลิกปุ่ม refresh (🔄) ที่ GunGong Extension

4. รีเฟรชหน้าเว็บที่เปิดอยู่

### การอัปเดตแบบ Auto (สำหรับ Production)

เมื่อ Extension ถูก publish บน Chrome Web Store แล้ว:
- จะอัปเดตอัตโนมัติ
- ไม่ต้องทำอะไร

## การถอนการติดตั้ง

### วิธีที่ 1: จากหน้า Extensions

1. ไปที่ `chrome://extensions/`
2. หา "GunGong - ตรวจสอบการฉ้อโกง"
3. คลิก **Remove**
4. ยืนยัน

### วิธีที่ 2: จาก Context Menu

1. คลิกขวาที่ไอคอน Extension
2. เลือก **Remove from Chrome...**
3. ยืนยัน

## การติดตั้งสำหรับ Production

### การ Package Extension

```bash
cd browser-extension
zip -r gungong-extension.zip . -x "*.git*" -x "node_modules/*" -x "*.DS_Store"
```

### การ Publish บน Chrome Web Store

1. สมัครบัญชี [Chrome Web Store Developer](https://chrome.google.com/webstore/devconsole/)
2. จ่ายค่าลงทะเบียน $5 (ครั้งเดียว)
3. Upload ไฟล์ .zip
4. กรอกรายละเอียด, screenshot, icon
5. Submit for review
6. รอการอนุมัติ (1-3 วัน)

## คำถามที่พบบ่อย (FAQ)

**Q: Extension ใช้ได้กับทุกเว็บไซต์หรือไม่?**
A: ใช่ Extension จะทำงานบนเว็บไซต์ทุกเว็บที่รองรับ content script

**Q: ข้อมูลจะถูกส่งไปที่ไหน?**
A: ข้อมูลที่คุณตรวจสอบจะส่งไปยัง Backend API ที่คุณตั้งค่าไว้เท่านั้น

**Q: Extension ใช้งานได้โดยไม่มี Backend หรือไม่?**
A: ไม่ได้ Extension ต้องการ Backend API เพื่อตรวจสอบข้อมูลกับฐานข้อมูล

**Q: รองรับ Firefox หรือไม่?**
A: Extension สามารถใช้กับ Firefox ได้ แต่ต้องโหลดแบบ temporary add-on

## การขอความช่วยเหลือ

หากมีปัญหาในการติดตั้ง:

1. **อ่าน README.md** - ดูเอกสารหลัก
2. **ตรวจสอบ Issues** - ดู [GitHub Issues](https://github.com/your-repo/gungong/issues)
3. **สร้าง Issue ใหม่** - รายงานปัญหาพร้อมรายละเอียด:
   - Browser version
   - Extension version
   - Error messages
   - Steps to reproduce

---

**เรียบร้อย!** 🎉 ตอนนี้คุณสามารถใช้งาน GunGong Extension ได้แล้ว
