import { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { PlayCircle, CheckCircle, Clock, FileText, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useMemo } from "react";

interface AcademyCurriculumProps {
  lessons: Tables<'lessons'>[];
  activeLesson: Tables<'lessons'> | null;
  onLessonClick: (lesson: Tables<'lessons'>) => void;
  totalLessons: number;
}

const AcademyCurriculum = ({ 
  lessons, 
  activeLesson, 
  onLessonClick,
  totalLessons 
}: AcademyCurriculumProps) => {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Group lessons by modules (assuming naming convention or order)
  const modules = useMemo(() => {
    const moduleGroups: { [key: string]: Tables<'lessons'>[] } = {};
    
    lessons.forEach(lesson => {
      // Simple module grouping based on lesson order
      let moduleIndex;
      if (lesson.order <= 4) moduleIndex = 1;
      else if (lesson.order <= 9) moduleIndex = 2;
      else if (lesson.order <= 14) moduleIndex = 3;
      else if (lesson.order <= 19) moduleIndex = 4;
      else moduleIndex = 5;
      
      const moduleKey = `Module ${moduleIndex}`;
      if (!moduleGroups[moduleKey]) {
        moduleGroups[moduleKey] = [];
      }
      moduleGroups[moduleKey].push(lesson);
    });

    return Object.entries(moduleGroups).map(([name, lessons]) => ({
      name,
      title: getModuleTitle(name),
      lessons: lessons.sort((a, b) => a.order - b.order)
    }));
  }, [lessons]);

  const getModuleTitle = (moduleName: string) => {
    const titles: { [key: string]: string } = {
      "Module 1": "The Architect's Mindset",
      "Module 2": "Blueprinting Your Engine", 
      "Module 3": "Building Your AI Workforce",
      "Module 4": "Activating The Automation",
      "Module 5": "The 2-Hour CEO"
    };
    return titles[moduleName] || moduleName;
  };

  const toggleLessonComplete = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
  };

  const progressPercentage = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  return (
    <div className="h-full bg-slate-900/50 backdrop-blur-sm border-l border-slate-700/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-white mb-3">หลักสูตร Academy</h2>
        
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">ความคืบหน้า</span>
            <span className="text-amber-400 font-medium">{completedLessons.size}/{totalLessons}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-slate-800"
            style={{ 
              background: 'rgb(30 41 59)',
            }}
          />
          <p className="text-xs text-slate-500">
            {Math.round(progressPercentage)}% เสร็จสิ้น
          </p>
        </div>
      </div>

      {/* Curriculum */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {modules.map((module, moduleIndex) => (
            <div key={module.name} className="space-y-3">
              {/* Module Header */}
              <div className="flex items-center gap-3 py-2">
                <div className="w-8 h-8 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                  {moduleIndex + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{module.name}</h3>
                  <p className="text-xs text-slate-400">{module.title}</p>
                </div>
              </div>

              {/* Module Lessons */}
              <div className="space-y-2 ml-2">
                {module.lessons.map((lesson, lessonIndex) => {
                  const isActive = activeLesson?.id === lesson.id;
                  const isCompleted = completedLessons.has(lesson.id);
                  
                  return (
                    <div 
                      key={lesson.id}
                      className={cn(
                        "group cursor-pointer rounded-lg border p-3 transition-all duration-200",
                        isActive 
                          ? "bg-amber-500/20 border-amber-500/50 shadow-lg" 
                          : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600"
                      )}
                      onClick={() => onLessonClick(lesson)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Lesson Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle 
                              className="h-5 w-5 text-green-400 cursor-pointer" 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLessonComplete(lesson.id);
                              }}
                            />
                          ) : isActive ? (
                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                              <PlayCircle className="h-3 w-3 text-black" />
                            </div>
                          ) : (
                            <div 
                              className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center text-slate-400 text-xs font-medium cursor-pointer hover:bg-green-500 hover:text-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLessonComplete(lesson.id);
                              }}
                            >
                              {lessonIndex + 1}
                            </div>
                          )}
                        </div>
                        
                        {/* Lesson Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs text-slate-400 font-medium">
                              EP.{lesson.order + 1}
                            </p>
                            {lesson.video_url ? (
                              <Video className="h-3 w-3 text-blue-400" />
                            ) : (
                              <FileText className="h-3 w-3 text-slate-400" />
                            )}
                          </div>
                          <p className={cn(
                            "font-medium leading-tight text-sm line-clamp-2",
                            isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                          )}>
                            {lesson.title}
                          </p>
                          
                          {/* Lesson Status */}
                          <div className="flex items-center gap-2 mt-2">
                            {isCompleted && (
                              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                                เรียนจบแล้ว
                              </Badge>
                            )}
                            {isActive && (
                              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 text-xs">
                                กำลังดู
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademyCurriculum;