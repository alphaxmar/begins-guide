
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LessonContentProps {
  lesson: Tables<'lessons'> | null;
  onNext: () => void;
  onPrev: () => void;
  isFirstLesson: boolean;
  isLastLesson: boolean;
}

const LessonContent = ({ lesson, onNext, onPrev, isFirstLesson, isLastLesson }: LessonContentProps) => {
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{lesson.title}</h2>

        {lesson.video_url && (
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

        {lesson.content && (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
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

export default LessonContent;
