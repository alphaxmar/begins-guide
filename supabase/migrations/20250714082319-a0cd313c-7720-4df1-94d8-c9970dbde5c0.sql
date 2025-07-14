-- Create certificates table if not exists (it seems to exist already from the schema)
-- But let's make sure we have the proper structure and add any missing functionality

-- First, let's add a function to check if user has completed all lessons in a course
CREATE OR REPLACE FUNCTION public.has_user_completed_course(p_user_id UUID, p_course_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Function to generate certificate for a user who completed a course
CREATE OR REPLACE FUNCTION public.generate_certificate(p_user_id UUID, p_course_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- RLS Policies for certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Users can view their own certificates
CREATE POLICY "Users can view own certificates" ON public.certificates
FOR SELECT USING (user_id = auth.uid());

-- Only authenticated users can generate certificates (through the function)
CREATE POLICY "Users can generate certificates" ON public.certificates
FOR INSERT WITH CHECK (user_id = auth.uid());