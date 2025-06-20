
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RatingDisplay from './RatingDisplay';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name?: string;
    email: string;
    avatar_url?: string;
  };
}

interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
}

const ReviewsList = ({ reviews, isLoading }: ReviewsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">ยังไม่มีรีวิว</p>
          <p className="text-sm text-muted-foreground mt-1">
            เป็นคนแรกที่เขียนรีวิวผลิตภัณฑ์นี้
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.user.avatar_url} />
                <AvatarFallback>
                  {review.user.full_name?.[0] || review.user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm">
                      {review.user.full_name || review.user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingDisplay rating={review.rating} size="sm" showText={false} />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), {
                          addSuffix: true,
                          locale: th,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-foreground leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;
