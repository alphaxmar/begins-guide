
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Tables } from '@/integrations/supabase/types';
import SortableLessonItem from './SortableLessonItem';
import LessonDialog from './LessonDialog';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UseMutationResult } from '@tanstack/react-query';
import { LessonFormValues } from './LessonForm';

interface LessonListProps {
  lessons: Tables<'lessons'>[];
  product: Tables<'products'>;
  handleDragEnd: (event: DragEndEvent) => void;
  sensors: SensorDescriptor<SensorOptions>[];
  lessonMutation: UseMutationResult<Tables<'lessons'>, Error, { values: LessonFormValues; lessonId?: string | undefined; }, unknown>;
  deleteLessonMutation: UseMutationResult<void, Error, string, unknown>;
}

const LessonList = ({
  lessons,
  product,
  handleDragEnd,
  sensors,
  lessonMutation,
  deleteLessonMutation,
}: LessonListProps) => {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={lessons.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <SortableLessonItem key={lesson.id} lesson={lesson}>
              <LessonDialog
                product={product}
                lesson={lesson}
                onSave={(values, lessonId) => lessonMutation.mutate({ values, lessonId })}
                isSaving={lessonMutation.isPending}
              >
                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
              </LessonDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                    <AlertDialogDescription>
                      การกระทำนี้ไม่สามารถย้อนกลับได้ บทเรียน "{lesson.title}" จะถูกลบอย่างถาวร
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteLessonMutation.mutate(lesson.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      ลบ
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </SortableLessonItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default LessonList;
