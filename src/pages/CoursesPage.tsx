
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const fetchCourses = async (): Promise<Tables<'products'>[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("product_type", "course")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

const CoursesPage = () => {
  const { data: courses, isLoading, isError, error } = useQuery<Tables<'products'>[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6 tracking-tight">คอร์สออนไลน์ทั้งหมด</h1>
      
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-10 px-4 sm:px-6 lg:px-8 bg-destructive/10 rounded-lg">
            <h2 className="text-2xl font-bold text-destructive">เกิดข้อผิดพลาด</h2>
            <p className="mt-2 text-muted-foreground">ไม่สามารถโหลดข้อมูลคอร์สได้: {error.message}</p>
        </div>
      )}

      {!isLoading && !isError && courses && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              description={product.description || ""}
              price={product.price}
              imageUrl={product.image_url || "/placeholder.svg"}
              slug={product.slug}
              product_type={product.product_type}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && (!courses || courses.length === 0) && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-bold tracking-tight">ไม่พบคอร์สเรียน</h2>
            <p className="mt-2 text-muted-foreground">ยังไม่มีคอร์สออนไลน์ในระบบ ณ ขณะนี้</p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
