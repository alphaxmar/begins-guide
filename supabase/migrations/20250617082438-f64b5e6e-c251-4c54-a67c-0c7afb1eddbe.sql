
-- ลบ policies เดิมทั้งหมดสำหรับตาราง profiles
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

-- สร้าง RLS policies ใหม่สำหรับตาราง profiles
-- Policy สำหรับ Admin ดูข้อมูลผู้ใช้ทั้งหมด
CREATE POLICY "Admin can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS current_user_profile
      WHERE current_user_profile.id = auth.uid() 
      AND current_user_profile.role = 'admin'
    )
  );

-- Policy สำหรับผู้ใช้ดูโปรไฟล์ตัวเอง
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

-- Policy สำหรับผู้ใช้แก้ไขโปรไฟล์ตัวเอง
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id);

-- Policy สำหรับ Admin แก้ไขโปรไฟล์ผู้ใช้ (เช่น เปลี่ยน role)
CREATE POLICY "Admin can update all profiles" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS current_user_profile
      WHERE current_user_profile.id = auth.uid() 
      AND current_user_profile.role = 'admin'
    )
  );

-- Policy สำหรับการสร้างโปรไฟล์ใหม่
CREATE POLICY "Anyone can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);
