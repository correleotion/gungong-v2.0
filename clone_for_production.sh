#!/bin/bash

# สคริปต์สำหรับ Clone โปรเจคไปยัง Production Repository
# ใช้สคริปต์นี้เพื่อสร้าง private repo สำหรับรันงานจริง

set -e  # Exit on error

echo "🚀 GunGong - Clone to Production Repository"
echo "==========================================="
echo ""

# ตรวจสอบว่ามี argument ไหม
if [ -z "$1" ]; then
    echo "❌ กรุณาระบุ path ที่ต้องการสร้าง production repo"
    echo ""
    echo "Usage:"
    echo "  ./clone_for_production.sh /path/to/gungong-production"
    echo ""
    echo "Example:"
    echo "  ./clone_for_production.sh ~/Desktop/gungong-production"
    exit 1
fi

PROD_PATH="$1"
CURRENT_DIR="$(pwd)"

# ตรวจสอบว่า path มีอยู่แล้วหรือไม่
if [ -d "$PROD_PATH" ]; then
    echo "⚠️  Directory $PROD_PATH มีอยู่แล้ว"
    read -p "ต้องการลบและสร้างใหม่หรือไม่? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROD_PATH"
    else
        echo "ยกเลิกการดำเนินการ"
        exit 1
    fi
fi

echo "📋 ขั้นตอนที่จะทำ:"
echo "1. Clone repository ไปยัง $PROD_PATH"
echo "2. สร้างโฟลเดอร์สำหรับ secrets และ .env"
echo "3. แสดงคำแนะนำในการตั้งค่า"
echo ""
read -p "ดำเนินการต่อหรือไม่? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "ยกเลิกการดำเนินการ"
    exit 1
fi

# Clone repository
echo "📦 กำลัง clone repository..."
git clone "$CURRENT_DIR" "$PROD_PATH"

cd "$PROD_PATH"

# ลบ git remote เดิม
echo "🔗 กำลังลบ remote เดิม..."
git remote remove origin 2>/dev/null || true

# สร้างโฟลเดอร์ secrets ถ้ายังไม่มี
mkdir -p secrets

# สร้างไฟล์ .env จาก .env.example
if [ ! -f ".env" ]; then
    echo "📝 กำลังสร้างไฟล์ .env..."
    cp .env.example .env
fi

# สร้าง branch สำหรับ production
echo "🌿 สร้าง branch production..."
git checkout -b production 2>/dev/null || git checkout production

echo ""
echo "✅ Clone สำเร็จ!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 ขั้นตอนต่อไป:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  สร้าง Private Repository บน GitHub:"
echo "   - ไปที่ https://github.com/new"
echo "   - ตั้งชื่อ repository (เช่น gungong-production)"
echo "   - เลือก 'Private'"
echo "   - อย่าเลือก 'Initialize with README'"
echo ""
echo "2️⃣  เพิ่ม Remote และ Push:"
echo "   cd $PROD_PATH"
echo "   git remote add origin https://github.com/YOUR_USERNAME/gungong-production.git"
echo "   git push -u origin production"
echo ""
echo "3️⃣  Copy ไฟล์ Secrets ของจริง:"
echo "   # Copy service account keys"
echo "   cp /path/to/real/service-account.json $PROD_PATH/secrets/"
echo "   cp /path/to/real/github-actions-key.json $PROD_PATH/secrets/"
echo ""
echo "4️⃣  แก้ไขไฟล์ .env ให้เป็นค่าจริง:"
echo "   nano $PROD_PATH/.env"
echo ""
echo "5️⃣  ตั้งค่า GitHub Secrets:"
echo "   - ไปที่ Repository Settings → Secrets → Actions"
echo "   - เพิ่ม secrets ทั้งหมดตาม SECURITY_GUIDE.md"
echo ""
echo "6️⃣  Deploy ไปยัง Cloud Run:"
echo "   # ผ่าน GitHub Actions (แนะนำ)"
echo "   git add ."
echo "   git commit -m \"chore: setup production environment\""
echo "   git push origin production"
echo ""
echo "   # หรือ deploy ด้วย gcloud CLI"
echo "   cd $PROD_PATH"
echo "   gcloud run deploy gungong-fullstack --source . --region asia-southeast1"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  สิ่งสำคัญที่ต้องจำ:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ DO:"
echo "  • เก็บ .env และ secrets/ เป็นความลับ"
echo "  • ตั้ง repository เป็น Private"
echo "  • ใช้ GitHub Secrets สำหรับ CI/CD"
echo "  • Backup .env และ secrets/ เป็นประจำ"
echo ""
echo "❌ DON'T:"
echo "  • อย่า push .env หรือ secrets/ ขึ้น git"
echo "  • อย่าทำ repository เป็น Public"
echo "  • อย่าแชร์ credentials ให้ใคร"
echo ""
echo "📖 อ่านเพิ่มเติม:"
echo "  • SECURITY_GUIDE.md - คำแนะนำด้านความปลอดภัย"
echo "  • PREPARE_FOR_PUBLIC.md - การจัดการ public/private repos"
echo ""
echo "🎉 พร้อมใช้งานแล้ว!"
