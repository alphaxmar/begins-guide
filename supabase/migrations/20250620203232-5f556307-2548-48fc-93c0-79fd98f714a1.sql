
-- Create vip_packages table
CREATE TABLE public.vip_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  duration_months INTEGER NULL, -- NULL = lifetime
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vip_packages ENABLE ROW LEVEL SECURITY;

-- Create policies (VIP packages can be viewed by anyone, but only admins can manage)
CREATE POLICY "Anyone can view active VIP packages"
  ON public.vip_packages
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can insert VIP packages"
  ON public.vip_packages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update VIP packages"
  ON public.vip_packages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete VIP packages"
  ON public.vip_packages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Insert default VIP package
INSERT INTO public.vip_packages (name, description, price, duration_months, features, is_active)
VALUES (
  'แพ็กเกจ VIP Premium',
  'เข้าถึงคอร์สและเทมเพลตทั้งหมดไม่จำกัด',
  2999,
  NULL, -- lifetime
  '["เข้าถึงคอร์สออนไลน์ทั้งหมด", "ดาวน์โหลดเทมเพลตทั้งหมด", "อัปเดตเนื้อหาใหม่ฟรี", "สนับสนุนลูกค้า VIP", "เข้าถึงเนื้อหาพิเศษ"]'::jsonb,
  true
);
