
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight, DollarSign, TrendingUp, Users, Target, AlertTriangle, CheckCircle } from 'lucide-react';
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

const PricingDigitalProductsArticle = () => {
  const currentUrl = window.location.href;
  const articleTitle = "วิธีตั้งราคาสินค้าดิจิทัล: 4 กลยุทธ์ที่จะเปลี่ยน 'ของดี' ให้เป็น 'ของขายดี'";

  const pricingStrategies = [
    {
      title: "ตั้งราคาตามคู่แข่ง (Competitor-Based Pricing)",
      description: "การสำรวจตลาดว่าคู่แข่งขายสินค้าคล้ายๆ กันในราคาเท่าไหร่ แล้วตั้งราคาของเราให้อยู่ในระดับใกล้เคียงกัน",
      pros: ["ง่าย รวดเร็ว", "ปลอดภัยสำหรับตลาดใหม่", "ลดความเสี่ยงในการตั้งราคาผิดจากตลาด"],
      cons: ["คุณอาจกำลังลอก 'ราคาที่ผิดพลาด' ของคู่แข่งมา", "ไม่ได้สะท้อนคุณค่าที่แท้จริงของคุณ"],
      suitableFor: "สินค้าที่ไม่มีความแตกต่างชัดเจน หรือผู้ที่เพิ่งเข้าสู่ตลาดใหม่",
      icon: Users,
      color: "blue"
    },
    {
      title: "ตั้งราคาตามต้นทุน (Cost-Plus Pricing)",
      description: "การคำนวณต้นทุนทั้งหมดแล้วบวกกำไรที่ต้องการเข้าไป",
      pros: ["ตรงไปตรงมา เข้าใจง่าย", "มั่นใจได้ว่าจะไม่ขาดทุน"],
      cons: ["ไม่เหมาะอย่างยิ่งสำหรับสินค้าดิจิทัล", "ต้นทุนการผลิตซ้ำเกือบเป็นศูนย์ ทำให้ตั้งราคาต่ำเกินไป"],
      suitableFor: "สินค้าที่จับต้องได้ (Physical Products) เท่านั้น",
      icon: DollarSign,
      color: "orange"
    },
    {
      title: "ตั้งราคาตามคุณค่า (Value-Based Pricing)",
      description: "การตั้งราคาโดยอิงจาก 'มูลค่า' หรือ 'ผลลัพธ์' ที่ลูกค้าจะได้รับจากสินค้าของคุณ ไม่ใช่ต้นทุนของคุณ",
      pros: ["สร้างกำไรได้สูงสุด", "สะท้อนคุณค่าที่แท้จริง", "ดึงดูดลูกค้าคุณภาพสูง"],
      cons: ["ทำได้ยากที่สุด", "ต้องเข้าใจลูกค้าและสามารถสื่อสาร 'คุณค่า' ออกมาให้ได้"],
      suitableFor: "สินค้าทุกชนิด โดยเฉพาะสินค้าที่ช่วยให้ลูกค้าประหยัดเวลา ประหยัดเงิน หรือหาเงินได้มากขึ้น",
      icon: Target,
      color: "green",
      recommended: true
    },
    {
      title: "การสร้างแพ็กเกจราคา (Tiered Pricing)",
      description: "การสร้างแพ็กเกจ 2-3 ระดับ (เช่น Basic, Pro, Premium) ที่มีฟีเจอร์หรือสิทธิประโยชน์ต่างกัน",
      pros: ["เข้าถึงลูกค้าได้หลายกลุ่ม", "เพิ่มโอกาสในการ Upsell", "ให้ลูกค้าเลือกตามงบประมาณ"],
      cons: ["อาจสร้างความสับสนหากแพ็กเกจไม่ชัดเจน", "ต้องออกแบบแพ็กเกจให้มีเหตุผล"],
      suitableFor: "ซอฟต์แวร์ (SaaS), Membership, หรือคอร์สเรียนที่มีหลายระดับ",
      icon: TrendingUp,
      color: "purple"
    }
  ];

  return (
    <>
      <Helmet>
        <title>วิธีตั้งราคาสินค้าดิจิทัล: 4 กลยุทธ์ที่จะเปลี่ยน 'ของดี' ให้เป็น 'ของขายดี' | Begins.guide</title>
        <meta name="description" content="เรียนรู้ 4 กลยุทธ์การตั้งราคาสินค้าดิจิทัลที่พิสูจน์แล้วว่าได้ผล ตั้งแต่การตั้งราคาตามคู่แข่ง ไปจนถึงการตั้งราคาตามคุณค่า พร้อม Case Study จริง" />
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
                    <BreadcrumbLink href="/articles?category=การเงินธุรกิจ">การเงินธุรกิจ</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="hidden sm:block">วิธีตั้งราคาสินค้าดิจิทัล...</BreadcrumbPage>
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
                      <Badge variant="secondary" className="mb-3 sm:mb-4 bg-green-100 text-green-800">
                        การเงินธุรกิจ
                      </Badge>
                      
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
                          <span className="hidden sm:inline">เผยแพร่เมื่อ 23 มกราคม 2025</span>
                          <span className="sm:hidden">23 ม.ค. 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>อ่าน 9 นาที</span>
                        </div>
                        <div className="hidden sm:block">
                          <SocialShare 
                            url={currentUrl}
                            title={articleTitle}
                            description="เรียนรู้ 4 กลยุทธ์การตั้งราคาสินค้าดิจิทัลที่ได้ผลจริง"
                          />
                        </div>
                      </div>

                      {/* Mobile Social Share */}
                      <div className="sm:hidden mb-4">
                        <SocialShare 
                          url={currentUrl}
                          title={articleTitle}
                          description="เรียนรู้ 4 กลยุทธ์การตั้งราคาสินค้าดิจิทัลที่ได้ผลจริง"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
                      <img
                        src="/placeholder.svg"
                        alt="Digital Product Pricing Strategies"
                        className="w-full rounded-lg"
                      />
                    </div>

                    {/* Introduction */}
                    <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                      <div className="prose max-w-none prose-lg prose-gray mb-6 sm:mb-8">
                        <p className="text-lg sm:text-xl leading-relaxed text-gray-700 mb-4 sm:mb-6">
                          คุณใช้เวลาหลายสัปดาห์ หรืออาจหลายเดือน เพื่อสร้างสรรค์คอร์สออนไลน์, E-book, 
                          หรือเทมเพลตที่ยอดเยี่ยม... แต่แล้วก็มาถึงคำถามที่น่ากลัวที่สุด: 
                          <strong>"แล้วจะขายมันราคาเท่าไหร่ดี?"</strong>
                        </p>
                        
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 sm:p-6 rounded-r-lg mb-4 sm:mb-6">
                          <p className="text-base sm:text-lg text-red-900 mb-2">
                            ⚠️ <strong>ความจริงที่โหดร้าย:</strong>
                          </p>
                          <p className="text-sm sm:text-base text-red-800">
                            การตั้งราคาผิดพลาดอาจทำให้คุณ <em>"ทำงานฟรี"</em> หรือ <em>"ไม่มีลูกค้าเลย"</em> 
                            ไม่ว่าสินค้าของคุณจะดีแค่ไหนก็ตาม
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r-lg">
                          <p className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                            ✅ <strong>แต่ไม่ต้องกังวล!</strong>
                          </p>
                          <p className="text-sm sm:text-base text-blue-800">
                            บทความนี้จะสรุป <strong>4 กลยุทธ์การตั้งราคา</strong> ที่พิสูจน์แล้วว่าได้ผล 
                            เพื่อให้คุณเลือกใช้ได้อย่างมั่นใจและสร้างกำไรที่คุ้มค่ากับความพยายามของคุณ
                          </p>
                        </div>
                      </div>

                      {/* Section 1: The 4 Strategies */}
                      <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                          4 กลยุทธ์การตั้งราคาที่ผู้ประกอบการต้องรู้
                        </h2>
                        
                        <div className="space-y-6 sm:space-y-8">
                          {pricingStrategies.map((strategy, index) => (
                            <div key={index} className={`border rounded-xl p-4 sm:p-6 lg:p-8 ${
                              strategy.recommended 
                                ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300' 
                                : 'bg-white border-gray-200'
                            }`}>
                              <div className="flex flex-col sm:flex-row items-start gap-4">
                                <div className={`p-3 sm:p-4 rounded-lg flex-shrink-0 ${
                                  strategy.color === 'green' ? 'bg-green-600 text-white' :
                                  strategy.color === 'blue' ? 'bg-blue-600 text-white' :
                                  strategy.color === 'orange' ? 'bg-orange-600 text-white' :
                                  strategy.color === 'purple' ? 'bg-purple-600 text-white' :
                                  'bg-gray-600 text-white'
                                }`}>
                                  <strategy.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                      {index + 1}. {strategy.title}
                                    </h3>
                                    {strategy.recommended && (
                                      <Badge className="bg-green-600 text-white self-start sm:self-auto">แนะนำที่สุด</Badge>
                                    )}
                                  </div>
                                  
                                  <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                                    {strategy.description}
                                  </p>
                                  
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                    <div>
                                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                        ข้อดี
                                      </h4>
                                      <ul className="space-y-2">
                                        {strategy.pros.map((pro, proIndex) => (
                                          <li key={proIndex} className="text-sm sm:text-base text-green-700 flex items-start gap-2">
                                            <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                                            <span>{pro}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                                        ข้อเสีย
                                      </h4>
                                      <ul className="space-y-2">
                                        {strategy.cons.map((con, conIndex) => (
                                          <li key={conIndex} className="text-sm sm:text-base text-red-700 flex items-start gap-2">
                                            <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                                            <span>{con}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">เหมาะสำหรับ:</h4>
                                    <p className="text-sm sm:text-base text-gray-700">{strategy.suitableFor}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mid-Article CTA */}
                      <div className="my-12 sm:my-16 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                          การตั้งราคาตามคุณค่า (Value-Based) คือหัวใจ...
                        </h3>
                        <h4 className="text-lg sm:text-xl mb-4 sm:mb-6 text-green-100">
                          แต่จะรู้ได้อย่างไรว่า "คุณค่า" ของสินค้าคุณคือเท่าไหร่? 🤔
                        </h4>
                        <p className="text-base sm:text-lg mb-6 sm:mb-8 text-green-100 max-w-4xl mx-auto leading-relaxed">
                          ในคอร์ส <strong>'Micro-SaaS Zero to Hero'</strong> เรามี Workshop และ Case Study 
                          เฉพาะทางที่จะสอนคุณคำนวณ <strong>'คุณค่า'</strong> และการตั้งราคาสำหรับธุรกิจ Subscription 
                          เพื่อสร้างกำไรสูงสุดและรักษาลูกค้าให้อยู่ยาวนาน
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full sm:w-auto">
                            <Link to="/micro-saas-course">
                              <span className="hidden sm:inline">เรียนรู้การตั้งราคาเชิงลึก</span>
                              <span className="sm:hidden">เรียนรู้เพิ่มเติม</span>
                              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      {/* Practical Tips Section */}
                      <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                          เทคนิคเพิ่มเติม: หลีกเลี่ยงข้อผิดพลาดที่มักเกิดขึ้น
                        </h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
                              อย่าทำ (DON'Ts)
                            </h3>
                            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-red-800">
                              <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                                <span>อย่าตั้งราคาต่ำเกินไปเพื่อ "ทดลองตลาด"</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                                <span>อย่าเปลี่ยนราคาบ่อยเกินไปโดยไม่มีเหตุผล</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                                <span>อย่าลอกราคาคู่แข่งโดยไม่เข้าใจบริบท</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1 flex-shrink-0">✗</span>
                                <span>อย่าตั้งราคาโดยไม่คิดถึงต้นทุนการตลาด</span>
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                              ควรทำ (DOs)
                            </h3>
                            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-green-800">
                              <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                                <span>ทดสอบราคาด้วยกลุ่มลูกค้าเล็กๆ ก่อน</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                                <span>เก็บข้อมูลปฏิกิริยาของลูกค้าต่อราคา</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                                <span>สร้างหลายแพ็กเกจเพื่อเพิ่มทางเลือก</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                                <span>อธิบายคุณค่าให้ชัดเจนก่อนเปิดราคา</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Final CTA */}
                      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 sm:p-8 lg:p-12 text-white text-center">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
                          หยุดการ "เดา" ราคา แล้วมาสร้างกลยุทธ์ที่ทำกำไรจริงกันเถอะ
                        </h3>
                        
                        <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-purple-100 max-w-4xl mx-auto leading-relaxed">
                          ทฤษฎีเป็นเพียงจุดเริ่มต้น หากคุณต้องการเข้าถึงทุกคอร์ส, คลังเทมเพลตใบเสนอราคา, 
                          และถามคำถามเรื่องการตั้งราคาของคุณได้โดยตรงใน Community ของเรา...
                        </p>
                        
                        <h4 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-yellow-300">
                          Begins.guide PRO คือคำตอบสุดท้ายสำหรับคุณ
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 text-left">
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <h5 className="font-bold mb-2">📚 ทุกคอร์ส</h5>
                            <p className="text-xs sm:text-sm text-purple-100">เข้าถึงคอร์สทั้งหมด รวมถึง Advanced Pricing Strategies</p>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <h5 className="font-bold mb-2">📄 เทมเพลต</h5>
                            <p className="text-xs sm:text-sm text-purple-100">ใบเสนอราคา, สัญญา, และเครื่องมือคำนวณราคา</p>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3 sm:p-4">
                            <h5 className="font-bold mb-2">🤖 AI ผู้ช่วย</h5>
                            <p className="text-xs sm:text-sm text-purple-100">AI ช่วยวิเคราะห์ราคาและให้คำแนะนำเฉพาะทาง</p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl w-full sm:w-auto">
                            <Link to="/pricing">
                              <span className="hidden sm:inline">ปลดล็อกทุกเครื่องมือด้วย PRO</span>
                              <span className="sm:hidden">อัปเกรดเป็น PRO</span>
                              <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                            </Link>
                          </Button>
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
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg sm:text-xl">BG</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-base sm:text-lg mb-2">ทีมงาน Begins.guide</h4>
                          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                            ทีมผู้เชี่ยวชาญด้านธุรกิจและการตลาดดิจิทัล ที่มีประสบการณ์ช่วยให้ผู้ประกอบการหลายร้อยคนตั้งราคาสินค้าอย่างเหมาะสมและสร้างกำไรอย่างยั่งยืน
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/articles">บทความทั้งหมด</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                              <Link to="/micro-saas-course">คอร์ส Micro-SaaS</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Articles */}
                  <RelatedPosts 
                    currentSlug="how-to-price-digital-products-4-strategies" 
                    category="การเงินธุรกิจ"
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
                        <a href="#strategies" className="block text-blue-600 hover:text-blue-800">4 กลยุทธ์การตั้งราคา</a>
                        <a href="#competitor-based" className="block text-blue-600 hover:text-blue-800 ml-4">1. ตามคู่แข่ง</a>
                        <a href="#cost-plus" className="block text-blue-600 hover:text-blue-800 ml-4">2. ตามต้นทุน</a>
                        <a href="#value-based" className="block text-blue-600 hover:text-blue-800 ml-4">3. ตามคุณค่า</a>
                        <a href="#tiered" className="block text-blue-600 hover:text-blue-800 ml-4">4. แพ็กเกจราคา</a>
                        <a href="#tips" className="block text-blue-600 hover:text-blue-800">เทคนิคเพิ่มเติม</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contextual CTA */}
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        พร้อมสร้างกำไรจริง?
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เรียนรู้กลยุทธ์การตั้งราคาขั้นสูงในคอร์ส Micro-SaaS
                      </p>
                      <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700 mb-2">
                        <Link to="/micro-saas-course">
                          ดูคอร์ส Micro-SaaS
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link to="/pricing">
                          อัปเกรดเป็น PRO
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

export default PricingDigitalProductsArticle;
