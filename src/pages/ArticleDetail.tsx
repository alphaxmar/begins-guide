
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

// Mock articles data (same as in Articles.tsx)
const mockArticles = [
  {
    id: "mock-1",
    title: "10 ไอเดียธุรกิจ Micro-SaaS ที่ทำได้จริงในปี 2025",
    excerpt: "ไอเดียธุรกิจ SaaS ขนาดเล็กที่ไม่ต้องลงทุนเยอะ แต่มีโอกาสทำเงินสูง พร้อมวิธีการเริ่มต้นที่เป็นรูปธรรม",
    category: "ไอเดียธุรกิจ",
    slug: "micro-saas-business-ideas-2025",
    cover_image_url: "/placeholder.svg",
    created_at: "2025-06-23T10:00:00Z",
    content: `
      <h2>10 ไอเดียธุรกิจ Micro-SaaS ที่ทำได้จริงในปี 2025</h2>
      
      <p>Micro-SaaS เป็นธุรกิจขนาดเล็กที่มีความเฉพาะเจาะจง แต่สามารถสร้างรายได้ที่ดีได้ ในบทความนี้เราจะมาดู 10 ไอเดียที่น่าสนใจ</p>
      
      <h3>1. เครื่องมือจัดการ Social Media สำหรับธุรกิจขนาดเล็ก</h3>
      <p>สร้างเครื่องมือที่ช่วยให้ธุรกิจขนาดเล็กสามารถจัดการโซเชียลมีเดียได้อย่างมีประสิทธิภาพ</p>
      
      <h3>2. แอปติดตามค่าใช้จ่ายสำหรับฟรีแลนเซอร์</h3>
      <p>ระบบติดตามรายรับ-รายจ่ายและการคำนวณภาษีสำหรับฟรีแลนเซอร์</p>
      
      <h3>3. เครื่องมือสร้างใบเสนอราคาอัตโนมัติ</h3>
      <p>ช่วยให้ธุรกิจสร้างใบเสนอราคาที่สวยงามและมืออาชีพได้อย่างรวดเร็ว</p>
      
      <p>ธุรกิจ Micro-SaaS เหล่านี้สามารถเริ่มต้นได้ด้วยงบประมาณน้อย แต่มีศักยภาพในการเติบโตสูง</p>
    `
  },
  {
    id: "mock-2", 
    title: "วิธีตั้งราคาสินค้าดิจิทัลให้ขายดีและกำไรสูง",
    excerpt: "กลยุทธ์การตั้งราคาที่จะทำให้สินค้าดิจิทัลของคุณขายได้ดี พร้อมเทคนิคการทดสอบราคาที่เหมาะสม",
    category: "การตลาด",
    slug: "pricing-digital-products-strategies",
    cover_image_url: "/placeholder.svg",
    created_at: "2025-06-22T10:00:00Z",
    content: `
      <h2>วิธีตั้งราคาสินค้าดิจิทัลให้ขายดีและกำไรสูง</h2>
      
      <p>การตั้งราคาเป็นหนึ่งในปัจจัยสำคัญที่สุดที่จะกำหนดความสำเร็จของสินค้าดิจิทัล</p>
      
      <h3>หลักการตั้งราคาพื้นฐาน</h3>
      <ul>
        <li>วิเคราะห์คู่แข่ง</li>
        <li>เข้าใจคุณค่าที่ลูกค้าได้รับ</li>
        <li>คำนวณต้นทุนการผลิต</li>
      </ul>
      
      <h3>กลยุทธ์การตั้งราคา</h3>
      <p>1. <strong>Value-based Pricing:</strong> ตั้งราคาตามคุณค่าที่ลูกค้าได้รับ</p>
      <p>2. <strong>Tiered Pricing:</strong> สร้างแพ็กเกจหลายระดับ</p>
      <p>3. <strong>Psychological Pricing:</strong> ใช้จิตวิทยาในการตั้งราคา</p>
      
      <p>การทดสอบราคาอย่างต่อเนื่องจะช่วยให้คุณพบราคาที่เหมาะสมที่สุด</p>
    `
  },
  {
    id: "mock-3",
    title: "สร้างธุรกิจแรกด้วย No-Code: ความจริงทั้งหมดที่ต้องรู้",
    excerpt: "คู่มือฉบับสมบูรณ์สำหรับการเริ่มต้นธุรกิจด้วยเครื่องมือ No-Code พร้อมข้อดี-ข้อเสียที่ต้องรู้",
    category: "No-Code",
    slug: "no-code-business-complete-guide",
    cover_image_url: "/placeholder.svg",
    created_at: "2025-06-21T10:00:00Z",
    content: `
      <h2>สร้างธุรกิจแรกด้วย No-Code: ความจริงทั้งหมดที่ต้องรู้</h2>
      
      <p>No-Code เป็นเทรนด์ที่กำลังเติบโตอย่างรวดเร็ว ช่วยให้คนที่ไม่มีความรู้ด้านการเขียนโปรแกรมสามารถสร้างธุรกิจได้</p>
      
      <h3>ข้อดีของ No-Code</h3>
      <ul>
        <li>เริ่มต้นได้เร็ว</li>
        <li>ต้นทุนต่ำ</li>
        <li>ไม่ต้องเขียนโค้ด</li>
        <li>ปรับแต่งได้ง่าย</li>
      </ul>
      
      <h3>ข้อจำกัดที่ต้องรู้</h3>
      <ul>
        <li>ความยืดหยุ่นจำกัด</li>
        <li>ขึ้นอยู่กับแพลตฟอร์ม</li>
        <li>ค่าใช้จ่ายในระยะยาว</li>
      </ul>
      
      <h3>เครื่องมือ No-Code ยอดนิยม</h3>
      <p>1. <strong>Bubble:</strong> สำหรับสร้างเว็บแอป</p>
      <p>2. <strong>Webflow:</strong> สำหรับสร้างเว็บไซต์</p>
      <p>3. <strong>Airtable:</strong> สำหรับจัดการข้อมูล</p>
      
      <p>การเลือกเครื่องมือที่เหมาะสมกับธุรกิจของคุณเป็นสิ่งสำคัญ</p>
    `
  },
  {
    id: "mock-8",
    title: "Case Study: ผมสร้างเว็บขายแบบบ้านออนไลน์ (sellplan.store) ด้วย No-Code",
    excerpt: "เรื่องราวการสร้างธุรกิจขายแบบบ้านออนไลน์ด้วยเครื่องมือ No-Code พร้อมผลลัพธ์และบทเรียนที่ได้",
    category: "Case Studies",
    slug: "case-study-build-sell-plan-store",
    cover_image_url: "/placeholder.svg",
    created_at: "2025-06-15T10:00:00Z",
    content: `
      <h2>Case Study: ผมสร้างเว็บขายแบบบ้านออนไลน์ (sellplan.store) ด้วย No-Code</h2>
      
      <p>ในบทความนี้ ผมจะเล่าประสบการณ์การสร้างเว็บไซต์ขายแบบบ้านออนไลน์ด้วยเครื่องมือ No-Code</p>
      
      <h3>ที่มาของไอเดีย</h3>
      <p>ผมสังเกตว่าสถาปนิกและนักออกแบบหลายคนยังไม่มีช่องทางในการขายแบบบ้านออนไลน์ที่ดี</p>
      
      <h3>เครื่องมือที่ใช้</h3>
      <ul>
        <li><strong>Webflow:</strong> สำหรับสร้างหน้าเว็บ</li>
        <li><strong>Stripe:</strong> สำหรับรับชำระเงิน</li>
        <li><strong>Airtable:</strong> สำหรับจัดการข้อมูลสินค้า</li>
        <li><strong>Zapier:</strong> สำหรับเชื่อมระบบต่างๆ</li>
      </ul>
      
      <h3>ผลลัพธ์ที่ได้</h3>
      <ul>
        <li>สร้างเว็บไซต์ได้ใน 7 วัน</li>
        <li>ขายแบบบ้านได้ 15 ชุดในเดือนแรก</li>
        <li>รายได้ 45,000 บาทในเดือนแรก</li>
      </ul>
      
      <h3>บทเรียนที่ได้</h3>
      <p>No-Code ช่วยให้เราสามารถทดสอบไอเดียได้อย่างรวดเร็วและประหยัด แต่ต้องมีแผนในการขยายธุรกิจ</p>
    `
  },
  {
    id: "mock-6",
    title: "ทำไม Personal Branding คือการตลาดที่ทรงพลังที่สุด",
    excerpt: "เหตุผลที่การสร้างแบรนด์ส่วนตัวคือกลยุทธ์การตลาดที่ดีที่สุดสำหรับผู้ประกอบการยุคใหม่",
    category: "การตลาด",
    slug: "why-personal-branding-is-powerful",
    cover_image_url: "/placeholder.svg",
    created_at: "2025-06-18T10:00:00Z",
    content: `
      <h2>ทำไม Personal Branding คือการตลาดที่ทรงพลังที่สุด</h2>
      
      <p>ในยุคดิจิทัล การสร้างแบรนด์ส่วนตัวกลายเป็นหนึ่งในกลยุทธ์การตลาดที่ทรงพลังที่สุด</p>
      
      <h3>ทำไม Personal Branding ถึงสำคัญ</h3>
      <ul>
        <li>สร้างความน่าเชื่อถือ</li>
        <li>แยกตัวออกจากคู่แข่ง</li>
        <li>สร้างการเชื่อมต่อกับลูกค้า</li>
        <li>เพิ่มมูลค่าให้กับธุรกิจ</li>
      </ul>
      
      <h3>วิธีสร้าง Personal Brand</h3>
      <p>1. <strong>กำหนดตัวตน:</strong> รู้ว่าคุณคือใคร และต้องการสื่ออะไร</p>
      <p>2. <strong>สร้างเนื้อหาสม่ำเสมอ:</strong> แชร์ความรู้และประสบการณ์</p>
      <p>3. <strong>มีปฏิสัมพันธ์:</strong> ตอบกลับและสร้างความสัมพันธ์</p>
      <p>4. <strong>รักษาความสม่ำเสมอ:</strong> รักษาภาพลักษณ์ที่ชัดเจน</p>
      
      <h3>แพลตฟอร์มที่แนะนำ</h3>
      <ul>
        <li>LinkedIn สำหรับธุรกิจ B2B</li>
        <li>Facebook สำหรับธุรกิจ B2C</li>
        <li>YouTube สำหรับแชร์ความรู้</li>
        <li>Website/Blog ส่วนตัว</li>
      </ul>
    `
  },
  {
    id: "mock-7",
    title: "ภาษีเบื้องต้นที่เจ้าของธุรกิจไทยต้องรู้",
    excerpt: "คู่มือภาษีพื้นฐานสำหรับผู้ประกอบการใหม่ ครอบคลุมตั้งแต่การจดทะเบียนไปจนถึงการยื่นแบบ",
    category: "การเงินและกฎหมาย",
    slug: "basic-tax-guide-for-thai-business-owners",
    cover_image_url: "/placeholder.svg",
    created_at: "2025-06-17T10:00:00Z",
    content: `
      <h2>ภาษีเบื้องต้นที่เจ้าของธุรกิจไทยต้องรู้</h2>
      
      <p>การทำความเข้าใจเรื่องภาษีเป็นสิ่งจำเป็นสำหรับผู้ประกอบการทุกคน</p>
      
      <h3>ประเภทภาษีหลักสำหรับธุรกิจ</h3>
      
      <h4>1. ภาษีเงินได้บุคคลธรรมดา</h4>
      <ul>
        <li>อัตราภาษี 5-35% ตามรายได้</li>
        <li>ยื่นภายใน 31 มีนาคมของปีถัดไป</li>
      </ul>
      
      <h4>2. ภาษีมูลค่าเพิ่ม (VAT)</h4>
      <ul>
        <li>อัตรา 7% ของการขาย</li>
        <li>ยื่นทุกเดือนภายใน 15 วัน</li>
        <li>ต้องจดทะเบียนถ้ารายได้เกิน 1.8 ล้านบาท/ปี</li>
      </ul>
      
      <h4>3. ภาษีเงินได้หัก ณ ที่จ่าย</h4>
      <ul>
        <li>หักจากการจ่ายเงินให้ผู้อื่น</li>
        <li>อัตราแตกต่างกันตามประเภทรายได้</li>
      </ul>
      
      <h3>เอกสารที่ต้องเก็บ</h3>
      <ul>
        <li>ใบเสร็จรับเงิน</li>
        <li>ใบกำกับภาษี</li>
        <li>สำเนาใบสั่งซื้อ</li>
        <li>บันทึกการชำระเงิน</li>
      </ul>
      
      <h3>คำแนะนำสำหรับผู้เริ่มต้น</h3>
      <ul>
        <li>ปรึกษานักบัญชี</li>
        <li>ใช้โปรแกรมบัญชี</li>
        <li>เก็บเอกสารอย่างเป็นระบบ</li>
        <li>วางแผนภาษีล่วงหน้า</li>
      </ul>
    `
  }
];

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

      if (error) {
        // If not found in database, try to find in mock articles
        const mockArticle = mockArticles.find(article => article.slug === slug);
        if (mockArticle) {
          return {
            ...mockArticle,
            status: 'published' as const,
            author_id: null,
            updated_at: mockArticle.created_at,
            image_url: mockArticle.cover_image_url,
            is_pinned_on_hub: false
          };
        }
        throw error;
      }
      return data;
    },
  });

  // Calculate estimated reading time (approximate)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200; // Average reading speed
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
                {article.category && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={`/articles?category=${article.category}`}>
                        {article.category}
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
                    {article.category && (
                      <Badge variant="secondary" className="mb-4">
                        {article.category}
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
                  category={article.category || undefined}
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
                {/* Table of Contents - placeholder for future implementation */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-bold mb-4">สารบัญ</h4>
                    <div className="text-sm text-gray-600">
                      <p>สารบัญจะแสดงที่นี่เมื่อมีการอัปเดตระบบ</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contextual CTA */}
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <h4 className="font-bold text-gray-900 mb-3">
                      เริ่มสร้างธุรกิจจริงๆ
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      เรียนรู้การสร้างเว็บไซต์และธุรกิจออนไลน์โดยไม่ต้องเขียนโค้ด
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link to="/no-code-webpreneur">
                        ดูคอร์ส No-Code Webpreneur
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

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
