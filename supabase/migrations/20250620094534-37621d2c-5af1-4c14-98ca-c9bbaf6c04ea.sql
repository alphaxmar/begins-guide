
-- Create storage bucket for product files if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_files', 'product_files', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Admin full access for product_files" ON storage.objects;
DROP POLICY IF EXISTS "Allow read access to purchased template files" ON storage.objects;

-- Policy 1: Give administrators full access to product_files bucket
CREATE POLICY "Admin full access for product_files"
ON storage.objects FOR ALL
USING (
  bucket_id = 'product_files' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'product_files' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy 2: Allow authenticated users to read files of templates they have purchased
-- File path format expected: 'templates/{product_id}/{filename}'
CREATE POLICY "Allow read access to purchased template files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'product_files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1
    FROM public.user_purchases up
    WHERE up.user_id = auth.uid()
      AND up.product_id::text = (
        CASE
          WHEN array_length(string_to_array(storage.objects.name, '/'), 1) >= 2
          THEN (string_to_array(storage.objects.name, '/'))[2]
          ELSE NULL
        END
      )
  )
);

-- Add template_file_path column to products table if not exists
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS template_file_path TEXT;
