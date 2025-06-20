
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel?: () => void;
}

const ReviewForm = ({ productId, onSubmit, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('กรุณาให้คะแนน');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('กรุณาเขียนรีวิวอย่างน้อย 10 ตัวอักษร');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment.trim());
      toast.success('เขียนรีวิวสำเร็จ!');
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการเขียนรีวิว');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>เขียนรีวิว</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium">คะแนน</Label>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    className="transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(starValue)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        starValue <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">ความคิดเห็น</Label>
            <Textarea
              id="comment"
              placeholder="แบ่งปันประสบการณ์ของคุณเกี่ยวกับผลิตภัณฑ์นี้..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              ต้องมีอย่างน้อย 10 ตัวอักษร ({comment.length}/10)
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting || rating === 0}>
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                ยกเลิก
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
