import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

const fetchArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading, isError } = useQuery<Tables<'articles'> | null>({
    queryKey: ["article", slug],
    queryFn: () => fetchArticleBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-1/4 mb-8" />
        <Skeleton className="h-96 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">ไม่พบบทความ</h2>
        <p className="text-muted-foreground mb-8">บทความที่คุณกำลังมองหาอาจถูกลบหรือไม่มีอยู่จริง</p>
        <Button asChild>
          <Link to="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารวมบทความ
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="py-12 max-w-4xl mx-auto">
      <Button variant="ghost" asChild className="mb-4 -ml-4">
         <Link to="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารวมบทความ
         </Link>
      </Button>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{article.title}</h1>
      {article.cover_image_url && (
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="w-full h-auto max-h-[500px] object-cover rounded-lg my-8"
        />
      )}
      <div
        className="text-base"
        dangerouslySetInnerHTML={{ __html: article.content || "" }}
      />
    </article>
  );
};

export default ArticleDetail;
