
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseAccessBadge from "./CourseAccessBadge";
import LessonDownloadButton from "./LessonDownloadButton";

interface EnhancedLessonContentProps {
  lesson: Tables<'lessons'> | null;
  onNext: () => void;
  onPrev: () => void;
  isFirstLesson: boolean;
  isLastLesson: boolean;
  accessType: 'admin' | 'vip' | 'purchased' | 'none';
  hasAccess: boolean;
  productId?: string;
}

const EnhancedLessonContent = ({ 
  lesson, 
  onNext, 
  onPrev, 
  isFirstLesson, 
  isLastLesson,
  accessType,
  hasAccess,
  productId
}: EnhancedLessonContentProps) => {
  if (!lesson) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">เลือกบทเรียนเพื่อเริ่มต้น</p>
      </div>
    );
  }

  // A simple way to convert YouTube watch URLs to embed URLs
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
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-background flex flex-col">
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold">{lesson.title}</h2>
          <CourseAccessBadge accessType={accessType} />
        </div>

        {lesson.video_url && hasAccess && (
          <div className="aspect-video mb-6 rounded-lg overflow-hidden shadow-lg bg-black">
            <iframe
              width="100%"
              height="100%"
              src={getEmbedUrl(lesson.video_url)}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {lesson.video_url && !hasAccess && (
          <div className="aspect-video mb-6 rounded-lg overflow-hidden shadow-lg bg-gray-800 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">เนื้อหาสำหรับสมาชิกเท่านั้น</h3>
              <p className="text-gray-300">กรุณาซื้อคอร์สหรือสมัครสมาชิก VIP เพื่อดูวิดีโอ</p>
            </div>
          </div>
        )}

        {lesson.content && hasAccess && (
          <div
            className="prose prose-lg max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}

        {lesson.content && !hasAccess && (
          <div className="bg-gray-100 p-6 rounded-lg text-center mb-6">
            <p className="text-gray-600">เนื้อหาบทเรียนสำหรับสมาชิกเท่านั้น</p>
          </div>
        )}

        {productId && (
          <div className="mt-6">
            <LessonDownloadButton
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              productId={productId}
              hasAccess={hasAccess}
            />
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t flex justify-between items-center">
        <Button onClick={onPrev} disabled={isFirstLesson} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          บทเรียนก่อนหน้า
        </Button>
        <Button onClick={onNext} disabled={isLastLesson}>
          บทเรียนถัดไป
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedLessonContent;
