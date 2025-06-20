import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import RelatedPosts from "@/components/RelatedPosts";
import NewsletterSignup from "@/components/NewsletterSignup";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!article) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="prose max-w-none">
                <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                <p className="text-muted-foreground mb-4">
                  {format(new Date(article.created_at), 'dd MMMM yyyy', { locale: th })}
                </p>
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full rounded-md mb-4"
                  />
                )}
                <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RelatedPosts 
              currentSlug={article.slug} 
              category={article.category || undefined}
              limit={4}
            />
            
            <div className="sticky top-8">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
