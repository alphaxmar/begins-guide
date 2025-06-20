
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import ProductCard from "@/components/ProductCard";
import { LoadingCard } from "@/components/ui/loading-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageHeader } from "@/components/ui/page-header";
import { GraduationCap } from "lucide-react";

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
    <ErrorBoundary>
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <PageHeader
          title="คอร์สออนไลน์ทั้งหมด"
          description="เรียนรู้จากผู้เชี่ยวชาญและพัฒนาทักษะการทำธุรกิจของคุณ"
        />

        {isError ? (
          <EmptyState
            icon={GraduationCap}
            title="ไม่สามารถโหลดคอร์สได้"
            description={`เกิดข้อผิดพลาด: ${error?.message || 'ไม่ทราบสาเหตุ'}`}
            action={{
              label: "ลองใหม่",
              onClick: () => window.location.reload()
            }}
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((product) => (
              <div key={product.id} className="group">
                <ProductCard
                  title={product.title}
                  description={product.description || ""}
                  price={product.price}
                  imageUrl={product.image_url || "/placeholder.svg"}
                  slug={product.slug}
                  product_type={product.product_type}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={GraduationCap}
            title="ไม่พบคอร์สเรียน"
            description="ยังไม่มีคอร์สออนไลน์ในระบบ ณ ขณะนี้ เรากำลังเตรียมเนื้อหาคุณภาพสูงไว้ให้คุณ"
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CoursesPage;
