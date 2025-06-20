
-- สร้างฟังก์ชันสำหรับดึงสถิติแดชบอร์ด
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE(
  total_users bigint,
  new_users_this_month bigint,
  total_revenue numeric,
  revenue_this_month numeric,
  total_orders bigint,
  pending_orders bigint,
  completed_orders bigint,
  failed_orders bigint
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
    (SELECT COUNT(*) FROM public.profiles) as total_users,
    (SELECT COUNT(*) FROM public.profiles p 
     JOIN auth.users au ON p.id = au.id 
     WHERE au.created_at >= date_trunc('month', now())) as new_users_this_month,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE status = 'completed') as total_revenue,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders 
     WHERE status = 'completed' AND created_at >= date_trunc('month', now())) as revenue_this_month,
    (SELECT COUNT(*) FROM public.orders) as total_orders,
    (SELECT COUNT(*) FROM public.orders WHERE status = 'pending') as pending_orders,
    (SELECT COUNT(*) FROM public.orders WHERE status = 'completed') as completed_orders,
    (SELECT COUNT(*) FROM public.orders WHERE status = 'failed') as failed_orders;
END;
$$;

-- สร้างฟังก์ชันสำหรับดึงสินค้าขายดี
CREATE OR REPLACE FUNCTION public.get_top_selling_products(limit_count integer DEFAULT 5)
RETURNS TABLE(
  product_id uuid,
  product_title text,
  product_price numeric,
  total_sales bigint,
  total_revenue numeric
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
    p.id as product_id,
    p.title as product_title,
    p.price as product_price,
    COUNT(oi.id) as total_sales,
    SUM(oi.price * oi.quantity) as total_revenue
  FROM public.products p
  JOIN public.order_items oi ON p.id = oi.product_id
  JOIN public.orders o ON oi.order_id = o.id
  WHERE o.status = 'completed'
  GROUP BY p.id, p.title, p.price
  ORDER BY total_sales DESC
  LIMIT limit_count;
END;
$$;

-- สร้างฟังก์ชันสำหรับดึงข้อมูลยอดขายรายวัน
CREATE OR REPLACE FUNCTION public.get_daily_sales_stats(days_back integer DEFAULT 30)
RETURNS TABLE(
  sale_date date,
  daily_revenue numeric,
  daily_orders bigint
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
    o.created_at::date as sale_date,
    COALESCE(SUM(o.total_amount), 0) as daily_revenue,
    COUNT(o.id) as daily_orders
  FROM public.orders o
  WHERE o.status = 'completed'
    AND o.created_at >= (now() - interval '1 day' * days_back)
  GROUP BY o.created_at::date
  ORDER BY sale_date DESC;
END;
$$;

-- สร้างฟังก์ชันสำหรับจัดการคำสั่งซื้อ
CREATE OR REPLACE FUNCTION public.get_admin_orders(
  status_filter text DEFAULT NULL,
  limit_count integer DEFAULT 50,
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  order_id uuid,
  user_email text,
  user_full_name text,
  total_amount numeric,
  status order_status,
  payment_provider text,
  created_at timestamp with time zone,
  items_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'auth'
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
    o.id as order_id,
    au.email::text as user_email,
    p.full_name as user_full_name,
    o.total_amount,
    o.status,
    o.payment_provider,
    o.created_at,
    COUNT(oi.id) as items_count
  FROM public.orders o
  JOIN public.profiles p ON o.user_id = p.id
  JOIN auth.users au ON p.id = au.id
  LEFT JOIN public.order_items oi ON o.id = oi.order_id
  WHERE (status_filter IS NULL OR o.status::text = status_filter)
  GROUP BY o.id, au.email, p.full_name, o.total_amount, o.status, o.payment_provider, o.created_at
  ORDER BY o.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- สร้างฟังก์ชันสำหรับอัปเดตสถานะคำสั่งซื้อ
CREATE OR REPLACE FUNCTION public.admin_update_order_status(
  order_id uuid,
  new_status order_status
)
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

  -- อัปเดตสถานะ
  UPDATE public.orders 
  SET status = new_status, updated_at = now()
  WHERE id = order_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found.';
  END IF;
END;
$$;

-- สร้างตารางสำหรับ email templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  subject text NOT NULL,
  content text NOT NULL,
  variables text[], -- ตัวแปรที่ใช้ใน template
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- สร้างตารางสำหรับ email logs
CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES public.email_templates(id),
  recipient_email text NOT NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, sent, failed
  error_message text,
  sent_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now()
);

-- เปิด RLS สำหรับตารางใหม่
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- สร้าง policies สำหรับแอดมิน
CREATE POLICY "Admins can manage email templates"
  ON public.email_templates
  FOR ALL
  USING (current_user_has_role('admin'))
  WITH CHECK (current_user_has_role('admin'));

CREATE POLICY "Admins can view email logs"
  ON public.email_logs
  FOR SELECT
  USING (current_user_has_role('admin'));

CREATE POLICY "Admins can create email logs"
  ON public.email_logs
  FOR INSERT
  WITH CHECK (current_user_has_role('admin'));
