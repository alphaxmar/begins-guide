
import { useQuery } from "@tanstack/react-query";
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
  const { data: products, isLoading, error } = useQuery<Tables<'products'>[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <ErrorBoundary>
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <PageHeader
          title="สินค้าทั้งหมด"
          description="คอร์สออนไลน์และเทมเพลตที่จะช่วยให้คุณเริ่มต้นธุรกิจได้สำเร็จ"
        />
        
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
              <LoadingCard key={index} />
            ))}
          </div>
        ) : products && products.length > 0 ? (
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
            title="ยังไม่มีสินค้า"
            description="เรากำลังเตรียมสินค้าคุณภาพดีไว้ให้คุณ กรุณารอติดตาม"
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Products;
