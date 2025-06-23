
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight, CheckCircle, Zap, Globe, Wrench, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NewsletterSignup from '@/components/NewsletterSignup';
import SocialShare from '@/components/SocialShare';
import RelatedPosts from '@/components/RelatedPosts';

const NoCodeBusinessArticle = () => {
  const currentUrl = window.location.href;
  const articleTitle = "สร้างธุรกิจแรกด้วย No-Code: ความจริงทั้งหมดที่ต้องรู้ (ฉบับ 2025)";

  const noCodeTools = [
    {
      name: "Bubble",
      description: "สำหรับสร้างเว็บแอปพลิเคชันที่ซับซ้อน มีฐานข้อมูล และฟีเจอร์การจัดการผู้ใช้",
      icon: Globe,
      useCase: "เหมาะกับ: แอป E-commerce, CRM, แพลตฟอร์มเชื่อมต่อผู้ใช้"
    },
    {
      name: "Glide/Softr",
      description: "สำหรับสร้างแอปง่ายๆ จากข้อมูลใน Google Sheets หรือ Airtable",
      icon: Users,
      useCase: "เหมาะกับ: แอปแคตตาล็อกสินค้า, ไดเรกทอรี่ธุรกิจ, แอปภายในองค์กร"
    },
    {
      name: "Webflow",
      description: "สำหรับสร้างเว็บไซต์ดีไซน์สวยงามและซับซ้อน มีระบบ CMS ในตัว",
      icon: TrendingUp,
      useCase: "เหมาะกับ: เว็บไซต์บริษัท, Portfolio, Blog ระดับมืออาชีพ"
    },
    {
      name: "Lovable",
      description: "สำหรับสร้างเว็บไซต์สำหรับธุรกิจ SME ที่สวยงามและใช้งานง่ายที่สุด",
      icon: Zap,
      useCase: "เหมาะกับ: เว็บไซต์ธุรกิจ, Landing Page, เว็บขายสินค้า",
      highlighted: true
    },
    {
      name: "Zapier/Make",
      description: "สำหรับเชื่อมต่อและสร้าง Automation ระหว่างแอปต่างๆ",
      icon: Wrench,
      useCase: "เหมาะกับ: การทำงานอัตโนมัติ, เชื่อมต่อระหว่างระบบต่างๆ"
    }
  ];

  const caseStudies = [
    {
      name: "Zapier",
      description: "เริ่มต้นเป็นเครื่องมือ Automation ง่ายๆ วันนี้มีมูลค่ากิจการกว่า 5 พันล้านดอลลาร์",
      achievement: "5B USD Valuation"
    },
    {
      name: "Mailchimp",
      description: "เริ่มจากเครื่องมือส่งอีเมลธรรมดา พัฒนาเป็นแพลตฟอร์มการตลาดครบวงจร",
      achievement: "12B USD Sale"
    },
    {
      name: "Gumroad",
      description: "แพลตฟอร์มขายผลิตภัณฑ์ดิจิทัล ที่ช่วยให้ Creator หลายพันคนสร้างรายได้หลักล้าน",
      achievement: "100M+ Creator Revenue"
    }
  ];

  return (
    <>
      <Helmet>
        <title>สร้างธุรกิจแรกด้วย No-Code: ความจริงทั้งหมดที่ต้องรู้ | Begins.guide</title>
        <meta name="description" content="ทำลายกำแพงความเชื่อเรื่องการเขียนโค้ด! เรียนรู้ความจริงทั้งหมดเกี่ยวกับ No-Code พร้อมข้อดี ข้อเสีย และเครื่องมือที่คุณต้องรู้ในปี 2025" />
      </Helmet>

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
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/articles?category=สร้างธุรกิจ No-Code">สร้างธุรกิจ No-Code</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>สร้างธุรกิจแรกด้วย No-Code...</BreadcrumbPage>
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
                      <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
                        สร้างธุรกิจ No-Code
                      </Badge>
                      
                      <h1 className="text-4xl font-bold mb-6 leading-tight">
                        {articleTitle}
                      </h1>
                      
                      {/* Article Metadata */}
                      <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6 pb-6 border-b">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>ทีมงาน Begins.guide</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>เผยแพร่เมื่อ 23 มกราคม 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>อ่าน 10 นาที</span>
                        </div>
                        <SocialShare 
                          url={currentUrl}
                          title={articleTitle}
                          description="ทำลายกำแพงความเชื่อเรื่องการเขียนโค้ด เรียนรู้ความจริงเกี่ยวกับ No-Code"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="px-8 mb-8">
                      <img
                        src="/placeholder.svg"
                        alt="No-Code Business Creation"
                        className="w-full rounded-lg"
                      />
                    </div>

                    {/* Introduction */}
                    <div className="px-8 pb-8">
                      <div className="prose max-w-none prose-lg prose-gray mb-8">
                        <p className="text-xl leading-relaxed text-gray-700 mb-6">
                          หลายคนมีความคิดอยากสร้างแอปหรือเว็บไซต์ แต่สุดท้ายก็ต้องพับโครงการไปเพราะเจอกำแพงที่ชื่อว่า <strong>"Coding"</strong> 
                          ทั้งความซับซ้อน, เวลา, และค่าใช้จ่ายในการจ้างโปรแกรมเมอร์...
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                          <p className="text-lg font-semibold text-blue-900 mb-2">
                            🚀 แต่วันนี้... กำแพงนั้นกำลังจะทลายลง
                          </p>
                          <p className="text-blue-800">
                            ด้วยเทคโนโลยีที่เรียกว่า <strong>"No-Code"</strong> มันคือการสร้างซอฟต์แวร์ที่เปรียบเสมือน 
                            <em>"การต่อเลโก้บล็อก"</em> คุณใช้ชิ้นส่วนสำเร็จรูปที่คนอื่นสร้างไว้ มาประกอบกันเป็นสิ่งที่คุณต้องการ 
                            โดยไม่ต้องรู้วิธีสร้างบล็อกแต่ละชิ้นขึ้นมาเอง
                          </p>
                        </div>
                      </div>

                      {/* Section 1: Advantages */}
                      <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                          ข้อดี... ทำไม No-Code ถึงเปลี่ยนเกมสำหรับผู้ประกอบการ?
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <Zap className="h-8 w-8 text-green-600 mb-4" />
                            <h3 className="text-xl font-bold text-green-900 mb-3">ความเร็ว (Speed)</h3>
                            <p className="text-green-800">
                              เปิดตัวผลิตภัณฑ์ต้นแบบ (MVP) ได้ในหลักวันหรือสัปดาห์ ไม่ใช่หลายเดือน
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold text-blue-900 mb-3">ต้นทุน (Cost)</h3>
                            <p className="text-blue-800">
                              ประหยัดค่าจ้างโปรแกรมเมอร์หลักแสนหรือหลักล้านบาท
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <Users className="h-8 w-8 text-purple-600 mb-4" />
                            <h3 className="text-xl font-bold text-purple-900 mb-3">ความเป็นเจ้าของ</h3>
                            <p className="text-purple-800">
                              ผู้ก่อตั้งที่ไม่ใช่สายเทคนิคสามารถสร้างและแก้ไขวิสัยทัศน์ของตัวเองได้โดยตรง
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Limitations */}
                      <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <AlertTriangle className="h-8 w-8 text-orange-600" />
                          ข้อจำกัด... อะไรคือสิ่งที่ No-Code ยังทำไม่ได้?
                        </h2>
                        
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-6">
                          <p className="text-lg text-gray-700 mb-4">
                            <strong>เราไม่ได้อยากขายให้คุณฝันเฟื่อง</strong> ดังนั้นนี่คือข้อจำกัดที่คุณต้องรู้:
                          </p>
                          
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-gray-900">การขยายระบบที่ซับซ้อน</h4>
                                <p className="text-gray-700">อาจไม่เหมาะกับแอปที่ต้องรองรับผู้ใช้หลายสิบล้านคนพร้อมกัน</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-gray-900">ข้อจำกัดด้านฟังก์ชัน</h4>
                                <p className="text-gray-700">คุณถูกจำกัดด้วยสิ่งที่แพลตฟอร์มมีให้ ไม่สามารถสร้างฟีเจอร์ที่เฉพาะทางมากๆ ได้</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-gray-900">การผูกมัดกับแพลตฟอร์ม</h4>
                                <p className="text-gray-700">ธุรกิจของคุณต้องพึ่งพาแพลตฟอร์ม No-Code นั้นๆ ต่อไป</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: No-Code Tools */}
                      <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <Wrench className="h-8 w-8 text-blue-600" />
                          5 เครื่องมือ No-Code ยอดนิยม
                        </h2>
                        
                        <div className="space-y-6">
                          {noCodeTools.map((tool, index) => (
                            <div 
                              key={index} 
                              className={`border rounded-lg p-6 ${
                                tool.highlighted 
                                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300' 
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${
                                  tool.highlighted 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <tool.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                  <h3 className={`text-xl font-bold mb-2 ${
                                    tool.highlighted ? 'text-blue-900' : 'text-gray-900'
                                  }`}>
                                    {tool.name}
                                    {tool.highlighted && (
                                      <Badge className="ml-2 bg-blue-600">แนะนำ</Badge>
                                    )}
                                  </h3>
                                  <p className="text-gray-700 mb-2">{tool.description}</p>
                                  <p className="text-sm text-gray-600 italic">{tool.useCase}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Main CTA */}
                      <div className="my-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 text-center">
                        <h3 className="text-3xl font-bold mb-4">
                          เห็นพลังของเครื่องมือเหล่านี้แล้วใช่ไหม? 🚀
                        </h3>
                        <h4 className="text-xl mb-6 text-blue-100">
                          แต่จะเริ่มต้นเรียนรู้มันอย่างไรให้เร็วที่สุด?
                        </h4>
                        <p className="text-lg mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                          ไม่ต้องเสียเวลาลองผิดลองถูก! เราได้ย่อยทุกความซับซ้อนและสร้างเส้นทางลัดไว้ให้คุณแล้วในคอร์ส 
                          <strong>'No-Code Webpreneur'</strong> ที่จะสอนคุณใช้ <strong>'Lovable'</strong> 
                          (เครื่องมือที่เราแนะนำว่าใช้ง่ายและเหมาะกับธุรกิจ SME ที่สุด) 
                          สร้างเว็บไซต์ระดับมืออาชีพแบบจับมือทำ
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                            <Link to="/no-code-webpreneur">
                              ดูรายละเอียดคอร์ส No-Code
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      {/* Section 4: Case Studies */}
                      <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                          <TrendingUp className="h-8 w-8 text-green-600" />
                          ธุรกิจจริงที่สร้างด้วย No-Code
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          {caseStudies.map((company, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                              <h3 className="text-xl font-bold text-gray-900 mb-3">{company.name}</h3>
                              <p className="text-gray-700 mb-4">{company.description}</p>
                              <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                                {company.achievement}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                          <p className="text-lg text-gray-800 text-center">
                            💡 <strong>ข้อสังเกต:</strong> ธุรกิจเหล่านี้ไม่ได้ "เริ่มต้นใหญ่" พวกเขาเริ่มจากการแก้ปัญหาเล็กๆ 
                            ด้วยเครื่องมือที่มีอยู่ แล้วค่อยๆ พัฒนาไปเรื่อยๆ
                          </p>
                        </div>
                      </div>

                      {/* Secondary CTA */}
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
                        <h3 className="text-2xl font-bold text-center mb-6">
                          No-Code เป็นเพียง "เครื่องมือ" แต่ความสำเร็จที่แท้จริงมาจากการมี "โมเดลธุรกิจ" ที่ถูกต้อง
                        </h3>
                        
                        <p className="text-lg text-center text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                          หากคุณต้องการเรียนรู้ทั้งหมด ตั้งแต่การหาไอเดีย, การตลาด, การตั้งราคา ไปจนถึงการใช้ AI ช่วยทำธุรกิจ... 
                          <strong>Begins.guide PRO</strong> คือคำตอบที่ให้คุณเข้าถึงทุกคอร์สและเครื่องมือของเราในที่เดียว
                        </p>
                        
                        <div className="text-center">
                          <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                            <Link to="/pricing">
                              อัปเกรดเป็น PRO
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
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
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">BG</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">ทีมงาน Begins.guide</h4>
                          <p className="text-gray-600 mb-4">
                            ทีมผู้เชี่ยวชาญด้านเทคโนโลยี No-Code และการสร้างธุรกิจออนไลน์ ที่มีประสบการณ์ช่วยให้ผู้ประกอบการสร้างเว็บไซต์และแอปพลิเคชันโดยไม่ต้องเขียนโค้ดมากกว่า 3 ปี
                          </p>
                          <div className="flex gap-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link to="/articles">บทความทั้งหมด</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link to="/no-code-webpreneur">คอร์ส No-Code</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  <RelatedPosts 
                    currentSlug="what-is-no-code-business-the-whole-truth" 
                    category="สร้างธุรกิจ No-Code"
                    limit={4}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Table of Contents */}
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-bold mb-4">สารบัญ</h4>
                      <div className="space-y-2 text-sm">
                        <a href="#introduction" className="block text-blue-600 hover:text-blue-800">บทนำ</a>
                        <a href="#pros" className="block text-blue-600 hover:text-blue-800">ข้อดีของ No-Code</a>
                        <a href="#cons" className="block text-blue-600 hover:text-blue-800">ข้อจำกัดของ No-Code</a>
                        <a href="#tools" className="block text-blue-600 hover:text-blue-800">5 เครื่องมือ No-Code</a>
                        <a href="#case-studies" className="block text-blue-600 hover:text-blue-800">ธุรกิจที่ประสบความสำเร็จ</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contextual CTA */}
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                    <CardContent className="p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        พร้อมเริ่มต้นสร้างเว็บ No-Code?
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เรียนรู้วิธีใช้ Lovable สร้างเว็บไซต์ระดับมืออาชีพใน 7 วัน
                      </p>
                      <Button asChild size="sm" className="w-full bg-purple-500 hover:bg-purple-600">
                        <Link to="/no-code-webpreneur">
                          ดูคอร์ส No-Code
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
    </>
  );
};

export default NoCodeBusinessArticle;
