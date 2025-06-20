
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CourseAccessBadge from "./CourseAccessBadge";

interface ModernLessonContentProps {
  lesson: Tables<'lessons'> | null;
  onNext: () => void;
  onPrev: () => void;
  isFirstLesson: boolean;
  isLastLesson: boolean;
  accessType: 'admin' | 'vip' | 'purchased' | 'none';
  hasAccess: boolean;
  productId?: string;
  currentLessonIndex?: number;
  totalLessons?: number;
}

const ModernLessonContent = ({ 
  lesson, 
  onNext, 
  onPrev, 
  isFirstLesson, 
  isLastLesson,
  accessType,
  hasAccess,
  productId,
  currentLessonIndex = 0,
  totalLessons = 0
}: ModernLessonContentProps) => {
  if (!lesson) {
    return (
      <div className="flex-1 bg-slate-900 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl">เลือกบทเรียนเพื่อเริ่มต้น</p>
        </div>
      </div>
    );
  }

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes("youtube.com")) {
        const videoId = urlObj.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      if (urlObj.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
      }
    } catch (e) {
      // Not a valid URL, return original
    }
    return url;
  };

  return (
    <div className="flex-1 bg-slate-900 text-white">
      {/* Video Section */}
      <div className="relative">
        {lesson.video_url && hasAccess && (
          <div className="aspect-video bg-black">
            <iframe
              width="100%"
              height="100%"
              src={getEmbedUrl(lesson.video_url)}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}

        {lesson.video_url && !hasAccess && (
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">เนื้อหาสำหรับสมาชิกเท่านั้น</h3>
              <p className="text-slate-400">กรุณาซื้อคอร์สหรือสมัครสมาชิก VIP เพื่อดูวิดีโอ</p>
            </div>
          </div>
        )}

        {!lesson.video_url && (
          <div className="aspect-video bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">บทเรียนแบบข้อความ</h3>
              <p className="text-slate-400">บทเรียนนี้เป็นเนื้อหาแบบข้อความ</p>
            </div>
          </div>
        )}

        {/* Access Badge Overlay */}
        <div className="absolute top-4 right-4">
          <CourseAccessBadge accessType={accessType} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Lesson Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="bg-blue-600 text-white">
              EP.{currentLessonIndex + 1}
            </Badge>
            <span className="text-slate-400 text-sm">
              {currentLessonIndex + 1} จาก {totalLessons}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{lesson.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>50 นาที</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>ผู้สอน: AI Instructor</span>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        {lesson.content && hasAccess && (
          <div className="mb-8">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-slate-200">เนื้อหาประกอบ</h3>
              <div
                className="prose prose-slate prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>
          </div>
        )}

        {lesson.content && !hasAccess && (
          <div className="mb-8">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
              <p className="text-slate-400">เนื้อหาบทเรียนสำหรับสมาชิกเท่านั้น</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-700">
          <Button 
            onClick={onPrev} 
            disabled={isFirstLesson} 
            variant="outline"
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            บทเรียนก่อนหน้า
          </Button>
          
          <div className="text-center text-slate-400 text-sm">
            {currentLessonIndex + 1} / {totalLessons}
          </div>
          
          <Button 
            onClick={onNext} 
            disabled={isLastLesson}
            className="bg-blue-600 hover:bg-blue-700"
          >
            บทเรียนถัดไป
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModernLessonContent;
