
-- Create storage bucket for product images (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for product template files (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_templates', 'product_templates', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for product_images bucket (public read access)
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product_images');

-- RLS policies for admin access to product_images
CREATE POLICY "Admin full access for product images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'product_images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'product_images' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- RLS policies for product_templates bucket
-- Admin full access
CREATE POLICY "Admin full access for product templates"
ON storage.objects FOR ALL
USING (
  bucket_id = 'product_templates' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'product_templates' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow users to download templates they have purchased
CREATE POLICY "Allow download of purchased templates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'product_templates' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1
    FROM public.user_purchases up
    JOIN public.products p ON up.product_id = p.id
    WHERE up.user_id = auth.uid()
      AND p.template_file_path = storage.objects.name
  )
);
