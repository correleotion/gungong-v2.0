# 🔄 GCP Project Migration Guide

คู่มือการย้ายโปรเจกต์ไปยัง GCP Project ใหม่

## 📋 Overview

เอกสารนี้จะแนะนำวิธีการ:
1. สร้าง GCP Project ใหม่
2. สร้าง Service Account ใหม่
3. อัปเดต configuration ทั้งหมด
4. Deploy ไปยัง Cloud Run
5. ตรวจสอบว่าทุกอย่างทำงานถูกต้อง

---

## 🎯 Prerequisites

ก่อนเริ่ม ต้องมี:
- [ ] Google Cloud SDK (gcloud CLI) ติดตั้งแล้ว
- [ ] สิทธิ์ในการสร้าง GCP Project
- [ ] Billing Account ที่พร้อมใช้งาน
- [ ] API Keys ต่างๆ (Gemini, LINE, VirusTotal)

---

## Step 1: สร้าง GCP Project ใหม่

### 1.1 สร้างผ่าน Console

```
1. ไปที่ https://console.cloud.google.com/
2. คลิก "Select a project" → "New Project"
3. ตั้งชื่อ: "gungong" หรือชื่อที่ต้องการ
4. เลือก Billing Account
5. คลิก "Create"
6. จดบันทึก Project ID (เช่น gungong-123456)
```

### 1.2 สร้างผ่าน gcloud CLI

```bash
# ตั้งชื่อ Project
export NEW_PROJECT_ID="gungong-$(date +%s)"

# สร้าง Project
gcloud projects create $NEW_PROJECT_ID \
  --name="GunGong Fraud Detection" \
  --set-as-default

# Link Billing Account (แทนที่ BILLING_ACCOUNT_ID)
export BILLING_ACCOUNT_ID="YOUR-BILLING-ACCOUNT-ID"
gcloud billing projects link $NEW_PROJECT_ID \
  --billing-account=$BILLING_ACCOUNT_ID

# บันทึก Project ID
echo "New Project ID: $NEW_PROJECT_ID"
echo $NEW_PROJECT_ID > .gcp-project-id
```

---

## Step 2: Enable APIs ที่จำเป็น

### 2.1 Enable APIs

```bash
# ใช้ Project ใหม่
gcloud config set project $NEW_PROJECT_ID

# Enable APIs ที่จำเป็นทั้งหมด
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  firestore.googleapis.com \
  cloudresourcemanager.googleapis.com \
  secretmanager.googleapis.com \
  aiplatform.googleapis.com

# ตรวจสอบว่า enable สำเร็จ
gcloud services list --enabled
```

### 2.2 สร้าง Firestore Database

```bash
# สร้าง Firestore in Native mode
gcloud firestore databases create \
  --location=asia-southeast1 \
  --type=firestore-native

# ตรวจสอบสถานะ
gcloud firestore databases list
```

---

## Step 3: สร้าง Service Account ใหม่

### 3.1 สร้าง Service Account

```bash
# ตั้งชื่อ Service Account
export SERVICE_ACCOUNT_NAME="gungong-backend"
export SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${NEW_PROJECT_ID}.iam.gserviceaccount.com"

# สร้าง Service Account
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
  --display-name="GunGong Backend Service" \
  --description="Service account for GunGong backend application"

# ตรวจสอบว่าสร้างสำเร็จ
gcloud iam service-accounts list
```

### 3.2 Grant Permissions

```bash
# Grant Firestore permissions
gcloud projects add-iam-policy-binding $NEW_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/datastore.user"

# Grant Cloud Storage permissions (ถ้าใช้)
gcloud projects add-iam-policy-binding $NEW_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/storage.objectViewer"

# Grant Cloud Run permissions
gcloud projects add-iam-policy-binding $NEW_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/run.invoker"

# Grant Vertex AI permissions (สำหรับ Gemini)
gcloud projects add-iam-policy-binding $NEW_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/aiplatform.user"
```

### 3.3 สร้าง Service Account Key

```bash
# สร้างโฟลเดอร์ secrets ถ้ายังไม่มี
mkdir -p secrets

# สร้าง key file
gcloud iam service-accounts keys create secrets/service-account.json \
  --iam-account=$SERVICE_ACCOUNT_EMAIL

# ตรวจสอบไฟล์
ls -lh secrets/service-account.json

# ⚠️ IMPORTANT: เก็บไฟล์นี้ให้ปลอดภัย!
chmod 600 secrets/service-account.json
```

---

## Step 4: อัปเดต Configuration Files

### 4.1 อัปเดต .env

