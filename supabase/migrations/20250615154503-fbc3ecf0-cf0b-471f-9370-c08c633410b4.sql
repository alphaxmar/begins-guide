
-- Step 1: สร้างประเภทข้อมูล (ENUM) ใหม่เพื่อแยกแยะระหว่างประเภทของสินค้า
CREATE TYPE public.product_type AS ENUM ('course', 'template');

-- Step 2: เปลี่ยนชื่อตาราง `courses` เป็น `products` เพื่อให้สื่อความหมายได้ดีขึ้น
ALTER TABLE public.courses RENAME TO products;

-- Step 3: เพิ่มคอลัมน์ `product_type` ในตาราง `products` ที่สร้างขึ้นใหม่
-- โดยกำหนดค่าเริ่มต้นเป็น 'course' เนื่องจากข้อมูลเริ่มต้นน่าจะเป็นคอร์ส
ALTER TABLE public.products
ADD COLUMN product_type public.product_type NOT NULL DEFAULT 'course';

-- Step 4: เปิดใช้งาน Row Level Security (RLS) และกำหนดให้ทุกคนสามารถมองเห็นสินค้าได้
-- เพื่อให้ผู้เยี่ยมชมทุกคนสามารถเห็นสินค้าในหน้าร้านค้าได้
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT
USING (true);
