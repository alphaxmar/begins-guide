import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseData } from "@/hooks/useCourseData";
import { useAdvancedCourseAccess } from "@/hooks/useAdvancedCourseAccess";
import AcademyLessonPlayer from "@/components/academy/AcademyLessonPlayer";
import AcademyCurriculum from "@/components/academy/AcademyCurriculum";
import AcademyTabs from "@/components/academy/AcademyTabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

const AcademyCoursePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { product, lessons, isLoading } = useCourseData(slug);
  const { hasAccess, accessType, isLoading: accessLoading } = useAdvancedCourseAccess(product?.id);
  
  const [activeLesson, setActiveLesson] = useState<Tables<'lessons'> | null>(null);

  useEffect(() => {
    if (lessons && lessons.length > 0 && !activeLesson) {
      setActiveLesson(lessons[0]);
    }
  }, [lessons, activeLesson]);

  const handleLessonClick = (lesson: Tables<'lessons'>) => {
    setActiveLesson(lesson);
  };

  if (isLoading || accessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-lg">กำลังโหลด Freedom Engine Academy...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-8">
          <div className="mb-6">
            <Lock className="h-20 w-20 text-amber-400 mx-auto mb-4" />
            <Crown className="h-8 w-8 text-amber-400 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold mb-4">ขอต้อนรับสู่ Freedom Engine Academy</h1>
          <p className="text-slate-300 mb-6 leading-relaxed">
            คอร์สนี้เป็นส่วนหนึ่งของ <span className="text-amber-400 font-semibold">Pro Membership</span> 
            ที่จะพาคุณจากการมีแค่ "ไอเดีย" ไปสู่การมี "เครื่องจักรทำเงิน" ที่ทำงานให้คุณ 24 ชั่วโมง
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              <Link to="/pricing">
                <Crown className="mr-2 h-4 w-4" />
                อัปเกรดเป็น Pro Member
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับไป Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">ไม่พบคอร์ส Academy</h1>
          <Button onClick={() => navigate("/dashboard")} className="bg-amber-500 hover:bg-amber-600 text-black">
            กลับไป Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Academy Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="h-5 w-5 text-amber-400" />
                <h1 className="text-xl font-bold">Freedom Engine Academy</h1>
              </div>
              <p className="text-sm text-slate-400">สร้าง "เครื่องจักรทำเงิน" ที่ทำงานแทนคุณ 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
              Pro Member
            </div>
          </div>
        </div>
      </header>

      {/* Main Course Interface */}
      <div className="flex h-[calc(100vh-85px)]">
        {/* Left Column - Video Player & Tabs */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 p-6">
            <AcademyLessonPlayer 
              lesson={activeLesson}
              accessType={accessType}
              hasAccess={hasAccess}
            />
          </div>
          
          {/* Tabs Section */}
          <div className="border-t border-slate-700/50 bg-black/20 backdrop-blur-sm">
            <AcademyTabs 
              lesson={activeLesson}
              productId={product.id}
            />
          </div>
        </div>

        {/* Right Column - Curriculum */}
        <div className="w-96 border-l border-slate-700/50">
          <AcademyCurriculum
            lessons={lessons || []}
            activeLesson={activeLesson}
            onLessonClick={handleLessonClick}
            totalLessons={lessons?.length || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default AcademyCoursePage;