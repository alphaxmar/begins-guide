# Begins.guide - Complete Learning Platform Documentation

## 📖 ภาพรวมโครงการ

Begins.guide เป็นแพลตฟอร์มการเรียนรู้และขายคอร์สออนไลน์แบบครบวงจร ที่รวมระบบจัดการเนื้อหา (CMS), ระบบการชำระเงิน, และระบบ Affiliate Marketing

## 🏗️ เทคโนโลยีหลัก

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Authentication + Storage + Edge Functions)
- **Payment**: Stripe Integration
- **Email**: Resend API

## 📁 โครงสร้างโปรเจกต์

```
src/
├── components/           # React Components
│   ├── ui/              # shadcn/ui Components
│   ├── admin/           # Admin Panel Components
│   ├── auth/            # Authentication Components
│   ├── homepage/        # Homepage Sections
│   ├── learn/           # Learning Platform Components
│   ├── payment/         # Payment System Components
│   └── ...
├── pages/               # Page Components
│   ├── admin/          # Admin Panel Pages
│   ├── Articles.tsx    # คลังความรู้
│   ├── CoursePage.tsx  # หน้าเรียนคอร์ส
│   └── ...
├── hooks/              # Custom React Hooks
├── contexts/           # React Context
├── integrations/       # Supabase Integration
└── lib/               # Utility Functions

supabase/
├── functions/         # Edge Functions
├── migrations/        # Database Migrations
└── config.toml       # Supabase Configuration
```

## 🗄️ โครงสร้างฐานข้อมูล

### Core Tables

#### **profiles**
```sql
- id (uuid, PK) - User ID จาก auth.users
- full_name (text) - ชื่อ-นามสกุล
- avatar_url (text) - รูปโปรไฟล์
- role (user_role) - บทบาท: user, admin, partner, vip
```

#### **products**
```sql
- id (uuid, PK)
- title (text) - ชื่อสินค้า/คอร์ส
- description (text) - รายละเอียด
- price (numeric) - ราคา
- product_type (product_type) - ประเภท: course, template, ebook, etc.
- slug (text) - URL slug
- image_url (text) - รูปภาพหน้าปก
- template_file_path (text) - path ไฟล์เทมเพลต
- certificate_enabled (boolean) - เปิดใช้ใบรับรอง
```

#### **lessons**
```sql
- id (uuid, PK)
- product_id (uuid, FK) - คอร์สที่เป็นของ
- title (text) - ชื่อบทเรียน
- content (text) - เนื้อหา
- video_url (text) - ลิงก์วิดีโอ
- order (integer) - ลำดับบทเรียน
- is_free_preview (boolean) - ให้ดูฟรีได้
```

#### **articles**
```sql
- id (uuid, PK)
- title (text) - หัวข้อบทความ
- content (text) - เนื้อหา
- slug (text) - URL slug
- status (article_status) - สถานะ: draft, published
- is_featured_on_hub (boolean) - แสดงในหน้าคลังความรู้
- category_id (uuid, FK) - หมวดหมู่
- recommended_product_id (uuid, FK) - สินค้าที่แนะนำ
```

### E-commerce Tables

#### **orders**
```sql
- id (uuid, PK)
- user_id (uuid, FK) - ผู้สั่งซื้อ
- total_amount (numeric) - ยอดรวม
- status (order_status) - สถานะ: pending, completed, failed
- stripe_session_id (text) - Stripe session
- payment_provider (text) - ผู้ให้บริการการชำระเงิน
```

#### **order_items**
```sql
- id (uuid, PK)
- order_id (uuid, FK) - คำสั่งซื้อ
- product_id (uuid, FK) - สินค้า
- price (numeric) - ราคา
- quantity (integer) - จำนวน
```

#### **user_purchases**
```sql
- id (uuid, PK)
- user_id (uuid, FK) - ผู้ซื้อ
- product_id (uuid, FK) - สินค้าที่ซื้อ
- created_at (timestamptz) - วันที่ซื้อ
```

### VIP Membership

#### **vip_memberships**
```sql
- id (uuid, PK)
- user_id (uuid, FK) - สมาชิก VIP
- stripe_subscription_id (text) - Stripe subscription
- status (subscription_status) - สถานะการสมัคร
- is_active (boolean) - สถานะใช้งาน
- current_period_end_at (timestamptz) - วันหมดอายุ
```

### Affiliate System

#### **affiliates**
```sql
- user_id (uuid, PK, FK) - ผู้ทำการตลาด
- affiliate_code (text) - รหัสการตลาด
- status (text) - สถานะ: active, inactive
```

#### **affiliate_sales**
```sql
- id (uuid, PK)
- affiliate_id (uuid, FK) - ผู้ทำการตลาด
- purchase_id (uuid, FK) - การซื้อที่เกิดขึ้น
- commission_amount (numeric) - ค่าคอมมิชชั่น
- commission_rate (numeric) - อัตราค่าคอมมิชชั่น
- status (text) - สถานะ: pending, paid
```

### Learning Progress

#### **user_lesson_progress**
```sql
- id (uuid, PK)
- user_id (uuid, FK) - ผู้เรียน
- lesson_id (uuid, FK) - บทเรียน
- completed (boolean) - เรียนจบแล้ว
- watch_time_seconds (integer) - เวลาดู
```

#### **certificates**
```sql
- id (uuid, PK)
- user_id (uuid, FK) - ผู้ได้รับใบรับรอง
- product_id (uuid, FK) - คอร์สที่จบ
- certificate_number (text) - เลขที่ใบรับรอง
- issued_date (timestamptz) - วันที่ออกใบรับรอง
```

## 🎯 ฟีเจอร์หลัก

