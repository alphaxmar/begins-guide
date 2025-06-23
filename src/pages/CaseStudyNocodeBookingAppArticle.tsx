
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight, CheckCircle, ExternalLink, Calendar, Coffee, Zap, Target, Crown, Database, Code, TrendingUp } from 'lucide-react';
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

const CaseStudyNocodeBookingAppArticle = () => {
  const currentUrl = window.location.href;
  const articleTitle = 'Case Study: ผมสร้างเว็บแอปจองคิวร้านกาแฟด้วย No-Code ใน 7 วันได้อย่างไร';

  const dailyProgress = [
    {
      day: 1,
      title: "วางแผนและออกแบบ (The Blueprint)",
      description: "ขั้นตอนแรกไม่ใช่การลงมือทำ แต่คือการวาดภาพในหัวให้ชัด",
      details: "ใช้เวลาทั้งวันในการทำความเข้าใจปัญหาของร้านกาแฟ วาด User Flow และ Wireframe ง่ายๆ ของระบบจองคิว",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      day: 2,
      title: "สร้างฐานข้อมูลหลังบ้าน (The Database)",
      description: "หัวใจของแอปคือข้อมูล",
      details: "สร้างตาราง Airtable สำหรับเก็บข้อมูล Bookings, Customers, และ TimeSlots พร้อมกำหนด Field ต่างๆ ที่จำเป็น",
      icon: Database,
      color: "from-green-500 to-teal-500"
    },
    {
      day: 3,
      title: "ต่อยอดฐานข้อมูลและ Logic",
      description: "ทำให้ข้อมูลเชื่อมโยงกัน",
      details: "ตั้งค่า Relationship ระหว่างตาราง สร้าง Formula สำหรับการตรวจสอบช่วงเวลาที่ว่าง และทดสอบการทำงาน",
      icon: Code,
      color: "from-purple-500 to-pink-500"
    },
    {
      day: 4,
      title: "ประกอบร่างหน้าเว็บด้วย Lovable (Day 1)",
      description: "นี่คือช่วงเวลาที่สนุกที่สุด เหมือนการต่อเลโก้",
      details: "เริ่มสร้างหน้าเว็บด้วย Lovable ออกแบบ UI สำหรับหน้าแรก หน้าเลือกวันเวลา และหน้ากรอกข้อมูลลูกค้า",
      icon: Coffee,
      color: "from-orange-500 to-red-500"
    },
    {
      day: 5,
      title: "เชื่อมต่อ Frontend กับ Database",
      description: "ให้เว็บไซต์สื่อสารกับฐานข้อมูลได้",
      details: "เชื่อมต่อ Lovable กับ Airtable API ทำให้สามารถดึงข้อมูลช่วงเวลาที่ว่าง และบันทึกการจองใหม่ได้",
      icon: Zap,
      color: "from-indigo-500 to-purple-500"
    },
    {
      day: 6,
      title: "ทดสอบและสร้างระบบอัตโนมัติ",
      description: "ทำให้แอปฉลาดขึ้นอีกนิด",
      details: "ใช้ Zapier เชื่อมต่อ Airtable กับ Email เพื่อส่งอีเมลยืนยันการจองโดยอัตโนมัติ และทดสอบระบบทั้งหมด",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500"
    },
    {
      day: 7,
      title: "เปิดตัวและสรุปผล (The Launch)",
      description: "โปรเจกต์สำเร็จภายใน 7 วันตามเป้าหมาย!",
      details: "Deploy เว็บไซต์ขึ้น Production ทดสอบกับผู้ใช้จริง และสรุปผลการทำงานทั้งหมด",
      icon: TrendingUp,
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const costBreakdown = [
    {
      item: "Lovable Pro Plan",
      cost: "800 บาท/เดือน",
      description: "สำหรับสร้างเว็บไซต์และ Deploy"
    },
    {
      item: "Airtable",
      cost: "ฟรี",
      description: "ใช้แผนฟรีสำหรับฐานข้อมูล"
    },
    {
      item: "Zapier",
      cost: "ฟรี",
      description: "ใช้แผนฟรีสำหรับ Automation"
    },
    {
      item: "Domain Name",
      cost: "300 บาท/ปี",
      description: "ค่าโดเมนสำหรับเว็บไซต์"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Case Study: ผมสร้างเว็บแอปจองคิวร้านกาแฟด้วย No-Code ใน 7 วันได้อย่างไร | Begins.guide</title>
        <meta name="description" content="เรื่องราวจริงของการสร้างเว็บแอปจองคิวสำหรับร้านกาแฟด้วยเครื่องมือ No-Code ภายใน 7 วัน พร้อมต้นทุนและผลลัพธ์จริง" />
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
                    <BreadcrumbPage className="hidden sm:block">Case Study: สร้างเว็บแอปจองคิว...</BreadcrumbPage>
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
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Case Study
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          สร้างธุรกิจ No-Code
                        </Badge>
                      </div>
                      
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                        {articleTitle}
                        <span className="block text-lg sm:text-xl text-gray-600 font-normal mt-2">
                          (พร้อมผลลัพธ์และต้นทุนทั้งหมด)
                        </span>
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
                          <span>อ่าน 10 นาที</span>
                        </div>
                        <div className="hidden sm:block">
                          <SocialShare 
                            url={currentUrl}
                            title={articleTitle}
                            description="เรื่องราวจริงของการสร้างเว็บแอปจองคิวสำหรับร้านกาแฟด้วยเครื่องมือ No-Code ภายใน 7 วัน พร้อมต้นทุนและผลลัพธ์จริง"
                          />
                        </div>
                      </div>

                      {/* Mobile Social Share */}
                      <div className="sm:hidden mb-4">
                        <SocialShare 
                          url={currentUrl}
                          title={articleTitle}
                          description="เรื่องราวจริงของการสร้างเว็บแอปจองคิวสำหรับร้านกาแฟด้วยเครื่องมือ No-Code ภายใน 7 วัน พร้อมต้นทุนและผลลัพธ์จริง"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                      <img
                        src="/placeholder.svg"
                        alt="No-Code cafe booking app mockup"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <p className="text-center text-sm text-gray-600 mt-2">
                        ภาพ Mockup ของเว็บแอปจองคิวร้านกาแฟที่สร้างด้วย No-Code
                      </p>
                    </div>

                    {/* Introduction */}
                    <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                      <div className="prose max-w-none prose-lg prose-gray mb-6 sm:mb-8">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 mb-6">
                          <h3 className="text-xl font-bold text-blue-800 mb-3">🎯 ความท้าทายที่ตั้งไว้</h3>
                          <p className="text-gray-700 mb-3">
                            เพื่อพิสูจน์ว่าคนธรรมดาที่เขียนโค้ดไม่เป็น สามารถสร้างธุรกิจดิจิทัลที่ใช้งานได้จริง ผมจึงท้าทายตัวเองด้วยโปรเจกต์:
                          </p>
                          <p className="text-gray-900 font-bold text-lg mb-0">
                            <strong>"สร้างเว็บแอปจองคิวสำหรับร้านกาแฟขึ้นมาให้เสร็จภายใน 7 วัน"</strong> โดยใช้เครื่องมือ No-Code 100%
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 mb-6">
                          <h3 className="text-xl font-bold text-orange-800 mb-3">☕ ปัญหาที่ต้องแก้</h3>
                          <p className="text-gray-700 mb-0">
                            โจทย์คือการแก้ปัญหาร้านกาแฟเล็กๆ ที่ยังรับคิวผ่านการจดบนกระดาษหรือตอบ LINE 
                            ซึ่งวุ่นวายและจัดการยาก ทำให้เกิดการสับสนและลูกค้าไม่พอใจ
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                          <h3 className="text-xl font-bold text-green-800 mb-3">🛠️ เครื่องมือที่เลือกใช้</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="bg-white rounded-lg p-3 shadow-sm border">
                                <h4 className="font-bold text-purple-600">Lovable</h4>
                                <p className="text-sm text-gray-600">สร้างหน้าเว็บ</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-white rounded-lg p-3 shadow-sm border">
                                <h4 className="font-bold text-green-600">Airtable</h4>
                                <p className="text-sm text-gray-600">จัดการฐานข้อมูล</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-white rounded-lg p-3 shadow-sm border">
                                <h4 className="font-bold text-blue-600">Zapier</h4>
                                <p className="text-sm text-gray-600">เชื่อมต่อระบบ</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Content Sections */}
                      <div className="space-y-8 sm:space-y-12">
                        
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

                        {/* Business Breakdown Section */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            💰 แล้วโปรเจกต์นี้...สร้างเป็นธุรกิจได้อย่างไร?
                          </h2>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                              <h3 className="text-xl font-bold mb-4 text-red-600">ต้นทุนทั้งหมด (The Cost)</h3>
                              <div className="space-y-4">
                                {costBreakdown.map((item, index) => (
                                  <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-bold text-gray-900">{item.item}</h4>
                                      <span className="font-bold text-green-600">{item.cost}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                  </div>
                                ))}
                                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 border-2 border-green-300">
                                  <p className="text-lg font-bold text-green-800">
                                    💡 สรุป: เริ่มต้นได้ด้วยเงินไม่ถึง 1,500 บาท!
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-bold mb-4 text-green-600">ศักยภาพในการสร้างรายได้</h3>
                              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                                <p className="text-gray-700 mb-4">
                                  คุณสามารถนำโมเดลนี้ไปเสนอขายให้:
                                </p>
                                <ul className="text-gray-700 space-y-2 mb-4">
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>ร้านกาแฟ</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>ร้านทำผม</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>คลินิก</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>ธุรกิจบริการอื่นๆ</span>
                                  </li>
                                </ul>
                                <div className="bg-white rounded-lg p-4 border">
                                  <p className="text-lg font-bold text-green-600">
                                    💰 ราคา: 10,000 - 15,000 บาท/ปี
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    แพ็กเกจเว็บไซต์พร้อมระบบนัดหมายรายปี
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Main CTA Section */}
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">
                            🚀 คุณก็ทำได้เหมือนกัน และนี่คือเส้นทางลัดสู่ความสำเร็จ
                          </h3>
                          
                          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-100 text-center max-w-4xl mx-auto leading-relaxed">
                            เรื่องราวทั้งหมดนี้ไม่ใช่เวทมนตร์ แต่เป็น <strong>'ทักษะ'</strong> ที่เรียนรู้และทำซ้ำได้ 
                            คอร์ส <strong>'No-Code Webpreneur'</strong> ของเราคือคู่มือฉบับละเอียด ที่จะสอนคุณทุกขั้นตอนที่ผมทำใน Case Study นี้
                          </p>
                          
                          <div className="bg-white/10 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <h4 className="font-bold text-white mb-3">✅ สิ่งที่คุณจะได้เรียน:</h4>
                                <ul className="text-sm sm:text-base text-blue-100 space-y-2">
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-300 flex-shrink-0" />
                                    <span>การใช้ <strong>Lovable</strong> สร้างเว็บไซต์มืออาชีพ</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-300 flex-shrink-0" />
                                    <span>การเชื่อมต่อ <strong>ฐานข้อมูล</strong> และจัดการข้อมูล</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-300 flex-shrink-0" />
                                    <span>การสร้าง <strong>ระบบอัตโนมัติ</strong> ด้วย Zapier</span>
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-300 flex-shrink-0" />
                                    <span>การหา <strong>ลูกค้าคนแรก</strong> และขายบริการ</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black font-bold px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl w-full sm:w-auto">
                              <Link to="/no-code-webpreneur">
                                <Code className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="hidden sm:inline">เรียนรู้วิธีสร้างแบบนี้ด้วยตัวเอง</span>
                                <span className="sm:hidden">เรียนคอร์ส No-Code</span>
                                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                              </Link>
                            </Button>
                          </div>
                        </div>

                        {/* Secondary CTA - MVP Launchpad */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-blue-200">
                          <div className="text-center">
                            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">
                              🤔 หรือถ้าคุณมีไอเดียที่ใหญ่กว่านั้น แต่ไม่มีเวลาลงมือทำ?
                            </h3>
                            
                            <p className="text-base text-gray-700 mb-6 max-w-2xl mx-auto">
                              ให้ทีมงานของเราช่วยสร้าง MVP ให้คุณ เราพร้อมรับพัฒนาโปรเจกต์ที่ซับซ้อนกว่านี้
                            </p>
                            
                            <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto">
                              <Link to="/services/mvp-launchpad">
                                <Target className="mr-2 h-5 w-5" />
                                <span className="hidden sm:inline">ให้ทีมงานสร้าง MVP ให้คุณ</span>
                                <span className="sm:hidden">สร้าง MVP ให้</span>
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
                            ทีมผู้เชี่ยวชาญด้านการสร้างธุรกิจดิจิทัลด้วย No-Code Tools 
                            ที่มีประสบการณ์ในการพัฒนาโซลูชั่นสำหรับธุรกิจต่างๆ มากกว่า 100+ โปรเจกต์
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/no-code-webpreneur">เรียนคอร์ส No-Code</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/services/mvp-launchpad">ปรึกษาโปรเจกต์</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  <RelatedPosts 
                    currentSlug="case-study-nocode-cafe-booking-app-7-days" 
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
                        <a href="#challenge" className="block text-blue-600 hover:text-blue-800">ความท้าทาย</a>
                        <a href="#daily-progress" className="block text-green-600 hover:text-green-800">บันทึก 7 วัน</a>
                        <a href="#business-model" className="block text-purple-600 hover:text-purple-800">โมเดลธุรกิจ</a>
                        <a href="#course-cta" className="block text-orange-600 hover:text-orange-800">เรียนรู้ด้วยตัวเอง</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* No-Code Course CTA */}
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        พร้อมสร้างแอปของคุณ?
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เรียนรู้การสร้างเว็บแอปด้วย No-Code
                      </p>
                      <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700 mb-2">
                        <Link to="/no-code-webpreneur">
                          <Code className="mr-2 h-4 w-4" />
                          No-Code Course
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link to="/services/mvp-launchpad">
                          <Target className="mr-2 h-4 w-4" />
                          สร้าง MVP ให้
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

export default CaseStudyNocodeBookingAppArticle;
