
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight, CheckCircle, Target, Users, TrendingUp, MessageCircle, Globe, Zap } from 'lucide-react';
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

const OrganicMarketingArticle = () => {
  const currentUrl = window.location.href;
  const articleTitle = "วิธีหาลูกค้า 100 คนแรก แบบไม่ต้องยิงแอด (คู่มือฉบับสมบูรณ์สำหรับธุรกิจใหม่)";

  const marketingStrategies = [
    {
      id: 1,
      title: "เปิดตัวกับคนใกล้ตัว",
      subtitle: "(The \"Inner Circle\" Launch)",
      icon: Users,
      description: "วิธีการนำเสนอสินค้าให้เพื่อน, ครอบครัว, หรือคนรู้จัก ไม่ใช่เพื่อ \"ขาย\" แต่เพื่อ \"ขอ Feedback\" และเปลี่ยนพวกเขาให้เป็น \"ผู้บอกต่อ\" กลุ่มแรก",
      actionStep: "ใช้สคริปต์ง่ายๆ: \"สวัสดีครับ/ค่ะ ผม/ดิฉันกำลังสร้างผลิตภัณฑ์ใหม่ที่ช่วย [แก้ปัญหาอะไร] อยากขอความคิดเห็นจากคุณหน่อยได้ไหม มีเวลาดู 5 นาทีไหม?\"",
      tips: [
        "เน้น \"ขอคำแนะนำ\" มากกว่า \"ขาย\"",
        "เสนอให้ทดลองใช้ฟรีแลกกับ Feedback",
        "ขอให้แนะนำคนที่อาจสนใจต่อ"
      ]
    },
    {
      id: 2,
      title: "เข้าไปอยู่ในที่ที่ลูกค้าอยู่",
      subtitle: "(Community Participation)",
      icon: MessageCircle,
      description: "การเข้าไปมีส่วนร่วมอย่างมีคุณค่าใน Facebook Group, เว็บบอร์ด, หรือกลุ่มเฉพาะทางที่กลุ่มเป้าหมายของคุณอยู่ โดยเน้น \"การให้\" ก่อน \"การรับ\"",
      actionStep: "ค้นหากลุ่ม Facebook ด้วยคำค่นหา \"[กลุ่มเป้าหมาย] + ไทย\" เช่น \"ผู้ประกอบการ ไทย\" หรือ \"คนขายของออนไลน์\" จากนั้นโพสต์เนื้อหาที่ช่วยเหลือคนอื่นเป็นประจำ",
      tips: [
        "ตอบคำถามคนอื่นอย่างละเอียดและเป็นประโยชน์",
        "แชร์ประสบการณ์หรือเคล็ดลับโดยไม่หวังผลตอบแทน",
        "เมื่อสร้างความน่าเชื่อถือแล้ว ค่อยแนะนำสินค้าอย่างธรรมชาติ"
      ]
    },
    {
      id: 3,
      title: "สร้างคอนเทนต์ที่เป็นประโยชน์",
      subtitle: "(Content Marketing)",
      icon: Globe,
      description: "การเขียนบทความ, ทำวิดีโอ หรือ Infographic ที่ช่วยแก้ปัญหาเล็กๆ น้อยๆ ของลูกค้า เพื่อสร้างความน่าเชื่อถือและดึงดูดคนเข้ามาหาเราเองผ่าน Google หรือ Social Media",
      actionStep: "เลือก 1 หัวข้อที่คุณเชี่ยวชาญ สร้างคอนเทนต์ 1 ชิ้นต่อสัปดาห์ เผยแพร่ผ่าน Blog, Facebook, YouTube, หรือ TikTok พร้อมใส่ลิงก์เว็บไซต์ของคุณ",
      tips: [
        "ทำ Tutorial หรือ How-to ที่เกี่ยวข้องกับสินค้าคุณ",
        "รีวิวเครื่องมือหรือแนวทางที่ลูกค้าใช้",
        "แชร์ Case Study หรือประสบการณ์จริง",
        "ตอบคำถามที่ลูกค้าถามบ่อยๆ"
      ]
    },
    {
      id: 4,
      title: "การติดต่อโดยตรงอย่างมีศิลปะ",
      subtitle: "(Smart Direct Outreach)",
      icon: Target,
      description: "เทคนิคการส่งอีเมลหรือข้อความหา \"ว่าที่ลูกค้า\" ในฝันโดยตรง โดยเน้นการนำเสนอคุณค่าและสร้างความสัมพันธ์ ไม่ใช่การขายแบบ Hard-sell",
      actionStep: "ทำรายชื่อ 20 คนที่คุณคิดว่าต้องการสินค้าคุณ ส่งข้อความสั้นๆ แนะนำตัวและเสนอสิ่งที่เป็นประโยชน์กับพวกเขาเป็นการเปิดบทสนทนา",
      tips: [
        "ศึกษาประวัติคนที่จะติดต่อให้ดีก่อน",
        "เริ่มด้วยการให้คำแนะนำฟรีที่เป็นประโยชน์",
        "ระบุชัดเจนว่าทำไมถึงติดต่อพวกเขาโดยเฉพาะ",
        "ไม่ขายสินค้าในข้อความแรก"
      ]
    },
    {
      id: 5,
      title: "ยืมพลังจากคนอื่น",
      subtitle: "(Leverage Other People's Audiences)",
      icon: TrendingUp,
      description: "การร่วมมือกับคนอื่นในวงการ, การไปเป็นแขกรับเชิญใน Podcast, หรือการเขียนบทความให้เว็บอื่น (Guest Posting) เพื่อเข้าถึงกลุ่มผู้ชมใหม่ๆ",
      actionStep: "หาผู้มีอิทธิพลหรือเว็บไซต์ที่มีผู้ติดตามเป็นกลุ่มเป้าหมายเดียวกับคุณ เสนอความร่วมมือที่เป็น Win-Win เช่น การแลกเปลี่ยนคอนเทนต์หรือการรีวิวผลิตภัณฑ์ของกันและกัน",
      tips: [
        "เสนอสร้างคอนเทนต์ฟรีให้กับเว็บหรือช่องทางของพวกเขา",
        "ร่วมทำ Live หรือ Webinar ด้วยกัน",
        "แลกเปลี่ยนการแนะนำผู้ติดตาม",
        "เข้าร่วมเป็นแขกใน Podcast หรือ YouTube Channel"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>วิธีหาลูกค้า 100 คนแรก แบบไม่ต้องยิงแอด | Begins.guide</title>
        <meta name="description" content="5 กลยุทธ์การตลาดแบบ Organic ที่พิสูจน์แล้วว่าได้ผล ช่วยให้คุณหาลูกค้า 100 คนแรกได้โดยไม่ต้องใช้เงินโฆษณา พร้อมเทมเพลตและ Action Step ที่ใช้ได้ทันที" />
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
                    <BreadcrumbLink href="/articles?category=การตลาดออนไลน์">การตลาดออนไลน์</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>วิธีหาลูกค้า 100 คนแรก...</BreadcrumbPage>
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
                      <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
                        การตลาดออนไลน์
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
                          <span>เผยแพร่เมื่อ 20 มกราคม 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>อ่าน 15 นาที</span>
                        </div>
                        <SocialShare 
                          url={currentUrl}
                          title={articleTitle}
                          description="5 กลยุทธ์การตลาดแบบ Organic ที่ช่วยหาลูกค้า 100 คนแรกได้"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="px-8 mb-8">
                      <img
                        src="/placeholder.svg"
                        alt="Organic Marketing Strategies"
                        className="w-full rounded-lg"
                      />
                    </div>

                    {/* Introduction */}
                    <div className="px-8 pb-8">
                      <div className="prose max-w-none prose-lg prose-gray mb-8">
                        <p className="text-xl leading-relaxed text-gray-700 mb-6">
                          การสร้างผลิตภัณฑ์ที่ยอดเยี่ยมเป็นแค่ครึ่งทาง... ความท้าทายที่แท้จริงที่ทำให้ <strong>90% ของธุรกิจไปไม่รอด</strong> คือ 
                          <em>"จะหาลูกค้าคนแรกจากไหน?"</em>
                        </p>
                        
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                          <p className="text-lg font-semibold text-green-900 mb-2">
                            🎯 สิ่งที่คุณจะได้รับจากบทความนี้
                          </p>
                          <p className="text-green-800">
                            ไม่ต้องกังวลไป ในบทความนี้ เราได้รวบรวม <strong>5 กลยุทธ์การตลาดแบบ "ไม่ใช้เงิน"</strong> ที่พิสูจน์แล้วว่าได้ผล 
                            ที่จะนำทางคุณไปสู่ลูกค้า 100 คนแรกและสร้างรากฐานที่แข็งแกร่งให้ธุรกิจ
                          </p>
                        </div>
                      </div>

                      {/* Main Content: 5 Marketing Strategies */}
                      <div className="space-y-12">
                        {marketingStrategies.slice(0, 2).map((strategy) => (
                          <div key={strategy.id} className="border-b border-gray-200 pb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                              <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
                                {strategy.id}
                              </span>
                              {strategy.title}
                            </h3>
                            <p className="text-lg text-green-600 font-medium mb-6">{strategy.subtitle}</p>
                            
                            {/* Description */}
                            <div className="mb-6">
                              <h4 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-3">
                                <strategy.icon className="h-5 w-5" />
                                วิธีการ
                              </h4>
                              <p className="text-gray-700 leading-relaxed">{strategy.description}</p>
                            </div>

                            {/* Action Step */}
                            <div className="mb-6">
                              <h4 className="flex items-center gap-2 text-lg font-semibold text-purple-700 mb-3">
                                <Zap className="h-5 w-5" />
                                Action Step
                              </h4>
                              <p className="text-gray-700 leading-relaxed">{strategy.actionStep}</p>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                              <h4 className="text-lg font-bold text-gray-800 mb-4">
                                💡 เคล็ดลับเพิ่มเติม
                              </h4>
                              <ul className="space-y-2">
                                {strategy.tips.map((tip, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Mid-Article CTA */}
                      <div className="my-16 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-12 text-center">
                        <h3 className="text-3xl font-bold mb-4">
                          กลยุทธ์เหล่านี้จะทรงพลังยิ่งขึ้น... 🚀
                        </h3>
                        <h4 className="text-xl mb-6 text-blue-100">
                          ถ้าคุณมี "ฐานทัพออนไลน์" ที่ดูเป็นมืออาชีพ
                        </h4>
                        <p className="text-lg mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                          ก่อนที่คุณจะเชิญลูกค้าเข้ามา คุณต้องมั่นใจว่า <strong>'หน้าร้าน'</strong> ของคุณสวยงามและน่าเชื่อถือ... 
                          คอร์ส <strong>'No-Code Webpreneur'</strong> จะสอนคุณสร้างเว็บไซต์ที่พร้อมรับลูกค้าได้ในไม่กี่วัน โดยไม่ต้องเขียนโค้ด
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                            <Link to="/no-code-webpreneur">
                              เรียนรู้วิธีสร้างเว็บที่พร้อมขาย
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      {/* Remaining Strategies */}
                      <div className="space-y-12">
                        {marketingStrategies.slice(2).map((strategy) => (
                          <div key={strategy.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                              <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
                                {strategy.id}
                              </span>
                              {strategy.title}
                            </h3>
                            <p className="text-lg text-green-600 font-medium mb-6">{strategy.subtitle}</p>
                            
                            {/* Description */}
                            <div className="mb-6">
                              <h4 className="flex items-center gap-2 text-lg font-semibold text-blue-700 mb-3">
                                <strategy.icon className="h-5 w-5" />
                                วิธีการ
                              </h4>
                              <p className="text-gray-700 leading-relaxed">{strategy.description}</p>
                            </div>

                            {/* Action Step */}
                            <div className="mb-6">
                              <h4 className="flex items-center gap-2 text-lg font-semibold text-purple-700 mb-3">
                                <Zap className="h-5 w-5" />
                                Action Step
                              </h4>
                              <p className="text-gray-700 leading-relaxed">{strategy.actionStep}</p>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                              <h4 className="text-lg font-bold text-gray-800 mb-4">
                                💡 เคล็ดลับเพิ่มเติม
                              </h4>
                              <ul className="space-y-2">
                                {strategy.tips.map((tip, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Final CTA */}
                      <div className="mt-16 bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8 mb-8">
                        <h3 className="text-3xl font-bold text-center mb-8">
                          คุณมี "กลยุทธ์" แล้ว... ถึงเวลาลงมือสร้าง "ระบบ" ที่ยั่งยืน
                        </h3>
                        
                        <p className="text-xl text-center text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                          การหาลูกค้าเป็นเพียงส่วนหนึ่งของการทำธุรกิจที่ประสบความสำเร็จ ถ้าคุณต้องการเข้าถึงทุกองค์ความรู้ 
                          ตั้งแต่การสร้างเว็บ, การทำสินค้า, ไปจนถึงการตลาดขั้นสูง พร้อมเทมเพลตและผู้ช่วย AI...
                        </p>
                        
                        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-blue-50 relative max-w-2xl mx-auto">
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-green-600 text-white">โซลูชันครบวงจร</Badge>
                          </div>
                          <CardContent className="p-8 text-center">
                            <h4 className="text-2xl font-bold mb-4 text-green-900">
                              Begins.guide PRO คือคำตอบสุดท้ายสำหรับคุณ
                            </h4>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                              สมัครสมาชิกวันนี้เพื่อเข้าถึง <strong>ทุกคอร์ส</strong> (รวมถึงคอร์ส No-Code และ Micro-SaaS ที่มีบทเรียนการตลาด), 
                              <strong>ทุกเทมเพลต</strong>, และ <strong>AI ช่วยคิดแคมเปญ</strong>
                            </p>
                            
                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-2 justify-center">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">คอร์สการตลาด + เทคนิคการขาย</span>
                              </div>
                              <div className="flex items-center gap-2 justify-center">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">เทมเพลตอีเมลและสคริปต์พร้อมใช้</span>
                              </div>
                              <div className="flex items-center gap-2 justify-center">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">AI ช่วยวางแผนแคมเปญการตลาด</span>
                              </div>
                            </div>
                            
                            <div className="text-center mb-6">
                              <div className="text-2xl font-bold text-green-600">เริ่มต้น 990 บาท/เดือน</div>
                              <div className="text-sm text-gray-600">ยกเลิกได้ตลอดเวลา</div>
                            </div>
                            
                            <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-lg py-3">
                              <Link to="/pricing">
                                อัปเกรดเป็น PRO Member
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
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
                            ทีมผู้เชี่ยวชาญด้านการตลาดออนไลน์และการสร้างธุรกิจ ที่มีประสบการณ์ช่วยให้ธุรกิจขนาดเล็กเติบโตด้วยกลยุทธ์การตลาดแบบ Organic มากกว่า 5 ปี
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
                    currentSlug="how-to-get-first-100-customers-organic-marketing" 
                    category="การตลาดออนไลน์"
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
                        {marketingStrategies.map((strategy) => (
                          <a key={strategy.id} href={`#strategy-${strategy.id}`} className="block text-blue-600 hover:text-blue-800">
                            {strategy.id}. {strategy.title}
                          </a>
                        ))}
                        <a href="#final-cta" className="block text-blue-600 hover:text-blue-800">สร้างระบบที่ยั่งยืน</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contextual CTA */}
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        พร้อมสร้างธุรกิจออนไลน์?
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เริ่มต้นด้วยการสร้างเว็บไซต์ที่พร้อมรับลูกค้า โดยไม่ต้องเขียนโค้ด
                      </p>
                      <Button asChild size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
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

export default OrganicMarketingArticle;
