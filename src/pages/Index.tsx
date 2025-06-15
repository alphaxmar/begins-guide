import ArticleCard from "@/components/ArticleCard";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";

const fetchFeaturedArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .limit(3)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const fetchFeaturedCourses = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .limit(2)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const Index = () => {
  const { data: articles, isLoading: isLoadingArticles } = useQuery<Tables<'articles'>[]>({
    queryKey: ["featuredArticles"],
    queryFn: fetchFeaturedArticles,
  });

  const { data: courses, isLoading: isLoadingCourses } = useQuery<Tables<'courses'>[]>({
    queryKey: ["featuredCourses"],
    queryFn: fetchFeaturedCourses,
  });

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          เปลี่ยน <span className="text-primary">ไอเดีย</span> ให้เป็น <span className="text-primary">ธุรกิจ</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Begins Guide คือเพื่อนคู่คิดสำหรับผู้ที่อยากเริ่มต้น เรามีทั้งความรู้, เครื่องมือ, และคอร์สออนไลน์ที่จะนำทางคุณไปสู่ความสำเร็จ
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/courses">ดูคอร์สทั้งหมด</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/articles">อ่านบทความฟรี</Link>
          </Button>
        </div>
      </section>

      {/* Featured Articles */}
      <section>
        <h2 className="text-3xl font-bold text-center">บทความน่าสนใจ</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoadingArticles
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            : articles && articles.length > 0
            ? articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  {...article}
                  imageUrl={article.cover_image_url || "/placeholder.svg"}
                  excerpt={article.excerpt || ""}
                  category={article.category || ""}
                />
              ))
            : <p className="text-center text-muted-foreground md:col-span-2 lg:col-span-3">ยังไม่มีบทความในขณะนี้</p>}
        </div>
        <div className="text-center mt-8">
          <Button variant="ghost" asChild>
            <Link to="/articles">อ่านบทความทั้งหมด &rarr;</Link>
          </Button>
        </div>
      </section>

      {/* Featured Courses */}
      <section>
        <h2 className="text-3xl font-bold text-center">คอร์สออนไลน์แนะนำ</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {isLoadingCourses
            ? Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            : courses && courses.length > 0
            ? courses.map((course) => (
                <CourseCard
                  key={course.slug}
                  {...course}
                  imageUrl={course.image_url || ""}
                  description={course.description || ""}
                />
              ))
            : <p className="text-center text-muted-foreground md:col-span-2">ยังไม่มีคอร์สในขณะนี้</p>}
        </div>
        <div className="text-center mt-8">
          <Button variant="ghost" asChild>
            <Link to="/courses">ดูคอร์สทั้งหมด &rarr;</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
