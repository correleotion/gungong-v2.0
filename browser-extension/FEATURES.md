# GunGong Browser Extension - รายละเอียดฟีเจอร์

## 🎯 ภาพรวม

GunGong Browser Extension เป็น extension สำหรับตรวจสอบการฉ้อโกงแบบ real-time บนเว็บเบราว์เซอร์ โดยสามารถ:
- สแกนหาหมายเลขโทรศัพท์และบัญชีธนาคารอัตโนมัติ
- ตรวจสอบกับฐานข้อมูล blacklist
- วิเคราะห์ความเสี่ยงจากข้อความด้วย AI
- แจ้งเตือนเมื่อพบข้อมูลที่น่าสงสัย

---

## 🔍 ฟีเจอร์หลัก

### 1. Automatic Page Scanning

**การทำงาน:**
- สแกนหน้าเว็บอัตโนมัติเมื่อโหลดเพจ
- ตรวจจับหมายเลขโทรศัพท์ไทย (08x, 09x, 06x)
- ตรวจจับเลขบัญชีธนาคาร (10-12 หลัก)
- ตรวจจับชื่อธนาคารไทย

**รูปแบบที่รองรับ:**
```
หมายเลขโทรศัพท์:
- 0812345678
- 081-234-5678
- 08-1234-5678
- +66 81-234-5678

บัญชีธนาคาร:
- 1234567890
- 123-4-56789-0
- 123-456789-0
```

**การใช้งาน:**
1. เปิดหน้าเว็บที่มีข้อมูล
2. Extension จะสแกนและไฮไลท์อัตโนมัติ
3. คลิกที่ข้อมูลที่ไฮไลท์เพื่อตรวจสอบ

---

### 2. Blacklist Checking

**ความสามารถ:**
- ตรวจสอบหมายเลขโทรศัพท์กับฐานข้อมูล blacklist
- ตรวจสอบบัญชีธนาคารที่ถูกรายงาน
- แสดงรายละเอียดการรายงาน (ถ้ามี)
- แสดงจำนวนครั้งที่ถูกรายงาน

**ผลลัพธ์:**
- ✅ **ปลอดภัย** - ไม่พบในบัญชีดำ
- ⚠️ **อันตราย** - พบในบัญชีดำพร้อมรายละเอียด

**API Endpoint:** `POST /blacklist/check`

**Request:**
```json
{
  "data": "0812345678"
}
```

**Response (Found):**
```json
{
  "found": true,
  "data": "0812345678",
  "type": "phone",
  "description": "รายงานว่าเป็นมิจฉาชีพ",
  "reports": 15
}
```

**Response (Not Found):**
```json
{
  "found": false,
  "data": "0812345678"
}
```

---

### 3. Fraud Detection & Risk Analysis

**การทำงาน:**
- วิเคราะห์ข้อความด้วย AI (Gemini)
- ตรวจจับลักษณะของการฉ้อโกง
- ประเมินระดับความเสี่ยง
- ให้คำแนะนำและสัญญาณเตือน

**ระดับความเสี่ยง:**
- 🟢 **ต่ำ (Low)** - น่าจะปลอดภัย
- 🟡 **ปานกลาง (Medium)** - ควรระวัง
- 🔴 **สูง (High)** - อันตราย ควรหลีกเลี่ยง

**สัญญาณเตือนที่ตรวจจับได้:**
- การขอเงินด่วน
- สัญญาผลตอบแทนสูง
- การขู่หรือกดดัน
- ข้อความเร่งรีบ
- การแอบอ้างหน่วยงาน
- ลิงก์ที่น่าสงสัย
- ขอข้อมูลส่วนตัว

**API Endpoint:** `POST /fraud-v2/analyze`

**Request:**
```json
{
  "text": "ด่วน! โอนเงินภายใน 1 ชั่วโมง รับดอกเบี้ย 50%"
}
```

**Response:**
```json
{
  "risk_level": "สูง",
  "analysis": "ข้อความนี้มีลักษณะของการฉ้อโกง...",
  "warning_signs": [
    "การสัญญาผลตอบแทนสูงผิดปกติ",
    "ข้อความเร่งรีบ"
  ],
  "recommendation": "ไม่ควรดำเนินการตามที่ข้อความขอ"
}
```

---

### 4. Data Highlighting

