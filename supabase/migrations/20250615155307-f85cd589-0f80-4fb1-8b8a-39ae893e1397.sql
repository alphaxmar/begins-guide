
-- ลบนโยบายเก่าที่อนุญาตให้ผู้ใช้ทุกคนสร้างสินค้าได้ (ถ้ามีอยู่)
DROP POLICY IF EXISTS "Authenticated users can create products." ON public.products;
-- ลบนโยบายเก่าที่เกี่ยวข้องกับ 'instructor' (ถ้ามีอยู่)
DROP POLICY IF EXISTS "Instructors can update their own products." ON public.products;
DROP POLICY IF EXISTS "Instructors can delete their own products." ON public.products;

-- สร้างนโยบายใหม่ที่อนุญาตให้ผู้ใช้ที่มีบทบาท 'admin' สามารถทำได้ทุกอย่างกับตาราง products
-- นโยบายนี้จะครอบคลุมทั้งการ SELECT, INSERT, UPDATE, DELETE
CREATE POLICY "Admins can manage all products"
ON public.products FOR ALL
TO authenticated
USING (current_user_has_role('admin'))
WITH CHECK (current_user_has_role('admin'));

-- หมายเหตุ: นโยบาย "Products are viewable by everyone" ที่เราสร้างไว้ก่อนหน้านี้
-- จะยังคงทำงานร่วมกับนโยบายใหม่นี้ เพื่อให้ผู้ใช้ทั่วไปที่ไม่ได้ login หรือไม่มีสิทธิ์ admin
-- สามารถมองเห็นสินค้าได้ตามปกติ แต่ไม่สามารถแก้ไขอะไรได้
