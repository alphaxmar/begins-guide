
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, FileText, Download, Users, Wrench, Package } from 'lucide-react';

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  slug: string;
  product_type: 'course' | 'template' | 'ebook' | 'video' | 'software' | 'service' | 'membership';
}

const PRODUCT_TYPE_CONFIG = {
  course: { 
    label: 'คอร์ส', 
    variant: 'default' as const, 
    icon: Video,
    color: 'bg-blue-100 text-blue-800'
  },
  template: { 
    label: 'เทมเพลต', 
    variant: 'secondary' as const, 
    icon: FileText,
    color: 'bg-gray-100 text-gray-800'
  },
  ebook: { 
    label: 'E-book', 
    variant: 'outline' as const, 
    icon: Download,
    color: 'bg-green-100 text-green-800'
  },
  video: { 
    label: 'วิดีโอ', 
    variant: 'destructive' as const, 
    icon: Video,
    color: 'bg-red-100 text-red-800'
  },
  software: { 
    label: 'ซอฟต์แวร์', 
    variant: 'default' as const, 
    icon: Wrench,
    color: 'bg-purple-100 text-purple-800'
  },
  service: { 
    label: 'บริการ', 
    variant: 'secondary' as const, 
    icon: Users,
    color: 'bg-orange-100 text-orange-800'
  },
  membership: { 
    label: 'สมาชิก', 
    variant: 'outline' as const, 
    icon: Package,
    color: 'bg-yellow-100 text-yellow-800'
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ title, description, price, imageUrl, slug, product_type }) => {
  const typeConfig = PRODUCT_TYPE_CONFIG[product_type] || PRODUCT_TYPE_CONFIG.course;
  const IconComponent = typeConfig.icon;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
      <Link to={`/products/${slug}`} className="block">
        <div className="relative">
          <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
              <IconComponent className="h-3 w-3" />
              {typeConfig.label}
            </div>
          </div>
        </div>
      </Link>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <p className="text-xl font-bold text-primary">
          {price === 0 ? 'ฟรี' : `${price.toLocaleString()} บาท`}
        </p>
        <Button asChild>
          <Link to={`/products/${slug}`}>ดูรายละเอียด</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
