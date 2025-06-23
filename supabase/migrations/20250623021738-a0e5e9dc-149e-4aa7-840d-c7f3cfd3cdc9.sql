
-- สร้างตารางสำหรับเก็บข้อมูล Service Leads
CREATE TABLE public.service_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_description TEXT NOT NULL,
  budget_range TEXT,
  preferred_start_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending'
);

-- เพิ่ม RLS policies
ALTER TABLE public.service_leads ENABLE ROW LEVEL SECURITY;

-- สร้าง policy ให้ admin ดูได้ทั้งหมด
CREATE POLICY "Admins can view all service leads" 
  ON public.service_leads 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- สร้าง policy ให้ใครก็ได้สามารถสร้าง lead ได้ (สำหรับ form submission)
CREATE POLICY "Anyone can create service leads" 
  ON public.service_leads 
  FOR INSERT 
  WITH CHECK (true);

-- สร้าง policy ให้ admin อัปเดตสถานะได้
CREATE POLICY "Admins can update service leads" 
  ON public.service_leads 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
