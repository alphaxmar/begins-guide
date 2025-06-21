
-- ลบ policy เก่าที่อาจจะมีปัญหา circular dependency
DROP POLICY IF EXISTS "Admin can view all profiles and users can view own" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

-- สร้าง policy ใหม่ที่แก้ปัญหา circular dependency
-- ผู้ใช้สามารถดูโปรไฟล์ตัวเองได้เสมอ (เงื่อนไขแรก)
-- และ admin สามารถดูโปรไฟล์ทุกคนได้ (เงื่อนไขที่สอง)
CREATE POLICY "Users can view own profile and admins can view all"
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
