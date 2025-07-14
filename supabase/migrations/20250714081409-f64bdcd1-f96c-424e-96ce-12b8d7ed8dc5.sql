-- Create course_reviews table for Task 2.2
CREATE TABLE public.course_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id) -- ผู้ใช้แต่ละคนรีวิวได้แค่ครั้งเดียวต่อคอร์ส
);

-- Enable RLS
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_reviews
-- ทุกคนสามารถอ่านรีวิวได้
CREATE POLICY "Anyone can read course reviews" 
ON public.course_reviews 
FOR SELECT 
USING (true);

-- เฉพาะผู้ที่ซื้อคอร์สแล้วเท่านั้นที่สร้างรีวิวได้
CREATE POLICY "Users can create reviews for purchased courses" 
ON public.course_reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.user_purchases 
    WHERE user_id = auth.uid() 
    AND product_id = course_id
  )
);

-- ผู้เขียนรีวิวสามารถแก้ไขรีวิวของตนเองได้
CREATE POLICY "Users can update their own reviews" 
ON public.course_reviews 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ผู้เขียนรีวิวสามารถลบรีวิวของตนเองได้
CREATE POLICY "Users can delete their own reviews" 
ON public.course_reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admin สามารถจัดการรีวิวทั้งหมดได้
CREATE POLICY "Admins can manage all reviews" 
ON public.course_reviews 
FOR ALL 
USING (current_user_has_role('admin'::text))
WITH CHECK (current_user_has_role('admin'::text));

-- Add updated_at trigger
CREATE TRIGGER update_course_reviews_updated_at 
BEFORE UPDATE ON public.course_reviews 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();

-- Add is_free_preview column to lessons table for Task 2.3
ALTER TABLE public.lessons 
ADD COLUMN is_free_preview BOOLEAN NOT NULL DEFAULT false;

-- Create index for better performance
CREATE INDEX idx_course_reviews_course_id ON public.course_reviews(course_id);
CREATE INDEX idx_course_reviews_rating ON public.course_reviews(rating);
CREATE INDEX idx_lessons_free_preview ON public.lessons(is_free_preview) WHERE is_free_preview = true;