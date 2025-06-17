
-- Add more product types to support future expansion
ALTER TYPE public.product_type ADD VALUE IF NOT EXISTS 'ebook';
ALTER TYPE public.product_type ADD VALUE IF NOT EXISTS 'video';
ALTER TYPE public.product_type ADD VALUE IF NOT EXISTS 'software';
ALTER TYPE public.product_type ADD VALUE IF NOT EXISTS 'service';
ALTER TYPE public.product_type ADD VALUE IF NOT EXISTS 'membership';
