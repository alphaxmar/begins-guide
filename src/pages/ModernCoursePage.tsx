
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseData } from "@/hooks/useCourseData";
import { useAdvancedCourseAccess } from "@/hooks/useAdvancedCourseAccess";
import ModernLessonSidebar from "@/components/learn/ModernLessonSidebar";
import ModernLessonContent from "@/components/learn/ModernLessonContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ModernCoursePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { product, lessons, isLoading } = useCourseData(slug);
  const { hasAccess, accessType } = useAdvancedCourseAccess(product?.id);
  
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (lessons && lessons.length > 0 && !activeLessonId) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);

  const handleLessonClick = (lessonId: string) => {
    setActiveLessonId(lessonId);
  };

  const currentLessonIndex = lessons?.findIndex(l => l.id === activeLessonId) ?? 0;
  const currentLesson = lessons?.find(l => l.id === activeLessonId) ?? null;

  const handleNext = () => {
    if (lessons && currentLessonIndex < lessons.length - 1) {
      setActiveLessonId(lessons[currentLessonIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (lessons && currentLessonIndex > 0) {
      setActiveLessonId(lessons[currentLessonIndex - 1].id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>กำลังโหลดคอร์ส...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">ไม่พบคอร์สที่ต้องการ</h1>
          <Button onClick={() => navigate("/courses")} className="bg-blue-600 hover:bg-blue-700">
            กลับไปหน้าคอร์ส
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/courses")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปคอร์ส
          </Button>
          <div className="text-white">
            <h1 className="text-lg font-semibold">{product.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        <ModernLessonContent
          lesson={currentLesson}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirstLesson={currentLessonIndex === 0}
          isLastLesson={currentLessonIndex === (lessons?.length ?? 0) - 1}
          accessType={accessType}
          hasAccess={hasAccess}
          productId={product.id}
          currentLessonIndex={currentLessonIndex}
          totalLessons={lessons?.length ?? 0}
        />
        
        <ModernLessonSidebar
          lessons={lessons || []}
          activeLessonId={activeLessonId}
          onLessonClick={handleLessonClick}
          productTitle={product.title}
          totalLessons={lessons?.length}
        />
      </div>
    </div>
  );
};

export default ModernCoursePage;
