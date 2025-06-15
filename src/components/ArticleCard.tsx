
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  slug: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, excerpt, category, imageUrl, slug }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <Link to={`/articles/${slug}`}>
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      </Link>
      <CardHeader>
        <Badge variant="secondary" className="w-fit">{category}</Badge>
        <CardTitle className="mt-2 text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Link to={`/articles/${slug}`} className="flex items-center text-sm font-semibold text-primary hover:underline">
          อ่านต่อ <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
