
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  slug: string;
  created_at?: string;
  content?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  title, 
  excerpt, 
  category, 
  imageUrl, 
  slug, 
  created_at,
  content
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  // Calculate estimated reading time
  const calculateReadingTime = (content?: string) => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(content);

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50">
      <Link to={`/articles/${slug}`} className="block">
        <div className="relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {category}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            อ่าน {readingTime} นาที
          </div>
        </div>
        <CardTitle className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-2">
          {excerpt}
        </p>
        {created_at && (
          <p className="text-xs text-muted-foreground">
            {formatDate(created_at)}
          </p>
        )}
      </CardContent>
      
      <CardFooter>
        <Link 
          to={`/articles/${slug}`} 
          className="flex items-center text-sm font-semibold text-primary hover:text-primary/80 group-hover:gap-3 gap-2 transition-all duration-300"
        >
          อ่านต่อ 
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
