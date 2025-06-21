
-- ตรวจสอบ RLS policies ปัจจุบันของตาราง profiles
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';

-- สร้าง policy ใหม่สำหรับให้ admin สามารถ update profiles ของผู้อื่นได้
-- ลบ policy เก่าที่อาจจะขัดแย้งก่อน
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- สร้าง policy ใหม่ที่ครอบคลุมทั้ง user update profile ตัวเองและ admin update ทุกคน
CREATE POLICY "Users can update own profile and admins can update all"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.profiles AS current_user_profile
      WHERE current_user_profile.id = auth.uid() 
      AND current_user_profile.role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.profiles AS current_user_profile
      WHERE current_user_profile.id = auth.uid() 
      AND current_user_profile.role = 'admin'
    )
  );

-- เพิ่ม policy สำหรับการ SELECT ให้ admin ดูข้อมูลทุกคนได้ (ถ้ายังไม่มี)
DROP POLICY IF EXISTS "Admin can view all profiles and users can view own" ON public.profiles;
CREATE POLICY "Admin can view all profiles and users can view own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.profiles AS current_user_profile
      WHERE current_user_profile.id = auth.uid() 
      AND current_user_profile.role = 'admin'
    )
  );
