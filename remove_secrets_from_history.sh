#!/bin/bash

# สคริปต์สำหรับลบไฟล์ secrets ออกจาก git history
# ⚠️ คำเตือน: สคริปต์นี้จะเปลี่ยนประวัติ git ทั้งหมด
# ควรทำ backup ก่อนรันสคริปต์นี้

echo "⚠️  คำเตือน: สคริปต์นี้จะลบไฟล์ secrets ออกจากประวัติ git ทั้งหมด"
echo "📋 กำลังจะลบไฟล์เหล่านี้:"
echo "   - secrets/github-actions-key.json"
echo "   - secrets/gungong-ai-9eb1c76f4119.json"
echo "   - secrets/service-account.json"
echo ""
read -p "คุณต้องการดำเนินการต่อหรือไม่? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "ยกเลิกการดำเนินการ"
    exit 1
fi

echo "🔍 กำลังตรวจสอบ git-filter-repo..."

# ตรวจสอบว่ามี git-filter-repo หรือไม่
if ! command -v git-filter-repo &> /dev/null
then
    echo "❌ ไม่พบ git-filter-repo"
    echo "📦 กำลังติดตั้ง git-filter-repo..."

    if command -v brew &> /dev/null
    then
        brew install git-filter-repo
    elif command -v pip3 &> /dev/null
    then
        pip3 install git-filter-repo
    elif command -v pip &> /dev/null
    then
        pip install git-filter-repo
    else
        echo "❌ ไม่สามารถติดตั้ง git-filter-repo ได้"
        echo "กรุณาติดตั้งด้วยตัวเอง: https://github.com/newren/git-filter-repo"
        exit 1
    fi
fi

echo "✅ พบ git-filter-repo"
echo "🗑️  กำลังลบไฟล์ secrets จากประวัติ git..."

# สร้าง backup branch
git branch backup-before-secret-removal 2>/dev/null || echo "⚠️  backup branch อาจมีอยู่แล้ว"

# ลบไฟล์ออกจาก git history
git filter-repo --path secrets/github-actions-key.json --invert-paths --force
git filter-repo --path secrets/gungong-ai-9eb1c76f4119.json --invert-paths --force
git filter-repo --path secrets/service-account.json --invert-paths --force

echo "✅ ลบไฟล์ secrets จาก git history เรียบร้อยแล้ว"
echo ""
echo "📝 ขั้นตอนต่อไป:"
echo "1. ตรวจสอบว่าไฟล์ถูกลบแล้วด้วย: git log --all --full-history -- secrets/"
echo "2. ถ้าทุกอย่างถูกต้อง ให้ push ไปยัง remote:"
echo "   git push origin --force --all"
echo "   git push origin --force --tags"
echo ""
echo "⚠️  คำเตือน: คนอื่นที่ clone repository ไปแล้วจะต้อง re-clone ใหม่"
echo "⚠️  อย่าลืม revoke credentials เหล่านั้นใน Google Cloud Console!"
