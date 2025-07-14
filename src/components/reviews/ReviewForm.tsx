import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<boolean>;
  isLoading?: boolean;
}

export const ReviewForm = ({ onSubmit, isLoading = false }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    setSubmitting(true);
    const success = await onSubmit(rating, comment);
    
    if (success) {
      setRating(0);
      setComment('');
    }
    
    setSubmitting(false);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">แบ่งปันประสบการณ์ของคุณ</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div className="space-y-2">
          <label className="text-sm font-medium">ให้คะแนนคอร์สนี้</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 transition-colors"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={cn(
                    "w-6 h-6 transition-colors",
                    (hoverRating >= star || rating >= star)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground">
              {rating === 1 && "แย่มาก"}
              {rating === 2 && "แย่"}
              {rating === 3 && "ปานกลาง"}
              {rating === 4 && "ดี"}
              {rating === 5 && "ยอดเยี่ยม"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">ความคิดเห็น (ไม่บังคับ)</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="แบ่งปันประสบการณ์ของคุณกับคอร์สนี้..."
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {comment.length}/500
          </p>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={rating === 0 || submitting || isLoading}
          className="w-full"
        >
          {submitting ? "กำลังส่งรีวิว..." : "ส่งรีวิว"}
        </Button>
      </form>
    </Card>
  );
};