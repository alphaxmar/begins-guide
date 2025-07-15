-- Create dreamlining table to store user's dreams and financial goals
CREATE TABLE public.dreamlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('having', 'being', 'doing')),
  cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_dreamline_summaries table to store calculated TMI and summary data
CREATE TABLE public.user_dreamline_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_having NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_being NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_doing NUMERIC(10, 2) NOT NULL DEFAULT 0,
  monthly_basic_expenses NUMERIC(10, 2) NOT NULL DEFAULT 0,
  target_monthly_income NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dreamlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dreamline_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dreamlines
CREATE POLICY "Users can view their own dreamlines" 
ON public.dreamlines 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dreamlines" 
ON public.dreamlines 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dreamlines" 
ON public.dreamlines 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dreamlines" 
ON public.dreamlines 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for user_dreamline_summaries
CREATE POLICY "Users can view their own summary" 
ON public.user_dreamline_summaries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own summary" 
ON public.user_dreamline_summaries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own summary" 
ON public.user_dreamline_summaries 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_dreamlines_updated_at
BEFORE UPDATE ON public.dreamlines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_dreamline_summaries_updated_at
BEFORE UPDATE ON public.user_dreamline_summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate and update TMI
CREATE OR REPLACE FUNCTION public.calculate_and_update_tmi(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_total_having NUMERIC(10, 2) := 0;
  v_total_being NUMERIC(10, 2) := 0;
  v_total_doing NUMERIC(10, 2) := 0;
  v_monthly_basic_expenses NUMERIC(10, 2) := 0;
  v_target_monthly_income NUMERIC(10, 2) := 0;
BEGIN
  -- Calculate totals for each category
  SELECT 
    COALESCE(SUM(CASE WHEN category = 'having' THEN cost ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN category = 'being' THEN cost ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN category = 'doing' THEN cost ELSE 0 END), 0)
  INTO v_total_having, v_total_being, v_total_doing
  FROM public.dreamlines
  WHERE user_id = p_user_id;

  -- Get current monthly basic expenses or use default
  SELECT COALESCE(monthly_basic_expenses, 0)
  INTO v_monthly_basic_expenses
  FROM public.user_dreamline_summaries
  WHERE user_id = p_user_id;

  -- Calculate TMI (Annual dream cost / 12 + monthly basic expenses)
  v_target_monthly_income := (v_total_having + v_total_being + v_total_doing) / 12 + v_monthly_basic_expenses;

  -- Insert or update summary
  INSERT INTO public.user_dreamline_summaries (
    user_id, 
    total_having, 
    total_being, 
    total_doing, 
    monthly_basic_expenses,
    target_monthly_income
  ) 
  VALUES (
    p_user_id, 
    v_total_having, 
    v_total_being, 
    v_total_doing, 
    v_monthly_basic_expenses,
    v_target_monthly_income
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_having = EXCLUDED.total_having,
    total_being = EXCLUDED.total_being,
    total_doing = EXCLUDED.total_doing,
    target_monthly_income = EXCLUDED.target_monthly_income,
    updated_at = now();
END;
$$;