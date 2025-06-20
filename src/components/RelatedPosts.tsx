
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Link } from 'react-router-dom';

interface RelatedPostsProps {
  currentSlug: string;
  category?: string;
  limit?: number;
}

const RelatedPosts = ({ currentSlug, category, limit = 3 }: RelatedPostsProps) => {
  const { data: relatedPosts, isLoading } = useQuery({
    queryKey: ['related-posts', currentSlug, category],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('id, title, slug, excerpt, image_url, created_at')
        .eq('status', 'published')
        .neq('slug', currentSlug);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>บทความที่เกี่ยวข้อง</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>บทความที่เกี่ยวข้อง</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {relatedPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/articles/${post.slug}`}
              className="block group"
            >
              <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(post.created_at).toLocaleDateString('th-TH')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedPosts;
