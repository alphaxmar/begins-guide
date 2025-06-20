
-- สร้าง storage bucket สำหรับเทมเพลตไฟล์ (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('product_templates', 'product_templates', false, 52428800)
ON CONFLICT (id) DO NOTHING;

-- สร้าง storage bucket สำหรับรูปภาพสินค้า (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('product_images', 'product_images', true, 10485760)
ON CONFLICT (id) DO NOTHING;

-- RLS policies สำหรับ product_templates bucket
-- Admin สามารถจัดการไฟล์ได้ทั้งหมด
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

-- ผู้ใช้สามารถดาวน์โหลดเทมเพลตที่ซื้อแล้วได้
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

-- RLS policies สำหรับ product_images bucket
-- อ่านได้สาธารณะ
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product_images');

-- Admin จัดการได้ทั้งหมด
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
