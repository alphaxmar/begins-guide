
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import TemplateDownloadButton from "@/components/template/TemplateDownloadButton";

interface PurchasedItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  product_type: string;
  slug: string;
  template_file_path?: string;
  purchased_at: string;
}

interface PurchasedItemCardProps {
  item: PurchasedItem;
}

const PurchasedItemCard = ({ item }: PurchasedItemCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span className="text-4xl">
              {item.product_type === 'course' ? '📚' : '📄'}
            </span>
          </div>
        )}
        <Badge 
          variant={item.product_type === 'course' ? 'default' : 'secondary'}
          className="absolute top-2 right-2"
        >
          {item.product_type === 'course' ? 'คอร์ส' : 'เทมเพลต'}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          ซื้อเมื่อ: {formatDate(item.purchased_at)}
        </p>
        
        <div className="flex gap-2">
          {item.product_type === 'course' ? (
            <Button asChild className="flex-1">
              <Link to={`/courses/${item.slug}/learn`}>
                <BookOpen className="mr-2 h-4 w-4" />
                เรียนต่อ
              </Link>
            </Button>
          ) : (
            <>
              {item.template_file_path ? (
                <TemplateDownloadButton
                  templatePath={item.template_file_path}
                  fileName={item.title}
                  productId={item.id}
                  className="flex-1"
                />
              ) : (
                <Button disabled className="flex-1">
                  ไม่มีไฟล์
                </Button>
              )}
            </>
          )}
          
          <Button variant="outline" size="icon" asChild>
            <Link to={`/products/${item.slug}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchasedItemCard;
