import ArticleCard from "@/components/ArticleCard";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { LoadingCard } from "@/components/ui/loading-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { ArrowRight, BookOpen, ShoppingBag, Users } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";

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
    .from("products")
    .select("*")
    .eq("product_type", "course")
    .limit(2)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const Index = () => {
  const { data: articles, isLoading: isLoadingArticles, error: articlesError } = useQuery<Tables<'articles'>[]>({
    queryKey: ["featuredArticles"],
    queryFn: fetchFeaturedArticles,
  });

  const { data: courses, isLoading: isLoadingCourses, error: coursesError } = useQuery<Tables<'products'>[]>({
    queryKey: ["featuredCourses"],
    queryFn: fetchFeaturedCourses,
  });

  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <div className="space-y-20 md:space-y-28">
          {/* Hero Section */}
          <section className="relative text-center py-20 md:py-32">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-3xl"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                เริ่มต้นสร้างธุรกิจที่ใช่สำหรับคุณ
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                เปลี่ยน <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ไอเดีย</span> ให้เป็น <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">ธุรกิจ</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Begins Guide คือเพื่อนคู่คิดสำหรับผู้ที่อยากเริ่มต้น เรามีทั้งความรู้ เครื่องมือ และคอร์สออนไลน์ที่จะนำทางคุณไปสู่ความสำเร็จ
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link to="/products" className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    ดูคอร์สและสินค้า
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:bg-accent/10 transition-all duration-300" asChild>
                  <Link to="/articles" className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    อ่านบทความฟรี
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Featured Articles */}
          <section className="px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">บทความน่าสนใจ</h2>
                <p className="text-muted-foreground text-lg">ความรู้และเทคนิคการทำธุรกิจที่คุณไม่ควรพลาด</p>
              </div>
              
              {articlesError ? (
                <EmptyState
                  icon={BookOpen}
                  title="ไม่สามารถโหลดบทความได้"
                  description="เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง"
                  action={{
                    label: "ลองใหม่",
                    onClick: () => window.location.reload()
                  }}
                />
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {isLoadingArticles
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <LoadingCard key={index} />
                      ))
                    : articles && articles.length > 0
                    ? articles.map((article) => (
                        <div key={article.slug} className="group">
                          <ArticleCard
                            {...article}
                            imageUrl={article.cover_image_url || "/placeholder.svg"}
                            excerpt={article.excerpt || ""}
                            category={article.category || ""}
                          />
                        </div>
                      ))
                    : <div className="col-span-full">
                        <EmptyState
                          icon={BookOpen}
                          title="ยังไม่มีบทความ"
                          description="เรากำลังเตรียมเนื้อหาดีๆ ไว้ให้คุณ กรุณารอติดตาม"
                          action={{
                            label: "ดูบทความทั้งหมด",
                            onClick: () => window.location.href = "/articles"
                          }}
                        />
                      </div>}
                </div>
              )}
              
              {articles && articles.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="ghost" size="lg" className="group" asChild>
                    <Link to="/articles" className="flex items-center gap-2">
                      อ่านบทความทั้งหมด 
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Featured Courses */}
          <section className="px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">คอร์สออนไลน์แนะนำ</h2>
                <p className="text-muted-foreground text-lg">เรียนรู้จากผู้เชี่ยวชาญและสร้างธุรกิจของคุณให้สำเร็จ</p>
              </div>
              
              {coursesError ? (
                <EmptyState
                  icon={ShoppingBag}
                  title="ไม่สามารถโหลดคอร์สได้"
                  description="เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง"
                  action={{
                    label: "ลองใหม่",
                    onClick: () => window.location.reload()
                  }}
                />
              ) : (
                <div className="grid gap-8 md:grid-cols-2">
                  {isLoadingCourses
                    ? Array.from({ length: 2 }).map((_, index) => (
                        <LoadingCard key={index} />
                      ))
                    : courses && courses.length > 0
                    ? courses.map((product) => (
                        <div key={product.slug} className="group">
                          <ProductCard
                            {...product}
                            imageUrl={product.image_url || ""}
                            description={product.description || ""}
                          />
                        </div>
                      ))
                    : <div className="col-span-full">
                        <EmptyState
                          icon={ShoppingBag}
                          title="ยังไม่มีคอร์ส"
                          description="เรากำลังเตรียมคอร์สคุณภาพสูงไว้ให้คุณ กรุณารอติดตาม"
                          action={{
                            label: "ดูสินค้าทั้งหมด",
                            onClick: () => window.location.href = "/products"
                          }}
                        />
                      </div>}
                </div>
              )}
              
              {courses && courses.length > 0 && (
                <div className="text-center mt-12">
                  <Button variant="ghost" size="lg" className="group" asChild>
                    <Link to="/products" className="flex items-center gap-2">
                      ดูสินค้าทั้งหมด 
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  อัปเดตความรู้ใหม่ๆ ทุกสัปดาห์
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  รับเทคนิคการทำธุรกิจ เคล็ดลับการตลาด และข่าวสารเกี่ยวกับคอร์สใหม่ๆ ก่อนใครผ่านอีเมล
                </p>
              </div>
              <NewsletterSignup />
            </div>
          </section>

          {/* Stats Section */}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Index;
