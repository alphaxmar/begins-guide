
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

interface StaticArticle {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  categorySlug: string;
  coverImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const STATIC_ARTICLES: StaticArticle[] = [
  {
    title: "10 วิธีหาลูกค้า 100 คนแรกด้วย Organic Marketing",
    slug: "how-to-get-first-100-customers-organic-marketing",
    excerpt: "เทคนิคการหาลูกค้าออนไลน์ที่ไม่ต้องจ่ายเงินโฆษณา แต่ได้ผลจริง",
    categorySlug: "marketing",
    content: `
      <h2>การสร้างฐานลูกค้าด้วย Organic Marketing</h2>
      <p>การหาลูกค้า 100 คนแรกเป็นขั้นตอนที่สำคัญที่สุดของธุรกิจใหม่ เพราะมันจะเป็นตัวกำหนดทิศทางและความสำเร็จในระยะยาว</p>
      
      <h3>1. สร้าง Content ที่มีคุณค่า</h3>
      <p>เริ่มต้นด้วยการสร้างเนื้อหาที่ตอบโจทย์ปัญหาของกลุ่มเป้าหมาย ไม่ว่าจะเป็นบทความ วิดีโอ หรือ Podcast</p>
      
      <h3>2. ใช้ Social Media อย่างชาญฉลาด</h3>
      <p>เลือกแพลตฟอร์มที่เหมาะสมกับธุรกิจของคุณ และสร้างการมีส่วนร่วมกับผู้ติดตามอย่างสม่ำเสมอ</p>
      
      <h3>3. สร้าง Community</h3>
      <p>การสร้างชุมชนรอบๆ แบรนด์ของคุณจะช่วยให้เกิดความผูกพันและการแนะนำต่อ</p>
      
      <h3>4. Email Marketing</h3>
      <p>สร้างรายชื่ออีเมลและส่งเนื้อหาที่มีคุณค่าให้กับลูกค้าอย่างสม่ำเสมอ</p>
      
      <h3>5. Partnership และ Collaboration</h3>
      <p>ร่วมมือกับธุรกิจอื่นที่มีกลุ่มเป้าหมายคล้ายกัน</p>
    `,
    seoTitle: "10 วิธีหาลูกค้า 100 คนแรกด้วย Organic Marketing - ไม่ต้องจ่ายโฆษณา",
    seoDescription: "เรียนรู้เทคนิคการหาลูกค้าออนไลน์ที่ไม่ต้องจ่ายเงินโฆษณา พร้อมกลยุทธ์ที่ทดสอบแล้วได้ผลจริงสำหรับ startup"
  },
  {
    title: "แนวคิด Personal Branding ที่ทรงพลังสำหรับผู้ประกอบการ",
    slug: "why-personal-branding-is-powerful",
    excerpt: "ทำไม Personal Branding ถึงสำคัญกับธุรกิจ และจะเริ่มต้นอย่างไร",
    categorySlug: "marketing",
    content: `
      <h2>ทำไม Personal Branding ถึงสำคัญ</h2>
      <p>ในยุคดิจิทัล ผู้คนซื้อจากคนที่พวกเขารู้จัก ชื่นชอบ และไว้วางใจ Personal Branding จึงเป็นเครื่องมือสำคัญ</p>
      
      <h3>1. สร้างความน่าเชื่อถือ</h3>
      <p>การมี Personal Brand ที่แข็งแกร่งจะทำให้คนเชื่อมั่นในตัวคุณและธุรกิจของคุณมากขึ้น</p>
      
      <h3>2. สร้างการจดจำแบรนด์</h3>
      <p>คนจะจดจำคุณได้ง่ายขึ้นเมื่อคุณมีเอกลักษณ์เฉพาะตัว</p>
      
      <h3>3. เปิดโอกาสทางธุรกิจ</h3>
      <p>Personal Brand ที่ดีจะดึงดูดโอกาสต่างๆ เข้ามาหาคุณเอง</p>
    `,
    seoTitle: "Personal Branding สำคัญอย่างไรกับผู้ประกอบการ",
    seoDescription: "เรียนรู้ทำไม Personal Branding ถึงเป็นเครื่องมือสำคัญสำหรับผู้ประกอบการในยุคดิจิทัล"
  },
  {
    title: "ไอเดีย Micro SaaS ที่ทำเงินได้จริงในปี 2025",
    slug: "micro-saas-ideas",
    excerpt: "รวมไอเดีย Micro SaaS ที่มีโอกาสสำเร็จสูงและเริ่มต้นได้ง่าย",
    categorySlug: "business-ideas",
    content: `
      <h2>Micro SaaS คืออะไร</h2>
      <p>Micro SaaS คือซอฟต์แวร์ขนาดเล็กที่แก้ปัญหาเฉพาะจุด มักจะมีผู้ใช้ไม่เยอะ แต่ให้รายได้ที่สม่ำเสมอ</p>
      
      <h3>1. Social Media Scheduler</h3>
      <p>เครื่องมือจัดการโซเชียลมีเดียสำหรับธุรกิจขนาดเล็ก</p>
      
      <h3>2. Invoice Generator</h3>
      <p>ระบบออกใบแจ้งหนี้อัตโนมัติสำหรับฟรีแลนซ์เซอร์</p>
      
      <h3>3. Habit Tracker</h3>
      <p>แอปติดตามนิสัยที่ใช้งานง่าย</p>
    `,
    seoTitle: "ไอเดีย Micro SaaS ที่ทำเงินได้จริงในปี 2025",
    seoDescription: "สำรวจไอเดีย Micro SaaS ที่มีศักยภาพสูงและเริ่มต้นได้ด้วยทุนน้อย"
  },
  {
    title: "วิธีสร้างธุรกิจด้วย No-Code ในปี 2025",
    slug: "no-code-business",
    excerpt: "คู่มือเริ่มต้นธุรกิจด้วยเครื่องมือ No-Code ที่ไม่ต้องเขียนโค้ด",
    categorySlug: "no-code",
    content: `
      <h2>ยุคของ No-Code Business</h2>
      <p>ปัจจุบันคุณสามารถสร้างธุรกิจดิจิทัลได้โดยไม่ต้องเขียนโค้ดเลย</p>
      
      <h3>เครื่องมือ No-Code ที่แนะนำ</h3>
      <p>Bubble, Webflow, Airtable, Zapier และอื่นๆ</p>
      
      <h3>ประเภทธุรกิจที่เหมาะกับ No-Code</h3>
      <p>Marketplace, SaaS Tools, E-commerce, Community Platform</p>
    `,
    seoTitle: "วิธีสร้างธุรกิจด้วย No-Code ในปี 2025 - ไม่ต้องเขียนโค้ด",
    seoDescription: "เรียนรู้วิธีสร้างธุรกิจดิจิทัลด้วยเครื่องมือ No-Code ที่ใครก็ทำได้"
  },
  {
    title: "เครื่องมือ AI สำหรับผู้ประกอบการ 2025",
    slug: "ai-tools-for-entrepreneurs",
    excerpt: "รวมเครื่องมือ AI ที่จะช่วยให้ธุรกิจของคุณเติบโตเร็วขึ้น",
    categorySlug: "tools",
    content: `
      <h2>AI Tools ที่ผู้ประกอบการต้องรู้จัก</h2>
      <p>เครื่องมือ AI สามารถช่วยเพิ่มประสิทธิภาพการทำงานได้อย่างมาก</p>
      
      <h3>1. ChatGPT สำหรับ Content Creation</h3>
      <p>ใช้สร้างเนื้อหาการตลาด บทความ และ Caption</p>
      
      <h3>2. Midjourney สำหรับ Design</h3>
      <p>สร้างกราฟิกและรูปภาพสำหรับธุรกิจ</p>
      
      <h3>3. Notion AI สำหรับ Organization</h3>
      <p>จัดการข้อมูลและสร้างเอกสารอัตโนมัติ</p>
    `,
    seoTitle: "เครื่องมือ AI สำหรับผู้ประกอบการ 2025",
    seoDescription: "ค้นพบเครื่องมือ AI ที่จะช่วยให้ธุรกิจของคุณมีประสิทธิภาพมากขึ้น"
  }
];

const ArticleImporter = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const importArticles = async () => {
    setIsImporting(true);
    setProgress(0);
    setImportedCount(0);
    setErrors([]);

    try {
      // ดึงข้อมูล categories
      const { data: categories } = await supabase
        .from('categories')
        .select('id, slug');

      if (!categories) {
        throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
      }

      // สร้าง mapping ของ category
      const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.slug] = cat.id;
        return acc;
      }, {} as Record<string, string>);

      // ดึงข้อมูล current user เป็น author
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('กรุณาเข้าสู่ระบบก่อน');
      }

      const totalArticles = STATIC_ARTICLES.length;
      
      for (let i = 0; i < STATIC_ARTICLES.length; i++) {
        const article = STATIC_ARTICLES[i];
        
        try {
          // ตรวจสอบว่าบทความมีอยู่แล้วหรือไม่
          const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .eq('slug', article.slug)
            .single();

          if (existing) {
            console.log(`บทความ "${article.title}" มีอยู่แล้ว ข้าม...`);
            setProgress(((i + 1) / totalArticles) * 100);
            continue;
          }

          // Import บทความใหม่
          const { error } = await supabase
            .from('articles')
            .insert({
              title: article.title,
              slug: article.slug,
              content: article.content,
              excerpt: article.excerpt,
              category_id: categoryMap[article.categorySlug],
              author_id: user.id,
              cover_image_url: article.coverImageUrl,
              seo_title: article.seoTitle,
              seo_description: article.seoDescription,
              status: 'published',
              is_featured_on_hub: false
            });

          if (error) {
            console.error(`Error importing ${article.title}:`, error);
            setErrors(prev => [...prev, `${article.title}: ${error.message}`]);
          } else {
            setImportedCount(prev => prev + 1);
            console.log(`✅ นำเข้าบทความ "${article.title}" สำเร็จ`);
          }
        } catch (err) {
          console.error(`Error processing ${article.title}:`, err);
          setErrors(prev => [...prev, `${article.title}: ${err}`]);
        }

        setProgress(((i + 1) / totalArticles) * 100);
        
        // หน่วงเวลาเล็กน้อยเพื่อป้องกัน rate limit
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast.success(`นำเข้าบทความเสร็จสิ้น! สำเร็จ ${importedCount} บทความ`);
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`เกิดข้อผิดพลาด: ${error}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          นำเข้าบทความจากหน้า Static Pages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          ระบบจะนำเข้าบทความจากหน้า Static Pages ทั้งหมด {STATIC_ARTICLES.length} บทความ เข้าสู่ระบบจัดการแบบไดนามิก
        </div>
        
        {isImporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>กำลังนำเข้า...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            <div className="text-sm text-muted-foreground">
              นำเข้าสำเร็จแล้ว: {importedCount} บทความ
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4" />
              ข้อผิดพลาดที่เกิดขึ้น:
            </div>
            <div className="text-xs text-muted-foreground max-h-32 overflow-y-auto">
              {errors.map((error, index) => (
                <div key={index} className="py-1">• {error}</div>
              ))}
            </div>
          </div>
        )}

        {importedCount > 0 && !isImporting && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            นำเข้าเสร็จสิ้น: {importedCount} บทความ
          </div>
        )}

        <Button 
          onClick={importArticles} 
          disabled={isImporting}
          className="w-full"
        >
          {isImporting ? 'กำลังนำเข้า...' : 'เริ่มนำเข้าบทความ'}
        </Button>

        <div className="text-xs text-muted-foreground">
          หมายเหตุ: บทความที่มีอยู่แล้วจะไม่ถูกเขียนทับ
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleImporter;
