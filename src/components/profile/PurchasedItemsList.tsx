
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PurchasedItemCard from "./PurchasedItemCard";
import { Tables } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";

type ProductWithTemplatePath = Tables<'products'> & { template_file_path?: string | null };
type PurchasedItem = Tables<'user_purchases'> & {
  products: ProductWithTemplatePath | null;
}

interface PurchasedItemsListProps {
  user: User;
}

const PurchasedItemsList = ({ user }: PurchasedItemsListProps) => {
  const { data: purchasedItems, isLoading, isError, error } = useQuery<PurchasedItem[]>({
    queryKey: ['purchased_products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          id,
          product_id,
          products (
            id,
            title,
            slug,
            product_type,
            image_url,
            template_file_path
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data.filter(item => item.products) as PurchasedItem[];
    },
    enabled: !!user,
  });

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-xl font-semibold mb-4">สินค้าของฉัน</h3>
      
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      )}

      {isError && (
        <p className="text-destructive">เกิดข้อผิดพลาดในการโหลดสินค้า: {(error as Error).message}</p>
      )}

      {!isLoading && !isError && (
        purchasedItems && purchasedItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {purchasedItems.map((item) => (
              <PurchasedItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
            <h4 className="text-lg font-semibold">ยังไม่มีสินค้า</h4>
            <p className="text-muted-foreground mt-1 mb-4">เลือกซื้อคอร์สเรียนหรือเทมเพลตเพื่อเริ่มต้นเส้นทางของคุณ</p>
            <Button asChild>
              <Link to="/products">เลือกชมสินค้าทั้งหมด</Link>
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default PurchasedItemsList;
