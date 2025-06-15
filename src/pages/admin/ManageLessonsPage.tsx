
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLessonManager } from "@/hooks/useLessonManager";
import ManageLessonsSkeleton from "@/components/admin/ManageLessonsSkeleton";
import ManageLessonsHeader from "@/components/admin/ManageLessonsHeader";
import NoLessonsPlaceholder from "@/components/admin/NoLessonsPlaceholder";
import LessonList from "@/components/admin/LessonList";

const ManageLessonsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    product,
    localLessons,
    isLoading,
    lessonMutation,
    deleteLessonMutation,
    sensors,
    handleDragEnd,
  } = useLessonManager(slug);

  if (isLoading) {
    return <ManageLessonsSkeleton />;
  }

  if (!product) {
    return <p className="text-center text-muted-foreground py-8">ไม่พบข้อมูลคอร์ส</p>;
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <ManageLessonsHeader
        product={product}
        onSave={(values) => lessonMutation.mutate({ values })}
        isSaving={lessonMutation.isPending}
      />
      <Card>
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
          <CardDescription>
            จัดการบทเรียนทั้งหมดสำหรับคอร์สนี้ (ลากเพื่อจัดลำดับ)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {localLessons && localLessons.length > 0 ? (
            <LessonList
              lessons={localLessons}
              product={product}
              handleDragEnd={handleDragEnd}
              sensors={sensors}
              lessonMutation={lessonMutation}
              deleteLessonMutation={deleteLessonMutation}
            />
          ) : (
            <NoLessonsPlaceholder
              product={product}
              onSave={(values) => lessonMutation.mutate({ values })}
              isSaving={lessonMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageLessonsPage;
