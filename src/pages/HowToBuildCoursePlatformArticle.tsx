
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight, CheckCircle, Database, Globe, CreditCard, BookOpen, Users, Video, FileText, Crown, Zap } from 'lucide-react';
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

const HowToBuildCoursePlatformArticle = () => {
  const currentUrl = window.location.href;
  const articleTitle = 'สร้าง SkillLane ของตัวเอง: วิธีออกแบบเว็บขายคอร์สออนไลน์ด้วย No-Code (ฉบับจับมือทำ)';

  const databaseTables = [
    {
      name: "courses",
      description: "เก็บข้อมูลคอร์ส (ชื่อ, รายละเอียด, รูปภาพ, ราคา)",
      icon: BookOpen
    },
    {
      name: "lessons", 
      description: "เก็บข้อมูลบทเรียนย่อยของแต่ละคอร์ส พร้อมลิงก์วิดีโอ",
      icon: Video
    },
    {
      name: "profiles",
      description: "เก็บข้อมูลผู้ใช้/นักเรียน และข้อมูลโปรไฟล์",
      icon: Users
    },
    {
      name: "enrollments",
      description: "ตารางสำคัญที่บันทึกว่า 'ใคร' ลงทะเบียนเรียน 'คอร์สอะไร'",
      icon: CheckCircle
    },
    {
      name: "payments",
      description: "เก็บประวัติการชำระเงินและสถานะการสั่งซื้อ",
      icon: CreditCard
    }
  ];

  const frontendPages = [
    {
      name: "หน้ารวมคอร์ส (Course Catalog)",
      description: "แสดงคอร์สทั้งหมดที่เปิดขาย พร้อมหมวดหมู่และการกรอง",
      features: ["รายการคอร์สทั้งหมด", "ระบบค้นหาและกรอง", "รีวิวและเรตติ้ง"]
    },
    {
      name: "หน้าขายของแต่ละคอร์ส (Sales Page)",
      description: "หน้าสำหรับโปรโมทคอร์สแต่ละตัวโดยละเอียด",
      features: ["รายละเอียดคอร์ส", "หลักสูตรและโครงร่าง", "ปุ่มลงทะเบียนเรียน"]
    },
    {
      name: "หน้าของนักเรียน (Student Dashboard)",
      description: "หน้าที่แสดง 'คอร์สของฉัน' และความคืบหน้าการเรียน",
      features: ["คอร์สที่ลงทะเบียน", "ความคืบหน้าการเรียน", "ใบรับรองที่ได้รับ"]
    },
    {
      name: "หน้าเรียน (Lesson Page)",
      description: "หน้าสำหรับดูวิดีโอและดาวน์โหลดเอกสารประกอบ",
      features: ["เล่นวิดีโอบทเรียน", "เอกสารดาวน์โหลด", "ความคืบหน้าบทเรียน"]
    }
  ];

  const architectureSteps = [
    {
      title: "Frontend (Lovable)",
      description: "ส่วนหน้าบ้านที่ผู้ใช้มองเห็น",
      icon: Globe,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Backend (Supabase)",
      description: "ฐานข้อมูลและระบบจัดการข้อมูล",
      icon: Database,
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Payment (Stripe)",
      description: "ระบบชำระเงินและการเงิน",
      icon: CreditCard,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <>
      <Helmet>
        <title>สร้าง SkillLane ของตัวเอง: วิธีออกแบบเว็บขายคอร์สออนไลน์ด้วย No-Code | Begins.guide</title>
        <meta name="description" content="เรียนรู้วิธีสร้างแพลตฟอร์มขายคอร์สออนไลน์ของตัวเองด้วย No-Code พร้อมพิมพ์เขียวสถาปัตยกรรมและคู่มือลงมือทำ" />
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
                    <BreadcrumbLink href="/articles?category=สร้างธุรกิจ No-Code">สร้างธุรกิจ No-Code</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="hidden sm:block">สร้าง 'SkillLane' ของตัวเอง...</BreadcrumbPage>
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
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          สร้างธุรกิจ No-Code
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          กลยุทธ์ธุรกิจ
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
                          <span>อ่าน 15 นาที</span>
                        </div>
                        <div className="hidden sm:block">
                          <SocialShare 
                            url={currentUrl}
                            title={articleTitle}
                            description="เรียนรู้วิธีสร้างแพลตฟอร์มขายคอร์สออนไลน์ของตัวเองด้วย No-Code พร้อมพิมพ์เขียวสถาปัตยกรรมและคู่มือลงมือทำ"
                          />
                        </div>
                      </div>

                      {/* Mobile Social Share */}
                      <div className="sm:hidden mb-4">
                        <SocialShare 
                          url={currentUrl}
                          title={articleTitle}
                          description="เรียนรู้วิธีสร้างแพลตฟอร์มขายคอร์สออนไลน์ของตัวเองด้วย No-Code พร้อมพิมพ์เขียวสถาปัตยกรรมและคู่มือลงมือทำ"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                      <img
                        src="/placeholder.svg"
                        alt="Course Platform Dashboard Mockup"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <p className="text-center text-sm text-gray-600 mt-2">
                        ตัวอย่าง Dashboard ของแพลตฟอร์มขายคอร์สออนไลน์ที่สร้างด้วย No-Code
                      </p>
                    </div>

                    {/* Introduction */}
                    <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                      <div className="prose max-w-none prose-lg prose-gray mb-6 sm:mb-8">
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                          คุณมีความรู้ความเชี่ยวชาญที่อยากจะแบ่งปัน แต่ไม่อยากเสียค่าธรรมเนียมแพลตฟอร์ม 
                          <strong> 30-50%</strong> ให้กับ SkillLane หรือ Udemy ใช่ไหม? 
                          จะดีแค่ไหนถ้าคุณสามารถสร้าง <strong>'โรงเรียนออนไลน์'</strong> ที่เป็นของคุณเอง 100%?
                        </p>
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                          ในอดีต โปรเจกต์แบบนี้ต้องใช้เงินทุนหลักล้านและทีมนักพัฒนา... แต่วันนี้ 
                          ด้วยเทคโนโลยี <strong>No-Code</strong> ความฝันนั้นอยู่ในมือคุณแล้ว 
                          บทความนี้คือ <strong>'พิมพ์เขียว'</strong> ฉบับสมบูรณ์ที่จะแสดงให้คุณเห็นว่ามันประกอบด้วยอะไรบ้าง
                        </p>
                      </div>

                      {/* Main Content Sections */}
                      <div className="space-y-8 sm:space-y-12">
                        
                        {/* Section 1: Architecture Overview */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            🏗️ ส่วนที่ 1: ภาพรวมสถาปัตยกรรม (The Architecture)
                          </h2>
                          
                          <div className="mb-6">
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                              หัวใจของการสร้างแพลตฟอร์มคือการทำให้ <strong>3 ส่วนนี้</strong> 
                              ทำงานร่วมกันได้อย่างราบรื่น:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {architectureSteps.map((step, index) => (
                              <div key={index} className="text-center">
                                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center`}>
                                  <step.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                  {step.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {step.description}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                            <div className="flex items-center justify-between text-center">
                              <div className="flex-1">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Globe className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-sm font-medium">Frontend</span>
                              </div>
                              <ArrowRight className="h-6 w-6 text-gray-400 mx-4" />
                              <div className="flex-1">
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <Database className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-sm font-medium">Backend</span>
                              </div>
                              <ArrowRight className="h-6 w-6 text-gray-400 mx-4" />
                              <div className="flex-1">
                                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <CreditCard className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-sm font-medium">Payment</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Backend Database Design */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            🗄️ ส่วนที่ 2: หลังบ้าน - การออกแบบ "ฐานข้อมูล" นักเรียนและคอร์ส
                          </h2>
                          
                          <div className="mb-6">
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                              นี่คือ <strong>'ตู้เก็บเอกสาร'</strong> ของโรงเรียนเรา 
                              เราต้องออกแบบตารางข้อมูลหลักๆ ดังนี้:
                            </p>
                          </div>

                          <div className="space-y-4">
                            {databaseTables.map((table, index) => (
                              <div key={index} className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <table.icon className="h-6 w-6 text-white" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                      {table.name}
                                    </h4>
                                    <p className="text-base text-gray-700 leading-relaxed">
                                      {table.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section 3: Frontend Pages */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            🎨 ส่วนที่ 3: หน้าบ้าน - ประสบการณ์ที่ "นักเรียน" จะได้เห็น
                          </h2>
                          
                          <div className="mb-6">
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                              นี่คือ <strong>'อาคารเรียน'</strong> ที่สวยงามและใช้งานง่าย 
                              เราต้องสร้างหน้าหลักๆ เหล่านี้:
                            </p>
                          </div>

                          <div className="space-y-6">
                            {frontendPages.map((page, index) => (
                              <div key={index} className="border border-gray-200 rounded-xl p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                                  {page.name}
                                </h3>
                                <p className="text-base text-gray-700 mb-4">
                                  {page.description}
                                </p>
                                
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <h4 className="font-bold text-blue-800 mb-2">ฟีเจอร์หลัก:</h4>
                                  <ul className="space-y-1 text-blue-700 text-sm">
                                    {page.features.map((feature, featureIndex) => (
                                      <li key={featureIndex} className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section 4: Payment Integration */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            💳 ส่วนที่ 4: การเงิน - ติดตั้ง "แคชเชียร์" อัตโนมัติ
                          </h2>
                          
                          <div className="mb-6">
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                              เราจะใช้ <strong>Stripe</strong> เพื่อสร้างปุ่ม 'ลงทะเบียนเรียน' สำหรับคอร์สแต่ละตัว 
                              เมื่อมีการชำระเงินสำเร็จ Stripe จะส่งสัญญาณ (Webhook) กลับมาบอกระบบหลังบ้านของเรา
                              ให้อัปเดตตาราง enrollments โดยอัตโนมัติ
                            </p>
                          </div>

                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                            <h4 className="text-lg font-bold text-orange-800 mb-4">
                              🔄 กระบวนการชำระเงินแบบอัตโนมัติ
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                                <span className="text-orange-700">นักเรียนคลิกปุ่ม "ลงทะเบียนเรียน"</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                                <span className="text-orange-700">ระบบพาไป Stripe Checkout</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                                <span className="text-orange-700">ชำระเงินสำเร็จ → Stripe ส่ง Webhook</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs">4</div>
                                <span className="text-orange-700">ระบบอัปเดตตาราง enrollments อัตโนมัติ</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Primary CTA */}
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">
                            🚀 พิมพ์เขียวนี้ดูทรงพลังใช่ไหม? แต่การลงมือสร้างจริงอาจมีรายละเอียดอีกมาก
                          </h3>
                          
                          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-100 text-center max-w-4xl mx-auto leading-relaxed">
                            ไม่ต้องกังวล! คอร์ส <strong>'No-Code Webpreneur'</strong> ของเราไม่ได้สอนแค่สร้างเว็บธรรมดา 
                            แต่มีโปรเจกต์พิเศษท้ายคอร์สที่จะสอนคุณสร้าง <strong>'ระบบสมาชิกและคอร์สเรียนเบื้องต้น'</strong> 
                            ด้วย Lovable และ Supabase ตามพิมพ์เขียวนี้แบบทีละขั้นตอน
                          </p>
                          
                          <div className="bg-white/10 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-bold text-white mb-2">✅ สิ่งที่คุณจะได้เรียน:</h4>
                                <ul className="text-sm text-blue-100 space-y-1">
                                  <li>• การออกแบบฐานข้อมูลสำหรับคอร์ส</li>
                                  <li>• สร้างหน้าขายและระบบชำระเงิน</li>
                                  <li>• ระบบสมาชิกและการจัดการเนื้อหา</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-bold text-white mb-2">🎯 โปรเจกต์จริงที่จะสร้าง:</h4>
                                <ul className="text-sm text-blue-100 space-y-1">
                                  <li>• แพลตฟอร์มขายคอร์สเบื้องต้น</li>
                                  <li>• ระบบจัดการนักเรียนและคอร์ส</li>
                                  <li>• การเชื่อมต่อ Stripe Payment</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black font-bold px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl w-full sm:w-auto">
                              <Link to="/no-code-webpreneur">
                                <Zap className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="hidden sm:inline">เรียนรู้วิธีสร้างแพลตฟอร์มของคุณเอง</span>
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
                              📚 สร้างแ���ลตฟอร์มเป็นก้าวแรก... แต่การสร้าง "คอร์สที่ดี" และ "การตลาดที่ยอดเยี่ยม" คือก้าวต่อไป
                            </h3>
                            
                            <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                              สมัคร <strong>Begins.guide PRO</strong> เพื่อเข้าถึงทุกคอร์ส, AI ช่วยสร้างเนื้อหาคอร์ส, 
                              และเรียนรู้กลยุทธ์การตลาดจาก Community ของเรา
                            </p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <h4 className="font-bold text-gray-900 mb-1">เข้าถึงทุกคอร์ส</h4>
                                <p className="text-sm text-gray-600">คอร์สสร้างธุรกิจครบครัน</p>
                              </div>
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                                <h4 className="font-bold text-gray-900 mb-1">AI ช่วยสร้างเนื้อหา</h4>
                                <p className="text-sm text-gray-600">เครื่องมือ AI สำหรับคอร์ส</p>
                              </div>
                              <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <h4 className="font-bold text-gray-900 mb-1">Community PRO</h4>
                                <p className="text-sm text-gray-600">เครือข่ายผู้ประกอบการ</p>
                              </div>
                            </div>
                            
                            <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto">
                              <Link to="/pricing">
                                <Crown className="mr-2 h-5 w-5" />
                                <span className="hidden sm:inline">สร้างธุรกิจคอร์สออนไลน์ให้สมบูรณ์ด้วย PRO</span>
                                <span className="sm:hidden">อัปเกรดเป็น PRO</span>
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
                            ทีมผู้เชี่ยวชาญด้านการสร้างแพลตฟอร์มดิจิทัลและธุรกิจออนไลน์ 
                            ที่มีประสบการณ์ในการสร้างระบบขายคอร์สและสินค้าดิจิทัลมากกว่า 50+ โปรเจกต์
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
                    currentSlug="how-to-build-course-platform-with-nocode" 
                    category="สร้างธุรกิจ No-Code"
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
                        <a href="#architecture" className="block text-purple-600 hover:text-purple-800">ภาพรวมสถาปัตยกรรม</a>
                        <a href="#backend" className="block text-green-600 hover:text-green-800">การออกแบบฐานข้อมูล</a>
                        <a href="#frontend" className="block text-blue-600 hover:text-blue-800">หน้าบ้านและ UX</a>
                        <a href="#payment" className="block text-orange-600 hover:text-orange-800">ระบบชำระเงิน</a>
                        <a href="#course" className="block text-red-600 hover:text-red-800">คอร์ส No-Code</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Course CTA */}
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        พร้อมสร้างแพลตฟอร์ม?
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เรียนรู้การสร้างแพลตฟอร์มจริงในคอร์ส
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

export default HowToBuildCoursePlatformArticle;
