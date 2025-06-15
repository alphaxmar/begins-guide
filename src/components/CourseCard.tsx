
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  slug: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description, price, imageUrl, slug }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <Link to={`/courses/${slug}`}>
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      </Link>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm h-12 overflow-hidden">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xl font-bold text-primary">{price.toLocaleString()} บาท</p>
        <Button asChild>
          <Link to={`/courses/${slug}`}>ดูรายละเอียด</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
