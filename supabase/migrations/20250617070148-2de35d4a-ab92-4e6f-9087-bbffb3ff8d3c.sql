
-- เพิ่ม RLS policies ให้ตาราง profiles เพื่อให้ Admin เข้าถึงข้อมูลผู้ใช้ทั้งหมดได้
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy สำหรับ Admin ดูข้อมูลผู้ใช้ทั้งหมด
CREATE POLICY "Admin can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
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
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- สร้างฟังก์ชันสำหรับ Admin ดึงข้อมูลผู้ใช้พร้อมสถิติการซื้อ
CREATE OR REPLACE FUNCTION public.get_users_with_stats()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role user_role,
  created_at timestamptz,
  total_purchases bigint,
  total_spent numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- ตรวจสอบว่าผู้เรียกใช้เป็น admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    au.email,
    p.full_name,
    p.role,
    au.created_at,
    COALESCE(purchase_stats.total_purchases, 0) as total_purchases,
    COALESCE(purchase_stats.total_spent, 0) as total_spent
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  LEFT JOIN (
    SELECT 
      up.user_id,
      COUNT(up.id) as total_purchases,
      SUM(pr.price) as total_spent
    FROM public.user_purchases up
    JOIN public.products pr ON up.product_id = pr.id
    GROUP BY up.user_id
  ) purchase_stats ON p.id = purchase_stats.user_id
  ORDER BY au.created_at DESC;
END;
$$;

-- สร้างฟังก์ชันสำหรับ Admin เปลี่ยน role ของผู้ใช้
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  target_user_id uuid,
  new_role user_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- ตรวจสอบว่าผู้เรียกใช้เป็น admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- ตรวจสอบว่า target user มีอยู่จริง
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = target_user_id
  ) THEN
    RAISE EXCEPTION 'User not found.';
  END IF;

  -- อัปเดต role
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
END;
$$;
