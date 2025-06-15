
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, FileDown } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type ProductWithTemplatePath = Tables<'products'> & { template_file_path?: string | null };

type PurchasedItem = Tables<'user_purchases'> & {
  products: ProductWithTemplatePath | null;
}

interface PurchasedItemCardProps {
  item: PurchasedItem;
}

const PurchasedItemCard = ({ item }: PurchasedItemCardProps) => {
  const downloadTemplateMutation = useMutation({
    mutationFn: async (filePath: string) => {
      if (!filePath) {
        throw new Error("ไม่พบที่อยู่ไฟล์สำหรับดาวน์โหลด");
      }
      const { data, error } = await supabase
        .storage
        .from('product_files')
        .createSignedUrl(filePath, 60);

      if (error) {
        throw new Error(`ไม่สามารถสร้างลิงก์ดาวน์โหลดได้: ${error.message}`);
      }
      return data.signedUrl;
    },
    onSuccess: (url) => {
      window.open(url, '_blank');
      toast.success("กำลังเริ่มดาวน์โหลด...");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  if (!item.products) return null;

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <img src={item.products.image_url || '/placeholder.svg'} alt={item.products.title} className="w-28 h-28 object-cover" />
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h4 className="font-semibold">{item.products.title}</h4>
            <p className="text-sm text-muted-foreground">{item.products.product_type === 'course' ? 'คอร์สออนไลน์' : 'เทมเพลต'}</p>
          </div>
          {item.products.product_type === 'course' ? (
            <Button asChild size="sm" className="mt-2 self-start">
              <Link to={`/courses/${item.products.slug}/learn`}>
                <BookOpen className="mr-2 h-4 w-4" />
                เข้าเรียน
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              className="mt-2 self-start"
              onClick={() => {
                if (item.products?.template_file_path) {
                  downloadTemplateMutation.mutate(item.products.template_file_path);
                } else {
                  toast.error("ขออภัย, ไม่พบไฟล์สำหรับสินค้านี้");
                }
              }}
              disabled={!item.products?.template_file_path || (downloadTemplateMutation.isPending && downloadTemplateMutation.variables === item.products.template_file_path)}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {(downloadTemplateMutation.isPending && downloadTemplateMutation.variables === item.products.template_file_path) ? "กำลังเตรียม..." : "ดาวน์โหลด"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PurchasedItemCard;
