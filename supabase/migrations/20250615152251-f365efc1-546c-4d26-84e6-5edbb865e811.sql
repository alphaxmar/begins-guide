
-- Create a custom ENUM type for the status of articles if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'article_status') THEN
        CREATE TYPE public.article_status AS ENUM ('draft', 'published');
    END IF;
END$$;

-- Add 'status' and 'cover_image_url' columns to the 'articles' table if they don't exist
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS status public.article_status NOT NULL DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Enable Row Level Security (RLS) on the 'articles' table. This is idempotent.
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts before creating new ones.
DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can manage all articles" ON public.articles;

-- RLS Policy: Allow anyone (public, anonymous users) to read articles that are 'published'
CREATE POLICY "Public can read published articles"
ON public.articles FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- RLS Policy: Allow users with the 'admin' role to perform any action (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage all articles"
ON public.articles FOR ALL
TO authenticated
USING (current_user_has_role('admin'))
WITH CHECK (current_user_has_role('admin'));
