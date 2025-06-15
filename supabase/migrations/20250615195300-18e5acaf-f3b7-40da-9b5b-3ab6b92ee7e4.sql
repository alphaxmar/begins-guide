
-- เปิดใช้งาน Row Level Security (RLS) บนตาราง 'lessons' ที่มีอยู่แล้ว
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- สร้าง Policy ให้ Admin สามารถจัดการข้อมูลบทเรียนทั้งหมดได้
CREATE POLICY "Admin full access on lessons"
ON public.lessons
FOR ALL
USING (current_user_has_role('admin'))
WITH CHECK (current_user_has_role('admin'));

-- สร้าง Policy ให้ผู้ใช้ที่ซื้อคอร์สแล้ว สามารถดูบทเรียนของคอร์สนั้นๆ ได้
CREATE POLICY "Users can view lessons for purchased courses"
ON public.lessons
FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1
    FROM public.user_purchases up
    WHERE up.user_id = auth.uid()
      AND up.product_id = lessons.product_id
  )
);
