
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";

const fetchArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const Articles = () => {
  const { data: articles, isLoading } = useQuery<Tables<'articles'>[]>({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center mb-8">บทความทั้งหมด</h1>
      
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              {...article}
              imageUrl={article.image_url || ""}
              excerpt={article.excerpt || ""}
              category={article.category || ""}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          ยังไม่มีบทความในขณะนี้ จะถูกเพิ่มเข้ามาเร็วๆ นี้
        </p>
      )}
    </div>
  );
};

export default Articles;
