
import { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { PlayCircle } from "lucide-react";

interface LessonSidebarProps {
  lessons: Tables<'lessons'>[];
  activeLessonId: string | null;
  onLessonClick: (lessonId: string) => void;
  productTitle: string;
}

const LessonSidebar = ({ lessons, activeLessonId, onLessonClick, productTitle }: LessonSidebarProps) => {
  return (
    <aside className="w-full md:w-80 border-r bg-background h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold truncate">{productTitle}</h2>
      </div>
      <div className="overflow-y-auto flex-grow">
        <div className="p-4 space-y-2">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => onLessonClick(lesson.id)}
              className={cn(
                "w-full text-left p-3 rounded-md flex items-start transition-colors",
                activeLessonId === lesson.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <PlayCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0" />
              <div className="flex-grow">
                <p className="text-sm text-muted-foreground">บทที่ {index + 1}</p>
                <p className="font-medium leading-tight">{lesson.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LessonSidebar;
