
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

interface SortableLessonItemProps {
  lesson: Tables<'lessons'>;
  children: React.ReactNode;
}

const SortableLessonItem = ({ lesson, children }: SortableLessonItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center p-2 border rounded-md bg-background hover:bg-muted/50 transition-colors group"
    >
      <button {...attributes} {...listeners} className="p-1 cursor-grab touch-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="flex-grow ml-2">
        <p className="font-medium">{lesson.title}</p>
        <p className="text-sm text-muted-foreground">{lesson.video_url || 'ไม่มีวิดีโอ'}</p>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {children}
      </div>
    </div>
  );
};

export default SortableLessonItem;
