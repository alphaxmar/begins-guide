
-- เพิ่ม columns ใหม่ในตาราง articles ตาม PRD v2.0
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS recommended_product_id UUID REFERENCES public.products(id),
ADD COLUMN IF NOT EXISTS is_featured_on_hub BOOLEAN DEFAULT false;

-- อัปเดต comment สำหรับ column ที่มีอยู่แล้ว
COMMENT ON COLUMN public.articles.is_pinned_on_hub IS 'Legacy field - use is_featured_on_hub instead';
COMMENT ON COLUMN public.articles.is_featured_on_hub IS 'Flag to feature articles in "Start Here" section of knowledge hub homepage';

-- สร้างตาราง categories เพื่อจัดการหมวดหมู่
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- เพิ่ม category_id ในตาราง articles
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id);

-- สร้าง categories เริ่มต้นตาม Mock data
INSERT INTO public.categories (name, slug, description, display_order) VALUES
('ไอเดียธุรกิจ', 'business-ideas', 'ไอเดียและแนวทางการสร้างธุรกิจใหม่', 1),
('การตลาด', 'marketing', 'กลยุทธ์และเทคนิคการตลาดออนไลน์', 2),
('No-Code', 'no-code', 'เครื่องมือและแพลตฟอร์ม No-Code สำหรับสร้างธุรกิจ', 3),
('เครื่องมือ', 'tools', 'เครื่องมือดิจิทัลที่จำเป็นสำหรับผู้ประกอบการ', 4),
('การเงินและกฎหมาย', 'finance-legal', 'ความรู้ด้านการเงินและกฎหมายสำหรับธุรกิจ', 5),
('Case Studies', 'case-studies', 'เรื่องราวความสำเร็จและบทเรียนจากการทำธุรกิจจริง', 6)
ON CONFLICT (slug) DO NOTHING;

-- สร้าง index สำหรับ performance
CREATE INDEX IF NOT EXISTS idx_articles_featured_on_hub 
ON public.articles(is_featured_on_hub) 
WHERE is_featured_on_hub = true;

CREATE INDEX IF NOT EXISTS idx_articles_category_id 
ON public.articles(category_id);

CREATE INDEX IF NOT EXISTS idx_articles_status_published 
ON public.articles(status) 
WHERE status = 'published';

-- สร้าง trigger สำหรับ updated_at ในตาราง categories
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at 
BEFORE UPDATE ON public.categories 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
