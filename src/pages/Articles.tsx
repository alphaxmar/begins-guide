
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";
import { useAdmin } from "@/hooks/useAdmin";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetchArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const Articles = () => {
  const { data: articles, isLoading } = useQuery<Tables<'articles'>[]>({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });
  const { isAdmin } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    if (!articles) return [];
    const allCategories = articles
      .map((article) => article.category)
      .filter(Boolean);
    // Use a Set to get unique categories
    return ["all", ...Array.from(new Set(allCategories as string[]))];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "all" || article.category === selectedCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, searchTerm, selectedCategory]);

  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">บทความทั้งหมด</h1>
        {isAdmin && (
          <Button asChild>
            <Link to="/articles/create">
              <PlusCircle />
              เขียนบทความใหม่
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="ค้นหาบทความ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:flex-grow"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="md:w-[220px]">
            <SelectValue placeholder="เลือกหมวดหมู่" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "ทุกหมวดหมู่" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
      ) : filteredArticles && filteredArticles.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.slug}
              {...article}
              imageUrl={article.cover_image_url || "/placeholder.svg"}
              excerpt={article.excerpt || ""}
              category={article.category || ""}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground col-span-full py-16">
          {articles && articles.length > 0
            ? "ไม่พบบทความที่ตรงกับเงื่อนไขของคุณ"
            : "ยังไม่มีบทความในขณะนี้ จะถูกเพิ่มเข้ามาเร็วๆ นี้"}
        </p>
      )}
    </div>
  );
};

export default Articles;