**การแสดงผล:**
- **หมายเลขโทรศัพท์**: เส้นใต้สีฟ้า + พื้นหลังเหลืองอ่อน
- **บัญชีธนาคาร**: เส้นใต้สีเขียว + พื้นหลังเหลืองอ่อน
- **ข้อมูลอันตราย**: เส้นใต้สีแดง + พื้นหลังแดงอ่อน

**การ Interact:**
- Hover: เปลี่ยนสี + แสดง tooltip
- Click: เปิด modal ตรวจสอบทันที

**CSS Classes:**
```css
.gungong-highlight          /* Base highlight style */
.gungong-highlight.gungong-phone      /* Phone number */
.gungong-highlight.gungong-account    /* Bank account */
.gungong-highlight.gungong-danger     /* Blacklisted data */
```

---

### 5. Context Menu Integration

**เมนูที่เพิ่ม:**

```
GunGong - ตรวจสอบการฉ้อโกง
├── ตรวจสอบข้อมูลที่เลือก      (เมื่อเลือกข้อความ)
├── วิเคราะห์ความเสี่ยง         (เมื่อเลือกข้อความ)
└── สแกนหน้านี้               (บนหน้าเว็บ)
```

**การใช้งาน:**
1. เลือกข้อความในหน้าเว็บ
2. คลิกขวา
3. เลือก GunGong → [action]

---

### 6. Popup Interface

**แท็บที่ 1: ตรวจสอบ**
- Input สำหรับหมายเลขโทรศัพท์/บัญชีธนาคาร
- ปุ่มตรวจสอบ
- แสดงผลการตรวจสอบ
- ปุ่มสแกนหน้าเว็บ

**แท็บที่ 2: วิเคราะห์ข้อความ**
- Textarea สำหรับข้อความ
- ปุ่มวิเคราะห์
- แสดงระดับความเสี่ยง
- แสดงสัญญาณเตือนและคำแนะนำ

**แท็บที่ 3: ประวัติ**
- รายการประวัติการตรวจสอบ
- แสดงเวลาและผลลัพธ์
- ปุ่มล้างประวัติ
- คลิกเพื่อดูรายละเอียด

**ขนาด Popup:**
- Width: 400px
- Min-height: 500px

---

### 7. Notification System

**ประเภทการแจ้งเตือน:**

**1. Blacklist Found (อันตราย)**
```
Title: ⚠️ พบในบัญชีดำ!
Message: 0812345678
         ข้อมูลนี้ถูกรายงานว่าเป็นการฉ้อโกง
Priority: High
```

**2. Safe Data (ปลอดภัย)**
```
Title: ✓ ปลอดภัย
Message: 0812345678
         ไม่พบในบัญชีดำ
Priority: Normal
```

**3. High Risk Detection (ความเสี่ยงสูง)**
```
Title: 🚨 ระดับความเสี่ยง: สูง
Message: วิเคราะห์ข้อความเสร็จสิ้น
Priority: High
```

**การตั้งค่า:**
- เปิด/ปิดการแจ้งเตือนได้
- แจ้งเตือนเฉพาะกรณีอันตราย (optional)

---

### 8. History & Storage

**ข้อมูลที่เก็บ:**
```javascript
{
  id: 1234567890,
  timestamp: "2024-01-09T12:00:00.000Z",
  type: "check" | "analyze",
  value: "0812345678",
  result: "safe" | "warning" | "danger",
  details: { /* API response */ },
  url: "https://example.com"
}
```

**การจัดการ:**
- เก็บแค่ 100 รายการล่าสุด
- เก็บใน chrome.storage.local
- ไม่ส่งไปเซิร์ฟเวอร์
- ลบได้ทันที

**Storage Usage:**
- History: Local Storage
- Settings: Sync Storage (sync ข้าม device)

---

### 9. Options & Settings

**การตั้งค่าที่มี:**

**1. API Configuration**
- Backend API URL
- Connection testing
- Auto-detect local/production

**2. Scanning Options**
- ✅ Auto-scan pages on load
- ⚠️ Auto-check detected data
- ✅ Highlight detected data

**3. Notification Settings**
- ✅ Enable notifications
- ⚠️ Notify danger only

**4. Privacy Settings**
- ✅ Save history locally
- 🗑️ Clear history
- 🧹 Clear cache

