
-- ลบ Policy เก่าที่อนุญาตให้ทุกคนเข้าถึงบทเรียนได้ เพื่อบังคับใช้การตรวจสอบสิทธิ์การซื้อ
DROP POLICY IF EXISTS "Lessons are viewable by everyone" ON public.lessons;
