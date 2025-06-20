
-- Create email_templates table if not exists
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_logs table if not exists  
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.email_templates(id),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  sent_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for email tables
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policies for email_templates (admin only)
CREATE POLICY "Admin can manage email templates"
  ON public.email_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policies for email_logs (admin only)  
CREATE POLICY "Admin can view email logs"
  ON public.email_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "System can insert email logs"
  ON public.email_logs
  FOR INSERT
  WITH CHECK (true);

-- Create function to send purchase confirmation email
CREATE OR REPLACE FUNCTION public.send_purchase_confirmation_email(
  p_order_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;
