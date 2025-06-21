
-- เพิ่ม ON DELETE CASCADE สำหรับ foreign key constraint ของ order_items
-- เพื่อให้สามารถลบสินค้าได้แม้ว่าจะมี order_items ที่อ้างอิงอยู่

-- ลบ constraint เดิมก่อน
ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- เพิ่ม constraint ใหม่พร้อม ON DELETE CASCADE
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;

-- ทำเช่นเดียวกันกับ user_purchases
ALTER TABLE public.user_purchases 
DROP CONSTRAINT IF EXISTS user_purchases_product_id_fkey;

ALTER TABLE public.user_purchases 
ADD CONSTRAINT user_purchases_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;

-- ทำเช่นเดียวกันกับ lessons
ALTER TABLE public.lessons 
DROP CONSTRAINT IF EXISTS lessons_product_id_fkey;

ALTER TABLE public.lessons 
ADD CONSTRAINT lessons_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES public.products(id) 
ON DELETE CASCADE;
