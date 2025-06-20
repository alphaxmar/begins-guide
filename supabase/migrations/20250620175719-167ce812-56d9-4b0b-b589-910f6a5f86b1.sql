
-- เพิ่มฟีลด์ใหม่สำหรับตาราง products (คอร์ส)
ALTER TABLE public.products ADD COLUMN category TEXT;
ALTER TABLE public.products ADD COLUMN start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.products ADD COLUMN end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.products ADD COLUMN certificate_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN download_limit INTEGER;
ALTER TABLE public.products ADD COLUMN download_expiry_hours INTEGER DEFAULT 24;

-- เพิ่มฟีลด์ใหม่สำหรับตาราง lessons
ALTER TABLE public.lessons ADD COLUMN unlock_type TEXT DEFAULT 'sequential' CHECK (unlock_type IN ('sequential', 'date', 'immediate'));
ALTER TABLE public.lessons ADD COLUMN unlock_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.lessons ADD COLUMN is_locked BOOLEAN DEFAULT false;

-- สร้างตาราง lesson_attachments สำหรับเอกสารประกอบ
CREATE TABLE public.lesson_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- สร้างตาราง quizzes สำหรับแบบทดสอบ
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INTEGER DEFAULT 80,
  time_limit_minutes INTEGER,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- สร้างตาราง quiz_questions สำหรับคำถาม
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'essay')),
  options JSONB, -- สำหรับตัวเลือกของคำถามปรนัย
  correct_answer TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- สร้างตาราง quiz_attempts สำหรับการทำแบบทดสอบ
CREATE TABLE public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  answers JSONB,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- สร้างตาราง certificates สำหรับประกาศนียบัตร
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- สร้างตาราง download_logs สำหรับติดตามการดาวน์โหลด
CREATE TABLE public.download_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  lesson_attachment_id UUID REFERENCES public.lesson_attachments(id) ON DELETE CASCADE,
  download_count INTEGER DEFAULT 1,
  last_downloaded TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- สร้างตาราง user_lesson_progress สำหรับติดตามความคืบหน้า
CREATE TABLE public.user_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  watch_time_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.lesson_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (สำหรับ admin และ user access)
CREATE POLICY "Allow admin full access to lesson_attachments" ON public.lesson_attachments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Allow admin full access to quizzes" ON public.quizzes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Allow admin full access to quiz_questions" ON public.quiz_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own certificates" ON public.certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their own download logs" ON public.download_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create download logs" ON public.download_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view/update their lesson progress" ON public.user_lesson_progress
  FOR ALL USING (user_id = auth.uid());

-- สร้าง storage bucket สำหรับเอกสารประกอบ
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson_attachments', 'lesson_attachments', false);

-- RLS policies สำหรับ storage
CREATE POLICY "Users can view lesson attachments they have access to"
ON storage.objects FOR SELECT USING (
  bucket_id = 'lesson_attachments' AND
  EXISTS (
    SELECT 1 FROM public.user_purchases up
    JOIN public.lessons l ON l.product_id = up.product_id
    JOIN public.lesson_attachments la ON la.lesson_id = l.id
    WHERE up.user_id = auth.uid() AND la.file_path = name
  )
);

CREATE POLICY "Admins can manage lesson attachments"
ON storage.objects FOR ALL USING (
  bucket_id = 'lesson_attachments' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
