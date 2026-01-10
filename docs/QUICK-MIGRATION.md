# 🚀 Quick Migration Guide

เปลี่ยน GCP Project ใน 10 นาที!

## ⚡ Quick Steps

### 1. รันสคริปต์อัตโนมัติ (5 นาที)

```bash
# เข้าโฟลเดอร์โปรเจกต์
cd /path/to/gungong-v2.0

# รันสคริปต์ setup
./scripts/setup-new-gcp-project.sh
```

สคริปต์จะทำให้อัตโนมัติ:
- ✅ สร้าง GCP Project ใหม่
- ✅ Enable APIs ทั้งหมด
- ✅ สร้าง Firestore Database
- ✅ สร้าง Service Account
- ✅ Grant Permissions
- ✅ สร้าง Service Account Key
- ✅ สร้างไฟล์ .env.new

### 2. อัปเดต API Keys (2 นาที)

```bash
# แก้ไขไฟล์ .env.new
nano .env.new

# หรือใช้ editor ที่ชอบ
code .env.new  # VSCode
vim .env.new   # Vim
```

**ต้องอัปเดต:**
- `GOOGLE_API_KEY` - [รับจาก AI Studio](https://aistudio.google.com/app/apikey)
- `LINE_CHANNEL_ACCESS_TOKEN` - [รับจาก LINE Developers](https://developers.line.biz/console/)
- `LINE_CHANNEL_SECRET`
- `VIRUSTOTAL_API_KEY` (optional)

**ตรวจสอบว่าถูกต้อง:**
- `FIRESTORE_PROJECT_ID` - ควรเป็น Project ID ใหม่

```bash
# เสร็จแล้ว rename
mv .env.new .env
```

### 3. ทดสอบ Configuration (1 นาที)

```bash
# ทดสอบ Firestore connection
python scripts/test-firestore.py
```

ถ้าทุกอย่างผ่าน จะเห็น:
```
✅ PASS - Environment Variables
✅ PASS - Authentication
✅ PASS - Firestore Connection
✅ PASS - Firestore Write
✅ PASS - Firestore Read
✅ PASS - Firestore Delete
✅ PASS - List Collections

Results: 7/7 tests passed
```

### 4. Deploy to Cloud Run (2 นาที)

```bash
# Deploy ด้วยสคริปต์
./scripts/deploy-to-cloud-run.sh
```

หรือ deploy ด้วย Cloud Build:

```bash
# อ่าน Project ID
PROJECT_ID=$(cat .gcp-project-id)

# Set project
gcloud config set project $PROJECT_ID

# Deploy
gcloud builds submit --config=deployment/cloudbuild.yaml
```

### 5. อัปเดต LINE Webhook (1 นาที)

```bash
# ดู URL ที่ deploy
cat .cloud-run-url
```

**Update Webhook:**
1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. เลือก Channel
3. Messaging API → Webhook URL
4. ใส่: `https://your-service-url.run.app/webhook`
5. คลิก "Verify"
6. เปิด "Use webhook"

---

## ✅ เสร็จแล้ว!

ทดสอบโดยส่งข้อความไปที่ LINE Bot

---

## 🔧 Alternative: Manual Steps

ถ้าไม่ต้องการใช้สคริปต์อัตโนมัติ ทำตามนี้:

### สร้าง Project

```bash
# สร้าง Project
PROJECT_ID="gungong-$(date +%s)"
gcloud projects create $PROJECT_ID --name="GunGong"

# Link billing
gcloud billing projects link $PROJECT_ID --billing-account=YOUR-BILLING-ACCOUNT-ID

# Set as default
gcloud config set project $PROJECT_ID
```

### Enable APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  firestore.googleapis.com \
  aiplatform.googleapis.com
```

### สร้าง Firestore

```bash
gcloud firestore databases create \
  --location=asia-southeast1 \
  --type=firestore-native
```

### สร้าง Service Account

```bash
# สร้าง
gcloud iam service-accounts create gungong-backend \
  --display-name="GunGong Backend"

# Grant permissions
SERVICE_ACCOUNT="gungong-backend@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/aiplatform.user"

# สร้าง key
mkdir -p secrets
gcloud iam service-accounts keys create secrets/service-account.json \
  --iam-account=$SERVICE_ACCOUNT
```

### อัปเดต .env

```bash
# Copy template
cp .env.example .env

# แก้ไข
# - FIRESTORE_PROJECT_ID=$PROJECT_ID
# - เพิ่ม API keys
```

### Deploy

```bash
gcloud builds submit --config=deployment/cloudbuild.yaml
```

---

## 🐛 Troubleshooting

### ปัญหา: Permission Denied

```bash
# Login ใหม่
gcloud auth login
gcloud auth application-default login

# Set project
gcloud config set project $(cat .gcp-project-id)
```

### ปัญหา: API not enabled

```bash
# Enable API ที่ต้องการ
gcloud services enable [API_NAME]

# ตัวอย่าง
gcloud services enable run.googleapis.com
```

### ปัญหา: Firestore connection failed

```bash
# ตรวจสอบ service account
export GOOGLE_APPLICATION_CREDENTIALS="secrets/service-account.json"
cat $GOOGLE_APPLICATION_CREDENTIALS | python3 -m json.tool

# ทดสอบ
python scripts/test-firestore.py
```

### ปัญหา: Cloud Run deployment failed

```bash
# ดู logs
gcloud builds list --limit 5
gcloud builds log [BUILD_ID]

# ลองใหม่
gcloud builds submit --config=deployment/cloudbuild.yaml
```

---

## 📝 Checklist

- [ ] รันสคริปต์ setup-new-gcp-project.sh
- [ ] อัปเดต API keys ใน .env
- [ ] ทดสอบด้วย test-firestore.py (ผ่าน 7/7 tests)
- [ ] Deploy ด้วย deploy-to-cloud-run.sh หรือ Cloud Build
- [ ] อัปเดต LINE Webhook URL
- [ ] ทดสอบส่งข้อความไปที่ Bot
- [ ] Verify webhook ผ่าน LINE Console

---

## 📚 เอกสารเพิ่มเติม

- **คู่มือแบบละเอียด**: [docs/GCP-MIGRATION-GUIDE.md](GCP-MIGRATION-GUIDE.md)
- **Troubleshooting**: ดูที่ GCP-MIGRATION-GUIDE.md Step 9

---

**เวลาทั้งหมด**: ~10 นาที
**ความยาก**: ⭐⭐ (2/5)
