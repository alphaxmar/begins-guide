
-- สร้าง enum สำหรับประเภท discount
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed_amount');

-- สร้าง table สำหรับเก็บ discount codes
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  discount_type public.discount_type NOT NULL,
  discount_value NUMERIC NOT NULL, -- เปอร์เซ็นต์หรือจำนวนเงิน
  min_purchase_amount NUMERIC DEFAULT 0, -- ยอดขั้นต่ำที่ต้องซื้อ
  max_discount_amount NUMERIC, -- ยอดลดสูงสุด (สำหรับ percentage)
  usage_limit INTEGER, -- จำนวนครั้งที่ใช้ได้ทั้งหมด (null = ไม่จำกัด)
  used_count INTEGER DEFAULT 0, -- จำนวนครั้งที่ใช้ไปแล้ว
  user_usage_limit INTEGER DEFAULT 1, -- จำนวนครั้งที่ผู้ใช้คนหนึ่งใช้ได้
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  applicable_to TEXT[] DEFAULT ARRAY['all'], -- 'all', 'vip_packages', 'courses', 'templates'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- สร้าง table สำหรับติดตามการใช้ discount code ของแต่ละ user
CREATE TABLE public.discount_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id UUID REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  discount_amount NUMERIC NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(discount_code_id, user_id, order_id)
);

-- เพิ่มคอลัมน์ discount ใน orders table
ALTER TABLE public.orders 
ADD COLUMN discount_code_id UUID REFERENCES public.discount_codes(id),
ADD COLUMN discount_amount NUMERIC DEFAULT 0,
ADD COLUMN original_amount NUMERIC; -- ยอดก่อนหักส่วนลด

-- เพิ่มข้อมูล discount code ตัวอย่าง
INSERT INTO public.discount_codes (
  code, 
  name, 
  description,
  discount_type, 
  discount_value,
  min_purchase_amount,
  max_discount_amount,
  usage_limit,
  user_usage_limit,
  valid_until,
  applicable_to
) VALUES 
(
  'WELCOME10',
  'ส่วนลดต้อนรับ 10%',
  'รับส่วนลด 10% สำหรับการซื้อครั้งแรก',
  'percentage',
  10,
  0,
  500,
  100,
  1,
  now() + interval '1 month',
  ARRAY['all']
),
(
  'VIP500',
  'ส่วนลด VIP 500 บาท',
  'รับส่วนลด 500 บาท สำหรับแพ็กเกจ VIP',
  'fixed_amount',
  500,
  2000,
  null,
  50,
  1,
  now() + interval '2 months',
  ARRAY['vip_packages']
);

-- เปิด RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_code_usage ENABLE ROW LEVEL SECURITY;

-- Policy สำหรับ discount_codes - ให้ทุกคนอ่านได้
CREATE POLICY "Allow public read access to active discount codes"
  ON public.discount_codes
  FOR SELECT
  TO public
  USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

-- Policy ให้เฉพาะ admin จัดการ discount codes
CREATE POLICY "Allow admin to manage discount codes"
  ON public.discount_codes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policy สำหรับ discount_code_usage - ให้ user ดูการใช้งานของตัวเองได้
CREATE POLICY "Users can view their own discount usage"
  ON public.discount_code_usage
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy ให้ admin ดูทุกการใช้งาน
CREATE POLICY "Allow admin to view all discount usage"
  ON public.discount_code_usage
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
