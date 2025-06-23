
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Article = Tables<'articles'> & {
  categories?: Tables<'categories'>;
};

interface RelatedPostsProps {
  currentSlug: string;
  category?: string;
  limit?: number;
}

const RelatedPosts = ({ currentSlug, category, limit = 3 }: RelatedPostsProps) => {
  const { data: relatedPosts, isLoading } = useQuery<Article[]>({
    queryKey: ['related-posts', currentSlug, category],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select(`
          *,
          categories(*)
        `)
        .eq('status', 'published')
        .neq('slug', currentSlug)
        .limit(limit);

      // If category is provided, filter by category name
      if (category) {
        query = query.eq('categories.name', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Article[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>บทความที่เกี่ยวข้อง</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!relatedPosts || relatedPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>บทความอื่นๆ ที่น่าสนใจ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            สำรวจบทความอื่นๆ ในคลังความรู้ของเรา
          </p>
          <Button asChild variant="outline">
            <Link to="/articles">
              ดูบทความทั้งหมด
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>บทความที่เกี่ยวข้อง</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {relatedPosts.map((post) => (
            <div key={post.id} className="group">
              <Link to={`/articles/${post.slug}`}>
                <h4 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
              </Link>
              {post.excerpt && (
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              {post.categories && (
                <span className="inline-block text-xs text-primary mt-2">
                  {post.categories.name}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <Button asChild variant="outline" className="w-full">
            <Link to="/articles">
              ดูบทความทั้งหมด
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedPosts;
