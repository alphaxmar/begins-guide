import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useCourseData } from "@/hooks/useCourseData";
import { useAdvancedCourseAccess } from "@/hooks/useAdvancedCourseAccess";
import CoursePageSkeleton from "./CoursePageSkeleton";
import LessonSidebar from "@/components/learn/LessonSidebar";
import EnhancedLessonContent from "@/components/learn/EnhancedLessonContent";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, ShoppingCart } from "lucide-react";
import { ProMemberNav } from '@/components/ProMemberNav';

const CoursePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { product, lessons, isLoading: isCourseDataLoading } = useCourseData(slug);
  const { hasAccess, isLoading: isAccessLoading, isError: isAccessError, accessType } = useAdvancedCourseAccess(product?.id);
  const [activeLesson, setActiveLesson] = useState<Tables<'lessons'> | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const lessonIdFromUrl = queryParams.get('lesson');

  useEffect(() => {
    if (lessons && lessons.length > 0) {
      const lessonFromUrl = lessons.find(l => l.id === lessonIdFromUrl);
      const targetLesson = lessonFromUrl || lessons[0];
      setActiveLesson(targetLesson);
      
      if (!lessonFromUrl) {
        navigate(`${location.pathname}?lesson=${targetLesson.id}`, { replace: true });
      }
    }
  }, [lessons, lessonIdFromUrl, navigate, location.pathname]);

  const activeLessonIndex = useMemo(() => {
    if (!activeLesson || !lessons) return -1;
    return lessons.findIndex((l) => l.id === activeLesson.id);
  }, [activeLesson, lessons]);

  const handleLessonClick = (lessonId: string) => {
    const lesson = lessons?.find((l) => l.id === lessonId);
    if (lesson) {
      setActiveLesson(lesson);
      navigate(`${location.pathname}?lesson=${lesson.id}`, { replace: true });
    }
  };
  
  const handleNext = () => {
    if (lessons && activeLessonIndex < lessons.length - 1) {
      const nextLesson = lessons[activeLessonIndex + 1];
      setActiveLesson(nextLesson);
      navigate(`${location.pathname}?lesson=${nextLesson.id}`, { replace: true });
    }
  };

  const handlePrev = () => {
    if (lessons && activeLessonIndex > 0) {
      const prevLesson = lessons[activeLessonIndex - 1];
      setActiveLesson(prevLesson);
      navigate(`${location.pathname}?lesson=${prevLesson.id}`, { replace: true });
    }
  };

  const isLoading = isCourseDataLoading || (product && isAccessLoading);

  if (isLoading) {
    return <CoursePageSkeleton />;
  }

  if (product && (!hasAccess || isAccessError)) {
    return (
      <div className="text-center py-12 flex flex-col items-center">
        <Lock className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-4">คุณยังไม่มีสิทธิ์เข้าถึงคอร์สนี้</h2>
        <p className="text-muted-foreground mb-8">
          {isAccessError ? 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์' : 'กรุณาซื้อคอร์สเพื่อเข้าถึงบทเรียนทั้งหมด หรือสมัครสมาชิก VIP เพื่อเข้าถึงเนื้อหาทั้งหมด'}
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link to={`/products/${product.slug}`}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              ไปที่หน้าคอร์ส
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!product || !lessons) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">ไม่พบคอร์สเรียน</h2>
        <p className="text-muted-foreground mb-8">คอร์สที่คุณกำลังมองหาอาจไม่มีอยู่จริง หรือคุณไม่มีสิทธิ์เข้าถึง</p>
        <Button asChild>
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารวมสินค้า
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full py-4">
      <div className="mb-4">
        <Button variant="ghost" asChild className="-ml-4">
         <Link to={`/products/${product.slug}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้าข้อมูลคอร์ส
         </Link>
      </Button>
    </div>
      <div className="flex flex-col md:flex-row border rounded-lg overflow-hidden flex-grow" style={{ minHeight: '75vh' }}>
        <LessonSidebar
          lessons={lessons || []}
          activeLessonId={activeLesson?.id || null}
          onLessonClick={handleLessonClick}
          productTitle={product.title}
        />
        <EnhancedLessonContent
          lesson={activeLesson}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirstLesson={activeLessonIndex === 0}
          isLastLesson={lessons ? activeLessonIndex === lessons.length - 1 : true}
          accessType={accessType}
          hasAccess={hasAccess}
          productId={product.id}
        />
      </div>
    </div>
  );
};

export default CoursePage;
