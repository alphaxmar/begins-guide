
-- ทำให้สคริปต์สามารถรันซ้ำได้โดยไม่เกิดข้อผิดพลาด
-- 1. เปิดใช้งาน Row Level Security (RLS) ซึ่งปลอดภัยที่จะรันซ้ำ
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- 2. ลบนโยบายที่มีอยู่ออกไปก่อน (ถ้ามี) แล้วค่อยสร้างใหม่
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_purchases;
CREATE POLICY "Users can view their own purchases"
  ON public.user_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all user_purchases" ON public.user_purchases;
CREATE POLICY "Admins can manage all user_purchases"
  ON public.user_purchases
  FOR ALL
  USING (current_user_has_role('admin'))
  WITH CHECK (current_user_has_role('admin'));

-- 3. สร้างหรือแทนที่ฟังก์ชันสำหรับการสั่งซื้อ (CREATE OR REPLACE ปลอดภัยที่จะรันซ้ำ)
CREATE OR REPLACE FUNCTION public.create_order_for_current_user(product_ids uuid[])
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_id uuid;
  total_price numeric(10, 2);
  product_record record;
  current_user_id uuid := auth.uid();
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create an order.';
  END IF;

  SELECT SUM(p.price) INTO total_price
  FROM public.products p
  WHERE p.id = ANY(product_ids);

  IF total_price IS NULL OR total_price <= 0 THEN
    RAISE EXCEPTION 'No valid products found to create an order.';
  END IF;

  INSERT INTO public.orders (user_id, total_amount, status, payment_provider)
  VALUES (current_user_id, total_price, 'completed', 'skipped_for_mvp')
  RETURNING id INTO new_order_id;

  FOR product_record IN
    SELECT * FROM public.products WHERE id = ANY(product_ids)
  LOOP
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (new_order_id, product_record.id, 1, product_record.price);

    INSERT INTO public.user_purchases (user_id, product_id)
    VALUES (current_user_id, product_record.id)
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END LOOP;
  
  RETURN new_order_id;
END;
$$;
