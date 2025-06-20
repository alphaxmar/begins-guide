
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useLessonManager } from "@/hooks/useLessonManager";
import LessonDialog from "@/components/admin/LessonDialog";
import LessonList from "@/components/admin/LessonList";
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

interface ProductLessonsSectionProps {
  product: Tables<'products'>;
}

const ProductLessonsSection = ({ product }: ProductLessonsSectionProps) => {
  const {
    localLessons,
    isLoading,
    error,
    lessonMutation,
    deleteLessonMutation,
    sensors,
    handleDragEnd,
  } = useLessonManager(product.slug);

  if (product.product_type !== 'course') {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">บทเรียน (Episodes)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">บทเรียน (Episodes)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-red-400">เกิดข้อผิดพลาด: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">บทเรียน (Episodes)</CardTitle>
          <LessonDialog
            product={product}
            onSave={(values) => lessonMutation.mutate({ values })}
            isSaving={lessonMutation.isPending}
          >
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มบทเรียน
            </Button>
          </LessonDialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {localLessons && localLessons.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-400 mb-4">
              ลากเพื่อจัดลำดับบทเรียน ({localLessons.length} บทเรียน)
            </p>
            <LessonList
              lessons={localLessons}
              product={product}
              handleDragEnd={handleDragEnd}
              sensors={sensors}
              lessonMutation={lessonMutation}
              deleteLessonMutation={deleteLessonMutation}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-4">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-300 mb-2">ยังไม่มีบทเรียน</h3>
              <p className="text-slate-400 mb-6">เพิ่มบทเรียนแรกเพื่อเริ่มสร้างคอร์สของคุณ</p>
            </div>
            <LessonDialog
              product={product}
              onSave={(values) => lessonMutation.mutate({ values })}
              isSaving={lessonMutation.isPending}
            >
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มบทเรียนแรก
              </Button>
            </LessonDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductLessonsSection;
