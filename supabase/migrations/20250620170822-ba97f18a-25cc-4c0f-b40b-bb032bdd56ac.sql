
-- เพิ่ม VIP role เข้าไปใน user_role enum
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'vip';

-- สร้างตาราง VIP memberships
CREATE TABLE IF NOT EXISTS public.vip_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for VIP memberships
ALTER TABLE public.vip_memberships ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own VIP membership
CREATE POLICY "Users can view own VIP membership"
ON public.vip_memberships FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admins can manage all VIP memberships
CREATE POLICY "Admins can manage VIP memberships"
ON public.vip_memberships FOR ALL
TO authenticated
USING (current_user_has_role('admin'))
WITH CHECK (current_user_has_role('admin'));

-- สร้าง function เพื่อตรวจสอบสถานะ VIP
CREATE OR REPLACE FUNCTION public.is_user_vip(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.vip_memberships
    WHERE vip_memberships.user_id = is_user_vip.user_id
    AND is_active = true
    AND (end_date IS NULL OR end_date > now())
  );
END;
$$;

-- อัปเดต RLS policy สำหรับ lessons ให้รองรับ VIP
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;

-- Policy: Lessons viewable by purchasers or VIP members
CREATE POLICY "Lessons viewable by purchasers or VIP"
ON public.lessons FOR SELECT
USING (
  -- Public access (you can remove this if you want all lessons to be restricted)
  true OR
  -- User has purchased the course
  EXISTS (
    SELECT 1 FROM public.user_purchases up
    WHERE up.user_id = auth.uid()
    AND up.product_id = lessons.product_id
  ) OR
  -- User is VIP
  public.is_user_vip(auth.uid()) OR
  -- Admin access
  current_user_has_role('admin')
);

-- สร้าง storage bucket สำหรับไฟล์คอร์ส (ถ้ายังไม่มี)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('course_files', 'course_files', false, 104857600)
ON CONFLICT (id) DO NOTHING;

-- RLS policies สำหรับ course_files bucket
CREATE POLICY "VIP and purchasers can download course files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'course_files' AND
  auth.role() = 'authenticated' AND
  (
    -- User is VIP
    public.is_user_vip(auth.uid()) OR
    -- User has purchased the course (check by file path)
    EXISTS (
      SELECT 1
      FROM public.user_purchases up
      JOIN public.products p ON up.product_id = p.id
      WHERE up.user_id = auth.uid()
        AND storage.objects.name LIKE p.id::text || '/%'
    ) OR
    -- Admin access
    current_user_has_role('admin')
  )
);

-- Admins can manage course files
CREATE POLICY "Admins can manage course files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'course_files' AND 
  current_user_has_role('admin')
)
WITH CHECK (
  bucket_id = 'course_files' AND 
  current_user_has_role('admin')
);
