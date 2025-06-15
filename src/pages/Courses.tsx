
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";

const fetchCourses = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const Courses = () => {
  const { data: courses, isLoading } = useQuery<Tables<'courses'>[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center mb-8">คอร์สออนไลน์ทั้งหมด</h1>
      
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : courses && courses.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard
              key={course.slug}
              {...course}
              imageUrl={course.image_url || ""}
              description={course.description || ""}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          ยังไม่มีคอร์สในขณะนี้ จะถูกเพิ่มเข้ามาเร็วๆ นี้
        </p>
      )}
    </div>
  );
};

export default Courses;
