
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import VipPackageCard from "@/components/VipPackageCard";
import { LoadingCard } from "@/components/ui/loading-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageHeader } from "@/components/ui/page-header";
import { Tables } from "@/integrations/supabase/types";
import { ShoppingBag, Crown } from "lucide-react";
import { useVipPackages } from "@/hooks/useVipPackages";

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

  const { data: vipPackages, isLoading: vipLoading, error: vipError } = useVipPackages();

  const isLoading = productsLoading || vipLoading;
  const error = productsError || vipError;

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
          <div className="space-y-8">
            {/* VIP Packages Loading */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                แพ็กเกจ VIP
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <LoadingCard key={`vip-${index}`} />
                ))}
              </div>
            </div>
            
            {/* Products Loading */}
            <div>
              <h2 className="text-2xl font-bold mb-6">สินค้าอื่นๆ</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <LoadingCard key={`product-${index}`} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* VIP Packages Section */}
            {vipPackages && vipPackages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold">แพ็กเกจ VIP</h2>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    เข้าถึงทุกอย่างไม่จำกัด
                  </span>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {vipPackages.map((vipPackage) => (
                    <div key={vipPackage.id} className="group">
                      <VipPackageCard {...vipPackage} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Products Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">สินค้าอื่นๆ</h2>
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
                  title="ยังไม่มีสินค้า"
                  description="เรากำลังเตรียมสินค้าคุณภาพดีไว้ให้คุณ กรุณารอติดตาม"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Products;
