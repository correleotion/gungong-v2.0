# 🚀 Deploy GunGong to Google Cloud Run

คู่มือการ Deploy FastAPI + Playwright บน Google Cloud Run แบบฟรี

---

## 📋 สิ่งที่ต้องเตรียม

- [x] Google Account (Gmail)
- [x] โปรเจกต์ GunGong (มี Dockerfile ใน deployment/ อยู่แล้ว)
- [x] Terminal/Command Line

---

## 🎯 ขั้นตอนการ Deploy

### Step 1: ติดตั้ง Google Cloud SDK

#### สำหรับ macOS
```bash
# ติดตั้งผ่าน Homebrew
brew install --cask google-cloud-sdk

# หรือดาวน์โหลดจาก
# https://cloud.google.com/sdk/docs/install
```

#### สำหรับ Windows
1. ดาวน์โหลด: https://cloud.google.com/sdk/docs/install
2. รันไฟล์ติดตั้ง
3. เปิด `Google Cloud SDK Shell`

#### สำหรับ Linux
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

---

### Step 2: Login และสร้าง Project

```bash
# 1. Login เข้า Google Cloud
gcloud auth login

# 2. สร้าง Project ใหม่
gcloud projects create gungong-bot-2025 --name="GunGong Fraud Bot"

# 3. ตั้งเป็น Project ปัจจุบัน
gcloud config set project gungong-bot-2025

# 4. เปิดใช้งาน Cloud Run API
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

> **💡 Tip:** ถ้ามี Project อยู่แล้ว ข้าม Step 2 แล้วใช้คำสั่ง:
> ```bash
> gcloud config set project YOUR_EXISTING_PROJECT_ID
> ```

---

### Step 3: เตรียมไฟล์สำหรับ Cloud Run

#### 3.1 สร้าง `.gcloudignore` (เพื่อไม่ Upload ไฟล์ที่ไม่จำเป็น)

```bash
# สร้างไฟล์
cat > .gcloudignore << 'EOF'
# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.venv/
venv/
.env

# Git
.git/
.gitignore

# Logs
logs/
*.log

