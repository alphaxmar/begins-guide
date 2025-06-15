
-- 1. สร้างประเภทข้อมูลสำหรับสถานะคำสั่งซื้อ (Order Status)
CREATE TYPE public.order_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);

-- 2. สร้างตารางสำหรับจัดเก็บคำสั่งซื้อ (orders)
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  status public.order_status NOT NULL DEFAULT 'pending',
  total_amount numeric(10, 2) NOT NULL,
  payment_provider text NULL,
  provider_payment_id text NULL
);
COMMENT ON TABLE public.orders IS 'Stores customer orders.';
COMMENT ON COLUMN public.orders.provider_payment_id IS 'Stores the payment ID from the payment provider, e.g., Omise charge ID';

-- 3. สร้างตารางสำหรับจัดเก็บรายการสินค้าในแต่ละคำสั่งซื้อ (order_items)
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1,
  price numeric(10, 2) NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.order_items IS 'Stores items within an order.';

-- 4. เปิดใช้งาน Row Level Security (RLS) สำหรับตาราง orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders"
  ON public.orders
  FOR ALL
  USING (current_user_has_role('admin'))
  WITH CHECK (current_user_has_role('admin'));

-- 5. เปิดใช้งาน Row Level Security (RLS) สำหรับตาราง order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items in their own orders"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON public.order_items
  FOR ALL
  USING (current_user_has_role('admin'))
  WITH CHECK (current_user_has_role('admin'));
