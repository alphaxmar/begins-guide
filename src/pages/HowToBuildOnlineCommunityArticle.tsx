
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight, CheckCircle, Users, MessageCircle, Heart, Target, TrendingUp, Star, Crown, Zap } from 'lucide-react';
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

const HowToBuildOnlineCommunityArticle = () => {
  const currentUrl = window.location.href;
  const articleTitle = 'วิธีสร้าง Community ออนไลน์: เปลี่ยน "ลูกค้า" ที่ซื้อครั้งเดียว ให้เป็น "แฟนคลับ" ตลอดไป';

  const communityBenefits = [
    {
      icon: TrendingUp,
      title: "เพิ่มมูลค่าตลอดชีพของลูกค้า (LTV)",
      description: "พวกเขาจะซื้อสินค้าใหม่ของคุณเสมอ แทนที่จะไปหาแบรนด์อื่น"
    },
    {
      icon: MessageCircle,
      title: "ได้รับ Feedback ที่ประเมินค่าไม่ได้",
      description: "พวกเขาคือกลุ่มโฟกัสที่ดีที่สุดของคุณ ให้ข้อมูลตรงจากใจจริง"
    },
    {
      icon: Users,
      title: "สร้างกองทัพนักการตลาดแบบบอกต่อ",
      description: "แฟนคลับจะช่วยคุณขายของโดยที่คุณไม่ต้องร้องขอ"
    }
  ];

  const platformComparison = [
    {
      name: "Facebook Group",
      pros: ["คนส่วนใหญ่คุ้นเคย", "เข้าถึงง่าย", "ฟรี"],
      cons: ["การมองเห็นขึ้นอยู่กับ Algorithm", "มีสิ่งรบกวนเยอะ", "ไม่ใช่ของคุณ 100%"]
    },
    {
      name: "Discord/LINE OpenChat",
      pros: ["เหมาะกับการคุยสด", "แบ่งห้องตามหัวข้อได้ดี", "ฟรี"],
      cons: ["อาจดูซับซ้อนสำหรับบางคน", "ต้องเรียนรู้วิธีใช้", "การค้นหาข้อมูลยาก"]
    },
    {
      name: "แพลตฟอร์มเฉพาะทาง",
      pros: ["ดูเป็นมืออาชีพ", "ไม่มีโฆษณา", "เป็นของคุณ 100%", "ควบคุมได้เต็มที่"],
      cons: ["มีค่าใช้จ่ายรายเดือน", "ต้องเชิญคนเข้ามา", "สร้างแรกอาจเงียบ"]
    }
  ];

  const communityRules = [
    {
      title: "Content (เนื้อหาพิเศษ)",
      description: "แชร์คอนเทนต์เบื้องหลัง, สิทธิพิเศษ, หรือประกาศเรื่องใหม่ๆ ให้สมาชิกในกลุ่มรู้ก่อนใคร",
      icon: Star
    },
    {
      title: "Conversation (บทสนทนา)",
      description: "ตั้งคำถามปลายเปิด, ทำโพล, หรือสร้างกิจกรรมที่กระตุ้นให้ 'สมาชิกคุยกันเอง'",
      icon: MessageCircle
    },
    {
      title: "Connection (ความสัมพันธ์)",
      description: "จัด Live Q&A, เวิร์คช็อปออนไลน์, หรือยกย่องความสำเร็จของสมาชิกในกลุ่ม เพื่อสร้างความรู้สึกเป็นพวกเดียวกัน",
      icon: Heart
    }
  ];

  return (
    <>
      <Helmet>
        <title>วิธีสร้าง Community ออนไลน์: เปลี่ยนลูกค้าให้เป็น 'แฟนคลับ' | Begins.guide</title>
        <meta name="description" content="เรียนรู้วิธีสร้างและบริหาร Community ออนไลน์ที่เปลี่ยนลูกค้าให้เป็นแฟนคลับ พร้อม Framework 3C และเคล็ดลับสำคัญ" />
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
                    <BreadcrumbLink href="/articles?category=การตลาดออนไลน์">การตลาดออนไลน์</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="hidden sm:block">วิธีสร้าง Community ออนไลน์...</BreadcrumbPage>
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
                          การตลาดออนไลน์
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
                          <span>อ่าน 12 นาที</span>
                        </div>
                        <div className="hidden sm:block">
                          <SocialShare 
                            url={currentUrl}
                            title={articleTitle}
                            description="เรียนรู้วิธีสร้างและบริหาร Community ออนไลน์ที่เปลี่ยนลูกค้าให้เป็นแฟนคลับ พร้อม Framework 3C และเคล็ดลับสำคัญ"
                          />
                        </div>
                      </div>

                      {/* Mobile Social Share */}
                      <div className="sm:hidden mb-4">
                        <SocialShare 
                          url={currentUrl}
                          title={articleTitle}
                          description="เรียนรู้วิธีสร้างและบริหาร Community ออนไลน์ที่เปลี่ยนลูกค้าให้เป็นแฟนคลับ พร้อม Framework 3C และเคล็ดลับสำคัญ"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                      <img
                        src="/placeholder.svg"
                        alt="Building Online Community"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <p className="text-center text-sm text-gray-600 mt-2">
                        การสร้าง Community ออนไลน์: เปลี่ยนลูกค้าให้เป็นแฟนคลับตลอดไป
                      </p>
                    </div>

                    {/* Introduction */}
                    <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                      <div className="prose max-w-none prose-lg prose-gray mb-6 sm:mb-8">
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
                          การหาลูกค้าใหม่นั้น <strong>ยาก, แพง, และเหนื่อย</strong> แต่จะเกิดอะไรขึ้นถ้าลูกค้าเก่าของคุณ
                          ไม่เคยหนีไปไหน แถมยังช่วยคุณขายของและปกป้องแบรนด์ของคุณอีกด้วย?
                        </p>
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                          นั่นคือพลังของ <strong>'Community ออนไลน์'</strong> สินทรัพย์ทางการตลาดที่แข็งแกร่งที่สุด
                          ที่ธุรกิจยุคใหม่สามารถสร้างได้ ในบทความนี้ เราจะมอบพิมพ์เขียวสำหรับสร้าง 'เผ่า' หรือ 'Tribe' ของคุณเอง
                        </p>
                      </div>

                      {/* Main Content Sections */}
                      <div className="space-y-8 sm:space-y-12">
                        
                        {/* Section 1: Why Community Matters */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            🎯 ขั้นตอนที่ 1: ทำไม Community ถึงสำคัญกว่าแค่ 'ยอด Follower'?
                          </h2>
                          
                          <div className="mb-6">
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 border border-orange-200 mb-6">
                              <h4 className="text-lg font-bold text-orange-800 mb-3">
                                💡 ความแตกต่างที่สำคัญ
                              </h4>
                              <p className="text-orange-700 text-base">
                                <strong>Follower</strong> คือผู้ฟังทางเดียว แต่ <strong>Community</strong> คือบทสนทนาสองทาง 
                                ที่สมาชิกมีส่วนร่วม แลกเปลี่ยน และรู้สึกเป็นเจ้าของร่วมกัน
                              </p>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold mb-4 text-gray-900">ประโยชน์ทางธุรกิจ 3 ข้อ:</h3>
                          <div className="space-y-6">
                            {communityBenefits.map((benefit, index) => (
                              <div key={index} className="flex items-start gap-4 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <benefit.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                    {index + 1}. {benefit.title}
                                  </h4>
                                  <p className="text-base text-gray-700 leading-relaxed">
                                    {benefit.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section 2: Platform Comparison */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            🏠 ขั้นตอนที่ 2: เลือก "บ้าน" ให้กับ Community ของคุณ
                          </h2>
                          
                          <div className="space-y-6">
                            {platformComparison.map((platform, index) => (
                              <div key={index} className="border border-gray-200 rounded-xl p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                                  {platform.name}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Pros */}
                                  <div className="bg-green-50 rounded-lg p-4">
                                    <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                      <CheckCircle className="h-5 w-5" />
                                      ข้อดี
                                    </h4>
                                    <ul className="space-y-1 text-green-700 text-sm">
                                      {platform.pros.map((pro, proIndex) => (
                                        <li key={proIndex} className="flex items-start gap-2">
                                          <span className="text-green-600">•</span>
                                          <span>{pro}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Cons */}
                                  <div className="bg-red-50 rounded-lg p-4">
                                    <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                      <Target className="h-5 w-5" />
                                      ข้อเสีย
                                    </h4>
                                    <ul className="space-y-1 text-red-700 text-sm">
                                      {platform.cons.map((con, conIndex) => (
                                        <li key={conIndex} className="flex items-start gap-2">
                                          <span className="text-red-600">•</span>
                                          <span>{con}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Section 3: The 3C Framework */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
                            ⚡ ขั้นตอนที่ 3: กฎ 3C ในการบริหาร Community ให้น่าอยู่
                          </h2>
                          
                          <div className="space-y-6">
                            {communityRules.map((rule, index) => (
                              <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <rule.icon className="h-6 w-6 text-white" />
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="text-lg sm:text-xl font-bold text-purple-900 mb-2">
                                      {rule.title}
                                    </h3>
                                    <p className="text-base text-purple-800 leading-relaxed">
                                      {rule.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Main CTA */}
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center">
                            🌟 อยากสัมผัสพลังของ Community ที่ยอดเยี่ยมด้วยตัวเองใช่ไหม?
                          </h3>
                          
                          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-100 text-center max-w-4xl mx-auto leading-relaxed">
                            ทฤษฎีทั้งหมดนี้คือสิ่งที่ Begins.guide ยึดถือและปฏิบัติจริง เราได้สร้าง <strong>Private Community</strong> 
                            สำหรับสมาชิก PRO ของเราโดยเฉพาะ ที่ซึ่งผู้ประกอบการ, นักสร้างสรรค์, และผู้เชี่ยวชาญ
                            มารวมตัวกันเพื่อแลกเปลี่ยนความรู้, ขอฟีดแบค, และเติบโตไปด้วยกัน
                          </p>
                          
                          <div className="bg-white/10 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                            <p className="text-base sm:text-lg text-blue-100 text-center">
                              <strong className="text-white">"มันคือพื้นที่ปลอดภัยที่คุณไม่ต้องเดินทางคนเดียว 
                              ที่ซึ่งทุกคำถามจะได้รับคำตอบ และทุกความสำเร็จจะได้รับการเฉลิมฉลอง"</strong>
                            </p>
                          </div>
                          
                          <div className="text-center">
                            <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black font-bold px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl w-full sm:w-auto">
                              <Link to="/pricing">
                                <Crown className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                                <span className="hidden sm:inline">เข้าร่วม Community ของเราวันนี้ (ผ่าน PRO Membership)</span>
                                <span className="sm:hidden">เข้าร่วม PRO Community</span>
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
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg sm:text-xl">BG</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-base sm:text-lg mb-2">ทีมงาน Begins.guide</h4>
                          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                            ทีมผู้เชี่ยวชาญด้านการสร้างและบริหาร Community ออนไลน์ ที่ได้สร้างและดูแล Community 
                            ของผู้ประกอบการมากกว่า 500+ คนในประเทศไทย
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/pricing">เข้าร่วม PRO Community</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/articles">อ่านบทความอื่นๆ</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  <RelatedPosts 
                    currentSlug="how-to-build-online-community-turn-customers-into-fans" 
                    category="การตลาดออนไลน์"
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
                        <a href="#why-community" className="block text-blue-600 hover:text-blue-800">ทำไม Community สำคัญ?</a>
                        <a href="#choose-platform" className="block text-green-600 hover:text-green-800">เลือกแพลตฟอร์ม</a>
                        <a href="#3c-framework" className="block text-purple-600 hover:text-purple-800">กฎ 3C Framework</a>
                        <a href="#pro-community" className="block text-orange-600 hover:text-orange-800">PRO Community</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Access */}
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        พร้อมสร้าง Community?
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เข้าร่วมกับเราและเรียนรู้จากตัวอย่างจริง
                      </p>
                      <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700 mb-2">
                        <Link to="/pricing">
                          <Crown className="mr-2 h-4 w-4" />
                          เข้าร่วม PRO
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link to="/articles">
                          อ่านบทความอื่นๆ
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

export default HowToBuildOnlineCommunityArticle;