# Others
.DS_Store
.vscode/
.idea/
node_modules/
EOF
```

#### 3.2 เช็ค Dockerfile (อยู่ใน deployment/ folder)

โปรเจกต์เรามี Dockerfile ใน `deployment/Dockerfile` อยู่แล้ว แต่ต้องแก้นิดหน่อย:

```dockerfile
# เปลี่ยนจาก
CMD ["uvicorn", "src.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

# เป็น (เพื่อรองรับ PORT ที่ Cloud Run กำหนด)
CMD uvicorn src.backend.main:app --host 0.0.0.0 --port $PORT
```

---

### Step 4: ตั้งค่า Environment Variables

ใช้ไฟล์ `.env.yaml` (หรือสร้างใหม่) สำหรับ Cloud Run:

```yaml
GOOGLE_API_KEY: "your_gemini_api_key_here"
LINE_CHANNEL_ACCESS_TOKEN: "your_line_token"
LINE_CHANNEL_SECRET: "your_line_secret"
FIRESTORE_PROJECT_ID: "your_firestore_project_id"
VIRUSTOTAL_API_KEY: "your_virustotal_key"
FIREBASE_CREDENTIALS_JSON: >
  {
    "type": "service_account",
    "project_id": "your-project",
    "private_key_id": "...",
    "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    "client_email": "...",
    "client_id": "...",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "..."
  }
```

> **⚠️ สำคัญ:** ไฟล์ `.env.yaml` นี้มี Secret ห้ามเอาขึ้น GitHub!
> เพิ่มใน `.gitignore`:
> ```bash
> echo ".env.yaml" >> .gitignore
> ```

---

### Step 5: Deploy!

```bash
# Deploy ด้วยคำสั่งเดียว!
# Note: ต้องรันจาก root directory ของโปรเจค
gcloud run deploy gungong \
  --source deployment \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --env-vars-file .env.yaml \
  --max-instances 10
```

**อธิบายพารามิเตอร์:**
- `--source deployment` - ใช้ Dockerfile ในโฟลเดอร์ deployment/
- `--region asia-southeast1` - เซิร์ฟเวอร์ในเอเชียตะวันออกเฉียงใต้ (ใกล้ไทย)
- `--allow-unauthenticated` - ให้ทุกคนเข้าถึงได้ (สำหรับ LINE Webhook)
- `--memory 1Gi` - จองแรม 1GB (พอสำหรับ Playwright)
- `--timeout 300` - Timeout 5 นาที (สำหรับ AI + Scraping)
- `--env-vars-file .env.yaml` - โหลด Environment Variables

---

### Step 6: รับ URL และตั้งค่า LINE Webhook

หลัง Deploy เสร็จ จะได้ URL แบบนี้:
```
https://gungong-xxxxxxxxxx-as.a.run.app
```

**ตั้งค่า LINE Webhook:**
1. ไปที่ LINE Developers Console
2. เลือก Channel → Messaging API
3. ตั้ง Webhook URL: `https://gungong-xxxxxxxxxx-as.a.run.app/webhook`
4. เปิด "Use webhook"
5. ปิด "Auto-reply messages"

**ทดสอบ:**
```bash
# เช็คว่า Deploy สำเร็จ
curl https://gungong-xxxxxxxxxx-as.a.run.app/health

# ควรได้
{"status":"healthy","app_name":"GunGong (กันโกง)","timestamp":"..."}
```

---

## 🔧 การจัดการ Deployment

### ดู Logs แบบ Real-time
```bash
gcloud run logs tail gungong --region asia-southeast1
```

### อัปเดตเมื่อมีโค้ดใหม่
```bash
# แค่รันคำสั่งเดิมอีกครั้ง (Deploy ใหม่)
gcloud run deploy gungong \
  --source deployment \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```

### อัปเดต Environment Variables
```bash
# แก้ไข .env.yaml แล้ว Deploy ใหม่
gcloud run services update gungong \
  --region asia-southeast1 \
  --env-vars-file .env.yaml
```

### ลบ Service (ถ้าไม่ใช้แล้ว)
```bash
gcloud run services delete gungong --region asia-southeast1
```

---

## 💰 ค่าใช้จ่าย (Free Tier)

Google Cloud Run **ฟรี** ทุกเดือน:
- ✅ **2 ล้าน requests**
- ✅ **360,000 GB-seconds** (มากมายพอ!)
- ✅ **180,000 vCPU-seconds**

**ประมาณการสำหรับ GunGong:**
- ถ้ามี 1000 requests/วัน = 30,000 requests/เดือน
- **ยังอยู่ใน Free Tier สบายๆ!** 🎉

ดูข้อมูลเพิ่มเติม: https://cloud.google.com/run/pricing

---

## 🔐 Security Best Practices

### 1. ใช้ Secret Manager (แนะนำ!)

แทนที่จะใส่ Secret ใน `.env.yaml` ให้ใช้ Secret Manager:

```bash
# 1. เปิดใช้งาน Secret Manager API
gcloud services enable secretmanager.googleapis.com

# 2. สร้าง Secret
echo -n "your_gemini_api_key" | \
  gcloud secrets create GOOGLE_API_KEY --data-file=-

echo -n "your_line_token" | \
  gcloud secrets create LINE_TOKEN --data-file=-

# 3. Deploy พร้อม Secret
gcloud run deploy gungong \
  --source . \
  --region asia-southeast1 \
  --set-secrets="GOOGLE_API_KEY=GOOGLE_API_KEY:latest,LINE_CHANNEL_ACCESS_TOKEN=LINE_TOKEN:latest"
```

### 2. ตั้งค่า Custom Domain (ถ้าต้องการ)

```bash
gcloud run domain-mappings create \
  --service gungong \
  --domain bot.yourdomain.com \
  --region asia-southeast1
```

---

## 🐛 Troubleshooting

### ปัญหา: Deploy ล้มเหลว "Dockerfile not found"

**วิธีแก้:**
```bash
# ตรวจสอบว่ามี Dockerfile ในโฟลเดอร์ deployment
ls -la deployment/Dockerfile

# ตรวจสอบว่ารันจาก root directory ของโปรเจค
pwd  # ควรเห็น /path/to/gungong

# Deploy โดยระบุ path
gcloud run deploy gungong --source=deployment
```

---

### ปัญหา: Container failed to start

**วิธีแก้:**
ดู Logs เพื่อหาสาเหตุ:
```bash
gcloud run logs read gungong --region asia-southeast1 --limit=50
```

---

### ปัญหา: PORT environment variable not set

**วิธีแก้:**
แก้ Dockerfile ให้รับ `$PORT` จาก Cloud Run:
```dockerfile
CMD uvicorn src.backend.main:app --host 0.0.0.0 --port $PORT
```

---

### ปัญหา: Memory limit exceeded

**วิธีแก้:**
เพิ่ม Memory:
```bash
gcloud run deploy gungong \
  --source . \
  --region asia-southeast1 \
  --memory 2Gi  # เพิ่มเป็น 2GB
```

---

## 📊 Monitoring

### ดู Metrics บน Console
https://console.cloud.google.com/run

จะเห็น:
- Request count
- Response time
- Error rate
- Memory usage
- CPU usage

---

## 🎯 Next Steps

1. ✅ Deploy สำเร็จแล้ว
2. 📱 ตั้งค่า LINE Webhook
3. 🧪 ทดสอบส่งข้อความใน LINE
4. 📊 ดู Logs และ Metrics
5. 🚀 ปรับแต่ง Performance ตามต้องการ

---

## 🆘 ต้องการความช่วยเหลือ?

- 📘 Cloud Run Docs: https://cloud.google.com/run/docs
- 💬 Stack Overflow: https://stackoverflow.com/questions/tagged/google-cloud-run
- 🎓 Cloud Run Tutorials: https://cloud.google.com/run/docs/tutorials

---

**Good luck! 🚀**

Made with ❤️ for Line Hack 2025
