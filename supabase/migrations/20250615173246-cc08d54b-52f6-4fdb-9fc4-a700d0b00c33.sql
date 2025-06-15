
-- Create a new table to store user purchases
CREATE TABLE public.user_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT user_purchases_user_id_product_id_key UNIQUE (user_id, product_id)
);

-- Add comments for clarity
COMMENT ON TABLE public.user_purchases IS 'Tracks products purchased by users.';
COMMENT ON COLUMN public.user_purchases.user_id IS 'The user who made the purchase.';
COMMENT ON COLUMN public.user_purchases.product_id IS 'The product that was purchased.';

-- Enable Row Level Security
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own purchases.
CREATE POLICY "Users can view their own purchases"
ON public.user_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admins can manage all purchases.
-- This allows admins to view/add/delete purchases, useful for manual grants or debugging.
CREATE POLICY "Admins can manage all purchases"
ON public.user_purchases
FOR ALL
USING (public.current_user_has_role('admin'))
WITH CHECK (public.current_user_has_role('admin'));
