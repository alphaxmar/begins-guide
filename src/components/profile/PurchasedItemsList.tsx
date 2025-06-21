
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PurchasedItemCard from "./PurchasedItemCard";
import { Tables } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";
import { Package, RefreshCw, ShoppingCart } from "lucide-react";

type ProductWithTemplatePath = Tables<'products'> & { template_file_path?: string | null };
type PurchasedItem = Tables<'user_purchases'> & {
  products: ProductWithTemplatePath | null;
}

interface PurchasedItemsListProps {
  user: User;
}

const PurchasedItemsList = ({ user }: PurchasedItemsListProps) => {
  const { data: purchasedItems, isLoading, isError, error, refetch } = useQuery<PurchasedItem[]>({
    queryKey: ['purchased_products', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log("No user found");
        return [];
      }
      
      console.log("Fetching purchases for user:", user.id);
      
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          id,
          product_id,
          created_at,
          products (
            id,
            title,
            slug,
            product_type,
            image_url,
            description,
            template_file_path
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching purchases:", error);
        throw new Error(`ไม่สามารถโหลดข้อมูลได้: ${error.message}`);
      }
      
      console.log("Raw purchase data:", data);
      const filteredData = data.filter(item => item.products) as PurchasedItem[];
      console.log("Filtered purchase data:", filteredData);
      
      return filteredData;
    },
    enabled: !!user,
    retry: 2, // เพิ่ม retry
    staleTime: 30 * 1000, // 30 วินาที
  });

  console.log("PurchasedItemsList state:", { isLoading, isError, purchasedItems, error });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight">สินค้าของฉัน</h3>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold tracking-tight text-destructive">เกิดข้อผิดพลาด</h3>
        <div className="text-center py-8 border-2 border-dashed border-destructive/30 rounded-lg bg-destructive/5">
          <p className="text-destructive mb-4">
            ไม่สามารถโหลดรายการสินค้าได้: {(error as Error)?.message}
          </p>
          <div className="space-x-4">
            <Button 
              onClick={() => refetch()} 
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              ลองใหม่
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="destructive"
            >
              รีโหลดหน้า
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const courses = purchasedItems?.filter(item => item.products?.product_type === 'course') ?? [];
  const templates = purchasedItems?.filter(item => item.products?.product_type === 'template') ?? [];

  // Transform the data to match PurchasedItemCard expectations
  const transformPurchasedItem = (item: PurchasedItem) => {
    if (!item.products) return null;
    
    return {
      id: item.products.id,
      title: item.products.title,
      description: item.products.description,
      image_url: item.products.image_url,
      product_type: item.products.product_type,
      slug: item.products.slug,
      template_file_path: item.products.template_file_path,
      purchased_at: item.created_at,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">สินค้าของฉัน</h3>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          รีเฟรช
        </Button>
      </div>
      
      {!purchasedItems || purchasedItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/5">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-lg font-semibold mb-2">ยังไม่มีสินค้า</h4>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            เลือกซื้อคอร์สเรียนหรือเทมเพลตเพื่อเริ่มต้นเส้นทางการเรียนรู้ของคุณ
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link to="/products">
                <ShoppingCart className="mr-2 h-4 w-4" />
                เลือกชมสินค้าทั้งหมด
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/courses">
                คอร์สเรียน
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* คอร์สเรียน */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold border-b-2 border-blue-200 pb-2">
                📚 คอร์สเรียน ({courses.length})
              </h4>
              {courses.length > 0 && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/courses">ดูทั้งหมด</Link>
                </Button>
              )}
            </div>
            {courses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {courses.map((item) => {
                  const transformedItem = transformPurchasedItem(item);
                  return transformedItem ? (
                    <PurchasedItemCard key={item.id} item={transformedItem} />
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed rounded-lg bg-blue-50/50">
                <p className="text-muted-foreground">คุณยังไม่มีคอร์สเรียน</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/courses">เลือกคอร์สเรียน</Link>
                </Button>
              </div>
            )}
          </div>
          
          {/* เทมเพลต */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold border-b-2 border-green-200 pb-2">
                📄 เทมเพลต ({templates.length})
              </h4>
              {templates.length > 0 && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/products?type=template">ดูทั้งหมด</Link>
                </Button>
              )}
            </div>
            {templates.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {templates.map((item) => {
                  const transformedItem = transformPurchasedItem(item);
                  return transformedItem ? (
                    <PurchasedItemCard key={item.id} item={transformedItem} />
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed rounded-lg bg-green-50/50">
                <p className="text-muted-foreground">คุณยังไม่มีเทมเพลต</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/products?type=template">เลือกเทมเพลต</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedItemsList;
