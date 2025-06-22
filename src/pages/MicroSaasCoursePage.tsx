
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Star, 
  Shield, 
  Clock, 
  Users, 
  Zap,
  TrendingUp,
  CreditCard,
  Lightbulb,
  Target,
  Gift,
  HelpCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StripeCheckoutButton from "@/components/payment/StripeCheckoutButton";

const MicroSaasCoursePage = () => {
  const [openFaq, setOpenFaq] = useState<string>("");

  // Mock course data - in real implementation, this would come from Supabase
  const courseData = {
    id: "micro-saas-course",
    title: "Micro-SaaS Zero to Hero",
    subtitle: "สร้างธุรกิจดิจิทัลทำเงินรายเดือน",
    price: 3990,
    originalPrice: 5990,
    modules: [
      {
        id: "module-0",
        title: "Module 0: เตรียมความพร้อมและ Mindset",
        lessons: [
          "SaaS คืออะไร และทำไมถึงเป็นโมเดลธุรกิจที่ดี",
          "ความแตกต่างระหว่าง Micro-SaaS กับ SaaS ทั่วไป",
          "การตั้งเป้าหมายและวางแผนการทำงาน"
        ]
      },
      {
        id: "module-1",
        title: "Module 1: การหาไอเดียและวิเคราะห์ตลาด",
        lessons: [
          "เทคนิคการหาปัญหาที่แก้ได้ด้วย Software",
          "การวิเคราะห์คู่แข่งและโอกาสในตลาด",
          "การหาและสัมภาษณ์กลุ่มเป้าหมาย"
        ]
      },
      {
        id: "module-2",
        title: "Module 2: การออกแบบและวางแผนผลิตภัณฑ์",
        lessons: [
          "การสร้าง User Journey และ User Stories",
          "การออกแบบ UI/UX อย่างง่าย",
          "การใช้เครื่องมือ No-Code/Low-Code"
        ]
      },
      {
        id: "module-3",
        title: "Module 3: การพัฒนาและเปิดตัว MVP",
        lessons: [
          "การเลือกเครื่องมือและแพลตฟอร์มที่เหมาะสม",
          "การพัฒนาฟีเจอร์หลักอย่างรวดเร็ว",
          "การทดสอบและปรับปรุงผลิตภัณฑ์"
        ]
      },
      {
        id: "module-4",
        title: "Module 4: การตลาดและหาลูกค้า",
        lessons: [
          "กลยุทธ์การตลาดแบบ Lean Startup",
          "การใช้ Social Media และ Content Marketing",
          "การสร้างช่องทางขายที่ยั่งยืน"
        ]
      },
      {
        id: "module-5",
        title: "Module 5: การจัดการและขยายธุรกิจ",
        lessons: [
          "การตั้งราคาและโมเดลการเก็บเงิน",
          "การให้บริการลูกค้าและการรักษาลูกค้า",
          "การวิเคราะห์ข้อมูลและปรับปรุงอย่างต่อเนื่อง"
        ]
      },
      {
        id: "module-6",
        title: "Module 6: Case Studies และการต่อยอด",
        lessons: [
          "กรณีศึกษาธุรกิจ Micro-SaaS ที่ประสบความสำเร็จ",
          "การวางแผนการขยายธุรกิจในระยะยาว",
          "การสร้างแบรนด์และชุมชนรอบตัวผลิตภัณฑ์"
        ]
      }
    ]
  };

  const problems = [
    {
      icon: TrendingUp,
      title: "เบื่อไหมกับรายได้ทางเดียว?",
      description: "พึ่งพาเงินเดือนอย่างเดียว ไม่มีรายได้เสริมที่มั่นคง"
    },
    {
      icon: Lightbulb,
      title: "อยากมีธุรกิจแต่ไม่รู้จะเริ่มยังไง?",
      description: "มีไอเดียแต่ไม่รู้ว่าจะทำให้เป็นจริงได้อย่างไร"
    },
    {
      icon: CreditCard,
      title: "คิดว่าการสร้างแอปต้องใช้เงินทุนมหาศาล?",
      description: "เชื่อว่าต้องมีเงินเยอะเหมือนสตาร์ทอัปใหญ่ๆ"
    },
    {
      icon: Target,
      title: "ไม่รู้ว่าจะหาลูกค้าอย่างไร?",
      description: "ทำผลิตภัณฑ์เสร็จแล้วแต่ไม่มีใครสนใจซื้อ"
    }
  ];

  const targetAudience = [
    "พนักงานประจำที่อยากมีรายได้เสริม",
    "ฟรีแลนซ์ที่ต้องการรายได้ที่มั่นคงกว่า",
    "โปรแกรมเมอร์ที่อยากสร้างผลิตภัณฑ์ของตัวเอง",
    "ผู้ที่เขียนโค้ดไม่เป็น แต่อยากมีธุรกิจเทค",
    "ผู้ประกอบการที่กำลังมองหาโมเดลธุรกิจใหม่"
  ];

  const whatYouGet = [
    "วิดีโอคอร์สเรียน 7 โมดูล 40+ บทเรียน",
    "เทมเพลตและเวิร์คชีทครบชุด",
    "เครื่องมือวิเคราะห์ตลาดและคู่แข่ง",
    "รายชื่อเครื่องมือ No-Code/Low-Code ที่แนะนำ",
    "สิทธิ์เรียนซ้ำได้ตลอดชีพ",
    "อัปเดตเนื้อหาใหม่ฟรีตลอดไป"
  ];

  const testimonials = [
    {
      name: "คุณสมชาย ทำดี",
      role: "พนักงานบัญชี",
      content: "เรียนจบแล้วสามารถสร้างแอปจัดการค่าใช้จ่ายได้ ตอนนี้มีรายได้เสริม 15,000 บาท/เดือน",
      rating: 5
    },
    {
      name: "น้องมินท์ สร้างสรรค์",
      role: "นักศึกษาปี 4",
      content: "ไม่เคยเขียนโค้ดมาก่อน แต่ทำตามได้ ตอนนี้มีแอปขายของออนไลน์เป็นของตัวเอง",
      rating: 5
    },
    {
      name: "คุณกิตติ นวัตกรรม",
      role: "โปรแกรมเมอร์",
      content: "ได้แนวคิดใหม่ในการหาไอเดียและทำการตลาด แอปที่ทำตามคอร์สมีลูกค้าใช้งานกว่า 200 คน",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "SaaS คืออะไร?",
      answer: "SaaS ย่อมาจาก Software as a Service คือธุรกิจที่ให้เช่าใช้ซอฟต์แวร์ผ่านอินเทอร์เน็ต โดยลูกค้าจะจ่ายเป็นรายเดือนหรือรายปี เช่น Netflix, Spotify, Google Workspace"
    },
    {
      question: "ต้องเขียนโค้ดเป็นไหม?",
      answer: "ไม่จำเป็นต้องเขียนโค้ดเป็น เราจะสอนการใช้เครื่องมือ No-Code/Low-Code ที่ทำให้คุณสร้างแอปได้โดยไม่ต้องเขียนโค้ด เช่น Bubble, Webflow, Airtable"
    },
    {
      question: "ต้องลงทุนเท่าไหร่ในการเริ่มต้น?",
      answer: "ส่วนใหญ่เริ่มต้นได้ด้วยงบไม่เกิน 5,000-10,000 บาท สำหรับค่าเครื่องมือและการตลาดเบื้องต้น ซึ่งน้อยมากเมื่อเทียบกับธุรกิจทั่วไป"
    },
    {
      question: "ใช้เวลาเรียนนานแค่ไหน?",
      answer: "หากเรียนสัปดาห์ละ 3-4 ชั่วโมง จะจบคอร์สได้ใน 6-8 สัปดาห์ แต่คุณสามารถเรียนตามจังหวะของตัวเองได้ เพราะมีสิทธิ์เรียนตลอดชีพ"
    },
    {
      question: "มีการรับประกันไหม?",
      answer: "มีการรับประกันความพึงพอใจ 100% หากไม่พอใจสามารถขอคืนเงินเต็มจำนวนภายใน 14 วันแรกได้เลย"
    },
    {
      question: "หลังเรียนจบแล้วจะได้อะไรเพิ่ม?",
      answer: "จะได้เข้าร่วมกลุ่มชุมชนนักเรียน สามารถปรึกษาและแบ่งปันประสบการณ์กันได้ รวมถึงได้รับอัปเดตเนื้อหาใหม่ฟรีตลอดไป"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                เปลี่ยนไอเดียให้เป็น<br />
                <span className="text-yellow-400">'ธุรกิจออนไลน์'</span><br />
                ที่ทำเงินให้คุณทุกเดือน<br />
                <span className="text-2xl md:text-3xl">แม้ตอนคุณหลับ</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
                เรียนรู้วิธีสร้าง 'เครื่องมือดิจิทัลให้เช่า' ที่แก้ปัญหาให้ผู้คน<br />
                และสร้างรายได้ประจำให้คุณแบบ Step-by-Step
              </p>
              
              <div className="mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
                  <div className="flex items-center justify-center mb-4">
                    <Play className="h-16 w-16 text-yellow-400" />
                  </div>
                  <p className="text-lg">ดูวิดีโอแนะนำคอร์ส (2 นาที)</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-xl"
                  onClick={() => scrollToSection('pricing')}
                >
                  ลงทะเบียนเรียนทันทีในราคาพิเศษ
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>500+ นักเรียน</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>4.9/5 คะแนน</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>รับประกัน 14 วัน</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Problem Section */}
          <section className="mb-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  คุณกำลังเจอปัญหาพวกนี้อยู่ใช่ไหม?
                </h2>
                <p className="text-xl text-gray-600">
                  หลายคนต่างก็ฝันอยากมีธุรกิจเป็นของตัวเอง แต่ติดปัญหาเหล่านี้
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {problems.map((problem, index) => (
                  <Card key={index} className="border-red-200 bg-red-50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          <problem.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-red-800 mb-2">
                            {problem.title}
                          </h3>
                          <p className="text-red-700">{problem.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* The "New Way" Section */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                แต่มี <span className="text-blue-600">"วิธีใหม่"</span> ที่ดีกว่า
              </h2>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <Zap className="h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-green-800">
                    สร้าง "Micro-SaaS" - ธุรกิจดิจิทัลขนาดเล็กที่ทำเงินใหญ่
                  </h3>
                  <p className="text-lg text-green-700 leading-relaxed">
                    แทนที่จะสร้างแอปใหญ่ที่ทำทุกอย่าง ให้สร้างเครื่องมือเล็กๆ ที่แก้ปัญหาเฉพาะจุด<br />
                    ไม่ต้องใช้เงินทุนเยอะ ไม่ต้องจ้างทีม สามารถทำคนเดียวได้<br />
                    และสำคัญที่สุด - <strong>ลูกค้าจ่ายเงินให้ทุกเดือน!</strong>
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Introducing the Course */}
          <section className="mb-20">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                ขอแนะนำคอร์ส
              </h2>
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardContent className="p-12">
                  <h3 className="text-4xl md:text-5xl font-bold mb-4">
                    {courseData.title}
                  </h3>
                  <p className="text-2xl md:text-3xl mb-6">
                    {courseData.subtitle}
                  </p>
                  <p className="text-xl opacity-90">
                    คอร์สเดียวที่จะสอนคุณทุกขั้นตอนตั้งแต่ศูนย์<br />
                    จนถึงมีธุรกิจดิจิทัลทำเงินจริง
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Who Is This For */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  คอร์สนี้เหมาะสำหรับใคร?
                </h2>
                <p className="text-xl text-gray-600">
                  ไม่ว่าคุณจะเป็นใคร มีพื้นฐานอะไร คอร์สนี้จะพาคุณไปถึงเป้าหมาย
                </p>
              </div>
              
              <div className="space-y-4">
                {targetAudience.map((audience, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="text-lg">{audience}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-yellow-50 border-yellow-200 border rounded-lg">
                <p className="text-lg text-yellow-800 font-semibold text-center">
                  <strong>โดยเฉพาะ</strong> ผู้ที่เขียนโค้ดไม่เป็น แต่อยากมีธุรกิจเทค<br />
                  เราจะสอนใช้เครื่องมือที่ไม่ต้องเขียนโค้ดเลย!
                </p>
              </div>
            </div>
          </section>

          {/* Curriculum Breakdown */}
          <section className="mb-20">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  เนื้อหาในคอร์ส - 7 โมดูลครบครัน
                </h2>
                <p className="text-xl text-gray-600">
                  ทุกขั้นตอนที่คุณต้องรู้ เพื่อสร้างธุรกิจ Micro-SaaS ที่ประสบความสำเร็จ
                </p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {courseData.modules.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id} className="border rounded-lg">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{module.title}</h3>
                          <p className="text-sm text-gray-600">{module.lessons.length} บทเรียน</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="ml-16 space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-gray-700">{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* What You Get */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  สรุปสิ่งที่คุณจะได้รับ
                </h2>
                <p className="text-xl text-gray-600">
                  ความคุ้มค่าทั้งหมดที่รอคุณอยู่
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whatYouGet.map((item, index) => (
                  <Card key={index} className="border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          <Gift className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-medium">{item}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* The Offer & Pricing */}
          <section id="pricing" className="mb-20">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ราคาพิเศษเพื่อคุณ
                </h2>
                <p className="text-xl text-gray-600">
                  ลงทุนครั้งเดียว เรียนได้ตลอดชีพ
                </p>
              </div>
              
              <Card className="border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-2 transform rotate-12 translate-x-4 -translate-y-2">
                  <span className="font-bold">ประหยัด 33%</span>
                </div>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl font-bold">
                    Micro-SaaS Zero to Hero
                  </CardTitle>
                  <CardDescription className="text-lg">
                    สร้างธุรกิจดิจิทัลทำเงินรายเดือน
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <span className="text-2xl text-gray-500 line-through">
                        ฿{courseData.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-5xl font-bold text-blue-600">
                        ฿{courseData.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-lg text-gray-600">
                      จ่ายครั้งเดียว เรียนได้ตลอดชีพ
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>วิดีโอคอร์สเรียน 7 โมดูล 40+ บทเรียน</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>เทมเพลตและเครื่องมือครบชุด</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>สิทธิ์เรียนซ้ำได้ตลอดชีพ</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>รับประกันความพึงพอใจ 14 วัน</span>
                    </div>
                  </div>
                  
                  <StripeCheckoutButton
                    productIds={[courseData.id]}
                    amount={courseData.price}
                    className="w-full text-xl py-4"
                  />
                  
                  <p className="text-sm text-gray-600 mt-4">
                    การชำระเงินปลอดภัยด้วย SSL encryption
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  เสียงจากผู้เรียนที่ประสบความสำเร็จ
                </h2>
                <p className="text-xl text-gray-600">
                  พวกเขาทำได้ คุณก็ทำได้เหมือนกัน
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex text-yellow-500 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-6 italic">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{testimonial.name}</p>
                          <p className="text-gray-500 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Risk Reversal */}
          <section className="mb-20">
            <div className="max-w-3xl mx-auto text-center">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <Shield className="h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-green-800">
                    รับประกันความพึงพอใจ 100%
                  </h3>
                  <p className="text-lg text-green-700 leading-relaxed">
                    หากไม่พอใจด้วยเหตุผลใดก็ตาม สามารถขอคืนเงินเต็มจำนวน<br />
                    ภายใน <strong>14 วันแรก</strong> ได้ทันที<br />
                    ไม่มีข้อแม้ ไม่ต้องให้เหตุผล
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  คำถามที่พบบ่อย
                </h2>
                <p className="text-xl text-gray-600">
                  ตอบทุกข้อสงสัยก่อนตัดสินใจ
                </p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-4">
                        <HelpCircle className="h-6 w-6 text-blue-500 flex-shrink-0" />
                        <span className="text-left font-semibold">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="ml-10">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </div>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              พร้อมที่จะเริ่มต้นธุรกิจ Micro-SaaS หรือยัง?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              ลงทุนในตัวเองวันนี้ เพื่อรายได้ที่ยั่งยืนในอนาคต
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl"
                onClick={() => scrollToSection('pricing')}
              >
                ลงทะเบียนเรียนทันที ฿{courseData.price.toLocaleString()}
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>รับประกัน 14 วัน</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>เรียนได้ตลอดชีพ</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>ชุมชนนักเรียน</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MicroSaasCoursePage;
