
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight, CheckCircle, Calendar, ExternalLink, DollarSign, Zap, Target, Building, ShoppingCart, Crown } from 'lucide-react';
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

const CaseStudyBuildSellplanStoreArticle = () => {
  const currentUrl = window.location.href;
  const articleTitle = 'Case Study: ผมสร้างเว็บขาย "แบบบ้าน" ออนไลน์ (sellplan.store) ใน 7 วัน ด้วย No-Code ได้อย่างไร';

  const dailyProgress = [
    {
      day: 1,
      title: "วางแผน (The Plan)",
      description: "โจทย์ของผมคือ: เปลี่ยนไฟล์ 'แบบบ้าน' ที่มีอยู่ ให้กลายเป็น 'สินค้าดิจิทัล' ที่ขายได้",
      details: "ผมเริ่มต้นจากการวาง User Flow ว่าลูกค้าจะเข้ามา, เลือกดูแบบบ้าน, จ่ายเงิน, และดาวน์โหลดไฟล์ได้อย่างไร",
      icon: Target,
      color: "from-blue-500 to-purple-500"
    },
    {
      day: "2-3",
      title: "สร้าง 'คลังสินค้าดิจิทัล' (The Digital Warehouse)",
      description: "ผมใช้ Supabase สร้างตาราง products เพื่อเก็บข้อมูลแบบบ้าน",
      details: "ชื่อ, ราคา, รูปภาพ และใช้ Supabase Storage เพื่ออัปโหลดไฟล์ PDF และไฟล์ CAD ที่ลูกค้าจะได้รับหลังชำระเงิน",
      icon: Building,
      color: "from-green-500 to-teal-500"
    },
    {
      day: "4-5",
      title: "ก่อสร้าง 'หน้าร้าน' (The Storefront)",
      description: "นี่คือขั้นตอนที่เปลี่ยนข้อมูลที่น่าเบื่อให้กลายเป็นหน้าร้านที่สวยงาม",
      details: "ด้วย Lovable: หน้ารวมสินค้า, หน้าสินค้ารายชิ้นที่มีรายละเอียดและรูปภาพ, การสร้างปุ่ม 'เพิ่มลงตะกร้า'",
      icon: ShoppingCart,
      color: "from-orange-500 to-red-500"
    },
    {
      day: 6,
      title: "ติดตั้ง 'เครื่องคิดเงิน' (The Payment System)",
      description: "ผมเชื่อมต่อปุ่ม 'ชำระเงิน' ในเว็บที่สร้างด้วย Lovable เข้ากับ Stripe",
      details: "เพื่อให้ลูกค้าสามารถจ่ายเงินผ่านบัตรเครดิตและ QR PromptPay ได้อย่างปลอดภัย",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500"
    },
    {
      day: 7,
      title: "ตรวจสอบและ 'เปิดร้าน' (The Launch)",
      description: "ผมทำการทดลองสั่งซื้อ, ดาวน์โหลดไฟล์, และตรวจสอบทุกอย่างจนแน่ใจ",
      details: "จากนั้นก็กด 'Publish' เว็บไซต์ sellplan.store ก็พร้อมให้บริการอย่างเป็นทางการ!",
      icon: CheckCircle,
      color: "from-green-600 to-blue-600"
    }
  ];

  const techStack = [
    {
      name: "Lovable",
      role: "ส่วนหน้าบ้าน (Storefront)",
      description: "สร้างหน้าเว็บที่สวยงามและใช้งานง่าย",
      icon: "🎨"
    },
    {
      name: "Supabase", 
      role: "ส่วนหลังบ้าน (Database & File Storage)",
      description: "จัดเก็บข้อมูลสินค้าและไฟล์ดิจิทัล",
      icon: "🗄️"
    },
    {
      name: "Stripe",
      role: "ส่วนการชำระเงิน (Payment Gateway)",
      description: "ระบบชำระเงินที่ปลอดภัยและเชื่อถือได้",
      icon: "💳"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Case Study: ผมสร้างเว็บขาย "แบบบ้าน" ออนไลน์ (sellplan.store) ใน 7 วัน ด้วย No-Code ได้อย่างไร | Begins.guide</title>
        <meta name="description" content="เรื่องราวจริงของการสร้างเว็บ E-commerce ขายแบบบ้านดิจิทัลใน 7 วัน ด้วยเครื่องมือ No-Code พร้อมเผยทุกขั้นตอนและเทคนิค" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-4 sm:py-8">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <div className="mb-4 sm:mb-6">
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
                    <BreadcrumbLink href="/articles?category=Case Study">Case Study</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="hidden sm:block">Case Study: ผมสร้างเว็บขาย "แบบบ้าน"...</BreadcrumbPage>
                    <BreadcrumbPage className="sm:hidden">บทความ</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card className="mb-6 sm:mb-8">
                  <CardContent className="p-0">
                    {/* Header Area */}
                    <div className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6">
                      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Case Study
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          สร้างธุรกิจ No-Code
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          E-commerce
                        </Badge>
                      </div>
                      
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                        {articleTitle}
                      </h1>
                      
                      {/* Article Metadata */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="hidden sm:inline">โดย ทีมงาน Begins.guide</span>
                          <span className="sm:hidden">Begins.guide</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline">เผยแพร่เมื่อ 23 มิถุนายน 2025</span>
                          <span className="sm:hidden">23 มิ.ย. 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>อ่าน 9 นาที</span>
                        </div>
                        <div className="hidden sm:block">
                          <SocialShare 
                            url={currentUrl}
                            title={articleTitle}
                            description="เรื่องราวจริงของการสร้างเว็บ E-commerce ขายแบบบ้านดิจิทัลใน 7 วัน ด้วยเครื่องมือ No-Code พร้อมเผยทุกขั้นตอนและเทคนิค"
                          />
                        </div>
                      </div>

                      {/* Mobile Social Share */}
                      <div className="sm:hidden mb-4">
                        <SocialShare 
                          url={currentUrl}
                          title={articleTitle}
                          description="เรื่องราวจริงของการสร้างเว็บ E-commerce ขายแบบบ้านดิจิทัลใน 7 วัน ด้วยเครื่องมือ No-Code พร้อมเผยทุกขั้นตอนและเทคนิค"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                      <img
                        src="/placeholder.svg"
                        alt="Sellplan.store website mockup on multiple devices"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <p className="text-center text-sm text-gray-600 mt-2">
                        ภาพ Mockup ของเว็บไซต์ sellplan.store แสดงผลบนหลายอุปกรณ์
                      </p>
                    </div>

                    {/* Introduction */}
                    <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                      <div className="prose max-w-none prose-lg prose-gray mb-6 sm:mb-8">
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                          หลายคนเชื่อว่าการสร้างเว็บ E-commerce ที่มีระบบซื้อ-ขายและดาวน์โหลดไฟล์ได้นั้นซับซ้อน, แพง, และต้องใช้เวลานาน... 
                          <strong>ผมขอท้าทายความเชื่อนั้น</strong>
                        </p>
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                          <strong>บทความนี้คือบันทึกการเดินทางที่ผมสร้างธุรกิจขายสินค้าดิจิทัลขึ้นมาใหม่ทั้งหมดใน 7 วัน 
                          และนี่คือผลลัพธ์:</strong> 
                          <a href="https://www.sellplan.store" target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800 font-bold underline inline-flex items-center gap-1">
                            www.sellplan.store
                            <ExternalLink className="h-4 w-4" />
                          </a> 
                          <strong>(คลิกเพื่อดูเว็บไซต์จริงที่ใช้งานได้ในขณะนี้)</strong>
                        </p>
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                          <strong>ผมจะเล่าทุกขั้นตอน, เครื่องมือที่ใช้, และแนวคิดทางธุรกิจที่อยู่เบื้องหลังโปรเจกต์นี้ แบบไม่มีกั๊ก</strong>
                        </p>
                      </div>

                      {/* Main Content Sections */}
                      <div className="space-y-8 sm:space-y-12">
                        
                        {/* Tech Stack Section */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            🛠️ เครื่องมือที่ใช้ (The Tech Stack)
                          </h2>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {techStack.map((tool, index) => (
                              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 text-center">
                                <div className="text-4xl mb-4">{tool.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                  {tool.name}
                                </h3>
                                <p className="text-sm font-medium text-blue-600 mb-3">
                                  {tool.role}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {tool.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Daily Progress Section */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            📅 บันทึกการเดินทาง 7 วัน
                          </h2>
                          
                          <div className="space-y-8">
                            {dailyProgress.map((day, index) => (
                              <div key={index} className="relative">
                                <div className="flex items-start gap-4 sm:gap-6">
                                  <div className={`w-16 h-16 bg-gradient-to-r ${day.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                                    <day.icon className="h-8 w-8 text-white" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        Day {day.day}
                                      </Badge>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                                      {day.title}
                                    </h3>
                                    <p className="text-base sm:text-lg text-gray-700 mb-3 font-medium">
                                      {day.description}
                                    </p>
                                    <p className="text-base text-gray-600 leading-relaxed">
                                      {day.details}
                                    </p>
                                  </div>
                                </div>
                                {index < dailyProgress.length - 1 && (
                                  <div className="absolute left-8 top-20 w-0.5 h-12 bg-gradient-to-b from-gray-300 to-transparent"></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Business Model Section */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            💼 นี่ไม่ใช่แค่ 'โปรเจกต์' แต่คือ 'โมเดลธุรกิจ' ที่ทำซ้ำได้
                          </h2>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-orange-200">
                              <h3 className="text-xl font-bold text-orange-800 mb-4">
                                💰 ต้นทุน (The Cost)
                              </h3>
                              <p className="text-gray-700 mb-4">
                                ต้นทุนทั้งหมดคือค่าบริการรายเดือนของ Lovable และค่าโดเมนรายปี
                              </p>
                              <div className="bg-white rounded-lg p-4 border border-orange-200">
                                <p className="text-2xl font-bold text-orange-600">
                                  &lt; 2,000 บาท
                                </p>
                                <p className="text-sm text-gray-600">ต้นทุนเริ่มต้นทั้งหมด</p>
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                              <h3 className="text-xl font-bold text-green-800 mb-4">
                                📈 ศักยภาพในการสร้างรายได้
                              </h3>
                              <p className="text-gray-700 mb-4">
                                แบบบ้านแต่ละหลังสามารถตั้งราคาได้ตั้งแต่ 990 - 5,990 บาท
                              </p>
                              <div className="bg-white rounded-lg p-4 border border-green-200">
                                <p className="text-2xl font-bold text-green-600">
                                  10,000+ บาท/เดือน
                                </p>
                                <p className="text-sm text-gray-600">จากการขาย 10 ชุดต่อเดือน</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                            <p className="text-center text-gray-700 text-lg">
                              <strong>การขายได้เพียง 10 ชุดต่อเดือน ก็สามารถสร้างรายได้หลักหมื่นถึงหลายหมื่นบาท... 
                              จากสินค้าที่คุณสร้างแค่ครั้งเดียว</strong>
                            </p>
                          </div>
                        </div>

                        {/* Primary CTA */}
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">
                            🚀 คุณก็สร้างเว็บ E-commerce แบบนี้ได้ และนี่คือคู่มือฉบับสมบูรณ์
                          </h3>
                          
                          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-100 text-center max-w-4xl mx-auto leading-relaxed">
                            ทุกขั้นตอน, ทุกเทคนิค, และทุกการคลิกที่ผมใช้สร้าง <strong>sellplan.store</strong> 
                            ถูกบันทึกและสอนไว้อย่างละเอียดในคอร์ส <strong>'No-Code Webpreneur'</strong> ของเรา 
                            นี่ไม่ใช่แค่คอร์สทฤษฎี แต่คือ Workshop การลงมือสร้างโปรเจกต์จริงแบบเดียวกันนี้
                          </p>
                          
                          <div className="bg-white/10 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-bold text-white mb-2">✅ สิ่งที่คุณจะได้เรียน:</h4>
                                <ul className="text-sm text-blue-100 space-y-1">
                                  <li>• การออกแบบฐานข้อมูลสำหรับ E-commerce</li>
                                  <li>• สร้างหน้าขายและระบบชำระเงิน</li>
                                  <li>• ระบบจัดการไฟล์ดิจิทัลและดาวน์โหลด</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-bold text-white mb-2">🎯 โปรเจกต์จริงที่จะสร้าง:</h4>
                                <ul className="text-sm text-blue-100 space-y-1">
                                  <li>• เว็บ E-commerce ขายสินค้าดิจิทัล</li>
                                  <li>• ระบบชำระเงินและดาวน์โหลดอัตโนมัติ</li>
                                  <li>• หน้า Admin สำหรับจัดการสินค้า</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black font-bold px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl w-full sm:w-auto">
                              <Link to="/no-code-webpreneur">
                                <Zap className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="hidden sm:inline">เรียนรู้วิธีสร้างเว็บขายของแบบนี้</span>
                                <span className="sm:hidden">เรียนคอร์ส No-Code</span>
                                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {/* Secondary CTA */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-200">
                          <div className="text-center">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
                              🏪 มีเว็บแล้ว... แล้วจะหาลูกค้าและจัดการธุรกิจอย่างไรต่อ?
                            </h3>
                            
                            <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                              หากคุณต้องการเรียนรู้ทั้งหมด ตั้งแต่การตลาด, การทำ SEO ให้ร้านค้า, 
                              ไปจนถึงการใช้ AI ช่วยเขียนรายละเอียดสินค้า... <strong>Begins.guide PRO</strong> คือคำตอบ
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <h4 className="font-bold text-gray-900 mb-1">การตลาดครบวงจร</h4>
                                <p className="text-sm text-gray-600">SEO, Social Media, Email Marketing</p>
                              </div>
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                <h4 className="font-bold text-gray-900 mb-1">AI ช่วยขาย</h4>
                                <p className="text-sm text-gray-600">เครื่องมือ AI สำหรับ E-commerce</p>
                              </div>
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <Crown className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <h4 className="font-bold text-gray-900 mb-1">Community PRO</h4>
                                <p className="text-sm text-gray-600">เครือข่ายผู้ประกอบการ</p>
                              </div>
                            </div>
                            
                            <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto">
                              <Link to="/pricing">
                                <Crown className="mr-2 h-5 w-5" />
                                <span className="hidden sm:inline">ดูสิทธิประโยชน์ทั้งหมดของ PRO</span>
                                <span className="sm:hidden">ดู PRO Membership</span>
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Post-Content Area */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Author Box */}
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg sm:text-xl">BG</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-base sm:text-lg mb-2">ทีมงาน Begins.guide</h4>
                          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                            ทีมผู้เชี่ยวชาญด้านการสร้าง E-commerce และธุรกิจออนไลน์ด้วย No-Code 
                            ที่มีประสบการณ์ในการสร้างและขายสินค้าดิจิทัลมากกว่า 100+ โปรเจกต์
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/no-code-webpreneur">เรียนคอร์ส No-Code</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/pricing">ดู PRO Membership</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  <RelatedPosts 
                    currentSlug="case-study-build-sellplan-store-in-7-days-with-nocode" 
                    category="Case Study"
                    limit={4}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 sm:top-8 space-y-4 sm:space-y-6">
                  {/* Table of Contents */}
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <h4 className="font-bold mb-3 sm:mb-4">สารบัญ</h4>
                      <div className="space-y-2 text-sm">
                        <a href="#tech-stack" className="block text-blue-600 hover:text-blue-800">เครื่องมือที่ใช้</a>
                        <a href="#daily-progress" className="block text-purple-600 hover:text-purple-800">บันทึก 7 วัน</a>
                        <a href="#business-model" className="block text-green-600 hover:text-green-800">โมเดลธุรกิจ</a>
                        <a href="#course-cta" className="block text-orange-600 hover:text-orange-800">คอร์ส No-Code</a>
                        <a href="#pro-cta" className="block text-red-600 hover:text-red-800">PRO Membership</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Course CTA */}
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        พร้อมสร้างเว็บขายของ?
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เรียนรู้การสร้างเว็บ E-commerce จริงในคอร์ส
                      </p>
                      <Button asChild size="sm" className="w-full bg-purple-600 hover:bg-purple-700 mb-2">
                        <Link to="/no-code-webpreneur">
                          <Zap className="mr-2 h-4 w-4" />
                          เรียนคอร์ส
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link to="/pricing">
                          <Crown className="mr-2 h-4 w-4" />
                          PRO Access
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Newsletter Signup */}
                  <div className="sticky top-4 sm:top-8">
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

export default CaseStudyBuildSellplanStoreArticle;
