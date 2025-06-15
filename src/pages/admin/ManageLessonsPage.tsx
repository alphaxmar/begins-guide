
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, ArrowLeft, GripVertical } from "lucide-react";
import LessonDialog from "@/components/admin/LessonDialog";
import { LessonFormValues } from "@/components/admin/LessonForm";
import { Tables } from "@/integrations/supabase/types";
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
} from "@/components/ui/alert-dialog"

const fetchProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, slug, product_type")
    .eq("slug", slug)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

const fetchLessonsByProductId = async (productId: string) => {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("product_id", productId)
    .order("order", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

const ManageLessonsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product-for-lessons", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  const { data: lessons, isLoading: areLessonsLoading } = useQuery({
    queryKey: ["lessons", product?.id],
    queryFn: () => fetchLessonsByProductId(product!.id),
    enabled: !!product,
  });

  const lessonMutation = useMutation({
    mutationFn: async ({ values, lessonId }: { values: LessonFormValues; lessonId?: string }) => {
      if (!product) throw new Error("Product not found");

      if (lessonId) {
        // Update existing lesson
        const { data, error } = await supabase
          .from("lessons")
          .update({ ...values, updated_at: new Date().toISOString() })
          .eq("id", lessonId)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        // Create new lesson
        const { data, error } = await supabase
          .from("lessons")
          .insert({ ...values, product_id: product.id })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data, variables) => {
      toast.success(variables.lessonId ? "อัปเดตบทเรียนเรียบร้อย" : "สร้างบทเรียนใหม่เรียบร้อย");
      queryClient.invalidateQueries({ queryKey: ["lessons", product?.id] });
      // This is a bit of a trick to close the dialog. It relies on the dialog's open state being managed externally.
      // A better solution might involve passing a close function to the dialog.
      // For now, this works by re-triggering the component tree.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("ลบบทเรียนแล้ว");
      queryClient.invalidateQueries({ queryKey: ["lessons", product?.id] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  if (isProductLoading || areLessonsLoading) {
    return (
      <div className="py-8 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-64 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center text-muted-foreground py-8">ไม่พบข้อมูลคอร์ส</p>;
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
        <Link to={`/admin/products/${product.slug}/edit`} className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้าแก้ไขสินค้า
        </Link>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">จัดการบทเรียน</h1>
        <LessonDialog
          product={product}
          onSave={(values) => lessonMutation.mutate({ values })}
          isSaving={lessonMutation.isPending}
        >
          <Button><PlusCircle className="mr-2 h-4 w-4" /> เพิ่มบทเรียนใหม่</Button>
        </LessonDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
          <CardDescription>
            จัดการบทเรียนทั้งหมดสำหรับคอร์สนี้
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lessons && lessons.length > 0 ? (
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center p-2 border rounded-md bg-background hover:bg-muted/50 transition-colors group">
                  <GripVertical className="h-5 w-5 text-muted-foreground mr-2 cursor-grab" />
                  <div className="flex-grow">
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">{lesson.video_url || 'ไม่มีวิดีโอ'}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <h3 className="text-lg font-semibold">ยังไม่มีบทเรียน</h3>
                <p className="text-muted-foreground mt-1">เริ่มต้นด้วยการเพิ่มบทเรียนแรกของคอร์สนี้</p>
                <div className="mt-4">
                    <LessonDialog
                        product={product}
                        onSave={(values) => lessonMutation.mutate({ values })}
                        isSaving={lessonMutation.isPending}
                    >
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> เพิ่มบทเรียน</Button>
                    </LessonDialog>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageLessonsPage;
