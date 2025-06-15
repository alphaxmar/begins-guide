
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import LessonDialog from "./LessonDialog";
import { Tables } from "@/integrations/supabase/types";
import { LessonFormValues } from "./LessonForm";

interface NoLessonsPlaceholderProps {
    product: Tables<'products'>;
    onSave: (values: LessonFormValues) => void;
    isSaving: boolean;
}

const NoLessonsPlaceholder = ({ product, onSave, isSaving }: NoLessonsPlaceholderProps) => {
    return (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold">ยังไม่มีบทเรียน</h3>
            <p className="text-muted-foreground mt-1">เริ่มต้นด้วยการเพิ่มบทเรียนแรกของคอร์สนี้</p>
            <div className="mt-4">
                <LessonDialog
                    product={product}
                    onSave={onSave}
                    isSaving={isSaving}
                >
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> เพิ่มบทเรียน</Button>
                </LessonDialog>
            </div>
        </div>
    );
};

export default NoLessonsPlaceholder;