```bash
# อ่าน Project ID ที่สร้างไว้
NEW_PROJECT_ID=$(cat .gcp-project-id)

# สร้างไฟล์ .env ใหม่ (เก็บ API keys เดิม)
cat > .env << EOF
# Google Cloud & AI
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.0-flash-exp
GOOGLE_APPLICATION_CREDENTIALS=secrets/service-account.json
FIRESTORE_PROJECT_ID=$NEW_PROJECT_ID

# LINE Bot Credentials
LINE_CHANNEL_ACCESS_TOKEN=YOUR_LINE_ACCESS_TOKEN
LINE_CHANNEL_SECRET=YOUR_LINE_SECRET

# Application Settings
APP_NAME=GunGong (กันโกง)
DEBUG=False
HOST=0.0.0.0
PORT=8000

# ngrok Configuration (optional)
NGROK_AUTHTOKEN=YOUR_NGROK_TOKEN

# VirusTotal API
VIRUSTOTAL_API_KEY=YOUR_VIRUSTOTAL_KEY

# Use production Firestore
USE_FIREBASE_EMULATOR=false
EOF

echo "✅ Created new .env file"
echo "⚠️  Please update API keys in .env file!"
```

### 4.2 อัปเดต .env.example

```bash
# สร้าง .env.example template
cat > .env.example << EOF
# Google Cloud & AI
GOOGLE_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
GOOGLE_APPLICATION_CREDENTIALS=secrets/service-account.json
FIRESTORE_PROJECT_ID=your-gcp-project-id

# LINE Bot Credentials
LINE_CHANNEL_ACCESS_TOKEN=your_line_access_token
LINE_CHANNEL_SECRET=your_line_secret

# Application Settings
APP_NAME=GunGong (กันโกง)
DEBUG=False
HOST=0.0.0.0
PORT=8000

# ngrok Configuration (optional - for local webhook testing)
NGROK_AUTHTOKEN=your_ngrok_token

# VirusTotal API
VIRUSTOTAL_API_KEY=your_virustotal_api_key

# Use production Firestore
USE_FIREBASE_EMULATOR=false
EOF

echo "✅ Created .env.example"
```

### 4.3 Deploy Firestore Rules และ Indexes

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules --project=$NEW_PROJECT_ID

# Deploy Firestore indexes
firebase deploy --only firestore:indexes --project=$NEW_PROJECT_ID
```

---

## Step 5: ทดสอบ Configuration

### 5.1 ทดสอบ Service Account

```bash
# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="secrets/service-account.json"

# ทดสอบ access Firestore
python3 << EOF
import os
from google.cloud import firestore

# Initialize
project_id = os.getenv('FIRESTORE_PROJECT_ID')
db = firestore.Client(project=project_id)

# Test write
doc_ref = db.collection('test').document('test-doc')
doc_ref.set({'test': 'success', 'timestamp': firestore.SERVER_TIMESTAMP})

# Test read
doc = doc_ref.get()
print(f"✅ Firestore access successful: {doc.to_dict()}")

# Cleanup
doc_ref.delete()
print("✅ Test completed successfully")
EOF
```

### 5.2 ทดสอบ Backend

```bash
# ติดตั้ง dependencies
pip install -r requirements.txt

# รัน backend
cd src/backend
uvicorn main:app --reload

# ทดสอบ (ใน terminal อื่น)
curl http://localhost:8000/health
```

---

## Step 6: Deploy ไปยัง Cloud Run

### 6.1 Build และ Push Docker Image

```bash
# Set project
gcloud config set project $NEW_PROJECT_ID

# Enable Artifact Registry API (ถ้ายังไม่ได้ enable)
gcloud services enable artifactregistry.googleapis.com

# Build image
gcloud builds submit --tag gcr.io/$NEW_PROJECT_ID/gungong

# หรือ build ด้วย Docker local
docker build -t gcr.io/$NEW_PROJECT_ID/gungong .
docker push gcr.io/$NEW_PROJECT_ID/gungong
```

### 6.2 Deploy to Cloud Run

```bash
# Deploy
gcloud run deploy gungong \
  --image gcr.io/$NEW_PROJECT_ID/gungong \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --port 8080 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars "FIRESTORE_PROJECT_ID=$NEW_PROJECT_ID" \
  --service-account $SERVICE_ACCOUNT_EMAIL

# บันทึก URL
export CLOUD_RUN_URL=$(gcloud run services describe gungong \
  --region asia-southeast1 \
  --format 'value(status.url)')

