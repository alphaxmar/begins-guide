
-- Fix lesson access policy to allow users who purchased the course to view lessons
DROP POLICY IF EXISTS "Users can view lessons for purchased products" ON public.lessons;

CREATE POLICY "Users can view lessons for purchased products"
ON public.lessons FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.user_purchases
    WHERE user_purchases.product_id = lessons.product_id
      AND user_purchases.user_id = auth.uid()
  )
);

-- Drop existing policy first, then recreate it
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_purchases;

CREATE POLICY "Users can view their own purchases"
ON public.user_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Allow admins to manage everything
DROP POLICY IF EXISTS "Admins can manage all user purchases" ON public.user_purchases;

CREATE POLICY "Admins can manage all user purchases"
ON public.user_purchases
FOR ALL
USING (public.current_user_has_role('admin'))
WITH CHECK (public.current_user_has_role('admin'));
