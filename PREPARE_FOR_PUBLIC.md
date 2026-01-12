# 📋 เตรียมโปรเจคสำหรับเป็น Public Repository

## เป้าหมาย
แยกโปรเจคเป็น 2 ส่วน:
1. **Public Repository** - โชว์ใน portfolio (ไม่มีข้อมูลส่วนตัว)
2. **Private Repository** - รันงานจริง (มีข้อมูลจริง)

---

## ✅ ขั้นตอนที่ 1: เตรียม Public Version (ทำที่นี่)

### 1. ลบข้อมูลส่วนตัวออก

ไฟล์ที่ต้องแก้ไข (พบข้อมูลส่วนตัว):

**Backend:**
- [ ] `src/backend/routers/webhook.py` - ลบ LINE Account ID, URLs
- [ ] `src/backend/main.py` - ลบ personal info
- [ ] `src/backend/services/line_service.py` - แทนที่ด้วย placeholders
- [ ] `src/backend/services/verification_service.py`
- [ ] `src/backend/services/conversation_analyzer_service.py`
- [ ] `src/backend/services/gambling_detector_service.py`
- [ ] `src/backend/core/fraud_patterns.json`

**Frontend:**
- [ ] `src/frontend/src/utils/liff.js` - ลบ LIFF ID, URLs (เสร็จแล้ว - ใช้ env vars)
- [ ] `src/frontend/src/components/scanner.jsx`
- [ ] `src/frontend/src/components/shared/Sidebar.jsx`
- [ ] `src/frontend/src/components/shared/TopBanner.jsx` - ลบ LINE OA link
- [ ] `src/frontend/src/styles/scanner.css`

**Docs:**
- [ ] `README.md` - สร้างใหม่สำหรับ public

### 2. สร้างไฟล์ Template

สร้างไฟล์ตัวอย่างที่มี placeholders:

```
config/
├── .env.example (เสร็จแล้ว)
└── example-data/
    ├── sample-user-data.json
    └── sample-reports.json
```

### 3. Update Documentation

- [ ] สร้าง README.md ใหม่ (portfolio-friendly)
- [ ] เพิ่ม screenshots/demo (ปิดบังข้อมูลส่วนตัว)
- [ ] สร้าง CONTRIBUTING.md
- [ ] สร้าง LICENSE file

### 4. Clean Git History

```bash
# ลบ sensitive commits
./remove_secrets_from_history.sh

# Squash commits (optional)
git rebase -i --root
```

---

## ✅ ขั้นตอนที่ 2: สร้าง Private Repository (สำหรับงานจริง)

### วิธีที่ 1: Clone แล้วเปลี่ยน Remote

```bash
# 1. Clone repo ปัจจุบัน
cd /path/to/new/location
git clone /Users/analeotic/Desktop/project/personal/gungong-v2.0 gungong-production

cd gungong-production

# 2. สร้าง private repo ใหม่บน GitHub
# (ทำผ่าน GitHub web interface)

# 3. เปลี่ยน remote
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/gungong-private.git

# 4. Push
git push -u origin main

# 5. Copy ไฟล์ secrets จริง
cp /path/to/real/secrets/*.json secrets/
cp /path/to/real/.env .env
```

### วิธีที่ 2: Git Worktree (แนะนำ)

```bash
# สร้าง worktree แยก
cd /Users/analeotic/Desktop/project/personal/gungong-v2.0
git worktree add ../gungong-production production

cd ../gungong-production

# สร้าง branch ใหม่
git checkout -b main

# เปลี่ยน remote
git remote add production https://github.com/YOUR_USERNAME/gungong-private.git

# Copy ไฟล์จริง
cp /path/to/real/secrets/*.json secrets/
cp /path/to/real/.env .env
```

---

## ✅ ขั้นตอนที่ 3: Maintain ทั้ง 2 Repos

### การ Sync โค้ด

```bash
# ใน public repo - พัฒนา features ใหม่
git checkout main
git add .
git commit -m "feat: add new feature"

# ใน private repo - pull changes จาก public
git remote add public /path/to/public/repo
git fetch public
git merge public/main

# Copy .env และ secrets ของจริงกลับมา
cp /backup/.env .env
cp /backup/secrets/* secrets/
```

### Auto-sync Script (Optional)

สร้างไฟล์ `sync_from_public.sh` ใน private repo:

```bash
#!/bin/bash
# Backup sensitive files
cp .env .env.backup
cp secrets/*.json secrets/backup/

# Sync from public
git fetch public
git merge public/main

# Restore sensitive files
cp .env.backup .env
cp secrets/backup/*.json secrets/

echo "✅ Synced from public repo"
```

---

## 📝 Checklist: ข้อมูลที่ต้องลบจาก Public Repo

### ❌ ลบออก (Sensitive)
- [ ] LINE OA Account ID (`@357asclq`)
- [ ] LIFF ID จริง (`2008548759-KkM4Noxa`)
- [ ] Cloud Run URLs (`gungong-143631414136.asia-southeast1.run.app`)
- [ ] Firebase Project ID จริง (`gungong-6502f`)
- [ ] Google Cloud Project IDs
- [ ] Email addresses
- [ ] Service account emails
- [ ] ข้อมูลผู้ใช้จริง (ถ้ามี)
- [ ] Database credentials
- [ ] API Keys ทุกชนิด

### ✅ เก็บไว้ (Safe)
- ✅ โครงสร้างโค้ด
- ✅ Logic และ algorithms
- ✅ Documentation
- ✅ Tests
- ✅ .env.example (ไม่มีค่าจริง)
- ✅ Architecture diagrams
- ✅ Feature descriptions

---

## 🔒 Security Checklist

### Public Repo ต้อง:
- [ ] ไม่มี `.env` files
- [ ] ไม่มี `secrets/` directory (เว้นแต่ README.md)
- [ ] ไม่มี service account keys
- [ ] ไม่มี API keys
- [ ] ไม่มี production URLs
- [ ] ไม่มีข้อมูลผู้ใช้จริง
- [ ] Git history สะอาด (ไม่มี secrets)

### Private Repo ต้อง:
- [ ] ตั้งเป็น Private repository
- [ ] มี branch protection rules
- [ ] จำกัดการ access
- [ ] Enable GitHub Secret Scanning
- [ ] Backup `.env` และ `secrets/` เป็นประจำ

---

## 📂 โครงสร้างที่แนะนำ

```
~/Desktop/project/personal/
├── gungong-public/          # Public - สำหรับ portfolio
│   ├── .env.example
│   ├── secrets/
│   │   └── README.md
│   └── README.md (showcase)
│
└── gungong-production/      # Private - สำหรับงานจริง
    ├── .env (จริง)
    ├── secrets/
    │   ├── service-account.json
    │   └── github-actions-key.json
    └── README.md (internal)
```

---

## 🚀 คำสั่งสรุป

### สำหรับ Public Repo:
```bash
# 1. Clean ข้อมูลส่วนตัว
# (ทำตาม checklist)

# 2. Clean git history
./remove_secrets_from_history.sh

# 3. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/gungong.git
git push -u origin main
```

### สำหรับ Private Repo:
```bash
# 1. Clone/copy จาก public
git clone https://github.com/YOUR_USERNAME/gungong.git gungong-production

# 2. เปลี่ยนเป็น private repo
# (ทำผ่าน GitHub Settings)

# 3. เพิ่มไฟล์จริง
cp /backup/.env .env
cp /backup/secrets/* secrets/

# 4. ตั้งค่า GitHub Secrets
# (ทำผ่าน GitHub Settings → Secrets)

# 5. Deploy
# (ใช้ GitHub Actions)
```

---

## 💡 Tips

1. **ใช้ Git Tags** สำหรับ version ที่สำคัญ
2. **Automated Testing** ก่อน merge public → private
3. **Documentation** แยกชัดเจนระหว่าง public และ private
4. **Regular Backups** สำหรับ private repo
5. **Code Review** ก่อน push ไปยัง public repo

---

## ⚠️ คำเตือน

- **อย่า push** ข้อมูลส่วนตัวไปยัง public repo
- **อย่า commit** `.env` หรือ `secrets/` ใน public repo
- **ตรวจสอบ git diff** ทุกครั้งก่อน push
- **ใช้ pre-commit hooks** เพื่อป้องกันความผิดพลาด
