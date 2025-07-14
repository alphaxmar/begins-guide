
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import { LoadingCard } from "@/components/ui/loading-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageHeader } from "@/components/ui/page-header";
import { Tables } from "@/integrations/supabase/types";
import { ShoppingBag } from "lucide-react";

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const Products = () => {
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery<Tables<'products'>[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const isLoading = productsLoading;
  const error = productsError;

  return (
    <ErrorBoundary>
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <PageHeader
          title="คอร์สเรียนและสินค้าดิจิทัล"
          description="เลือกคอร์สที่เหมาะกับคุณ เรียนได้ตลอดชีวิต"
        />
        
        {/* Info Card */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-6 mb-8 border border-orange-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">🎓 โรงเรียนออนไลน์สำหรับผู้ประกอบการ</h3>
            <p className="text-orange-700 text-sm">
              เรียนคอร์สคุณภาพ ได้เนื้อหาครบถ้วน เป็นของคุณตลอดไป ไม่มีค่าใช้จ่ายซ้ำ
            </p>
          </div>
        </div>
        
        {error ? (
          <EmptyState
            icon={ShoppingBag}
            title="ไม่สามารถโหลดสินค้าได้"
            description="เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง"
            action={{
              label: "ลองใหม่",
              onClick: () => window.location.reload()
            }}
          />
        ) : isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={`product-${index}`} />
            ))}
          </div>
        ) : (
          <div>
            {products && products.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div key={product.slug} className="group">
                    <ProductCard
                      {...product}
                      imageUrl={product.image_url || ""}
                      description={product.description || ""}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title="ยังไม่มีคอร์ส"
                description="เรากำลังเตรียมคอร์สคุณภาพดีไว้ให้คุณ กรุณารอติดตาม"
              />
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Products;
