
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLessonManager } from "@/hooks/useLessonManager";
import ManageLessonsSkeleton from "@/components/admin/ManageLessonsSkeleton";
import ManageLessonsHeader from "@/components/admin/ManageLessonsHeader";
import NoLessonsPlaceholder from "@/components/admin/NoLessonsPlaceholder";
import LessonList from "@/components/admin/LessonList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ManageLessonsPage = () => {
  const params = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // ใช้ params.slug สำหรับหน้านี้ เพราะ route คือ :slug/lessons
  const slug = params.slug;
  
  console.log("ManageLessonsPage - Raw params:", params);
  console.log("ManageLessonsPage - Extracted slug:", slug, "typeof:", typeof slug);
  
  const {
    product,
    localLessons,
    isLoading,
    error,
    lessonMutation,
    deleteLessonMutation,
    sensors,
    handleDragEnd,
  } = useLessonManager(slug);

  console.log("ManageLessonsPage state:", { product, localLessons, isLoading, error });

  if (isLoading) {
    return <ManageLessonsSkeleton />;
  }

  if (error) {
    console.error("Page error:", error);
    return (
      <div className="py-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500 mb-4">เกิดข้อผิดพลาด: {error.message}</p>
            <div className="space-x-2">
              <Button onClick={() => window.location.reload()}>
                ลองใหม่
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/products")}>
                กลับไปรายการสินค้า
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8 mb-4">
              ไม่พบข้อมูลคอร์ส
            </p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Slug: {slug}
            </p>
            <div className="text-center">
              <Button onClick={() => navigate("/admin/products")}>
                กลับไปรายการสินค้า
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
