-- Create RPC function to record affiliate sales after successful payment
CREATE OR REPLACE FUNCTION public.record_affiliate_sale(p_purchase_id uuid, p_affiliate_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_affiliate_id UUID;
  v_buyer_id UUID;
  v_purchase_amount NUMERIC;
  v_commission_rate NUMERIC := 0.30; -- 30% commission rate (adjustable)
  v_commission_amount NUMERIC;
  v_product_id UUID;
BEGIN
  -- 1. Exit early if no affiliate code provided
  IF p_affiliate_code IS NULL OR p_affiliate_code = '' THEN
    RETURN;
  END IF;

  -- 2. Find affiliate ID from the provided code
  SELECT user_id INTO v_affiliate_id
  FROM public.affiliates
  WHERE affiliate_code = p_affiliate_code AND status = 'active';
  
  -- Exit if affiliate not found or inactive
  IF v_affiliate_id IS NULL THEN
    RETURN;
  END IF;

  -- 3. Get buyer ID and product ID from user_purchases table
  SELECT user_id, product_id INTO v_buyer_id, v_product_id
  FROM public.user_purchases
  WHERE id = p_purchase_id;

  -- Exit if purchase not found
  IF v_buyer_id IS NULL OR v_product_id IS NULL THEN
    RETURN;
  END IF;

  -- 4. IMPORTANT: Affiliates don't earn commission from their own purchases
  IF v_affiliate_id = v_buyer_id THEN
    RETURN;
  END IF;

  -- 5. Get product price from products table
  SELECT price INTO v_purchase_amount
  FROM public.products
  WHERE id = v_product_id;

  -- Exit if product not found or price is null/zero
  IF v_purchase_amount IS NULL OR v_purchase_amount <= 0 THEN
    RETURN;
  END IF;

  -- 6. Calculate commission amount
  v_commission_amount := v_purchase_amount * v_commission_rate;

  -- 7. Check if this sale is already recorded (prevent duplicates)
  IF EXISTS (SELECT 1 FROM public.affiliate_sales WHERE purchase_id = p_purchase_id) THEN
    RETURN;
  END IF;

  -- 8. Record the affiliate sale
  INSERT INTO public.affiliate_sales
    (affiliate_id, purchase_id, commission_amount, commission_rate, status)
  VALUES
    (v_affiliate_id, p_purchase_id, v_commission_amount, v_commission_rate, 'pending');
    
  -- Log success for debugging
  RAISE NOTICE 'Affiliate sale recorded: affiliate_id=%, purchase_id=%, commission=%, rate=%', 
    v_affiliate_id, p_purchase_id, v_commission_amount, v_commission_rate;
    
END;
$$;