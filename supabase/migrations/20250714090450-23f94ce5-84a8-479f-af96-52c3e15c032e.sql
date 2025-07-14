-- Fix Function Search Path Mutable warnings by setting search_path

-- Fix has_user_completed_course function
CREATE OR REPLACE FUNCTION public.has_user_completed_course(p_user_id uuid, p_course_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
BEGIN
  -- Count total lessons in the course
  SELECT COUNT(*) INTO total_lessons
  FROM public.lessons
  WHERE product_id = p_course_id;
  
  -- Count completed lessons by the user
  SELECT COUNT(*) INTO completed_lessons
  FROM public.user_lesson_progress ulp
  JOIN public.lessons l ON l.id = ulp.lesson_id
  WHERE ulp.user_id = p_user_id 
    AND l.product_id = p_course_id 
    AND ulp.completed = true;
  
  -- Return true if all lessons are completed (and there are lessons to complete)
  RETURN total_lessons > 0 AND completed_lessons = total_lessons;
END;
$function$;

-- Fix generate_certificate function
CREATE OR REPLACE FUNCTION public.generate_certificate(p_user_id uuid, p_course_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  certificate_id UUID;
  cert_number TEXT;
BEGIN
  -- Check if user has actually completed the course
  IF NOT public.has_user_completed_course(p_user_id, p_course_id) THEN
    RAISE EXCEPTION 'User has not completed this course yet';
  END IF;
  
  -- Check if certificate already exists
  SELECT id INTO certificate_id
  FROM public.certificates
  WHERE user_id = p_user_id AND product_id = p_course_id;
  
  IF certificate_id IS NOT NULL THEN
    RETURN certificate_id;
  END IF;
  
  -- Generate unique certificate number
  cert_number := 'BG-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
  
  -- Insert new certificate
  INSERT INTO public.certificates (
    user_id,
    product_id,
    certificate_number,
    completion_date,
    issued_date
  ) VALUES (
    p_user_id,
    p_course_id,
    cert_number,
    NOW(),
    NOW()
  ) RETURNING id INTO certificate_id;
  
  RETURN certificate_id;
END;
$function$;

-- Fix send_welcome_email function
CREATE OR REPLACE FUNCTION public.send_welcome_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  user_email TEXT;
  user_name TEXT;
  course_title TEXT;
  course_slug TEXT;
BEGIN
  -- Get user email and name
  SELECT au.email, p.full_name
  INTO user_email, user_name
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE au.id = NEW.user_id;

  -- Get course details
  SELECT pr.title, pr.slug
  INTO course_title, course_slug
  FROM public.products pr
  WHERE pr.id = NEW.product_id;

  -- Send welcome email via edge function
  PERFORM net.http_post(
    url := 'https://suemonabwttspbmxaxbi.supabase.co/functions/v1/send-transactional-email',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
    body := json_build_object(
      'type', 'welcome',
      'to', user_email,
      'data', json_build_object(
        'user_name', COALESCE(user_name, 'ผู้เรียน'),
        'course_title', course_title,
        'course_slug', course_slug
      )
    )::jsonb
  );

  RETURN NEW;
END;
$function$;

-- Fix send_certificate_email function
CREATE OR REPLACE FUNCTION public.send_certificate_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  user_email TEXT;
  user_name TEXT;
  course_title TEXT;
  course_slug TEXT;
BEGIN
  -- Get user email and name
  SELECT au.email, p.full_name
  INTO user_email, user_name
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.id = au.id
  WHERE au.id = NEW.user_id;

  -- Get course details
  SELECT pr.title, pr.slug
  INTO course_title, course_slug
  FROM public.products pr
  WHERE pr.id = NEW.product_id;

  -- Send certificate email via edge function
  PERFORM net.http_post(
    url := 'https://suemonabwttspbmxaxbi.supabase.co/functions/v1/send-transactional-email',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
    body := json_build_object(
      'type', 'certificate',
      'to', user_email,
      'data', json_build_object(
        'user_name', COALESCE(user_name, 'ผู้เรียน'),
        'course_title', course_title,
        'course_slug', course_slug,
        'certificate_number', NEW.certificate_number,
        'certificate_url', 'https://dbad61e2-24f5-4037-a08a-87d92111db2c.lovableproject.com/certificate/' || course_slug
      )
    )::jsonb
  );

  RETURN NEW;
END;
$function$;

-- Fix send_purchase_confirmation_email function
CREATE OR REPLACE FUNCTION public.send_purchase_confirmation_email(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
  v_user_email TEXT;
  v_user_name TEXT;
  v_order_total NUMERIC;
  v_products JSON;
BEGIN
  -- Get order details
  SELECT 
    au.email,
    p.full_name,
    o.total_amount,
    json_agg(
      json_build_object(
        'title', pr.title,
        'price', oi.price
      )
    )
  INTO v_user_email, v_user_name, v_order_total, v_products
  FROM public.orders o
  JOIN public.profiles p ON o.user_id = p.id
  JOIN auth.users au ON p.id = au.id
  JOIN public.order_items oi ON o.id = oi.order_id
  JOIN public.products pr ON oi.product_id = pr.id
  WHERE o.id = p_order_id
  GROUP BY au.email, p.full_name, o.total_amount;

  -- Call edge function to send email
  PERFORM net.http_post(
    url := 'https://suemonabwttspbmxaxbi.supabase.co/functions/v1/send-email-notifications',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
    body := json_build_object(
      'type', 'purchase_confirmation',
      'to', v_user_email,
      'data', json_build_object(
        'user_name', v_user_name,
        'order_id', p_order_id::text,
        'products', v_products,
        'total_amount', v_order_total
      )
    )::jsonb
  );
END;
$function$;

-- Fix update_lessons_order function
CREATE OR REPLACE FUNCTION public.update_lessons_order(p_lesson_ids uuid[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  FOR i IN 1..array_length(p_lesson_ids, 1) LOOP
    UPDATE public.lessons
    SET "order" = i - 1
    WHERE id = p_lesson_ids[i];
  END LOOP;
END;
$function$;

-- Fix is_user_vip function
CREATE OR REPLACE FUNCTION public.is_user_vip(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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