**Default Settings:**
```javascript
{
  apiBaseURL: 'http://localhost:8000',
  autoScan: true,
  autoCheck: false,
  highlightData: true,
  notifications: true,
  notifyDangerOnly: false,
  saveHistory: true
}
```

---

### 10. Background Service Worker

**หน้าที่:**
- Handle API requests
- Manage context menus
- Process messages from content scripts
- Send notifications
- Store history
- Cache results (optional)

**Message Types:**
```javascript
// From Content Script
{ type: 'DATA_DETECTED', data: {...} }
{ type: 'CHECK_DATA', data: {...} }

// From Popup
{ type: 'SCAN_PAGE' }
{ type: 'SCAN_SELECTION' }
```

**API Communication:**
```javascript
// Fetch with error handling
fetch(apiURL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

---

## 🔐 Security & Privacy

### Data Privacy
- ✅ History stored locally only
- ✅ No tracking or analytics
- ✅ No data sent to 3rd parties
- ⚠️ Data sent to configured Backend API only

### Permissions Used
- `storage` - Save settings and history
- `activeTab` - Access current page
- `contextMenus` - Add right-click menu
- `notifications` - Show notifications
- `<all_urls>` - Scan any website

### Security Best Practices
- Input validation
- XSS prevention
- HTTPS recommended for API
- No eval() or unsafe code
- Content Security Policy

---

## 🚀 Performance

### Optimization
- Debounced DOM scanning (1 second)
- Limited history (100 items)
- Lazy loading
- Efficient regex patterns
- Mutation observer for SPA

### Resource Usage
- Memory: ~10-20 MB
- CPU: Low (idle most of the time)
- Network: On-demand API calls only

---

## 🔄 Browser Compatibility

### Supported Browsers
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave
- ✅ Chromium-based browsers
- ⚠️ Firefox (with modifications)

### Not Supported
- ❌ Safari (needs conversion)
- ❌ Internet Explorer
- ❌ Opera (not tested)

---

## 🛠️ Technical Details

### Manifest V3
```json
{
  "manifest_version": 3,
  "permissions": [...],
  "background": {
    "service_worker": "background/background.js"
  },
  "content_scripts": [...],
  "action": { "default_popup": "popup/popup.html" }
}
```

### File Structure
```
browser-extension/
├── manifest.json         # Extension config
├── popup/               # Popup UI
├── content/             # Content scripts
├── background/          # Service worker
├── options/             # Settings page
├── styles/              # CSS
├── utils/               # Helper functions
└── assets/              # Icons, images
```

### APIs Used
- Chrome Extension API
- Fetch API
- Chrome Storage API
- Chrome Notifications API
- Chrome Context Menus API
- Chrome Tabs API

---

## 📊 Feature Comparison

| Feature | Free Version | Pro Version |
|---------|-------------|------------|
| Blacklist Check | ✅ | ✅ |
| Fraud Analysis | ✅ | ✅ |
| Page Scanning | ✅ | ✅ |
| History | 100 items | Unlimited |
| Notifications | ✅ | ✅ |
| Context Menu | ✅ | ✅ |
| Custom API | ✅ | ✅ |
| Auto-check | ❌ | ✅ |
| Bulk Check | ❌ | ✅ |
| Export History | ❌ | ✅ |

---

## 🎨 UI/UX Features

### Design System
- Colors: #667eea, #764ba2 (gradient)
- Font: Segoe UI, system fonts
- Style: Modern, flat, minimal

### Animations
- Fade in/out
- Slide animations
- Hover effects
- Loading spinners

### Responsive
- Popup: Fixed 400px width
- Options: Responsive up to 800px

### Accessibility
- Keyboard navigation
- ARIA labels
- High contrast support
- Screen reader friendly

---

## 🔮 Future Features

### Planned Features
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced filtering
- [ ] Export/Import history
- [ ] Scheduled scanning
- [ ] Whitelist management
- [ ] Statistics dashboard
- [ ] Browser sync
- [ ] Offline mode
- [ ] PDF scanning

### Under Consideration
- Mobile app integration
- Team/Enterprise features
- Custom rules
- Machine learning models
- Real-time collaboration

---

**Last Updated**: 2024-01-09
**Version**: 1.0.0
**Author**: GunGong Team
