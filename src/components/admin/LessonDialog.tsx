
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LessonForm, { LessonFormValues } from "./LessonForm";
import { Tables } from "@/integrations/supabase/types";
import { ReactNode, useState } from "react";

interface LessonDialogProps {
  children: ReactNode;
  product: Tables<'products'>;
  lesson?: Tables<'lessons'> | null;
  onSave: (values: LessonFormValues, lessonId?: string) => void;
  isSaving: boolean;
}

const LessonDialog = ({ children, product, lesson, onSave, isSaving }: LessonDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values: LessonFormValues) => {
    onSave(values, lesson?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{lesson ? "แก้ไขบทเรียน" : "เพิ่มบทเรียนใหม่"}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <LessonForm
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
