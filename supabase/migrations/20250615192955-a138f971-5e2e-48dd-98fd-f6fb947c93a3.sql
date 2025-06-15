
-- Create a storage bucket for product files if it doesn't already exist.
-- This bucket is private and has a 10MB file size limit.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product_files', 'product_files', false, 10485760, ARRAY['application/zip', 'application/pdf', 'image/png', 'image/jpeg'])
ON CONFLICT (id) DO NOTHING;

-- RLS policies for the product_files bucket
-- Remove any potentially conflicting old policies first.
DROP POLICY IF EXISTS "Admin full access to product_files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload to product_files" ON storage.objects;

-- Policy: Give administrators full access (select, insert, update, delete) to the product files.
-- This relies on the current_user_has_role('admin') function.
CREATE POLICY "Admin full access to product_files"
ON storage.objects FOR ALL
USING (bucket_id = 'product_files' AND current_user_has_role('admin'))
WITH CHECK (bucket_id = 'product_files' AND current_user_has_role('admin'));

