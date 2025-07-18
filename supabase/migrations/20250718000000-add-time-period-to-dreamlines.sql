-- Add time_period column to dreamlines table
ALTER TABLE public.dreamlines 
ADD COLUMN time_period TEXT CHECK (time_period IN ('1_year', '3_years', '5_years', '10_years', 'lifetime')) DEFAULT '1_year';

-- Add comment for documentation
COMMENT ON COLUMN public.dreamlines.time_period IS 'Time period for achieving the dream: 1_year, 3_years, 5_years, 10_years, or lifetime';
