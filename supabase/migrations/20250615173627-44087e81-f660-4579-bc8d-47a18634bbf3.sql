
-- First, remove the old policy that allows everyone to view lessons.
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;

-- Then, create a new, stricter policy.
-- This policy allows a user to select (view) a lesson only if
-- they have a corresponding purchase record for that product.
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
