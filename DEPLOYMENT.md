# 🚀 GunGong Deployment Guide

Full-Stack Deployment บน Google Cloud Run (Frontend + Backend ใน Container เดียว)

## 📋 สิ่งที่ต้องเตรียม

### 1. GCP Project
- Project ID: `iee-dscc` (หรือ project ของคุณ)
- Billing Account: ต้องเปิดใช้งาน
- APIs ที่ต้อง Enable:
  - Cloud Run API
  - Cloud Build API
  - Firestore API
  - Container Registry API

### 2. ไฟล์ `.env`
ต้องมีค่าเหล่านี้ (ไม่จำเป็นต้อง commit):
```env
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash-exp
FIRESTORE_PROJECT_ID=iee-dscc
LINE_CHANNEL_ACCESS_TOKEN=your_line_token
LINE_CHANNEL_SECRET=your_line_secret
```

**หมายเหตุ:** Environment variables สำหรับ Cloud Run จะตั้งค่าผ่าน Secret Manager หรือ `--set-env-vars` ตอน deploy

---

## 🏗️ สถาปัตยกรรม

```
┌─────────────────────────────────────┐
│     Google Cloud Run Service       │
│         (asia-southeast1)           │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Frontend (React + Vite)     │ │
│  │   → Served as static files    │ │
│  │   → Path: /src/backend/static │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Backend (FastAPI)           │ │
│  │   → Port: 8080                │ │
│  │   → Serves frontend at /      │ │
│  │   → API endpoints: /api/*     │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
           │
           ├─→ Firestore (asia-southeast1)
           ├─→ Gemini API
           └─→ LINE Webhook
```

---

## 🔧 การ Deploy

### วิธีที่ 1: ใช้ Script (แนะนำ)

```bash
./scripts/deploy-to-cloudrun.sh
```

Script จะทำสิ่งเหล่านี้:
1. ✅ ตรวจสอบ gcloud CLI และ Project ID
2. ✅ Build Docker image (Frontend + Backend)
3. ✅ Push image ไปยัง Google Container Registry
4. ✅ Deploy ไปยัง Cloud Run (asia-southeast1)
5. ✅ แสดง Service URL

### วิธีที่ 2: Manual Deploy

```bash
# 1. Build และ Deploy ด้วย Cloud Build
gcloud builds submit \
  --config=deployment/cloudbuild-fullstack.yaml \
  --timeout=40m

# 2. ตรวจสอบ Service URL
gcloud run services describe gungong-fullstack \
  --region=asia-southeast1 \
  --format='value(status.url)'
```

---

## 📝 ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | คำอธิบาย |
|------|----------|
| [deployment/Dockerfile.fullstack](deployment/Dockerfile.fullstack) | Multi-stage Dockerfile สำหรับ build Frontend + Backend |
| [deployment/cloudbuild-fullstack.yaml](deployment/cloudbuild-fullstack.yaml) | Cloud Build configuration |
| [scripts/deploy-to-cloudrun.sh](scripts/deploy-to-cloudrun.sh) | Deployment script (ใช้งานง่าย) |
| [src/backend/main.py](src/backend/main.py:89-136) | FastAPI config สำหรับ serve static files |

---

## ⚙️ Configuration

### Cloud Run Settings

```yaml
Service: gungong-fullstack
Region: asia-southeast1
Memory: 2Gi
CPU: 2
Port: 8080
Timeout: 300s
Max Instances: 10
Min Instances: 0
Authentication: Allow unauthenticated
```

### Environment Variables

ตั้งค่า environment variables ผ่าน Cloud Run:

```bash
gcloud run services update gungong-fullstack \
  --region=asia-southeast1 \
  --set-env-vars="GOOGLE_API_KEY=xxx,FIRESTORE_PROJECT_ID=iee-dscc,LINE_CHANNEL_ACCESS_TOKEN=xxx,LINE_CHANNEL_SECRET=xxx"
```

หรือใช้ Secret Manager (แนะนำสำหรับ production):

```bash
# สร้าง secrets
gcloud secrets create gemini-api-key --data-file=-
gcloud secrets create line-channel-token --data-file=-

# ตั้งค่า service ให้ใช้ secrets
gcloud run services update gungong-fullstack \
  --region=asia-southeast1 \
  --set-secrets="GOOGLE_API_KEY=gemini-api-key:latest,LINE_CHANNEL_ACCESS_TOKEN=line-channel-token:latest"
```

