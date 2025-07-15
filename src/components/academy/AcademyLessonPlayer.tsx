import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Maximize, Settings, Clock } from "lucide-react";
import { useState } from "react";

interface AcademyLessonPlayerProps {
  lesson: Tables<'lessons'> | null;
  accessType: 'admin' | 'vip' | 'purchased' | 'none';
  hasAccess: boolean;
}

const AcademyLessonPlayer = ({ lesson, hasAccess }: AcademyLessonPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
    }
    return url;
  };

  if (!lesson) {
    return (
      <div className="w-full h-full bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-6xl mb-4">🎥</div>
          <h3 className="text-xl font-semibold mb-2">เลือกบทเรียนเพื่อเริ่มต้น</h3>
          <p className="text-sm">เลือกบทเรียนจากเมนูด้านขวาเพื่อเริ่มเรียน Academy</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="w-full h-full bg-slate-800/50 rounded-lg border border-slate-700/50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">จำเป็นต้องมี Pro Membership</h3>
          <p className="text-sm">อัปเกรดเป็น Pro Member เพื่อเข้าถึงเนื้อหาทั้งหมด</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-4">
      {/* Lesson Header */}
      <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{lesson.title}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>บทเรียนที่ {lesson.order + 1}</span>
              </div>
              {lesson.video_url && (
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                  มีวิดีโอ
                </span>
              )}
            </div>
          </div>
          
          {/* Speed Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden border border-slate-700/50" style={{ aspectRatio: '16/9' }}>
        {lesson.video_url ? (
          <iframe
            src={getEmbedUrl(lesson.video_url)}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={lesson.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center text-slate-400">
            <div>
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-lg font-semibold mb-2">บทเรียนแบบข้อความ</h3>
              <p className="text-sm">เนื้อหาจะแสดงในแท็บ "คำอธิบายบทเรียน" ด้านล่าง</p>
            </div>
          </div>
        )}
      </div>

      {/* Player Controls (for non-embedded content) */}
      {!lesson.video_url && (
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-slate-700/50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-slate-400 hover:text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="text-sm text-slate-400">
                อ่านเนื้อหาในแท็บด้านล่าง
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademyLessonPlayer;