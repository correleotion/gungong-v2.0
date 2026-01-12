# 🔐 คำแนะนำด้านความปลอดภัย / Security Guide

## ⚠️ CRITICAL - ทำทันทีก่อนเปิดตัว

### 1. Revoke Credentials ที่รั่วไหล

ไปที่ Google Cloud Console และเพิกถอน Service Account Keys ทั้งหมด:

```
Project: gungong-ai
- github-actions@gungong-ai.iam.gserviceaccount.com
- gungong-backend@gungong-ai.iam.gserviceaccount.com

Project: euphoric-stone-478707-m0
- gungong-db@euphoric-stone-478707-m0.iam.gserviceaccount.com
```

**ขั้นตอน:**
1. เข้า https://console.cloud.google.com/
2. เลือก Project
3. ไปที่ IAM & Admin → Service Accounts
4. คลิกที่ Service Account
5. ไปที่ tab "Keys"
6. ลบ Keys ที่มี Key ID:
   - aab4fdb5e2ad80ebe83f7d0cc897f9a1d4dc9a19
   - 9eb1c76f411963ac643aa232bab34582bea73a60
   - 1394908ded2a7d366acb861f685a48976b9d1c3f

### 2. Rotate Firebase Credentials

1. ไปที่ Firebase Console: https://console.firebase.google.com/
2. เลือก Project: gungong-6502f
3. Settings → General → Your apps
4. ตั้งค่า API restrictions:
   - HTTP referrers (จำกัดเฉพาะ domain ของคุณ)
   - API restrictions (เปิดเฉพาะ APIs ที่ใช้)

### 3. ลบ Secrets จาก Git History

รันสคริปต์:
```bash
./remove_secrets_from_history.sh
```

หรือรันด้วยตัวเอง:
```bash
# ติดตั้ง git-filter-repo
brew install git-filter-repo  # macOS
# หรือ
pip install git-filter-repo

# ลบไฟล์ secrets
git filter-repo --path secrets/github-actions-key.json --invert-paths --force
git filter-repo --path secrets/gungong-ai-9eb1c76f4119.json --invert-paths --force
git filter-repo --path secrets/service-account.json --invert-paths --force

# Push force
git push origin --force --all
```

⚠️ **คำเตือน**: คนที่ clone repo ไปแล้วต้อง re-clone ใหม่

---

## 🛠️ Setup สำหรับ Development

### 1. ติดตั้ง Pre-commit Hooks

```bash
# ติดตั้ง pre-commit
pip install pre-commit

# Setup hooks
pre-commit install

# ทดสอบ
pre-commit run --all-files
```

### 2. สร้างไฟล์ .env

```bash
# Copy template
cp .env.example .env

# แก้ไขใส่ค่าจริง
nano .env
```

### 3. สร้าง Service Account ใหม่

```bash
# 1. ไปที่ Google Cloud Console
# 2. สร้าง Service Account ใหม่
# 3. Download JSON key
# 4. วางในโฟลเดอร์ secrets/
mv ~/Downloads/your-key.json secrets/service-account.json
```

---

## 🚀 Setup สำหรับ Production

### GitHub Secrets

ตั้งค่า Secrets ใน GitHub Repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

Secrets ที่ต้องตั้ง:
- `GCP_SA_KEY` - Service Account JSON (ทั้งไฟล์)
- `GOOGLE_API_KEY` - Gemini API Key
- `LINE_CHANNEL_ACCESS_TOKEN` - LINE Channel Access Token
- `LINE_CHANNEL_SECRET` - LINE Channel Secret
- `VITE_FIREBASE_API_KEY` - Firebase API Key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase Auth Domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase Project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase Storage Bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase Messaging Sender ID
- `VITE_FIREBASE_APP_ID` - Firebase App ID
- `VITE_LIFF_ID` - LINE LIFF ID

### Cloud Run Environment Variables

```bash
# ตั้งค่าผ่าน gcloud CLI
gcloud run services update gungong-fullstack \
  --set-env-vars="GOOGLE_API_KEY=xxx,LINE_CHANNEL_ACCESS_TOKEN=xxx" \
  --region=asia-southeast1
```

---

## ✅ Checklist ก่อนเปิดตัว

- [ ] Revoke Service Account Keys ที่รั่วไหล
- [ ] สร้าง Service Accounts ใหม่
- [ ] ตั้งค่า Firebase API restrictions
- [ ] ลบ secrets จาก git history
- [ ] ตั้งค่า GitHub Secrets
- [ ] ทดสอบ pre-commit hooks
- [ ] ตรวจสอบ .env ไม่ถูก commit
- [ ] ทดสอบ deployment pipeline
- [ ] Enable GitHub Secret Scanning (ถ้าเป็น public repo)
- [ ] Review Firebase Security Rules
- [ ] Enable Cloud Run authentication
- [ ] Setup monitoring และ alerts

---

## 📚 Best Practices

### ✅ DO
- ใช้ Environment Variables เสมอ
- Rotate credentials ทุก 90 วัน
- ใช้ Secret Manager สำหรับ production
- Enable MFA สำหรับ Cloud Console
- จำกัดสิทธิ์ Service Accounts (least privilege)
- Review permissions เป็นประจำ

### ❌ DON'T
- ห้าม hardcode credentials ในโค้ด
- ห้าม commit .env files
- ห้ามแชร์ credentials ผ่าน Slack/Email
- ห้ามใช้ credentials เดียวกันสำหรับ dev/prod
- ห้ามเก็บ credentials ใน cloud storage ที่เป็น public

---

## 🔍 ตรวจสอบ Secrets Leakage

### สแกนหา secrets ใน codebase

```bash
# detect-secrets
pip install detect-secrets
detect-secrets scan --all-files

# trufflehog
pip install truffleHog
trufflehog filesystem .

# gitleaks
brew install gitleaks
gitleaks detect
```

### GitHub Secret Scanning

เปิดใช้งานใน repository settings:
- Settings → Security → Code security and analysis
- Enable "Secret scanning"

---

## 🆘 ถ้า Credentials รั่วไหล

### ขั้นตอนฉุกเฉิน:

1. **Revoke ทันที** - ลบ/ปิดการใช้งาน credentials
2. **ประเมินความเสียหาย** - ตรวจสอบ logs หาการใช้งานผิดปกติ
3. **สร้าง credentials ใหม่** - และอัพเดททุกที่
4. **แจ้งทีม** - ให้ทุกคนรับทราบ
5. **ตรวจสอบระบบ** - หา indicators of compromise
6. **อัพเดท procedures** - เพื่อป้องกันในอนาคต

---

## 📞 Contact

หากพบปัญหาด้านความปลอดภัย:
1. อย่า open issue สาธารณะ
2. ติดต่อทีมโดยตรง
3. รายงานผ่าน security@your-domain.com (ถ้ามี)
