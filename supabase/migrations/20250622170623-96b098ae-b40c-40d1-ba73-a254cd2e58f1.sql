
-- ลบ column status ที่มีปัญหาและสร้างใหม่
ALTER TABLE public.vip_memberships DROP COLUMN IF EXISTS status;

-- เพิ่ม columns ใหม่
ALTER TABLE public.vip_memberships 
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS current_period_end_at TIMESTAMP WITH TIME ZONE;

-- อัปเดต enum สำหรับ subscription status
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- เพิ่ม status column ใหม่ด้วย enum type
ALTER TABLE public.vip_memberships 
ADD COLUMN status subscription_status DEFAULT 'active'::subscription_status;

-- อัปเดต function is_user_vip เพื่อเช็คสถานะ subscription ที่ active
CREATE OR REPLACE FUNCTION public.is_user_vip(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- เช็คจากตาราง profiles ก่อน
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = is_user_vip.user_id 
    AND role = 'vip'
  ) THEN
    RETURN true;
  END IF;

  -- เช็คจาก vip_memberships ที่มี subscription active
  RETURN EXISTS (
    SELECT 1 FROM public.vip_memberships
    WHERE vip_memberships.user_id = is_user_vip.user_id
    AND (status = 'active' OR status = 'trialing')
    AND (current_period_end_at IS NULL OR current_period_end_at > now())
    AND is_active = true
  );
END;
$function$;

-- สร้าง function สำหรับอัปเดต subscription status จาก Stripe webhook
CREATE OR REPLACE FUNCTION public.update_subscription_status(
  p_stripe_subscription_id TEXT,
  p_status subscription_status,
  p_current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.vip_memberships 
  SET 
    status = p_status,
    current_period_end_at = p_current_period_end,
    is_active = CASE 
      WHEN p_status IN ('active', 'trialing') THEN true 
      ELSE false 
    END,
    updated_at = now()
  WHERE stripe_subscription_id = p_stripe_subscription_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found for ID: %', p_stripe_subscription_id;
  END IF;
END;
$function$;
