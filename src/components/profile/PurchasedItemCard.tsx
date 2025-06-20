
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Download, Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useTemplateDownload } from "@/hooks/useTemplateDownload";
import { toast } from "sonner";

type ProductWithTemplatePath = Tables<'products'> & { template_file_path?: string | null };

type PurchasedItem = Tables<'user_purchases'> & {
  products: ProductWithTemplatePath | null;
}

interface PurchasedItemCardProps {
  item: PurchasedItem;
}

const PurchasedItemCard = ({ item }: PurchasedItemCardProps) => {
  const downloadTemplateMutation = useTemplateDownload();

  if (!item.products) return null;

  const isDownloading = downloadTemplateMutation.isPending;

  const handleDownload = () => {
    if (item.products?.template_file_path) {
      downloadTemplateMutation.mutate(item.products.template_file_path);
    } else {
      toast.error("ขออภัย ไม่พบไฟล์สำหรับสินค้านี้");
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        <img 
          src={item.products.image_url || '/placeholder.svg'} 
          alt={item.products.title} 
          className="w-28 h-28 object-cover flex-shrink-0" 
        />
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h4 className="font-semibold text-sm mb-1">{item.products.title}</h4>
            <p className="text-xs text-muted-foreground mb-2">
              {item.products.product_type === 'course' ? 'คอร์สออนไลน์' : 'เทมเพลต'}
            </p>
          </div>
          
          <div className="mt-3">
            {item.products.product_type === 'course' ? (
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link to={`/courses/${item.products.slug}/learn`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  เข้าเรียน
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={handleDownload}
                disabled={!item.products?.template_file_path || isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isDownloading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PurchasedItemCard;
