# 🚀 GitHub Actions Auto-Deploy Setup

การตั้งค่านี้จะทำให้ทุกครั้งที่ `git push` ไปยัง branch `main` จะ auto-deploy ไปยัง Cloud Run อัตโนมัติ

---

## ✅ สิ่งที่เตรียมไว้ให้แล้ว

1. ✅ GitHub Actions Workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))
2. ✅ Service Account: `github-actions@gungong-ai.iam.gserviceaccount.com`
3. ✅ Service Account Key: `secrets/github-actions-key.json`
4. ✅ Roles ที่จำเป็น (Cloud Run Admin, Cloud Build Editor, etc.)

---

## 📝 ขั้นตอนการตั้งค่า GitHub Secrets

### 1. ไปที่ GitHub Repository Settings

```
https://github.com/correleotion/gungong-v2.0/settings/secrets/actions
```

### 2. เพิ่ม Secrets ทั้งหมด (กด "New repository secret")

คัดลอกค่าเหล่านี้ไปใส่:

#### **Secret: `GCP_SA_KEY`**
```bash
# รันคำสั่งนี้เพื่อดูค่า:
cat secrets/github-actions-key.json
```
- คัดลอกเนื้อหาทั้งหมดของไฟล์ (JSON object ทั้งหมด)
- วางใน GitHub Secret ชื่อ `GCP_SA_KEY`

#### **Secret: `GOOGLE_API_KEY`**
```
AIzaSyAllTfB1cFQEKedG5r4rkRBgpFHAMnX8ZA
```

#### **Secret: `LINE_CHANNEL_ACCESS_TOKEN`**
```
hY3JamX9Kd9S597lyXmIHoCXFiPywCn8MVRFbWgobrVC27xr16fmxm8UGQS0Q0nz6sP5GRVMvdGDkwECX9846vQS2gtjZT8nkjkOrti6Uf3i2YuqvW9l4Z7ItSBI6wqVOEIB9+E61+DzBsjb8mSVoQdB04t89/1O/w1cDnyilFU=
```

#### **Secret: `LINE_CHANNEL_SECRET`**
```
5b6581e9696aa5e4319183f641d43c79
```

---

## 🎯 วิธีใช้งาน

หลังจากตั้งค่า Secrets เสร็จแล้ว:

### 1. Push Code ไปยัง GitHub

```bash
git add .
git commit -m "Your commit message"
git push
```

### 2. ดู Deployment Progress

- ไปที่: https://github.com/correleotion/gungong-v2.0/actions
- คลิกที่ workflow run ล่าสุด
- ดู logs real-time

### 3. ตรวจสอบผลลัพธ์

เมื่อ deployment สำเร็จ จะเห็น:
- ✅ Build successful
- ✅ Deploy successful
- 🔗 Service URL

---

## 📋 Workflow Summary

เมื่อ push ไปยัง `main` branch:

```
1. ✅ Checkout code
2. ✅ Authenticate to GCP
3. ✅ Build Docker image
4. ✅ Push to Container Registry
5. ✅ Deploy to Cloud Run
6. ✅ แสดง Service URL
```

**ระยะเวลา:** ประมาณ 5-8 นาที

---

## 🔧 Troubleshooting

### ปัญหา: Authentication failed
- ตรวจสอบว่า `GCP_SA_KEY` ถูกต้อง
- ตรวจสอบว่า Service Account มี roles ครบ

### ปัญหา: Build timeout
- เพิ่ม timeout ใน workflow file (บรรทัด 39)

### ปัญหา: Deployment failed
- ดู logs ใน GitHub Actions
- ตรวจสอบ environment variables

---

## 🔒 Security Notes

⚠️ **สำคัญ:**
- ไฟล์ `secrets/github-actions-key.json` อยู่ใน `.gitignore` แล้ว
- **ห้ามแชร์** service account key กับคนอื่น
- **ห้าม commit** key เข้า Git

---

## 🎉 Alternative: Manual Deploy

ถ้าไม่ต้องการ auto-deploy ทุกครั้ง ให้:

1. ลบหรือ disable workflow file
2. Deploy manual ด้วย:
   ```bash
   gcloud builds submit --config=deployment/cloudbuild-fullstack.yaml .
   ```

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloud Run Deployment](https://cloud.google.com/run/docs/deploying)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/best-practices-service-accounts)

---

**Created:** 2026-01-10
**Project:** GunGong (กันโกง) v2.0
