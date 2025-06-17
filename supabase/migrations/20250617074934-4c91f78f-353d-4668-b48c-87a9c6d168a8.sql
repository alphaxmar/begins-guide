
-- ลบฟังก์ชันเดิมก่อน
DROP FUNCTION IF EXISTS public.get_users_with_stats();

-- สร้างฟังก์ชันใหม่ด้วยประเภทข้อมูลที่ถูกต้อง
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
    au.email::text,
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
