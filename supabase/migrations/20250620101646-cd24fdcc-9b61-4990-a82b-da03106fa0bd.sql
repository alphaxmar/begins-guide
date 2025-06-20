
-- อัปเดตตาราง orders เพื่อรองรับ Stripe
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- สร้าง storage bucket สำหรับไฟล์เทมเพลต
INSERT INTO storage.buckets (id, name, public)
VALUES ('template-files', 'template-files', false)
ON CONFLICT (id) DO NOTHING;

-- ลบ policy เก่าก่อน (ถ้ามี) แล้วสร้างใหม่
DROP POLICY IF EXISTS "Admin can upload template files" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage template files" ON storage.objects;
DROP POLICY IF EXISTS "Users can download purchased templates" ON storage.objects;

-- Policy สำหรับให้ admin อัปโหลดไฟล์
CREATE POLICY "Admin can upload template files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'template-files' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy สำหรับให้ admin จัดการไฟล์
CREATE POLICY "Admin can manage template files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'template-files' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy สำหรับให้ผู้ซื้อดาวน์โหลดไฟล์ที่ซื้อแล้ว
CREATE POLICY "Users can download purchased templates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'template-files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1
    FROM public.user_purchases up
    JOIN public.products p ON up.product_id = p.id
    WHERE up.user_id = auth.uid()
      AND p.template_file_path = storage.objects.name
  )
);

-- สร้างฟังก์ชันสำหรับจัดการการสั่งซื้อผ่าน Stripe
CREATE OR REPLACE FUNCTION public.create_stripe_order(
  p_product_ids UUID[],
  p_stripe_session_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_id UUID;
  total_price NUMERIC(10, 2);
  product_record RECORD;
  current_user_id UUID := auth.uid();
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create an order.';
  END IF;

  SELECT SUM(p.price) INTO total_price
  FROM public.products p
  WHERE p.id = ANY(p_product_ids);

  IF total_price IS NULL OR total_price <= 0 THEN
    RAISE EXCEPTION 'No valid products found to create an order.';
  END IF;

  INSERT INTO public.orders (user_id, total_amount, status, payment_provider, stripe_session_id)
  VALUES (current_user_id, total_price, 'pending', 'stripe', p_stripe_session_id)
  RETURNING id INTO new_order_id;

  FOR product_record IN
    SELECT * FROM public.products WHERE id = ANY(p_product_ids)
  LOOP
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (new_order_id, product_record.id, 1, product_record.price);
  END LOOP;
  
  RETURN new_order_id;
END;
$$;

-- ฟังก์ชันสำหรับยืนยันการชำระเงินและให้สิทธิ์เข้าถึงสินค้า
CREATE OR REPLACE FUNCTION public.confirm_stripe_payment(
  p_stripe_session_id TEXT,
  p_stripe_payment_intent_id TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_record RECORD;
  product_record RECORD;
BEGIN
  -- ค้นหาคำสั่งซื้อ
  SELECT * INTO order_record
  FROM public.orders
  WHERE stripe_session_id = p_stripe_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found for session ID: %', p_stripe_session_id;
  END IF;

  -- อัปเดตสถานะคำสั่งซื้อ
  UPDATE public.orders 
  SET status = 'completed',
      stripe_payment_intent_id = p_stripe_payment_intent_id,
      updated_at = now()
  WHERE id = order_record.id;

  -- เพิ่มสิทธิ์การเข้าถึงสินค้าให้ผู้ซื้อ
  FOR product_record IN
    SELECT oi.product_id
    FROM public.order_items oi
    WHERE oi.order_id = order_record.id
  LOOP
    INSERT INTO public.user_purchases (user_id, product_id)
    VALUES (order_record.user_id, product_record.product_id)
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END LOOP;
END;
$$;
