
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedPostsProps {
  currentSlug: string;
  category?: string;
  limit?: number;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ 
  currentSlug, 
  category, 
  limit = 3 
}) => {
  const { data: relatedPosts, isLoading } = useQuery({
    queryKey: ['related-posts', currentSlug, category],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('id, title, excerpt, slug, image_url, created_at')
        .eq('status', 'published')
        .neq('slug', currentSlug)
        .limit(limit);

      // ถ้ามี category ให้กรองตาม category ก่อน
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;

      // ถ้าผลลัพธ์น้อยกว่า limit และมี category ให้ค้นหาเพิ่มจากบทความอื่น
      if (data && data.length < limit && category) {
        const remaining = limit - data.length;
        const { data: additionalPosts } = await supabase
          .from('articles')
          .select('id, title, excerpt, slug, image_url, created_at')
          .eq('status', 'published')
          .neq('slug', currentSlug)
          .neq('category', category)
          .limit(remaining)
          .order('created_at', { ascending: false });

        if (additionalPosts) {
          data.push(...additionalPosts);
        }
      }

      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">บทความที่เกี่ยวข้อง</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index}>
              <Skeleton className="h-48 rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">บทความที่เกี่ยวข้อง</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <Link to={`/articles/${post.slug}`}>
              {post.image_url && (
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                {post.excerpt && (
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                )}
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
