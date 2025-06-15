
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  slug: string;
  product_type: 'course' | 'template';
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, price, imageUrl, slug, product_type }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col">
      <Link to={`/products/${slug}`} className="block">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      </Link>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <Badge variant={product_type === 'course' ? 'default' : 'secondary'} className="flex-shrink-0">
                {product_type === 'course' ? 'คอร์ส' : 'เทมเพลต'}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm h-12 overflow-hidden">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <p className="text-xl font-bold text-primary">{price.toLocaleString()} บาท</p>
        <Button asChild>
          <Link to={`/products/${slug}`}>ดูรายละเอียด</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
