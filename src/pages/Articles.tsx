import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "@/components/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";
import { useAdmin } from "@/hooks/useAdmin";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import NewsletterSignup from "@/components/NewsletterSignup";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

  // Get featured articles (first 3 for now)
  const featuredArticles = filteredArticles?.slice(0, 3) || [];
  const regularArticles = filteredArticles?.slice(3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="min-h-screen bg-gray-50">
          {/* Section 1: Hero Section */}
          <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6">
                  คลังความรู้สำหรับผู้ประกอบการยุคใหม่
                </h1>
                <p className="text-xl mb-8 text-green-100">
                  เริ่มต้นเส้นทางของคุณสู่การเป็นเจ้าของธุรกิจ ด้วยบทความเชิงลึก, คู่มือ, และวิดีโอคุณภาพสูง ทั้งหมดนี้ฟรี!
                </p>
                
                <div className="max-w-md mx-auto mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">รับบทความใหม่และเคล็ดลับพิเศษส่งตรงถึงอีเมลคุณก่อนใคร</h3>
                    <NewsletterSignup />
                  </div>
                </div>

                {isAdmin && (
                  <Button asChild variant="secondary">
                    <Link to="/articles/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      เขียนบทความใหม่
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-12">
            {/* Section 2: Featured Articles */}
            {featuredArticles.length > 0 && (
              <section className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">บทความแนะนำ</h2>
                  <p className="text-xl text-gray-600">บทความคุณภาพสูงที่จะเปลี่ยนมุมมองการทำธุรกิจของคุณ</p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  {featuredArticles.map((article) => (
                    <Card key={article.slug} className="hover:shadow-xl transition-shadow border-2 border-yellow-200">
                      <ArticleCard
                        {...article}
                        imageUrl={article.cover_image_url || "/placeholder.svg"}
                        excerpt={article.excerpt || ""}
                        category={article.category || ""}
                      />
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Filter & Search */}
            <section className="mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="ค้นหาบทความที่สนใจ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
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
              </div>
            </section>

            {/* Section 4: Main Article Grid */}
            <section className="mb-16">
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
              ) : regularArticles && regularArticles.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {regularArticles.map((article) => (
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
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    {articles && articles.length > 0
                      ? "ไม่พบบทความที่ตรงกับเงื่อนไขของคุณ"
                      : "ยังไม่มีบทความในขณะนี้ จะถูกเพิ่มเข้ามาเร็วๆ นี้"}
                  </p>
                </div>
              )}
            </section>

            {/* Section 5: Final Call-to-Action */}
            <section className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">ชอบเนื้อหาฟรีของเราใช่ไหม?</h2>
              <p className="text-xl mb-8 text-yellow-100">
                ยกระดับไปอีกขั้นด้วยสิทธิ์เข้าถึงทุกอย่างแบบไม่จำกัด รวมถึงเครื่องมือ AI และคอร์สออนไลน์พิเศษ
              </p>
              <Button asChild size="lg" className="bg-white text-yellow-600 hover:bg-gray-100 font-bold px-8">
                <Link to="/pro">
                  ดูรายละเอียด Begins.guide PRO
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Articles;
