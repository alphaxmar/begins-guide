
-- Create the lessons table
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.lessons."order" IS 'For ordering lessons within a course';

-- Add index on product_id for faster lookups
CREATE INDEX ON public.lessons (product_id, "order");

-- Enable RLS for the lessons table
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do anything on lessons
CREATE POLICY "Admins can manage all lessons"
ON public.lessons FOR ALL
TO authenticated
USING (current_user_has_role('admin'))
WITH CHECK (current_user_has_role('admin'));

-- Policy: Lessons are viewable by everyone for now.
-- We will restrict this later based on user purchases.
CREATE POLICY "Lessons are viewable by everyone"
ON public.lessons FOR SELECT
USING (true);
