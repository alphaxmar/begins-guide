
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

const fetchPinnedArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("is_pinned_on_hub", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) throw new Error(error.message);
  return data;
};

const fetchCaseStudyArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("category", "Case Studies")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw new Error(error.message);
  return data;
};

const Articles = () => {
  const { data: articles, isLoading } = useQuery<Tables<'articles'>[]>({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  const { data: pinnedArticles, isLoading: pinnedLoading } = useQuery<Tables<'articles'>[]>({
    queryKey: ["pinned-articles"],
    queryFn: fetchPinnedArticles,
  });

  const { data: caseStudyArticles, isLoading: caseStudyLoading } = useQuery<Tables<'articles'>[]>({
    queryKey: ["case-study-articles"],
    queryFn: fetchCaseStudyArticles,
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

  // Group articles by category for the Deep Dive section
  const articlesByCategory = useMemo(() => {
    if (!articles) return {};
    const grouped: { [key: string]: Tables<'articles'>[] } = {};
    
    articles.forEach((article) => {
      const category = article.category || "อื่นๆ";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(article);
    });

    // Sort articles within each category and limit to 4
    Object.keys(grouped).forEach((category) => {
      grouped[category] = grouped[category]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);
    });

    return grouped;
  }, [articles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is already handled by the filteredArticles useMemo
  };

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
                  คู่มือ, กลยุทธ์, และ Case Study จริง ที่จะนำทางคุณในทุกย่างก้าวของการสร้างธุรกิจ
                </p>
                
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="คุณกำลังมองหาอะไร? (เช่น 'หาลูกค้า', 'No-Code', 'ภาษี')"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-green-200 focus:bg-white/20"
                    />
                  </div>
                </form>

                <div className="max-w-md mx-auto mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">รับเคล็ดลับและบทความใหม่ก่อนใคร ส่งตรงถึงอีเมลคุณ</h3>
                    <NewsletterSignup />
                  </div>
                </div>

                {isAdmin && (
                  <Button asChild variant="secondary">
                    <Link to="/admin/articles">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      จัดการบทความ
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-12">
            {/* Section 2: Start Here - Featured Articles */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">สำหรับผู้เริ่มต้น: เริ่มต้นเส้นทางของคุณที่นี่</h2>
                <p className="text-xl text-gray-600">บทความเสาหลักที่สำคัญที่สุดที่ทุกคนควรต้องอ่าน</p>
              </div>
              
              {pinnedLoading ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : pinnedArticles && pinnedArticles.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {pinnedArticles.map((article) => (
                    <Card key={article.slug} className="hover:shadow-xl transition-shadow border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                      <ArticleCard
                        {...article}
                        imageUrl={article.cover_image_url || "/placeholder.svg"}
                        excerpt={article.excerpt || ""}
                        category={article.category || ""}
                      />
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">ยังไม่มีบทความที่ปักหมุดไว้</p>
                  {isAdmin && (
                    <p className="text-sm text-gray-500 mt-2">ไปที่หน้าจัดการบทความเพื่อปักหมุดบทความสำคัญ</p>
                  )}
                </div>
              )}
            </section>

            {/* Section 3: Case Studies */}
            <section className="mb-16 bg-gray-100 rounded-2xl p-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Case Studies: จากไอเดียสู่ธุรกิจจริงด้วย No-Code</h2>
                <p className="text-xl text-gray-600">เรื่องราวความสำเร็จจริงที่จะสร้างแรงบันดาลใจและความเชื่อมั่นให้คุณ</p>
              </div>
              
              {caseStudyLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="space-y-4">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : caseStudyArticles && caseStudyArticles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {caseStudyArticles.map((article) => (
                    <Card key={article.slug} className="hover:shadow-lg transition-shadow bg-white">
                      <ArticleCard
                        {...article}
                        imageUrl={article.cover_image_url || "/placeholder.svg"}
                        excerpt={article.excerpt || ""}
                        category={article.category || ""}
                      />
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">ยังไม่มี Case Study</p>
                </div>
              )}
            </section>

            {/* Section 4: Deep Dive by Categories */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">เจาะลึกตามหัวข้อที่คุณสนใจ</h2>
                <p className="text-xl text-gray-600">สำรวจความรู้แบบจัดหมวดหมู่เพื่อการเรียนรู้ที่เป็นระบบ</p>
              </div>

              {Object.entries(articlesByCategory).map(([category, categoryArticles]) => {
                if (category === "Case Studies") return null; // Skip since we have a dedicated section
                
                return (
                  <div key={category} className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold">{category}</h3>
                      <Button variant="outline" asChild>
                        <Link to={`/articles?category=${encodeURIComponent(category)}`}>
                          ดูทั้งหมด
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {categoryArticles.map((article) => (
                        <ArticleCard
                          key={article.slug}
                          {...article}
                          imageUrl={article.cover_image_url || "/placeholder.svg"}
                          excerpt={article.excerpt || ""}
                          category={article.category || ""}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Section 5: Filter & Search Results (when searching) */}
            {searchTerm && (
              <section className="mb-16">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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

                <h2 className="text-2xl font-bold mb-6">
                  ผลการค้นหา {searchTerm && `"${searchTerm}"`}
                  {filteredArticles.length > 0 && ` (${filteredArticles.length} บทความ)`}
                </h2>

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
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">
                      ไม่พบบทความที่ตรงกับการค้นหา "{searchTerm}"
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Section 6: Main Call-to-Action */}
            <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">ความรู้จากบทความคือจุดเริ่มต้น...</h2>
              <p className="text-xl mb-8 text-purple-100">
                แต่การลงมือทำจริงต้องการเครื่องมือและแรงสนับสนุน
              </p>
              <p className="text-lg mb-8 text-purple-100 max-w-4xl mx-auto">
                ยกระดับการเดินทางของคุณไปอีกขั้นด้วย <strong>Begins.guide PRO</strong> ที่ให้คุณเข้าถึงทุกคอร์ส, 
                ทุกเทมเพลต, ผู้ช่วย AI เฉพาะทาง, และ Private Community ของเรา
              </p>
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8">
                <Link to="/pro">
                  ดูรายละเอียดและเข้าร่วม PRO Membership
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
