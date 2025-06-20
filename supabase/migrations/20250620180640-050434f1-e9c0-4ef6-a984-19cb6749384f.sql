
-- ลบ policy เก่าที่มีปัญหา infinite recursion
DROP POLICY IF EXISTS "Allow admin full access to lesson_attachments" ON public.lesson_attachments;
DROP POLICY IF EXISTS "Allow admin full access to quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Allow admin full access to quiz_questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Admins can manage lesson attachments" ON storage.objects;

-- สร้าง security definer function เพื่อหลีกเลี่ยง infinite recursion
CREATE OR REPLACE FUNCTION public.current_user_has_role(role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role::text = role_name
  );
END;
$$;

-- สร้าง policy ใหม่ที่ใช้ function แทน
CREATE POLICY "Allow admin full access to lesson_attachments" ON public.lesson_attachments
  FOR ALL USING (public.current_user_has_role('admin'));

CREATE POLICY "Allow admin full access to quizzes" ON public.quizzes
  FOR ALL USING (public.current_user_has_role('admin'));

CREATE POLICY "Allow admin full access to quiz_questions" ON public.quiz_questions
  FOR ALL USING (public.current_user_has_role('admin'));

-- แก้ไข storage policy
CREATE POLICY "Admins can manage lesson attachments"
ON storage.objects FOR ALL USING (
  bucket_id = 'lesson_attachments' AND
  public.current_user_has_role('admin')
);

-- เพิ่ม policy สำหรับ users ที่ซื้อคอร์สแล้วให้ดู attachments ได้
CREATE POLICY "Users can view purchased lesson attachments"
ON public.lesson_attachments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_purchases up
    JOIN public.lessons l ON l.product_id = up.product_id
    WHERE up.user_id = auth.uid() AND l.id = lesson_attachments.lesson_id
  )
);

-- เพิ่ม policy สำหรับ users ที่ซื้อคอร์สแล้วให้ดู quizzes ได้
CREATE POLICY "Users can view purchased course quizzes" ON public.quizzes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_purchases up
      WHERE up.user_id = auth.uid() AND up.product_id = quizzes.product_id
    )
  );

CREATE POLICY "Users can view purchased lesson quizzes" ON public.quizzes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_purchases up
      JOIN public.lessons l ON l.product_id = up.product_id
      WHERE up.user_id = auth.uid() AND l.id = quizzes.lesson_id
    )
  );

-- เพิ่ม policy สำหรับ quiz questions
CREATE POLICY "Users can view quiz questions for purchased courses" ON public.quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.user_purchases up ON up.product_id = q.product_id
      WHERE up.user_id = auth.uid() AND q.id = quiz_questions.quiz_id
    )
    OR
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.lessons l ON l.id = q.lesson_id
      JOIN public.user_purchases up ON up.product_id = l.product_id
      WHERE up.user_id = auth.uid() AND q.id = quiz_questions.quiz_id
    )
  );
