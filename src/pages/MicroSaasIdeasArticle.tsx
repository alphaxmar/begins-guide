
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ArrowRight, CheckCircle, Target, Lightbulb, TrendingUp } from 'lucide-react';
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

const MicroSaasIdeasArticle = () => {
  const currentUrl = window.location.href;
  const articleTitle = "10 ไอเดียธุรกิจ Micro-SaaS ที่คนไทยยังไม่ค่อยมีคนทำในปี 2025 (พร้อมวิธีเริ่มต้น)";

  const microSaasIdeas = [
    {
      id: 1,
      title: "ระบบจัดการนัดหมายสำหรับคลินิกเฉพาะทาง",
      subtitle: "(เช่น คลินิกกายภาพบำบัด, คลินิกจัดฟัน)",
      problem: "ทุกวันนี้คลินิกเล็กๆ ยังใช้สมุดจดหรือ LINE ในการรับนัด ซึ่งวุ่นวายและผิดพลาดง่าย ลูกค้าต้องโทรมาถามเวลาว่างตลอด",
      solution: "สร้างเว็บแอปง่ายๆ ที่ให้คนไข้เข้ามาดูตารางว่างและจองคิวได้เอง มีระบบส่ง SMS เตือนนัดหมายอัตโนมัติ และสามารถยกเลิก/เลื่อนนัดได้",
      whyThailand: "เพราะมีคลินิกเฉพาะทางเกิดขึ้นใหม่จำนวนมาก แต่ยังขาดซอฟต์แวร์ที่ราคาไม่แพงและใช้งานง่าย คลินิกส่วนใหญ่ยังไม่รู้จัก SaaS แบบสมัยใหม่",
      techPath: "No-Code (Bubble, Adalo) หรือ React + Supabase + Twilio API",
      pricing: "เก็บเงิน 990-2,990 บาท/เดือน ต่อคลินิก"
    },
    {
      id: 2,
      title: "แพลตฟอร์มจัดการห้องเช่า/คอนโดให้เช่า",
      subtitle: "สำหรับเจ้าของหอพัก/คอนโดขนาดเล็ก",
      problem: "เจ้าของหอพักต้องจดจำว่าใครจ่ายค่าเช่าแล้วบ้าง ใครค้างชำระ ค่าไฟฟ้า-น้ำเป็นเท่าไร จัดการเอกสารสัญญาเช่ายุ่งยาก",
      solution: "ระบบจัดการผู้เช่าออนไลน์ มีการแจ้งเตือนค่าเช่า คำนวณค่าไฟฟ้า-น้ำ เก็บเอกสารสัญญา และส่งใบเสร็จอัตโนมัติ",
      whyThailand: "ตลาดห้องเช่าในไทยใหญ่มาก แต่เจ้าของหอพักส่วนใหญ่ยังจัดการแบบเดิมๆ ขาดเครื่องมือที่เข้าใจง่ายและราคาถูก",
      techPath: "React + Supabase + Line Notify API",
      pricing: "เก็บเงิน 590-1,990 บาท/เดือน ตามจำนวนห้อง"
    },
    {
      id: 3,
      title: "ระบบจัดการคำสั่งซื้อสำหรับร้านอาหารเดลิเวอรี่",
      subtitle: "ที่ไม่ผ่าน Platform ใหญ่",
      problem: "ร้านอาหารเล็กๆ เสีย Commission ให้ Grab/Foodpanda สูงมาก แต่การรับออเดอร์ผ่าน Line/Facebook ทำให้พลาดออเดอร์และจัดการยุ่งยาก",
      solution: "สร้างเว็บไซต์สำหรับร้านเดี่ยว ให้ลูกค้าสั่งอาหารได้โดยตรง มีระบบจัดการคิว การชำระเงิน และแจ้งสถานะการส่ง",
      whyThailand: "ร้านอาหารในไทยเริ่มหาทางลด Commission ต้องการช่องทางขายตรงที่ประหยัดกว่า",
      techPath: "Next.js + Stripe + Line Messaging API",
      pricing: "เก็บเงิน 1,290-2,990 บาท/เดือน + Commission 2-3%"
    },
    {
      id: 4,
      title: "แอปบัลลีต จดรายรับ-รายจ่ายสำหรับฟรีแลนซ์",
      subtitle: "ที่ช่วยคำนวณภาษีได้",
      problem: "ฟรีแลนซ์/ผู้ประกอบการรายย่อยไม่รู้จะจดบัญชีอย่างไร ทำภาษียุ่งยาก ไม่รู้ว่าต้องเก็บใบเสร็จอะไรบ้าง",
      solution: "แอปบันทึกรายรับ-รายจ่าย สแกน QR Code เพื่อเก็บใบเสร็จ คำนวณภาษีเบื้องต้น และสร้างรายงานสำหรับนักบัญชี",
      whyThailand: "ฟรีแลนซ์ในไทยเติบโตเร็ว แต่ขาดความรู้ด้านการเงิน ต้องการเครื่องมือที่เข้าใจง่าย",
      techPath: "React Native + OCR API + Firebase",
      pricing: "Freemium: ฟรี 10 ธุรกรรม/เดือน, PRO 290 บาท/เดือน"
    },
    {
      id: 5,
      title: "ระบบบุ๊คกิ่งสำหรับธุรกิจบริการส่วนตัว",
      subtitle: "(นวด, ทำเล็บ, ตัดผม, Personal Trainer)",
      problem: "ร้านบิวตี้/สปา/ยิมเล็กๆ ใช้โทรศัพท์รับจองตลอดเวลา ลูกค้าโทรมาไม่ติด หรือจองแล้วลืม มีปัญหาการจัดการคิวซ้อน",
      solution: "ระบบจองออนไลน์ที่ลูกค้าเลือกวันเวลาได้เอง มีการแจ้งเตือน และเจ้าของร้านดูตารางงานได้ชัดเจน",
      whyThailand: "ธุรกิจบริการส่วนตัวในไทยเติบโตเร็ว แต่ยังใช้วิธีเก่าในการจัดการ",
      techPath: "Vue.js + Supabase + Calendar API",
      pricing: "เก็บเงิน 890-2,490 บาท/เดือน"
    }
  ];

  const remainingIdeas = [
    { title: "แพลตฟอร์มจัดการสมาชิกสำหรับยิม/ฟิตเนสขนาดเล็ก" },
    { title: "ระบบจัดการคลังสินค้าสำหรับร้านค้าออนไลน์" },
    { title: "แอปติดตามผลการเรียนสำหรับโรงเรียนกวดวิชา" },
    { title: "เครื่องมือสร้างใบเสนอราคาและใบแจ้งหนี้อัตโนมัติ" },
    { title: "ระบบจัดการอีเวนต์และงานแต่งงานขนาดเล็ก" }
  ];

  return (
    <>
      <Helmet>
        <title>10 ไอเดียธุรกิจ Micro-SaaS ที่คนไทยยังไม่ค่อยมีคนทำในปี 2025 | Begins.guide</title>
        <meta name="description" content="ค้นพบไอเดียธุรกิจ Micro-SaaS ที่มีโอกาสสูงในตลาดไทย พร้อมแนวทางการเริ่มต้นและเครื่องมือที่ใช้ เหมาะสำหรับผู้ที่ต้องการสร้างรายได้ออนไลน์" />
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
                    <BreadcrumbLink href="/articles?category=ไอเดียธุรกิจ">ไอเดียธุรกิจ</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>10 ไอเดียธุรกิจ Micro-SaaS...</BreadcrumbPage>
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
                        ไอเดียธุรกิจ
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
                          <span>เผยแพร่เมื่อ 15 มกราคม 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>อ่าน 12 นาที</span>
                        </div>
                        <SocialShare 
                          url={currentUrl}
                          title={articleTitle}
                          description="ค้นพบไอเดียธุรกิจ Micro-SaaS ที่มีโอกาสสูงในตลาดไทย"
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="px-8 mb-8">
                      <img
                        src="/placeholder.svg"
                        alt="Micro-SaaS Business Ideas"
                        className="w-full rounded-lg"
                      />
                    </div>

                    {/* Introduction */}
                    <div className="px-8 pb-8">
                      <div className="prose max-w-none prose-lg prose-gray mb-8">
                        <p className="text-xl leading-relaxed text-gray-700 mb-6">
                          ในยุคที่ธุรกิจออนไลน์กำลังเติบโตอย่างรวดเร็ว <strong>Micro-SaaS</strong> กลายเป็นหนึ่งในโอกาสทองที่ผู้ประกอบการรายเล็กสามารถเข้าถึงได้ง่ายที่สุด 
                          คิดง่ายๆ ว่าเป็น <em>"การสร้างเครื่องมือดิจิทัลให้เช่า"</em> ที่แก้ปัญหาเฉพาะทางของกลุ่มลูกค้าขนาดเล็ก
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                          <p className="text-lg font-semibold text-blue-900 mb-2">
                            💡 สิ่งที่ทำให้บทความนี้แตกต่าง
                          </p>
                          <p className="text-blue-800">
                            บทความนี้ไม่ได้มีแค่ไอเดียลอยๆ แต่ในท้ายแต่ละไอเดีย เราจะชี้ช่องทาง <strong>'วิธีเริ่มต้น'</strong> และ <strong>'เครื่องมือที่ใช้'</strong> ให้คุณด้วย 
                            เพื่อให้คุณนำไปต่อยอดได้ทันที
                          </p>
                        </div>
                      </div>

                      {/* Main Content: First 5 Ideas */}
                      <div className="space-y-12">
                        {microSaasIdeas.map((idea) => (
                          <div key={idea.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                                {idea.id}
                              </span>
                              {idea.title}
                            </h3>
                            <p className="text-lg text-blue-600 font-medium mb-6">{idea.subtitle}</p>
                            
                            {/* Problem Section */}
                            <div className="mb-6">
                              <h4 className="flex items-center gap-2 text-lg font-semibold text-red-700 mb-3">
                                <Target className="h-5 w-5" />
                                ปัญหาที่แก้ไข
                              </h4>
                              <p className="text-gray-700 leading-relaxed">{idea.problem}</p>
                            </div>

                            {/* Solution Section */}
                            <div className="mb-6">
                              <h4 className="flex items-center gap-2 text-lg font-semibold text-green-700 mb-3">
                                <Lightbulb className="h-5 w-5" />
                                โซลูชัน
                              </h4>
                              <p className="text-gray-700 leading-relaxed">{idea.solution}</p>
                            </div>

                            {/* Why Thailand Section */}
                            <div className="mb-6">
                              <h4 className="flex items-center gap-2 text-lg font-semibold text-purple-700 mb-3">
                                <TrendingUp className="h-5 w-5" />
                                ทำไมถึงน่าทำในไทย
                              </h4>
                              <p className="text-gray-700 leading-relaxed">{idea.whyThailand}</p>
                            </div>

                            {/* How to Start Box */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                              <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                                🚀 วิธีเริ่มต้น
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <span className="font-semibold text-green-700">เส้นทางในการสร้าง:</span>
                                  <p className="text-green-800">{idea.techPath}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-green-700">โมเดลราคาแนะนำ:</span>
                                  <p className="text-green-800">{idea.pricing}</p>
                                </div>
                                <div className="pt-2">
                                  <Button asChild className="bg-green-600 hover:bg-green-700">
                                    <Link to="/micro-saas-course">
                                      เรียนรู้วิธีการสร้างแบบละเอียด
                                      <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Mid-Article CTA */}
                      <div className="my-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 text-center">
                        <h3 className="text-3xl font-bold mb-4">
                          มีไอเดียที่ถูกใจแล้วใช่ไหม? 🤔
                        </h3>
                        <h4 className="text-xl mb-6 text-blue-100">
                          แต่ไม่รู้จะเริ่มต้นสร้างให้เป็นจริงได้อย่างไร?
                        </h4>
                        <p className="text-lg mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                          ไอเดียเป็นเพียง 1% ส่วนที่เหลืออีก 99% คือการลงมือทำอย่างถูกวิธี... 
                          คอร์ส <strong>'Micro-SaaS Zero to Hero'</strong> คือพิมพ์เขียวฉบับสมบูรณ์ที่จะนำทางคุณตั้งแต่การตรวจสอบไอเดีย, 
                          การสร้าง MVP, ไปจนถึงการหาลูกค้ารายแรก
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                            <Link to="/micro-saas-course">
                              ดูรายละเอียดคอร์ส Micro-SaaS
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      {/* Remaining Ideas Summary */}
                      <div className="mb-12">
                        <h3 className="text-2xl font-bold mb-6">ไอเดียที่เหลืออีก 5 ตัว (สรุปแบบย่อ)</h3>
                        <div className="grid gap-4">
                          {remainingIdeas.map((idea, index) => (
                            <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                              <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                                {index + 6}
                              </span>
                              <span className="font-medium">{idea.title}</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-center mt-6 text-gray-600">
                          ต้องการรายละเอียดทั้ง 10 ไอเดีย? เข้าคอร์สเพื่อดู Deep Dive แต่ละไอเดียแบบครบถ้วน
                        </p>
                      </div>

                      {/* Final CTA - Path Comparison */}
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
                        <h3 className="text-3xl font-bold text-center mb-8">
                          คุณมี "ไอเดีย" แล้ว... ถึงเวลาเลือก "เส้นทาง" ของคุณ
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Focused Path */}
                          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
                            <CardContent className="p-6">
                              <div className="text-center mb-6">
                                <Badge className="bg-blue-100 text-blue-800 mb-4">เส้นทางสำหรับผู้เริ่มต้น</Badge>
                                <h4 className="text-xl font-bold mb-2">คอร์ส "Micro-SaaS Zero to Hero"</h4>
                                <p className="text-gray-600">
                                  เรียนรู้ทุกขั้นตอนที่จำเป็นสำหรับการสร้างธุรกิจ Micro-SaaS แรกของคุณโดยเฉพาะ
                                </p>
                              </div>
                              
                              <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">8 โมดูลเรียนแบบเฉพาะทาง</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">Case Studies จริง</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">เทมเพลตและเครื่องมือ</span>
                                </div>
                              </div>
                              
                              <div className="text-center mb-6">
                                <div className="text-2xl font-bold text-blue-600">3,990 บาท</div>
                                <div className="text-sm text-gray-600">จ่ายครั้งเดียว เรียนตลอดชีพ</div>
                              </div>
                              
                              <Button asChild className="w-full">
                                <Link to="/micro-saas-course">
                                  ลงทะเบียนเรียนคอร์สนี้
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>

                          {/* All-Access Path */}
                          <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-green-600 text-white">แนะนำ - คุ้มค่าที่สุด</Badge>
                            </div>
                            <CardContent className="p-6">
                              <div className="text-center mb-6">
                                <Badge className="bg-green-100 text-green-800 mb-4">เส้นทางสำหรับผู้ที่ต้องการโตไกล</Badge>
                                <h4 className="text-xl font-bold mb-2">Begins.guide PRO Membership</h4>
                                <p className="text-gray-600">
                                  เข้าถึง <strong>คอร์สนี้</strong>, <strong>ทุกคอร์สอื่นในอนาคต</strong>, 
                                  <strong>ทุกเทมเพลต</strong>, และ <strong>ผู้ช่วย AI ทั้งหมด</strong>
                                </p>
                              </div>
                              
                              <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">คอร์ส Micro-SaaS + คอร์สอื่นๆ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">เทมเพลตและเครื่องมือทั้งหมด</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">ผู้ช่วย AI สำหรับประกอบการ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">อัปเดตเนื้อหาใหม่ตลอด</span>
                                </div>
                              </div>
                              
                              <div className="text-center mb-6">
                                <div className="text-2xl font-bold text-green-600">เริ่มต้น 990 บาท/เดือน</div>
                                <div className="text-sm text-gray-600">ยกเลิกได้ตลอดเวลา</div>
                              </div>
                              
                              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                                <Link to="/pricing">
                                  สมัครสมาชิก PRO
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </CardContent>
                          </Card>
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
                            เชี่ยวชาญเรื่อง Micro-SaaS และการตลาดออนไลน์
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
                    currentSlug="10-thai-micro-saas-ideas-2025" 
                    category="ไอเดียธุรกิจ"
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
                        {microSaasIdeas.map((idea) => (
                          <a key={idea.id} href={`#idea-${idea.id}`} className="block text-blue-600 hover:text-blue-800">
                            {idea.id}. {idea.title}
                          </a>
                        ))}
                        <a href="#more-ideas" className="block text-blue-600 hover:text-blue-800">ไอเดียเพิ่มเติม</a>
                        <a href="#choose-path" className="block text-blue-600 hover:text-blue-800">เลือกเส้นทางของคุณ</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contextual CTA */}
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                    <CardContent className="p-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-3">
                        เริ่มสร้าง Micro-SaaS วันนี้
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        เรียนรู้ทุกขั้นตอนจากศูนย์ พร้อม Case Study และเครื่องมือจริง
                      </p>
                      <Button asChild size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                        <Link to="/micro-saas-course">
                          ดูคอร์ส Micro-SaaS
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

export default MicroSaasIdeasArticle;
