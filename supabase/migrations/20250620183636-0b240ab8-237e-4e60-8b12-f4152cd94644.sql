
-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert their own profile" ON public.profiles;

-- Create a simple function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Create new non-recursive policies for profiles table
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create admin policies that use service role key instead of recursive checks
CREATE POLICY "Service role can manage all profiles"
  ON public.profiles
  FOR ALL
  TO service_role
  USING (true);

-- Fix the get_users_with_stats function to avoid admin check recursion
CREATE OR REPLACE FUNCTION public.get_users_with_stats()
RETURNS TABLE(id uuid, email text, full_name text, role user_role, created_at timestamp with time zone, total_purchases bigint, total_spent numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  -- Simple direct check without using other functions that might cause recursion
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    COALESCE(au.email, 'No email access')::text as email,
    p.full_name,
    p.role,
    COALESCE(au.created_at, now()) as created_at,
    COALESCE(purchase_stats.total_purchases, 0) as total_purchases,
    COALESCE(purchase_stats.total_spent, 0) as total_spent
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  LEFT JOIN (
    SELECT 
      up.user_id,
      COUNT(up.id) as total_purchases,
      SUM(pr.price) as total_spent
    FROM public.user_purchases up
    JOIN public.products pr ON up.product_id = pr.id
    GROUP BY up.user_id
  ) purchase_stats ON p.id = purchase_stats.user_id
  ORDER BY COALESCE(au.created_at, now()) DESC;
END;
$function$;
