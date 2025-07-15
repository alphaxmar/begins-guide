-- Create payment_slips table for storing payment receipt uploads
CREATE TABLE public.payment_slips (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slip_image_url text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  transaction_date timestamp with time zone,
  bank_name text,
  transfer_type text DEFAULT 'bank_transfer',
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create storage bucket for payment slips
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-slips', 'payment-slips', false);

-- Enable RLS on payment_slips table
ALTER TABLE public.payment_slips ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_slips
CREATE POLICY "Users can view their own payment slips"
  ON public.payment_slips
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment slips"
  ON public.payment_slips
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment slips"
  ON public.payment_slips
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all payment slips"
  ON public.payment_slips
  FOR ALL
  USING (current_user_has_role('admin'))
  WITH CHECK (current_user_has_role('admin'));

-- Create storage policies for payment slips
CREATE POLICY "Users can upload their own payment slips"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own payment slips"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'payment-slips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all payment slips"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'payment-slips' AND current_user_has_role('admin'));

-- Create function to update payment slip status
CREATE OR REPLACE FUNCTION public.update_payment_slip_status(
  p_slip_id uuid,
  p_status text,
  p_admin_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  -- Check if user is admin
  IF NOT current_user_has_role('admin') THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Update payment slip status
  UPDATE public.payment_slips 
  SET 
    status = p_status,
    admin_notes = p_admin_notes,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  WHERE id = p_slip_id
  RETURNING order_id INTO v_order_id;

  -- If approved, update order status to completed
  IF p_status = 'approved' AND v_order_id IS NOT NULL THEN
    UPDATE public.orders 
    SET status = 'completed', updated_at = now()
    WHERE id = v_order_id;
    
    -- Create user purchases for approved orders
    INSERT INTO public.user_purchases (user_id, product_id)
    SELECT o.user_id, oi.product_id
    FROM public.orders o
    JOIN public.order_items oi ON o.id = oi.order_id
    WHERE o.id = v_order_id
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END IF;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_payment_slips_updated_at
  BEFORE UPDATE ON public.payment_slips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();