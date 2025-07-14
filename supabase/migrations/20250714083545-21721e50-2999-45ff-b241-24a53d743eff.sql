-- Create function to send welcome email when user purchases a course
CREATE OR REPLACE FUNCTION public.send_welcome_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create trigger for welcome email on user_purchases insert
DROP TRIGGER IF EXISTS trigger_send_welcome_email ON public.user_purchases;
CREATE TRIGGER trigger_send_welcome_email
  AFTER INSERT ON public.user_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.send_welcome_email();

-- Create function to send certificate congratulations email
CREATE OR REPLACE FUNCTION public.send_certificate_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create trigger for certificate email on certificates insert
DROP TRIGGER IF EXISTS trigger_send_certificate_email ON public.certificates;
CREATE TRIGGER trigger_send_certificate_email
  AFTER INSERT ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.send_certificate_email();