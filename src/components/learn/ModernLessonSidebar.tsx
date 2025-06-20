
import { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { PlayCircle, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModernLessonSidebarProps {
  lessons: Tables<'lessons'>[];
  activeLessonId: string | null;
  onLessonClick: (lessonId: string) => void;
  productTitle: string;
  totalLessons?: number;
}

const ModernLessonSidebar = ({ 
  lessons, 
  activeLessonId, 
  onLessonClick, 
  productTitle,
  totalLessons 
}: ModernLessonSidebarProps) => {
  return (
    <aside className="w-full md:w-96 bg-slate-900 border-l border-slate-700 h-full flex flex-col text-white">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-semibold mb-2">{productTitle}</h2>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>{totalLessons || lessons.length} บทเรียน</span>
          <Badge variant="secondary" className="bg-blue-600 text-white">
            คอร์สออนไลน์
          </Badge>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {lessons.map((lesson, index) => {
            const isActive = activeLessonId === lesson.id;
            const lessonNumber = index + 1;
            
            return (
              <button
                key={lesson.id}
                onClick={() => onLessonClick(lesson.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg transition-all duration-200",
                  "border border-slate-700 hover:border-slate-600",
                  isActive 
                    ? "bg-blue-600 border-blue-500 shadow-lg" 
                    : "bg-slate-800 hover:bg-slate-700"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {isActive ? (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <PlayCircle className="h-5 w-5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-sm font-medium">
                        {lessonNumber}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-slate-400 font-medium">
                        EP.{lessonNumber}
                      </p>
                      {lesson.video_url && (
                        <Clock className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                    <p className={cn(
                      "font-medium leading-tight line-clamp-2",
                      isActive ? "text-white" : "text-slate-200"
                    )}>
                      {lesson.title}
                    </p>
                    {lesson.content && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        มีเนื้อหาประกอบ
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default ModernLessonSidebar;
