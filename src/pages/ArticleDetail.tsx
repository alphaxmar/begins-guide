
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import RelatedPosts from "@/components/RelatedPosts";
import NewsletterSignup from "@/components/NewsletterSignup";
import SocialShare from "@/components/SocialShare";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tables } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";

type Article = Tables<'articles'> & {
  categories?: Tables<'categories'>;
  products?: Tables<'products'>;
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tableOfContents, setTableOfContents] = useState<{id: string, text: string, level: number}[]>([]);

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ['article', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required');
      
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          categories(*),
          products!articles_recommended_product_id_fkey(*)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return data as Article;
    },
    enabled: !!slug,
  });

  // Generate table of contents from article content
  useEffect(() => {
    if (article?.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(article.content, 'text/html');
      const headings = doc.querySelectorAll('h2, h3');
      
      const toc = Array.from(headings).map((heading, index) => ({
        id: `heading-${index}`,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      }));
      
      setTableOfContents(toc);
    }
  }, [article?.content]);

  // Calculate estimated reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return <Navigate to="/404" replace />;
  }

  const readingTime = article.content ? calculateReadingTime(article.content) : 5;
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">หน้าแรก</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/articles">คลังความรู้</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {article.categories && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={`/articles?category=${article.categories.slug}`}>
                        {article.categories.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{article.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="mb-8">
                <CardContent className="p-0">
                  {/* Header Area */}
                  <div className="p-8 pb-6">
                    {article.categories && (
                      <Badge variant="secondary" className="mb-4">
                        {article.categories.name}
                      </Badge>
                    )}
                    
                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                      {article.title}
                    </h1>
                    
                    {/* Article Metadata */}
                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6 pb-6 border-b">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>ทีมงาน Begins.guide</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{format(new Date(article.created_at), 'dd MMMM yyyy', { locale: th })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>อ่าน {readingTime} นาที</span>
                      </div>
                      <SocialShare 
                        url={currentUrl}
                        title={article.title}
                        description={article.excerpt || ''}
                      />
                    </div>
                  </div>

                  {/* Featured Image */}
                  {article.cover_image_url && (
                    <div className="px-8 mb-8">
                      <img
                        src={article.cover_image_url}
                        alt={article.title}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}

                  {/* Main Content Area */}
                  <div className="px-8 pb-8">
                    <div className="prose max-w-none prose-lg prose-gray">
                      <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
                    </div>

                    {/* Inline Call-to-Action (Lead Magnet) */}
                    <div className="my-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        เรียนรู้ได้เร็วยิ่งขึ้น
                      </h3>
                      <p className="text-gray-600 mb-6">
                        ดาวน์โหลดฟรี! Checklist สรุปขั้นตอน "{article.title}" เพื่อนำไปใช้ได้ทันที
                      </p>
                      <div className="max-w-md mx-auto">
                        <NewsletterSignup />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Post-Content Area */}
              <div className="space-y-8">
                {/* Author Box */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">BG</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-2">ทีมงาน Begins.guide</h4>
                        <p className="text-gray-600 mb-4">
                          ทีมผู้เชี่ยวชาญด้านการสร้างธุรกิจและ No-Code ที่มีประสบการณ์การสอนและให้คำปรึกษามากกว่า 5 ปี
                        </p>
                        <div className="flex gap-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/articles">บทความทั้งหมด</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/pro">เรียนรู้เพิ่มเติม</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                <RelatedPosts 
                  currentSlug={article.slug} 
                  category={article.categories?.name}
                  limit={4}
                />

                {/* Main Call-to-Action */}
                <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">
                      พร้อมที่จะยกระดับการเรียนรู้ของคุณแล้วหรือยัง?
                    </h3>
                    <p className="text-green-100 mb-6">
                      เข้าถึงคอร์สออนไลน์, เทมเพลต, และเครื่องมือ AI ทั้งหมดด้วย Begins.guide PRO
                    </p>
                    <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                      <Link to="/pro">
                        สมัครสมาชิก PRO วันนี้
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-bold mb-4">สารบัญ</h4>
                      <div className="space-y-2">
                        {tableOfContents.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className={`block text-sm hover:text-primary transition-colors ${
                              item.level === 2 ? 'font-medium' : 'pl-4 text-muted-foreground'
                            }`}
                          >
                            {item.text}
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contextual CTA - Show recommended product if available */}
                {article.products ? (
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        แนะนำสำหรับคุณ
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {article.products.description || "เรียนรู้เพิ่มเติมเกี่ยวกับหัวข้อนี้"}
                      </p>
                      <Button asChild size="sm" className="w-full">
                        <Link to={`/products/${article.products.slug}`}>
                          ดู {article.products.title}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        เริ่มสร้างธุรกิจจริงๆ
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เรียนรู้การสร้างเว็บไซต์และธุรกิจออนไลน์โดยไม่ต้องเขียนโค้ด
                      </p>
                      <Button asChild size="sm" className="w-full">
                        <Link to="/pro">
                          สมัครสมาชิก PRO
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Newsletter Signup */}
                <div className="sticky top-8">
                  <NewsletterSignup />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
