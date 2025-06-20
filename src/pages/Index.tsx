
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
import { ArrowRight, BookOpen, ShoppingBag, Users, Sparkles, Target, TrendingUp, CheckCircle, Heart, Star, Clock } from "lucide-react";
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
          {/* Enhanced Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 border border-primary/20">
                  <Sparkles className="h-4 w-4" />
                  สำหรับคนไทยที่อยากมีธุรกิจของตัวเอง
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
                  จาก <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ไอเดีย</span><br />
                  สู่ <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">ธุรกิจจริง</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                  เริ่มต้นทำธุรกิจแบบมั่นใจ ด้วยความรู้ เครื่องมือ และแผนที่ชัดเจน<br />
                  <span className="text-primary font-semibold">ไม่ต้องเริ่มจากศูนย์อีกต่อไป</span>
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg" asChild>
                    <Link to="/products" className="flex items-center gap-3">
                      <ShoppingBag className="h-6 w-6" />
                      เริ่มเรียนเลย
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/5 transition-all duration-300 px-8 py-4 text-lg" asChild>
                    <Link to="/articles" className="flex items-center gap-3">
                      <BookOpen className="h-6 w-6" />
                      อ่านบทความฟรี
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                <div className="text-center p-6 bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">500+</h3>
                  <p className="text-muted-foreground">คนไทยที่เริ่มต้นธุรกิจสำเร็จ</p>
                </div>
                <div className="text-center p-6 bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">95%</h3>
                  <p className="text-muted-foreground">ของผู้เรียนนำไปใช้ได้จริง</p>
                </div>
                <div className="text-center p-6 bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">4.8/5</h3>
                  <p className="text-muted-foreground">คะแนนความพึงพอใจ</p>
                </div>
              </div>
            </div>
          </section>

          {/* Target Audience Section */}
          <section className="px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">เหมาะสำหรับใคร?</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  ไม่ว่าคุณจะเป็นใคร อยู่ในช่วงไหนของชีวิต เราพร้อมช่วยคุณเริ่มต้นธุรกิจ
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-card p-8 rounded-3xl border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">นักศึกษา / คนทำงานใหม่</h3>
                  <p className="text-muted-foreground mb-6">
                    อยากหารายได้เสริม ลงทุนน้อย เริ่มต้นง่าย เหมาะกับเวลาจำกัด
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">ธุรกิจออนไลน์ลงทุนต่ำ</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">ขายของออนไลน์แบบง่ายๆ</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">สร้างรายได้ระหว่างเรียน</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card p-8 rounded-3xl border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">พนักงานออฟฟิศ</h3>
                  <p className="text-muted-foreground mb-6">
                    วางแผนลาออกทำธุรกิจ หรือต้องการอาชีพเสริมหลังเลิกงาน
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">วิเคราะห์ตลาดอย่างมืออาชีพ</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">วางแผนการเงินธุรกิจ</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">สร้างรายได้เสริมที่มั่นคง</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card p-8 rounded-3xl border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">ผู้ที่กำลังหางาน</h3>
                  <p className="text-muted-foreground mb-6">
                    ต้องการสร้างอาชีพใหม่ เป็นเจ้าของธุรกิจ มีความมั่นคงทางการเงิน
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">เปลี่ยนอาชีพใหม่อย่างมั่นใจ</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">สร้างธุรกิจที่ยั่งยืน</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">มีรายได้ที่มั่นคง</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="px-4 bg-muted/30 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">เริ่มต้นได้ใน 3 ขั้นตอน</h2>
                <p className="text-xl text-muted-foreground">
                  ไม่ซับซ้อน ไม่วุ่นวาย ทำตามได้จริง
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">เรียนรู้พื้นฐาน</h3>
                  <p className="text-muted-foreground text-lg">
                    อ่านบทความฟรี เรียนรู้หลักการทำธุรกิจ เทคนิคการตลาด และการวางแผน
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">เรียนคอร์สเชิงลึก</h3>
                  <p className="text-muted-foreground text-lg">
                    เลือกคอร์สที่เหมาะกับเป้าหมาย เรียนทีละก้าว มีแบบฝึกหัดจริง
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">ลงมือทำจริง</h3>
                  <p className="text-muted-foreground text-lg">
                    ใช้เครื่องมือและเทมเพลต เริ่มต้นธุรกิจ ติดตามผลและปรับปรุง
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Articles */}
          <section className="px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">บทความสำหรับมือใหม่</h2>
                <p className="text-muted-foreground text-lg">เริ่มต้นด้วยความรู้ฟรีที่คัดสรรมาเพื่อคุณ</p>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">คอร์สยอดนิยม</h2>
                <p className="text-muted-foreground text-lg">เรียนรู้จากผู้เชี่ยวชาญ พร้อมใช้งานจริง</p>
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
                      ดูคอร์สทั้งหมด 
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  พร้อมเริ่มต้นแล้วใช่ไหม?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  รับเทคนิคใหม่ๆ เคล็ดลับการทำธุรกิจ และข่าวสารคอร์สใหม่ก่อนใคร ฟรี!
                </p>
              </div>
              <NewsletterSignup />
            </div>
          </section>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Index;
