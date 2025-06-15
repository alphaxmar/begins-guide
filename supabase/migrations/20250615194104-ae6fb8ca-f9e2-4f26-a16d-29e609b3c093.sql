
-- Create a new private storage bucket for product template files.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_files', 'product_files', false)
ON CONFLICT (id) DO NOTHING;

-- Drop any potentially conflicting old policies first to ensure a clean state.
DROP POLICY IF EXISTS "Admin full access for product_files" ON storage.objects;
DROP POLICY IF EXISTS "Allow read access to purchased template files" ON storage.objects;

-- Policy 1: Give administrators full access (select, insert, update, delete) to the product template files.
CREATE POLICY "Admin full access for product_files"
ON storage.objects FOR ALL
USING (bucket_id = 'product_files' AND current_user_has_role('admin'))
WITH CHECK (bucket_id = 'product_files' AND current_user_has_role('admin'));

-- Policy 2: Allow authenticated users to read/view files of templates they have purchased.
-- The file path is expected to be 'templates/{product_id}/{file_name}'.
-- This policy extracts the product_id from the path and checks if a corresponding
-- record exists in the user_purchases table for the current user.
CREATE POLICY "Allow read access to purchased template files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'product_files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1
    FROM public.user_purchases up
    WHERE up.user_id = auth.uid()
      AND up.product_id = (
        -- Safely extract UUID from path, handle potential errors
        CASE
          WHEN array_length(string_to_array(storage.objects.name, '/'), 1) > 1
          THEN (string_to_array(storage.objects.name, '/'))[2]::uuid
          ELSE NULL
        END
      )
  )
);
