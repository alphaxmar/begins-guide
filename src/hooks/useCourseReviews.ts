import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

export const useCourseReviews = (courseId: string) => {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews with user profile information
      const { data: reviewsData, error } = await supabase
        .from('course_reviews')
        .select(`
          id,
          course_id,
          user_id,
          rating,
          comment,
          created_at,
          profiles!user_id (
            full_name
          )
        `)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include user_name
      const transformedReviews: CourseReview[] = (reviewsData || []).map((review: any) => ({
        id: review.id,
        course_id: review.course_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment || '',
        created_at: review.created_at,
        user_name: review.profiles?.full_name || 'ผู้ใช้งาน'
      }));

      setReviews(transformedReviews);

      // Calculate statistics
      if (transformedReviews.length > 0) {
        const totalReviews = transformedReviews.length;
        const averageRating = transformedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        transformedReviews.forEach(review => {
          ratingDistribution[review.rating]++;
        });

        setStats({
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews,
          ratingDistribution
        });
      } else {
        setStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดรีวิวได้ในขณะนี้',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (rating: number, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'กรุณาเข้าสู่ระบบ',
          description: 'คุณต้องเข้าสู่ระบบก่อนที่จะสามารถให้รีวิวได้',
          variant: 'destructive'
        });
        return false;
      }

      const { error } = await supabase
        .from('course_reviews')
        .insert({
          course_id: courseId,
          user_id: user.id,
          rating,
          comment: comment.trim()
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: 'คุณได้ให้รีวิวคอร์สนี้แล้ว',
            description: 'คุณสามารถแก้ไขรีวิวที่มีอยู่ได้',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
        return false;
      }

      toast({
        title: 'ส่งรีวิวสำเร็จ',
        description: 'ขอบคุณสำหรับรีวิวของคุณ!',
      });

      // Refresh reviews
      await fetchReviews();
      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งรีวิวได้ในขณะนี้',
        variant: 'destructive'
      });
      return false;
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  return {
    reviews,
    stats,
    loading,
    submitReview,
    refreshReviews: fetchReviews
  };
};