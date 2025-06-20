
-- สร้าง table สำหรับเก็บการตั้งค่าการชำระเงิน
CREATE TABLE public.payment_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  promptpay_number TEXT,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  bank_branch TEXT,
  stripe_enabled BOOLEAN DEFAULT true,
  omise_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- เพิ่มข้อมูลเริ่มต้น
INSERT INTO public.payment_settings (
  id, 
  promptpay_number, 
  bank_name, 
  bank_account_number, 
  bank_account_name, 
  bank_branch,
  stripe_enabled,
  omise_enabled
) VALUES (
  1,
  '0962358979',
  'ธนาคารกรุงเทพ',
  '138-4-41680-4',
  'รณยศ ตันติถาวรรัช',
  '',
  true,
  true
);

-- เปิด RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- สร้าง policy ให้ทุกคนอ่านได้ (สำหรับแสดงข้อมูลการชำระเงิน)
CREATE POLICY "Allow public read access to payment settings"
  ON public.payment_settings
  FOR SELECT
  TO public
  USING (true);

-- สร้าง policy ให้เฉพาะ admin อัปเดตได้
CREATE POLICY "Allow admin to update payment settings"
  ON public.payment_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
