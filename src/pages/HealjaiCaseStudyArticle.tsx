
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight, Users, Database, DollarSign, Target, ExternalLink, Zap, Shield, CheckCircle, Workflow } from 'lucide-react';
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

const HealjaiCaseStudyArticle = () => {
  const currentUrl = window.location.href;
  const articleTitle = "Case Study: ผมสร้างเว็บแอป \"แมชชิ่งนักบำบัด\" (healjai.me) ใน 15 วันด้วย No-Code ได้อย่างไร";

  const techStack = [
    {
      name: "Lovable",
      role: "Frontend & Full-Stack Development",
      description: "สร้าง UI/UX และระบบ Authentication",
      icon: Zap
    },
    {
      name: "Supabase",
      role: "Backend & Database",
      description: "จัดการฐานข้อมูลและ Authentication",
      icon: Database
    },
    {
      name: "Stripe Connect",
      role: "Payment Processing",
      description: "จัดการเงินระหว่างแพลตฟอร์มและนักบำบัด",
      icon: DollarSign
    }
  ];

  const databaseTables = [
    {
      name: "therapists",
      description: "เก็บข้อมูลโปรไฟล์นักบำบัด, ใบรับรอง, ความเชี่ยวชาญ",
      fields: "id, name, specialization, certification, hourly_rate, bio"
    },
    {
      name: "clients", 
      description: "ข้อมูลผู้รับบริการและความต้องการ",
      fields: "id, name, email, preferences, booking_history"
    },
    {
      name: "appointments",
      description: "ตารางนัดหมายที่เชื่อมโยง therapist กับ client",
      fields: "id, therapist_id, client_id, datetime, status, payment_status"
    },
    {
      name: "reviews",
      description: "ระบบรีวิวและคะแนนประเมิน",
      fields: "id, appointment_id, rating, comment, created_at"
    }
  ];

  const userFlows = [
    {
      type: "Client Journey",
      steps: ["ค้นหานักบำบัด", "ดูโปรไฟล์และรีวิว", "เลือกเวลานัดหมาย", "ชำระเงิน", "รับบริการ", "ให้คะแนน"],
      color: "blue"
    },
    {
      type: "Therapist Journey", 
      steps: ["สมัครสมาชิก", "สร้างโปรไฟล์", "อัปโหลดใบรับรอง", "จัดการตารางเวลา", "รับงาน", "รับเงิน"],
      color: "green"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Case Study: สร้างเว็บแอป "แมชชิ่งนักบำบัด" (healjai.me) ใน 15 วันด้วย No-Code | Begins.guide</title>
        <meta name="description" content="เรียนรู้วิธีสร้างแพลตฟอร์มสองด้าน (Two-Sided Marketplace) ที่ซับซ้อนด้วย No-Code ใน 15 วัน พร้อมระบบการเงินและ Authentication แบบ Professional" />
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
                    <BreadcrumbPage className="hidden sm:block">สร้างเว็บแอปแมชชิ่งนักบำบัด...</BreadcrumbPage>
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
                          Case Study
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          สร้างธุรกิจ No-Code
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Platform Business
                        </Badge>
                      </div>
                      
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                        {articleTitle}
                      </h1>
                      
                      {/* Article Metadata */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="hidden sm:inline">ทีมงาน Begins.guide</span>
                          <span className="sm:hidden">Begins.guide</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline">เผยแพร่เมื่อ 23 มิถุนายน 2025</span>
                          <span className="sm:hidden">23 มิ.ย. 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>อ่าน 14 นาที</span>
                        </div>
                        <div className="hidden sm:block">
                          <SocialShare 
                            url={currentUrl}
                            title={articleTitle}
                            description="เรียนรู้วิธีสร้างแพลตฟอร์มสองด้านที่ซับซ้อนด้วย No-Code ใน 15 วัน"
                          />
                        </div>
                      </div>

                      {/* Mobile Social Share */}
                      <div className="sm:hidden mb-4">
                        <SocialShare 
                          url={currentUrl}
                          title={articleTitle}
                          description="เรียนรู้วิธีสร้างแพลตฟอร์มสองด้านที่ซับซ้อนด้วย No-Code ใน 15 วัน"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                      <img
                        src="/placeholder.svg"
                        alt="Healjai.me Platform Screenshot"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <p className="text-center text-sm text-gray-600 mt-2">
                        Mockup ของแพลตฟอร์ม healjai.me ที่สร้างเสร็จใน 15 วัน
                      </p>
                    </div>

                    {/* Introduction */}
                    <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                      <div className="prose max-w-none prose-lg prose-gray mb-6 sm:mb-8">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-4 sm:p-6 rounded-r-lg mb-6 sm:mb-8">
                          <h3 className="text-lg sm:text-xl font-bold text-purple-900 mb-3">
                            🎯 The Mission
                          </h3>
                          <p className="text-base sm:text-lg text-purple-800">
                            ในยุคที่ผู้คนให้ความสำคัญกับสุขภาพจิตมากขึ้น แต่การเข้าถึงนักบำบัดที่เหมาะสมยังคงเป็นเรื่องยากและน่ากังวล 
                            ผมจึงตั้งเป้าหมายที่จะสร้าง <strong>"สะพาน"</strong> ที่เชื่อมต่อระหว่างผู้ที่ต้องการความช่วยเหลือ
                            กับผู้เชี่ยวชาญให้ง่ายขึ้น
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-yellow-50 border-l-4 border-green-500 p-4 sm:p-6 rounded-r-lg mb-6 sm:mb-8">
                          <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-3">
                            🚀 The Challenge & The Proof
                          </h3>
                          <p className="text-base sm:text-lg text-green-800 mb-4">
                            โจทย์ที่ท้าทายคือการสร้าง <strong>"แพลตฟอร์มสองด้าน (Two-Sided Marketplace)"</strong> 
                            ที่มีระบบสำหรับทั้ง "ผู้รับบริการ" และ "นักบำบัด" ให้เกิดขึ้นจริงในเวลาอันสั้น...
                          </p>
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <p className="text-green-900 font-semibold mb-2">และนี่คือผลลัพธ์ที่สร้างเสร็จใน 15 วัน:</p>
                            <div className="flex items-center gap-2 text-blue-600">
                              <ExternalLink className="h-4 w-4" />
                              <a href="https://healjai.me" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">
                                www.healjai.me
                              </a>
                              <span className="text-gray-600 text-sm">(คลิกเพื่อดูและทดลองใช้งานจริง)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack Section */}
                      <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                          Tech Stack ที่ใช้งาน
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                          {techStack.map((tech, index) => (
                            <div key={index} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <tech.icon className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-lg">{tech.name}</h3>
                              </div>
                              <p className="text-sm text-blue-600 font-medium mb-2">{tech.role}</p>
                              <p className="text-sm text-gray-600">{tech.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Architecture Section */}
                      <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                          ส่วนที่ 1: สถาปัตยกรรมของ "ตลาด" สองด้าน
                        </h2>
                        
                        <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                          หัวใจของเว็บประเภทนี้คือการออกแบบประสบการณ์สำหรับผู้ใช้ 2 กลุ่มที่แตกต่างกันโดยสิ้นเชิง
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {userFlows.map((flow, index) => (
                            <div key={index} className={`border rounded-xl p-4 sm:p-6 ${
                              flow.color === 'blue' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                            }`}>
                              <h3 className={`text-xl font-bold mb-4 ${
                                flow.color === 'blue' ? 'text-blue-900' : 'text-green-900'
                              }`}>
                                <Workflow className="inline mr-2 h-5 w-5" />
                                {flow.type}
                              </h3>
                              <div className="space-y-3">
                                {flow.steps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                      flow.color === 'blue' ? 'bg-blue-600' : 'bg-green-600'
                                    }`}>
                                      {stepIndex + 1}
                                    </div>
                                    <span className="text-sm sm:text-base text-gray-700">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Database Section */}
                      <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                          ส่วนที่ 2: การออกแบบฐานข้อมูลที่ซับซ้อนขึ้น (Supabase)
                        </h2>
                        
                        <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                          เราต้องมีตารางข้อมูลที่รองรับความสัมพันธ์ที่ซับซ้อนขึ้น เพื่อจัดการกับการทำงานของแพลตฟอร์มสองด้าน
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          {databaseTables.map((table, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                              <h3 className="font-bold text-lg mb-2 text-gray-900 flex items-center gap-2">
                                <Database className="h-5 w-5 text-gray-600" />
                                {table.name}
                              </h3>
                              <p className="text-sm sm:text-base text-gray-700 mb-3">{table.description}</p>
                              <div className="bg-white rounded-md p-3 border">
                                <code className="text-xs sm:text-sm text-blue-600 font-mono">
                                  {table.fields}
                                </code>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Frontend Section */}
                      <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                          ส่วนที่ 3: สร้างสองประสบการณ์ในเว็บเดียว (Lovable)
                        </h2>
                        
                        <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed">
                          เราใช้ Lovable เพื่อสร้างหน้าตาที่แตกต่างกันสำหรับผู้ใช้แต่ละประเภท โดยใช้ระบบ Authentication และ Role-based Access Control
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">
                              สำหรับ Client (ผู้รับบริการ)
                            </h3>
                            <div className="space-y-3">
                              <div className="bg-white rounded-md p-3">
                                <img src="/placeholder.svg" alt="Client Interface" className="w-full rounded" />
                                <p className="text-sm text-gray-600 mt-2">หน้าค้นหาที่มี Filter ตามความเชี่ยวชาญ</p>
                              </div>
                              <ul className="text-sm space-y-1 text-blue-800">
                                <li>• ระบบค้นหาและกรองนักบำบัด</li>
                                <li>• หน้าโปรไฟล์พร้อมรีวิว</li>
                                <li>• ระบบจองคิวออนไลน์</li>
                                <li>• ชำระเงินผ่าน Stripe</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                            <h3 className="text-xl font-bold text-green-900 mb-4">
                              สำหรับ Therapist (นักบำบัด)
                            </h3>
                            <div className="space-y-3">
                              <div className="bg-white rounded-md p-3">
                                <img src="/placeholder.svg" alt="Therapist Dashboard" className="w-full rounded" />
                                <p className="text-sm text-gray-600 mt-2">Dashboard ส่วนตัวสำหรับจัดการงาน</p>
                              </div>
                              <ul className="text-sm space-y-1 text-green-800">
                                <li>• สร้างและแก้ไขโปรไฟล์</li>
                                <li>• จัดการตารางเวลาว่าง</li>
                                <li>• ดูรายการนัดหมาย</li>
                                <li>• ติดตามรายได้ผ่าน Stripe</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment System Section */}
                      <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                          ส่วนที่ 4: ระบบการเงินที่ชาญฉลาด (Stripe Connect)
                        </h2>
                        
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 sm:p-6 lg:p-8">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-yellow-500 rounded-lg flex-shrink-0">
                              <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-yellow-900 mb-3">
                                ระบบจัดการเงินอัตโนมัติ
                              </h3>
                              <p className="text-base sm:text-lg text-yellow-800 mb-4 leading-relaxed">
                                เราใช้ฟีเจอร์ขั้นสูงอย่าง <strong>Stripe Connect</strong> เพื่อจัดการเรื่องเงินได้อย่างอัตโนมัติ 
                                เมื่อลูกค้าจ่ายเงินเข้ามา ระบบจะสามารถ <strong>"หักค่าธรรมเนียมแพลตฟอร์ม"</strong> (Platform Fee) 
                                และจ่ายเงินส่วนที่เหลือให้กับ "นักบำบัด" ได้โดยตรง
                              </p>
                              
                              <div className="bg-white rounded-lg p-4 border border-yellow-300">
                                <h4 className="font-semibold mb-3">Money Flow Process:</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                    <span>ลูกค้าจ่ายเงิน 1,000 บาท</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                    <span>ระบบหัก Platform Fee 15% (150 บาท)</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                    <span>นักบำบัดได้รับ 850 บาท โดยอัตโนมัติ</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Business Model Section */}
                      <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                          จาก "โปรเจกต์" สู่ "แพลตฟอร์ม" ที่สร้างรายได้และผลกระทบเชิงบวก
                        </h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                              <Target className="h-5 w-5" />
                              โมเดลรายได้ (Revenue Model)
                            </h3>
                            <p className="text-base text-green-800 leading-relaxed">
                              รายได้หลักของแพลตฟอร์มมาจาก <strong>"ค่าธรรมเนียมบริการ" (Platform Fee) 15-20%</strong> 
                              จากทุกๆ การนัดหมายที่เกิดขึ้น ซึ่งเป็นโมเดลที่ยั่งยืนและเติบโตได้ตามการใช้งาน
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              ผลกระทบ (The Impact)
                            </h3>
                            <p className="text-base text-blue-800 leading-relaxed">
                              นอกเหนือจากรายได้ โปรเจกต์นี้ยังช่วยให้การเข้าถึงบริการสุขภาพจิตเป็นเรื่องง่ายขึ้น 
                              สร้างผลกระทบที่ดีต่อสังคมและเป็นตัวอย่างของ <strong>"Social Impact Platform"</strong>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Strategic CTAs */}
                      <div className="space-y-8 sm:space-y-12">
                        {/* CTA 1: For DIY-ers */}
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
                            คุณก็สร้าง "แพลตฟอร์ม" ในฝันของคุณได้ ไม่ว่าจะเป็นธุรกิจอะไรก็ตาม
                          </h3>
                          
                          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-purple-100 leading-relaxed">
                            หลักการสร้างแพลตฟอร์มสองด้านนี้ สามารถนำไปปรับใช้ได้กับธุรกิจอื่นๆ อีกมากมาย 
                            ไม่ว่าจะเป็นเว็บจับคู่ติวเตอร์, แพลตฟอร์มหาฟรีแลนซ์, หรือตลาดสำหรับงานฝีมือ... 
                            คอร์ส <strong>'No-Code Webpreneur'</strong> ของเราจะมอบทักษะพื้นฐานที่แข็งแกร่งในการใช้ 
                            Lovable และ Supabase ซึ่งเป็นหัวใจสำคัญของโปรเจกต์นี้
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8 text-left">
                            <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                              <h5 className="font-bold mb-2">🔧 Technical Skills</h5>
                              <p className="text-xs sm:text-sm text-purple-100">เรียนรู้ Lovable, Supabase และ Authentication</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                              <h5 className="font-bold mb-2">💰 Payment Systems</h5>
                              <p className="text-xs sm:text-sm text-purple-100">การใช้ Stripe Connect สำหรับ Marketplace</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                              <h5 className="font-bold mb-2">📊 Business Model</h5>
                              <p className="text-xs sm:text-sm text-purple-100">วิธีสร้างรายได้จาก Platform Fee</p>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl w-full sm:w-auto">
                              <Link to="/no-code-webpreneur">
                                <span className="hidden sm:inline">เรียนรู้ทักษะพื้นฐานเพื่อสร้างแพลตฟอร์ม</span>
                                <span className="sm:hidden">เรียนรู้สร้างแพลตฟอร์ม</span>
                                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {/* CTA 2: For High-Ticket Clients */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">
                            มีไอเดียแพลตฟอร์มที่ซับซ้อน แต่ไม่รู้จะเริ่มต้นอย่างไร?
                          </h3>
                          
                          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
                            การสร้างแพลตฟอร์มสองด้านมีรายละเอียดที่ต้องใส่ใจอย่างยิ่ง หากคุณมีวิสัยทัศน์ที่ชัดเจน
                            แต่ต้องการทีมผู้เชี่ยวชาญมาทำให้เป็นจริง บริการ <strong>'MVP Launchpad'</strong> 
                            ของเราพร้อมเปลี่ยนไอเดียของคุณให้เป็นผลิตภัณฑ์ที่ใช้งานได้จริง
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8 text-left">
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                              <h5 className="font-bold mb-2 text-yellow-400">⚡ Fast Track</h5>
                              <p className="text-xs sm:text-sm text-gray-300">สร้าง MVP ใน 30-45 วัน</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                              <h5 className="font-bold mb-2 text-yellow-400">👥 Expert Team</h5>
                              <p className="text-xs sm:text-sm text-gray-300">ทีมผู้เชี่ยวชาญ Full-Stack</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                              <h5 className="font-bold mb-2 text-yellow-400">🚀 Production Ready</h5>
                              <p className="text-xs sm:text-sm text-gray-300">พร้อมใช้งานจริงทันที</p>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black font-bold px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl w-full sm:w-auto">
                              <Link to="/services/mvp-launchpad">
                                <span className="hidden sm:inline">ปรึกษาโปรเจกต์แพลตฟอร์มของคุณ</span>
                                <span className="sm:hidden">ปรึกษาโปรเจกต์</span>
                                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
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
                            ทีมผู้เชี่ยวชาญด้าน No-Code Development และการสร้างแพลตฟอร์มธุรกิจ 
                            ที่มีประสบการณ์ในการสร้างโซลูชันที่แก้ปัญหาจริงสำหรับสังคม
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/articles">บทความทั้งหมด</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/no-code-webpreneur">คอร์ส No-Code</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  <RelatedPosts 
                    currentSlug="case-study-healjai-me-matching-platform-15-days" 
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
                        <a href="#introduction" className="block text-blue-600 hover:text-blue-800">บทนำ</a>
                        <a href="#tech-stack" className="block text-blue-600 hover:text-blue-800">Tech Stack</a>
                        <a href="#architecture" className="block text-blue-600 hover:text-blue-800">สถาปัตยกรรมแพลตฟอร์ม</a>
                        <a href="#database" className="block text-blue-600 hover:text-blue-800">การออกแบบฐานข้อมูล</a>
                        <a href="#frontend" className="block text-blue-600 hover:text-blue-800">Frontend Development</a>
                        <a href="#payment" className="block text-blue-600 hover:text-blue-800">ระบบการเงิน</a>
                        <a href="#business-model" className="block text-blue-600 hover:text-blue-800">Business Model</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Access */}
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        ต้องการสร้างแพลตฟอร์มเหมือนกัน?
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เรียนรู้ทักษะ No-Code หรือให้เราช่วยสร้างให้
                      </p>
                      <Button asChild size="sm" className="w-full bg-purple-600 hover:bg-purple-700 mb-2">
                        <Link to="/no-code-webpreneur">
                          เรียนรู้ No-Code
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link to="/services/mvp-launchpad">
                          บริการ Done-For-You
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

export default HealjaiCaseStudyArticle;
