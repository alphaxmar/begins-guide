
-- สร้าง function สำหรับให้ admin เข้าถึงข้อมูลผู้ใช้ทั้งหมด
-- โดยไม่ผ่าน RLS เพื่อหลีกเลี่ยง circular dependency
CREATE OR REPLACE FUNCTION public.get_users_with_stats_admin()
RETURNS TABLE(id uuid, email text, full_name text, role user_role, created_at timestamp with time zone, total_purchases bigint, total_spent numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  -- ตรวจสอบว่าผู้เรียกใช้เป็น admin โดยไม่ผ่าน RLS
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
    COALESCE(au.email, 'No email access')::text as email,
    p.full_name,
    p.role,
    COALESCE(au.created_at, now()) as created_at,
    COALESCE(purchase_stats.total_purchases, 0) as total_purchases,
    COALESCE(purchase_stats.total_spent, 0) as total_spent
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  LEFT JOIN (
    SELECT 
      up.user_id,
      COUNT(up.id) as total_purchases,
      SUM(pr.price) as total_spent
    FROM public.user_purchases up
    JOIN public.products pr ON up.product_id = pr.id
    GROUP BY up.user_id
  ) purchase_stats ON p.id = purchase_stats.user_id
  ORDER BY COALESCE(au.created_at, now()) DESC;
END;
$function$;

-- สร้าง function สำหรับตรวจสอบ admin role อย่างปลอดภัย
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$function$;