echo "🚀 Cloud Run URL: $CLOUD_RUN_URL"
echo $CLOUD_RUN_URL > .cloud-run-url
```

### 6.3 Set Environment Variables

```bash
# Update Cloud Run with environment variables
gcloud run services update gungong \
  --region asia-southeast1 \
  --update-env-vars \
    GOOGLE_API_KEY="$GOOGLE_API_KEY",\
    GEMINI_MODEL="gemini-2.0-flash-exp",\
    FIRESTORE_PROJECT_ID="$NEW_PROJECT_ID",\
    LINE_CHANNEL_ACCESS_TOKEN="$LINE_CHANNEL_ACCESS_TOKEN",\
    LINE_CHANNEL_SECRET="$LINE_CHANNEL_SECRET",\
    VIRUSTOTAL_API_KEY="$VIRUSTOTAL_API_KEY",\
    APP_NAME="GunGong",\
    DEBUG="False",\
    USE_FIREBASE_EMULATOR="false"
```

---

## Step 7: ตั้งค่า LINE Webhook

### 7.1 Update LINE Webhook URL

```bash
# Get Cloud Run URL
CLOUD_RUN_URL=$(cat .cloud-run-url)

echo "Update LINE Webhook URL to: $CLOUD_RUN_URL/webhook"
echo ""
echo "1. Go to https://developers.line.biz/console/"
echo "2. Select your provider"
echo "3. Select your channel"
echo "4. Go to Messaging API tab"
echo "5. Update Webhook URL: $CLOUD_RUN_URL/webhook"
echo "6. Click 'Verify' to test"
echo "7. Enable 'Use webhook'"
```

### 7.2 ทดสอบ Webhook

```bash
# ส่ง test message
curl -X POST $CLOUD_RUN_URL/webhook \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"test"}}]}'
```

---

## Step 8: Setup Cloud Build Trigger (CI/CD)

### 8.1 Connect Repository

```bash
# Connect GitHub repository
gcloud builds triggers create github \
  --repo-name=gungong-v2.0 \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=deployment/cloudbuild.yaml
```

### 8.2 Manual Trigger

```bash
# Trigger build manually
gcloud builds submit --config=deployment/cloudbuild.yaml
```

---

## Step 9: Cleanup Old Project (Optional)

### 9.1 Backup Data

```bash
# Export Firestore data from old project
OLD_PROJECT_ID="euphoric-stone-478707-m0"

gcloud config set project $OLD_PROJECT_ID

# Export to Cloud Storage
gcloud firestore export gs://your-backup-bucket/firestore-backup
```

### 9.2 Import to New Project

```bash
# Import to new project
gcloud config set project $NEW_PROJECT_ID

gcloud firestore import gs://your-backup-bucket/firestore-backup
```

### 9.3 Shutdown Old Project

```bash
# ⚠️ WARNING: This will delete everything!
gcloud projects delete $OLD_PROJECT_ID
```

---

## 📝 Checklist

### GCP Project Setup
- [ ] สร้าง GCP Project ใหม่
- [ ] Enable APIs ทั้งหมด
- [ ] สร้าง Firestore Database
- [ ] สร้าง Service Account
- [ ] Grant permissions
- [ ] สร้าง Service Account Key

### Configuration
- [ ] อัปเดต .env
- [ ] อัปเดต service-account.json
- [ ] Deploy Firestore rules
- [ ] Deploy Firestore indexes
- [ ] ทดสอบ configuration

### Deployment
- [ ] Build Docker image
- [ ] Deploy to Cloud Run
- [ ] Set environment variables
- [ ] Update LINE webhook URL
- [ ] ทดสอบ webhook

### Testing
- [ ] ทดสอบ /health endpoint
- [ ] ทดสอบ LINE Bot
- [ ] ทดสอบ Fraud Detection
- [ ] ทดสอบ Blacklist checking

### Cleanup
- [ ] Backup data from old project
- [ ] Delete old service account keys
- [ ] Shutdown old project (optional)

---

## 🔍 Verification Commands

```bash
# Check Project
gcloud config get-value project

# Check Services
gcloud services list --enabled

# Check Service Account
gcloud iam service-accounts list

# Check Cloud Run
gcloud run services list

# Check Firestore
gcloud firestore databases list

# Test Health Endpoint
curl https://your-cloud-run-url.run.app/health
```

---

## 🐛 Troubleshooting

### ปัญหา: Permission Denied

```bash
# Grant more permissions
gcloud projects add-iam-policy-binding $NEW_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/editor"
```

### ปัญหา: Firestore Access Denied

```bash
# Check service account
gcloud iam service-accounts get-iam-policy $SERVICE_ACCOUNT_EMAIL

# Re-grant permissions
gcloud projects add-iam-policy-binding $NEW_PROJECT_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/datastore.user"
```

### ปัญหา: Cloud Run Deployment Failed

```bash
# Check logs
gcloud run services logs read gungong --region asia-southeast1

# Check builds
gcloud builds list --limit 5
```

---

## 📚 Additional Resources

- [GCP Console](https://console.cloud.google.com/)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firestore Documentation](https://cloud.google.com/firestore/docs)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys)

---

**Last Updated**: 2024-01-09
