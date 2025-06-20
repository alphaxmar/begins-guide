
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EnhancedLessonForm, { EnhancedLessonFormValues } from "./EnhancedLessonForm";
import { Tables } from "@/integrations/supabase/types";
import { ReactNode, useState } from "react";

interface LessonDialogProps {
  children: ReactNode;
  product: Tables<'products'>;
  lesson?: Tables<'lessons'> | null;
  onSave: (values: EnhancedLessonFormValues, lessonId?: string) => void;
  isSaving: boolean;
}

const LessonDialog = ({ children, product, lesson, onSave, isSaving }: LessonDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values: EnhancedLessonFormValues) => {
    onSave(values, lesson?.id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson ? "แก้ไขบทเรียน" : "เพิ่มบทเรียนใหม่"}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <EnhancedLessonForm
            onSubmit={handleSubmit}
            isLoading={isSaving}
            initialData={lesson}
            submitButtonText={lesson ? "อัปเดตบทเรียน" : "สร้างบทเรียน"}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDialog;
