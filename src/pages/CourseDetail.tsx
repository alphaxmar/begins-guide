
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

const fetchCourseBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: course, isLoading, isError } = useQuery<Tables<'courses'> | null>({
    queryKey: ["course", slug],
    queryFn: () => fetchCourseBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="py-12 grid md:grid-cols-2 gap-12">
        <div>
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-12 w-full md:w-1/2 mt-4" />
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">ไม่พบคอร์สเรียน</h2>
        <p className="text-muted-foreground mb-8">คอร์สที่คุณกำลังมองหาอาจไม่มีอยู่จริง</p>
        <Button asChild>
          <Link to="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารวมคอร์ส
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12">
       <Button variant="ghost" asChild className="mb-4 -ml-4">
         <Link to="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารวมคอร์ส
         </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          {course.image_url && (
            <img
              src={course.image_url}
              alt={course.title}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          )}
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-lg text-muted-foreground">{course.description}</p>
          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-bold text-primary">{course.price.toLocaleString()} บาท</p>
          </div>
          <Button size="lg" className="w-full md:w-auto">
            <ShoppingCart className="mr-2 h-5 w-5" />
            ซื้อคอร์สนี้
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
