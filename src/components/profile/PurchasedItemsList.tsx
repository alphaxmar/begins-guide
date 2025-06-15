import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PurchasedItemCard from "./PurchasedItemCard";
import { Tables } from "@/integrations/supabase/types";
import { User } from "@supabase/supabase-js";
import { Package, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

type ProductWithTemplatePath = Tables<'products'> & { template_file_path?: string | null };
type PurchasedItem = Tables<'user_purchases'> & {
  products: ProductWithTemplatePath | null;
}

interface PurchasedItemsListProps {
  user: User;
}

const PurchasedItemsList = ({ user }: PurchasedItemsListProps) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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

  const handleDownload = async (item: PurchasedItem) => {
    const filePath = item.products?.template_file_path;
    const productId = item.products?.id;

    if (!filePath || !productId) {
      toast.error("ไม่พบไฟล์สำหรับดาวน์โหลด");
      return;
    }

    setDownloadingId(productId);
    try {
      const { data, error } = await supabase.storage
        .from("product_files")
        .createSignedUrl(filePath, 60); // 60 seconds validity

      if (error) {
        throw error;
      }
      
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.setAttribute('download', filePath.split('/').pop() || 'template');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link.remove();
      toast.success("กำลังเริ่มดาวน์โหลด...");

    } catch (err: any) {
      toast.error(`เกิดข้อผิดพลาดในการดาวน์โหลด: ${err.message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">สินค้าของฉัน</h3>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-semibold mb-4">สินค้าของฉัน</h3>
        <p className="text-destructive">เกิดข้อผิดพลาดในการโหลดสินค้า: {(error as Error).message}</p>
      </div>
    );
  }
  
  const courses = purchasedItems?.filter(item => item.products?.product_type === 'course') ?? [];
  const templates = purchasedItems?.filter(item => item.products?.product_type === 'template') ?? [];

  return (
    <div className="mt-8 border-t pt-8">
      <h3 className="text-2xl font-bold tracking-tight mb-6">สินค้าของฉัน</h3>
      
      {!purchasedItems || purchasedItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/5">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h4 className="text-lg font-semibold mt-4">ยังไม่มีสินค้า</h4>
          <p className="text-muted-foreground mt-1 mb-4">เลือกซื้อคอร์สเรียนหรือเทมเพลตเพื่อเริ่มต้นเส้นทางของคุณ</p>
          <Button asChild>
            <Link to="/products">เลือกชมสินค้าทั้งหมด</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          <div>
            <h4 className="text-xl font-semibold mb-4 border-b pb-2">คอร์สเรียน</h4>
            {courses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {courses.map((item) => (
                  <PurchasedItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4">คุณยังไม่มีคอร์สเรียน</p>
            )}
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4 border-b pb-2">เทมเพลต</h4>
            {templates.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {templates.map((item) => (
                   item.products && (
                    <Card key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        {item.products.image_url ? (
                            <img src={item.products.image_url} alt={item.products.title} className="h-16 w-16 object-cover rounded-md" />
                        ) : (
                            <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                        <div>
                          <p className="font-semibold">{item.products.title}</p>
                          <p className="text-sm text-muted-foreground">เทมเพลตธุรกิจ</p>
                        </div>
                      </div>
                      <Button onClick={() => handleDownload(item)} disabled={downloadingId === item.products?.id} className="w-full sm:w-auto">
                        {downloadingId === item.products?.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="mr-2 h-4 w-4" />
                        )}
                        ดาวน์โหลด
                      </Button>
                    </Card>
                   )
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4">คุณยังไม่มีเทมเพลต</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedItemsList;
