
import { Link } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LessonDialog from "@/components/admin/LessonDialog";
import { Tables } from "@/integrations/supabase/types";
import { LessonFormValues } from "./LessonForm";

interface ManageLessonsHeaderProps {
    product: Tables<'products'>;
    onSave: (values: LessonFormValues) => void;
    isSaving: boolean;
}

const ManageLessonsHeader = ({ product, onSave, isSaving }: ManageLessonsHeaderProps) => {
    return (
        <>
            <Link to={`/admin/products/${product.slug}/edit`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับไปหน้าแก้ไขสินค้า
            </Link>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">จัดการบทเรียน</h1>
                <LessonDialog
                    product={product}
                    onSave={onSave}
                    isSaving={isSaving}
                >
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> เพิ่มบทเรียนใหม่</Button>
                </LessonDialog>
            </div>
        </>
    );
}

export default ManageLessonsHeader;