---

## 🧪 ทดสอบหลัง Deploy

### 1. ตรวจสอบ Service ทำงาน

```bash
# ดู logs
gcloud run services logs read gungong-fullstack \
  --region=asia-southeast1 \
  --limit=50

# ตรวจสอบ health endpoint
curl https://YOUR_SERVICE_URL/health
```

### 2. ทดสอบ Frontend

เปิดเบราว์เซอร์ไปที่:
```
https://YOUR_SERVICE_URL/
```

### 3. ทดสอบ API

```bash
# Test fraud check endpoint
curl -X POST https://YOUR_SERVICE_URL/api/v2/fraud/check \
  -H "Content-Type: application/json" \
  -d '{"message": "โอนเงินมาที่ 0812345678"}'
```

### 4. อัพเดท LINE Webhook

ไปที่ [LINE Developers Console](https://developers.line.biz/console/):
1. เลือก Channel ของคุณ
2. แท็บ **Messaging API**
3. Webhook URL: `https://YOUR_SERVICE_URL/webhook`
4. กด **Verify** และ **Enable**

---

## 🔄 การ Update Service

### Update Code และ Deploy ใหม่

```bash
# วิธีที่ 1: ใช้ script
./scripts/deploy-to-cloudrun.sh

# วิธีที่ 2: Manual
gcloud builds submit --config=deployment/cloudbuild-fullstack.yaml
```

### Update เฉพาะ Environment Variables

```bash
gcloud run services update gungong-fullstack \
  --region=asia-southeast1 \
  --set-env-vars="DEBUG=False,NEW_VAR=value"
```

### Rollback ไปเวอร์ชันเก่า

```bash
# ดู revisions
gcloud run revisions list --service=gungong-fullstack --region=asia-southeast1

# Rollback
gcloud run services update-traffic gungong-fullstack \
  --region=asia-southeast1 \
  --to-revisions=REVISION_NAME=100
```

---

## 🐛 Troubleshooting

### ปัญหา: Build ใช้เวลานาน
**สาเหตุ:** Playwright installation ใช้เวลาประมาณ 5-10 นาที
**แก้ไข:** รอให้เสร็จ หรือใช้ cached image

### ปัญหา: Frontend แสดงไม่ออก
**ตรวจสอบ:**
```bash
# 1. ตรวจสอบ logs
gcloud run services logs read gungong-fullstack --region=asia-southeast1 | grep "Frontend"

# 2. ควรเห็น: "✅ Frontend (Vite build) mounted from..."
```

### ปัญหา: API ใช้งานไม่ได้
**ตรวจสอบ:**
```bash
# 1. Environment variables ครบหรือไม่
gcloud run services describe gungong-fullstack \
  --region=asia-southeast1 \
  --format='value(spec.template.spec.containers[0].env)'

# 2. Firestore connection
curl https://YOUR_SERVICE_URL/health
```

### ปัญหา: Memory/CPU ไม่พอ
```bash
# เพิ่ม resources
gcloud run services update gungong-fullstack \
  --region=asia-southeast1 \
  --memory=4Gi \
  --cpu=4
```

---

## 💰 ค่าใช้จ่ายโดยประมาณ

| Resource | ราคา (ประมาณ) |
|----------|--------------|
| Cloud Run (2GB RAM, 2 CPU) | ~$0.06/hr เมื่อใช้งาน |
| Cloud Build (30 min/build) | ~$0.05/build |
| Container Registry Storage | ~$0.02/GB/month |
| Firestore (Free tier) | $0 (ภายใน 50K reads/day) |

**ประมาณการ:** หากมี traffic ปานกลาง ~$10-20/เดือน

---

## 📚 References

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [FastAPI Static Files](https://fastapi.tiangolo.com/tutorial/static-files/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/)

---

## 🎉 Next Steps

หลัง deploy สำเร็จ:

1. ✅ อัพเดท LINE Webhook URL
2. ✅ ทดสอบ frontend ที่ Service URL
3. ✅ ทดสอบส่งข้อความผ่าน LINE Bot
4. ✅ Monitor logs และ performance
5. ✅ Setup alerting (optional)

---

**สร้างโดย:** Claude Code
**วันที่:** 2026-01-10
**Project:** GunGong (กันโกง) v2.0
