
-- ลบ policies เดิมที่ทำให้เกิด infinite recursion
DROP POLICY IF EXISTS "Users can view own profile and admins can view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile and admins can update all" ON public.profiles;

-- สร้าง function ใหม่ที่ปลอดภัยจาก infinite recursion
CREATE OR REPLACE FUNCTION public.check_admin_role_safe()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- ใช้ security definer เพื่อหลีกเลี่ยง RLS policies
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- สร้าง policies ใหม่ที่ปลอดภัย
CREATE POLICY "Allow users to view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow admins to view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.check_admin_role_safe());

CREATE POLICY "Allow users to update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admins to update all profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.check_admin_role_safe())
  WITH CHECK (public.check_admin_role_safe());

-- เพิ่ม policy สำหรับ INSERT
CREATE POLICY "Allow users to insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
