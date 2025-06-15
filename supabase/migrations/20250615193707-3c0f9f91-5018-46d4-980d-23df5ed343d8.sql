
-- Create a new public storage bucket for product cover images.
-- File size limit is 5MB. Allowed types are common image formats.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product_images', 'product_images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for the new 'product_images' bucket.

-- Drop any potentially conflicting old policies first to ensure a clean state.
DROP POLICY IF EXISTS "Public read access for product_images" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access for product_images" ON storage.objects;

-- Policy 1: Allow public, anonymous users to read/view images from this bucket.
-- This is necessary so the images can be displayed on the public-facing website.
CREATE POLICY "Public read access for product_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product_images');

-- Policy 2: Give administrators full access (select, insert, update, delete) to the product images.
-- This relies on the current_user_has_role('admin') function.
CREATE POLICY "Admin full access for product_images"
ON storage.objects FOR ALL
USING (bucket_id = 'product_images' AND current_user_has_role('admin'))
WITH CHECK (bucket_id = 'product_images' AND current_user_has_role('admin'));
