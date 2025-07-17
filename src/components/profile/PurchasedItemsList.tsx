
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PurchasedItemCard from "./PurchasedItemCard";
import { Tables } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";
import { Package, RefreshCw, ShoppingCart, BookOpen, FileText, Crown } from "lucide-react";

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
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          {/* Welcome Section */}
          <div className="text-center mb-8 max-w-2xl">
            <div className="mb-6">
              <div className="relative inline-block">
                <Package className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ยินดีต้อนรับสู่ Begins Guide! 🎉
            </h3>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              คุณกำลังอยู่ในจุดเริ่มต้นของการเดินทางที่ยิ่งใหญ่! 
              เรามีคอร์สเรียนและเครื่องมือมากมายที่จะช่วยให้คุณสร้างธุรกิจได้จริง
            </p>
          </div>

          {/* Quick Start Cards */}
          <div className="grid gap-6 md:grid-cols-3 w-full max-w-4xl mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">1. เลือกคอร์สเรียน</h4>
                <p className="text-sm text-gray-600 mb-4">
                  เริ่มต้นด้วยคอร์สที่เหมาะสมกับคุณ
                </p>
                <Button size="sm" asChild className="w-full">
                  <Link to="/courses">ดูคอร์สทั้งหมด</Link>
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">2. ดาวน์โหลดเทมเพลต</h4>
                <p className="text-sm text-gray-600 mb-4">
                  เครื่องมือพร้อมใช้สำหรับธุรกิจ
                </p>
                <Button size="sm" variant="outline" asChild className="w-full">
                  <Link to="/products?type=template">ดูเทมเพลต</Link>
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">3. อัพเกรด PRO</h4>
                <p className="text-sm text-gray-600 mb-4">
                  เข้าถึงทุกอย่างไม่จำกัด
                </p>
                <Button size="sm" variant="outline" asChild className="w-full border-purple-300 text-purple-600 hover:bg-purple-50">
                  <Link to="/pricing">ดูราคา PRO</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Popular Recommendations */}
          <div className="w-full max-w-4xl">
            <h4 className="text-xl font-semibold text-center mb-6 text-gray-800">
              📚 แนะนำสำหรับมือใหม่
            </h4>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-2">คอร์สเริ่มต้นธุรกิจ</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      เหมาะสำหรับผู้ที่ยังไม่รู้จะเริ่มจากไหน
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/courses">เริ่มเรียน</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-2">เทมเพลตฟรี</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      เครื่องมือพร้อมใช้ที่ไม่เสียค่าใช้จ่าย
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/products?price=free">ดาวน์โหลดฟรี</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full max-w-2xl mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h4 className="text-xl font-bold mb-2">พร้อมเริ่มต้นแล้วหรือยัง? 🚀</h4>
              <p className="text-blue-100 mb-4">
                เริ่มต้นด้วยคอร์สหรือเทมเพลตที่คุณสนใจ
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" variant="secondary" asChild className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/products">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    เลือกชมสินค้า
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link to="/courses">
                    <BookOpen className="mr-2 h-5 w-5" />
                    ดูคอร์สเรียน
                  </Link>
                </Button>
              </div>
            </div>
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
