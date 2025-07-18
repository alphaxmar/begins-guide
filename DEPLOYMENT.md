# 🚀 Deployment Setup Guide

## การตั้งค่า GitHub Actions + Vercel Deployment

### ✅ สิ่งที่ต้องทำเพื่อ Deploy:

#### 1. **ตั้งค่า Vercel Project**
- ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
- Import repository `alphaxmar/begins-guide` 
- Connect กับ GitHub account

#### 2. **สร้าง Vercel Access Token**
- ไปที่ [Vercel Tokens](https://vercel.com/account/tokens)
- สร้าง Token ใหม่ชื่อ "GitHub Actions"
- คัดลอก Token ที่ได้

#### 3. **หา Project IDs**
ไปที่ Project Settings ใน Vercel:
- **Team ID** = `VERCEL_ORG_ID`
- **Project ID** = `VERCEL_PROJECT_ID`

#### 4. **ตั้งค่า GitHub Secrets**
ไปที่ [Repository Secrets](https://github.com/alphaxmar/begins-guide/settings/secrets/actions)

เพิ่ม Secrets ดังนี้:
```
VERCEL_TOKEN = <Token จากขั้นตอนที่ 2>
VERCEL_ORG_ID = <Team ID จาก Vercel>
VERCEL_PROJECT_ID = <Project ID จาก Vercel>
```

#### 5. **Deploy อัตโนมัติ**
หลังจากตั้งค่า Secrets เสร็จ:
- การ Push ไปยัง `main` branch จะ Deploy Production
- การสร้าง Pull Request จะ Deploy Preview

---

## 🎯 สถานะการ Deploy

- ✅ GitHub Actions Workflow พร้อมใช้งาน
- ✅ Vercel Configuration พร้อมใช้งาน  
- ⏳ รอการตั้งค่า Vercel Secrets
- 🚀 พร้อม Deploy เมื่อตั้งค่า Secrets เสร็จ

---

## 📋 Features ที่เพิ่มล่าสุด

### ✨ UI/UX Improvements
- 🎨 Glassmorphism design สำหรับ navigation
- 💫 Card-based layouts พร้อม hover effects
- 🗂️ Reorganized menu structure
- 📱 Responsive design

### 🔧 Technical Fixes  
- ✅ แก้ไข navigation bar overlaps
- ✅ สร้าง PricingPage ใหม่
- ✅ เพิ่ม ProPage dashboard
- ✅ แก้ไข 404 link issues
- ✅ เพิ่ม routes ที่ขาดหายไง

### 🎪 New Pages
- `/pricing` - หน้าแผนราคาและ FAQ
- `/pro` - Pro Member dashboard
- `/ai-tools` - เครื่องมือ AI
- `/vip-courses` - คอร์ส VIP
- `/vip-templates` - Template VIP

---

## 🛠️ วิธีใช้งาน Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```
