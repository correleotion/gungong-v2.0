# 🔄 GCP Project Migration - README

คู่มือการเปลี่ยน GCP Project สำหรับ GunGong v2.0

## 📁 ไฟล์และเอกสาร

### 📄 Documentation
- **[QUICK-MIGRATION.md](QUICK-MIGRATION.md)** - เริ่มต้นด่วน 10 นาที
- **[GCP-MIGRATION-GUIDE.md](GCP-MIGRATION-GUIDE.md)** - คู่มือละเอียดทุกขั้นตอน

### 🔧 Scripts
- **[scripts/setup-new-gcp-project.sh](../scripts/setup-new-gcp-project.sh)** - สคริปต์สร้าง Project อัตโนมัติ
- **[scripts/test-firestore.py](../scripts/test-firestore.py)** - ทดสอบ Firestore connection
- **[scripts/deploy-to-cloud-run.sh](../scripts/deploy-to-cloud-run.sh)** - Deploy to Cloud Run

### ⚙️ Configuration Templates
- **[.env.example](../.env.example)** - Template สำหรับ .env file

---

## 🚀 Quick Start (เลือก 1 วิธี)

### วิธีที่ 1: ใช้สคริปต์อัตโนมัติ (แนะนำ)

```bash
# 1. รันสคริปต์
./scripts/setup-new-gcp-project.sh

# 2. อัปเดต API keys ใน .env.new
nano .env.new
mv .env.new .env

# 3. ทดสอบ
python scripts/test-firestore.py

# 4. Deploy
./scripts/deploy-to-cloud-run.sh

# 5. อัปเดต LINE Webhook
# ใช้ URL จาก .cloud-run-url
```

### วิธีที่ 2: ทำเอง Step-by-Step

ดูขั้นตอนละเอียดใน [GCP-MIGRATION-GUIDE.md](GCP-MIGRATION-GUIDE.md)

---

## 📋 สิ่งที่ต้องเตรียม

### ✅ Prerequisites

1. **Google Cloud SDK** ติดตั้งแล้ว
   ```bash
   gcloud --version
   ```
   ถ้ายังไม่มี: https://cloud.google.com/sdk/docs/install

2. **Billing Account** ที่พร้อมใช้งาน
   - ตรวจสอบที่: https://console.cloud.google.com/billing

3. **API Keys ต่างๆ**:
   - Gemini API Key: https://aistudio.google.com/app/apikey
   - LINE Channel Credentials: https://developers.line.biz/console/
   - VirusTotal API Key (optional): https://www.virustotal.com/

4. **Python** และ dependencies
   ```bash
   pip install -r requirements.txt
   ```

---

## 🎯 ขั้นตอนหลัก

### 1️⃣ สร้าง GCP Project ใหม่

**ใช้สคริปต์:**
```bash
./scripts/setup-new-gcp-project.sh
```

**หรือทำเอง:**
```bash
PROJECT_ID="gungong-$(date +%s)"
gcloud projects create $PROJECT_ID
gcloud config set project $PROJECT_ID
```

### 2️⃣ Enable APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  firestore.googleapis.com \
  aiplatform.googleapis.com
```

### 3️⃣ สร้าง Firestore

```bash
gcloud firestore databases create \
  --location=asia-southeast1 \
  --type=firestore-native
```

### 4️⃣ สร้าง Service Account

```bash
gcloud iam service-accounts create gungong-backend
```

### 5️⃣ Grant Permissions

```bash
SERVICE_ACCOUNT="gungong-backend@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/datastore.user"
```

### 6️⃣ สร้าง Service Account Key

```bash
mkdir -p secrets
gcloud iam service-accounts keys create secrets/service-account.json \
  --iam-account=$SERVICE_ACCOUNT
```

### 7️⃣ อัปเดต .env

```bash
cp .env.example .env
# แก้ไข:
# - FIRESTORE_PROJECT_ID
# - GOOGLE_API_KEY
# - LINE_CHANNEL_ACCESS_TOKEN
# - LINE_CHANNEL_SECRET
```

### 8️⃣ ทดสอบ

```bash
python scripts/test-firestore.py
```

### 9️⃣ Deploy

```bash
gcloud builds submit --config=deployment/cloudbuild.yaml
```

### 🔟 อัปเดต Webhook

Update LINE Webhook URL ใน LINE Developers Console

---

## 🔍 Verification

### ตรวจสอบว่า setup สำเร็จ

```bash
# 1. Project active
gcloud config get-value project

# 2. Services enabled
gcloud services list --enabled | grep -E "(run|firestore|cloudbuild)"

