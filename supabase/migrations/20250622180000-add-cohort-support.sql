
-- Add new product types for signature courses
ALTER TYPE product_type ADD VALUE IF NOT EXISTS 'cohort_program';

-- Create cohorts table
CREATE TABLE IF NOT EXISTS public.cohorts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  max_students integer DEFAULT 50,
  current_students integer DEFAULT 0,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  community_link text,
  live_session_notes text
);

-- Create cohort_enrollments table
CREATE TABLE IF NOT EXISTS public.cohort_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone NOT NULL DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(user_id, cohort_id)
);

-- Create live_sessions table for scheduling
CREATE TABLE IF NOT EXISTS public.live_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer DEFAULT 90,
  meeting_url text,
  recording_url text,
  notes text,
  week_number integer
);

-- Enable RLS
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cohorts
CREATE POLICY "Cohorts are viewable by everyone" ON public.cohorts FOR SELECT USING (true);
CREATE POLICY "Admin can manage cohorts" ON public.cohorts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for cohort_enrollments
CREATE POLICY "Users can view their own enrollments" ON public.cohort_enrollments 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all enrollments" ON public.cohort_enrollments 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "System can insert enrollments" ON public.cohort_enrollments 
FOR INSERT WITH CHECK (true);

-- RLS Policies for live_sessions
CREATE POLICY "Enrolled users can view live sessions" ON public.live_sessions 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.cohort_enrollments 
    WHERE cohort_id = live_sessions.cohort_id 
    AND user_id = auth.uid() 
    AND status = 'active'
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin can manage live sessions" ON public.live_sessions 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