### 1. ระบบการขายคอร์ส
- แสดงรายการคอร์ส/สินค้า
- ระบบตะกร้าสินค้า
- ระบบชำระเงินผ่าน Stripe
- ระบบสมาชิก VIP (เข้าถึงคอร์สทั้งหมด)

### 2. ระบบการเรียน (LMS)
- เรียนคอร์สออนไลน์
- ติดตามความคืบหน้าการเรียน
- ดาวน์โหลดไฟล์แนบบทเรียน
- ระบบใบรับรองการจบคอร์ส

### 3. ระบบคลังความรู้
- บทความฟรี
- จัดหมวดหมู่บทความ
- แนะนำสินค้าภายในบทความ
- SEO-friendly URLs

### 4. ระบบ Affiliate Marketing
- สมัครเป็น Affiliate
- ติดตามยอดขาย & ค่าคอมมิชชั่น
- ระบบอนุมัติการจ่ายเงิน (Admin)

### 5. Admin Panel
- จัดการผู้ใช้งาน
- จัดการคอร์ส/บทเรียน
- จัดการคำสั่งซื้อ
- จัดการ Affiliate & Commission
- ดาชบอร์ดสถิติ

## 🔧 การติดตั้งและพัฒนา

### ขั้นตอนการติดตั้ง

1. **Clone Repository**
```bash
git clone [repository-url]
cd begins-guide
npm install
```

2. **ตั้งค่า Supabase**
- สร้างโปรเจกต์ใหม่ใน Supabase
- รัน migrations ทั้งหมดในโฟลเดอร์ `supabase/migrations/`
- ตั้งค่า Environment Variables

3. **ตั้งค่า Stripe**
- สร้างบัญชี Stripe
- ใส่ API Keys ใน Supabase Secrets

4. **รันโปรเจกต์**
```bash
npm run dev
```

### Environment Variables (Supabase Secrets)

```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
RESEND_API_KEY=your-resend-api-key
```

## 🔒 ระบบความปลอดภัย (RLS Policies)

### กฎการเข้าถึงข้อมูลหลัก

1. **ผู้ใช้ทั่วไป** - อ่านข้อมูลสาธารณะได้เท่านั้น
2. **ผู้ซื้อสินค้า** - เข้าถึงคอร์สที่ซื้อแล้ว
3. **สมาชิก VIP** - เข้าถึงคอร์สทั้งหมด
4. **Admin** - เข้าถึงข้อมูลทั้งหมด

### ตัวอย่าง RLS Policy
```sql
-- ผู้ใช้เข้าถึงเฉพาะคอร์สที่ซื้อแล้ว
CREATE POLICY "Users can view purchased lessons" 
ON lessons FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_purchases 
    WHERE user_id = auth.uid() 
    AND product_id = lessons.product_id
  )
);
```

## 📡 Edge Functions

### ฟังก์ชันหลัก

1. **stripe-webhook** - จัดการ Webhook จาก Stripe
2. **send-transactional-email** - ส่งอีเมลต่างๆ
3. **create-stripe-checkout** - สร้าง Checkout Session

## 🎨 ระบบดีไซน์

### Design System
- ใช้ Tailwind CSS กับ Custom Design Tokens
- สีและ Typography ถูกกำหนดใน `index.css`
- Component Library จาก shadcn/ui

### Responsive Design
- Mobile-first approach
- รองรับทุกขนาดหน้าจอ

## 🚀 การ Deploy

### Production Checklist

1. **Frontend Deploy** - ใช้ Vercel หรือ Netlify
2. **Database Setup** - รัน migrations ใน Production
3. **Stripe Configuration** - ตั้งค่า Webhook URLs
4. **Email Setup** - ยืนยัน Domain ใน Resend
5. **SSL Certificate** - ตรวจสอบ HTTPS

## 🔄 การบำรุงรักษา

### การอัปเดตข้อมูล

1. **เพิ่มคอร์สใหม่** - ใช้ Admin Panel
2. **เพิ่มบทความ** - ใช้ Admin Panel
3. **จัดการผู้ใช้** - ใช้ Admin Panel
4. **ตรวจสอบการชำระเงิน** - ใช้ Dashboard

### การสำรองข้อมูล

- Supabase มีระบบ Backup อัตโนมัติ
- ควรสำรองไฟล์ Storage เป็นระยะ

## 📈 การขยายระบบ

### ฟีเจอร์ที่สามารถเพิ่มได้

1. **Live Streaming** - เพิ่มการเรียนแบบสด
2. **Community Forum** - ระบบกระดานสนทนา
3. **Mobile App** - สร้างแอปมือถือ
4. **Advanced Analytics** - วิเคราะห์ข้อมูลเชิงลึก
5. **Multi-language** - รองรับหลายภาษา

### การปรับแต่งเพิ่มเติม

1. **Custom Domain** - ใช้โดเมนของตัวเอง
2. **White-label** - ปรับแต่งแบรนด์
3. **Third-party Integrations** - เชื่อมต่อระบบอื่น

## 🆘 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **การ Login ไม่ได้** - ตรวจสอบ Auth Redirect URLs
2. **การชำระเงินล้มเหลว** - ตรวจสอบ Stripe Configuration
3. **ไฟล์ดาวน์โหลดไม่ได้** - ตรวจสอบ Storage Permissions

### Debugging Tools

- Supabase Dashboard - ดู Database และ Logs
- Stripe Dashboard - ดู Payment Logs
- Browser DevTools - Debug Frontend Issues

## 📞 Support & Documentation

- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

---

## 📄 License

MIT License - ใช้งานเพื่อการศึกษาและพาณิชย์ได้

---

**สร้างโดย:** Begins.guide Team  
**เวอร์ชัน:** 1.0.0  
**อัปเดตล่าสุด:** July 2025
# Deploy ready ✅