# 3. Service account exists
gcloud iam service-accounts list

# 4. Firestore database
gcloud firestore databases list

# 5. Test connection
python scripts/test-firestore.py

# 6. Cloud Run service (หลัง deploy)
gcloud run services list
```

---

## 📊 ไฟล์ที่สร้างขึ้นหลัง Setup

```
gungong-v2.0/
├── .env                       # Configuration (สร้างจาก .env.new)
├── .gcp-project-id            # Project ID ที่สร้าง
├── .gcp-setup-info.txt        # ข้อมูล setup
├── .cloud-run-url             # Cloud Run URL (หลัง deploy)
├── .deployment-info.txt       # ข้อมูล deployment
└── secrets/
    └── service-account.json   # Service Account Key (⚠️ SECRET!)
```

**⚠️ Important**:
- ไฟล์เหล่านี้อยู่ใน `.gitignore` แล้ว
- **NEVER** commit `secrets/service-account.json` ไปใน Git

---

## 🔐 Security Best Practices

### 1. Service Account Key
```bash
# Set permissions
chmod 600 secrets/service-account.json

# Verify not tracked by git
git status secrets/
# Should show: "nothing to commit"
```

### 2. Environment Variables
```bash
# Never commit .env
git status .env
# Should be ignored

# Use .env.example instead
```

### 3. Secret Manager (Production)

สำหรับ production ใช้ Secret Manager:

```bash
# Create secret
echo -n "YOUR_API_KEY" | gcloud secrets create GOOGLE_API_KEY --data-file=-

# Grant access to service account
gcloud secrets add-iam-policy-binding GOOGLE_API_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"

# Update Cloud Run to use secrets
gcloud run services update gungong \
  --update-secrets=GOOGLE_API_KEY=GOOGLE_API_KEY:latest
```

---

## 🐛 Common Issues

### Issue: "Permission denied"
```bash
# Re-authenticate
gcloud auth login
gcloud auth application-default login
```

### Issue: "Project already exists"
```bash
# Use different project ID
PROJECT_ID="gungong-$(date +%s)"
```

### Issue: "Billing not enabled"
```bash
# Link billing account
gcloud billing projects link $PROJECT_ID \
  --billing-account=BILLING_ACCOUNT_ID
```

### Issue: "Firestore connection failed"
```bash
# Check credentials
export GOOGLE_APPLICATION_CREDENTIALS="secrets/service-account.json"
cat $GOOGLE_APPLICATION_CREDENTIALS | python3 -m json.tool

# Test
python scripts/test-firestore.py
```

### Issue: "Cloud Run deployment failed"
```bash
# Check logs
gcloud builds list --limit 5
gcloud builds log [BUILD_ID]

# Check quotas
gcloud compute project-info describe --project=$PROJECT_ID
```

---

## 📞 Support

### หาความช่วยเหลือ

1. **ดู logs**:
   ```bash
   # Cloud Build logs
   gcloud builds list

   # Cloud Run logs
   gcloud run services logs read gungong
   ```

2. **ตรวจสอบ configuration**:
   ```bash
   python scripts/test-firestore.py
   ```

3. **GCP Console**:
   - Cloud Run: https://console.cloud.google.com/run
   - Firestore: https://console.cloud.google.com/firestore
   - IAM: https://console.cloud.google.com/iam-admin

4. **Documentation**:
   - [GCP Documentation](https://cloud.google.com/docs)
   - [Cloud Run Docs](https://cloud.google.com/run/docs)
   - [Firestore Docs](https://cloud.google.com/firestore/docs)

---

## 📚 Additional Resources

### Official Docs
- [Google Cloud Console](https://console.cloud.google.com/)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firestore Documentation](https://cloud.google.com/firestore/docs)
- [IAM Best Practices](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys)

### LINE Integration
- [LINE Developers Console](https://developers.line.biz/console/)
- [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/)

### AI Integration
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)

---

## ✅ Checklist

### Setup Checklist
- [ ] gcloud CLI installed
- [ ] Billing Account ready
- [ ] API Keys collected
- [ ] Python dependencies installed

### Migration Checklist
- [ ] GCP Project created
- [ ] APIs enabled
- [ ] Firestore database created
- [ ] Service Account created
- [ ] Permissions granted
- [ ] Service Account Key created
- [ ] .env file updated
- [ ] Configuration tested
- [ ] Deployed to Cloud Run
- [ ] LINE Webhook updated
- [ ] End-to-end test passed

---

**Last Updated**: 2024-01-09
**Version**: 2.0
