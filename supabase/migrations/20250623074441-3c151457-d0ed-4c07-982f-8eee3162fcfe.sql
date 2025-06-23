
-- Add new field for pinning articles on knowledge hub homepage
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS is_pinned_on_hub BOOLEAN DEFAULT false;

-- Add comment to explain the purpose
COMMENT ON COLUMN public.articles.is_pinned_on_hub IS 'Flag to pin articles in the "Start Here" section of knowledge hub homepage';

-- Create index for better performance when querying pinned articles
CREATE INDEX IF NOT EXISTS idx_articles_pinned_on_hub 
ON public.articles(is_pinned_on_hub) 
WHERE is_pinned_on_hub = true;
