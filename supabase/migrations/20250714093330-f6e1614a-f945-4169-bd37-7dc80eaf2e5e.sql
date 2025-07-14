-- Create RPC function for generating affiliate codes
CREATE OR REPLACE FUNCTION public.create_affiliate_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = 'public'
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_affiliate_code TEXT;
  v_user_name TEXT;
BEGIN
  -- Check if user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create affiliate code';
  END IF;

  -- Check if affiliate code already exists for this user
  SELECT affiliate_code INTO v_affiliate_code
  FROM public.affiliates
  WHERE user_id = v_user_id;

  -- If exists, return existing code
  IF v_affiliate_code IS NOT NULL THEN
    RETURN v_affiliate_code;
  END IF;

  -- Generate new code based on user name
  SELECT full_name INTO v_user_name FROM public.profiles WHERE id = v_user_id;
  
  -- Create readable code from user name
  IF v_user_name IS NOT NULL THEN
    v_affiliate_code := lower(regexp_replace(v_user_name, '[^a-zA-Z0-9]', '', 'g')) || '-' || floor(random() * 900 + 100)::int;
  END IF;

  -- Fallback to random code if name is null or code already exists
  IF v_user_name IS NULL OR v_affiliate_code IS NULL OR EXISTS (SELECT 1 FROM public.affiliates WHERE affiliate_code = v_affiliate_code) THEN
     v_affiliate_code := substr(md5(random()::text || clock_timestamp()::text), 1, 8);
  END IF;
  
  -- Insert new affiliate record
  INSERT INTO public.affiliates (user_id, affiliate_code, status)
  VALUES (v_user_id, v_affiliate_code, 'active');

  RETURN v_affiliate_code;
END;
$$;