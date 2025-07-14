-- ฟังก์ชันสำหรับดึงรายชื่อ Affiliates ทั้งหมด (สำหรับ Admin)
CREATE OR REPLACE FUNCTION public.get_all_affiliates()
RETURNS TABLE(
  user_id uuid,
  full_name text,
  email text,
  affiliate_code text,
  status text,
  created_at timestamp with time zone,
  total_sales bigint,
  total_commission numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- ตรวจสอบสิทธิ์แอดมิน
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    a.user_id,
    p.full_name,
    au.email::text,
    a.affiliate_code,
    a.status,
    a.created_at,
    COALESCE(stats.total_sales, 0) as total_sales,
    COALESCE(stats.total_commission, 0) as total_commission
  FROM public.affiliates a
  JOIN public.profiles p ON a.user_id = p.id
  JOIN auth.users au ON p.id = au.id
  LEFT JOIN (
    SELECT 
      affiliate_id,
      COUNT(*) as total_sales,
      SUM(commission_amount) as total_commission
    FROM public.affiliate_sales
    GROUP BY affiliate_id
  ) stats ON a.user_id = stats.affiliate_id
  ORDER BY a.created_at DESC;
END;
$$;

-- ฟังก์ชันสำหรับดึงรายการค่าคอมมิชชั่นที่รอจ่าย (สำหรับ Admin)
CREATE OR REPLACE FUNCTION public.get_pending_commissions()
RETURNS TABLE(
  id uuid,
  affiliate_name text,
  affiliate_code text,
  commission_amount numeric,
  commission_rate numeric,
  created_at timestamp with time zone,
  product_title text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- ตรวจสอบสิทธิ์แอดมิน
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    afs.id,
    p.full_name as affiliate_name,
    a.affiliate_code,
    afs.commission_amount,
    afs.commission_rate,
    afs.created_at,
    pr.title as product_title
  FROM public.affiliate_sales afs
  JOIN public.affiliates a ON afs.affiliate_id = a.user_id
  JOIN public.profiles p ON a.user_id = p.id
  JOIN public.user_purchases up ON afs.purchase_id = up.id
  JOIN public.products pr ON up.product_id = pr.id
  WHERE afs.status = 'pending'
  ORDER BY afs.created_at DESC;
END;
$$;

-- ฟังก์ชันสำหรับอัปเดตสถานะ Affiliate (สำหรับ Admin)
CREATE OR REPLACE FUNCTION public.update_affiliate_status(p_user_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- ตรวจสอบสิทธิ์แอดมิน
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- ตรวจสอบว่า status ที่ส่งมาถูกต้อง
  IF p_status NOT IN ('active', 'inactive', 'pending') THEN
    RAISE EXCEPTION 'Invalid status. Must be one of: active, inactive, pending';
  END IF;

  -- อัปเดตสถานะ
  UPDATE public.affiliates 
  SET status = p_status
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Affiliate not found.';
  END IF;
END;
$$;

-- ฟังก์ชันสำหรับอนุมัติค่าคอมมิชชั่น (สำหรับ Admin)
CREATE OR REPLACE FUNCTION public.approve_commission(p_sale_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- ตรวจสอบสิทธิ์แอดมิน
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- อัปเดตสถานะเป็น paid
  UPDATE public.affiliate_sales 
  SET status = 'paid'
  WHERE id = p_sale_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Commission record not found or already processed.';
  END IF;
END;
$$;