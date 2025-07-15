import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Star, Crown, Zap, Gift, Clock, Shield, ArrowDown, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const AcademyCoursePage = () => {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    pricingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const modules = [
    {
      title: "Module 1: The Architect's Mindset",
      content: "เริ่มต้นด้วยการปรับ Mindset ให้คิดเป็น 'สถาปนิก' แห่งอิสรภาพ ไม่ใช่ 'คนงาน' ที่ทำงานหนัก เรียนรู้หลักการคิดแบบ CEO ที่แท้จริง การออกแบบชีวิตที่คุณต้องการ และการสร้างวิสัยทัศน์ที่ชัดเจนสำหรับ 'เครื่องจักร' ของคุณ"
    },
    {
      title: "Module 2: Blueprinting Your Engine",
      content: "ออกแบบพิมพ์เขียวของ 'เครื่องจักรทำเงิน' ของคุณอย่างเป็นระบบ เรียนรู้ Business Model Canvas แบบพิเศษ การเลือกช่องทางรายได้ที่เหมาะสม และการวางแผนระบบที่จะทำงานแทนคุณได้จริง"
    },
    {
      title: "Module 3: Building Your AI Workforce (ภาคปฏิบัติ)",
      content: "สร้าง 'ทีมงาน AI' ที่จะทำงานแทนคุณ 24 ชั่วโมง เรียนรู้การใช้เครื่องมือ AI สำหรับการตลาด การขาย การผลิตเนื้อหา และการบริการลูกค้า พร้อม Template และ Prompt Library ที่พร้อมใช้งาน"
    },
    {
      title: "Module 4: Activating The Automation Switchboard (ภาคปฏิบัติ)",
      content: "เชื่อมต่อทุกส่วนให้ทำงานร่วมกันอย่างไร้รอยต่อ ตั้งแต่การหาลูกค้า การขาย การส่งสินค้า จนถึงการดูแลหลังการขาย สร้างระบบที่ทำงานแทนคุณแม้ตอนที่คุณหลับ"
    },
    {
      title: "Module 5: The 2-Hour CEO",
      content: "เรียนรู้ศิลปะการเป็น 'CEO 2 ชั่วโมง' การจัดการเวลา การมอบหมายงาน (แม้แต่กับ AI) และการสร้างสมดุลชีวิตที่แท้จริง พร้อมแผนการขยายธุรกิจแบบยั่งยืน"
    }
  ];

  const bonuses = [
    {
      icon: <Zap className="h-8 w-8 text-amber-400" />,
      title: "โบนัส #1: The Ultimate AI Prompt Library",
      description: "คลังคำสั่ง AI สำเร็จรูปกว่า 200 แบบสำหรับงานธุรกิจ",
      value: "มูลค่า 2,990 บาท",
      detailedDescription: "คลังคำสั่ง AI ที่ครอบคลุมทุกงานในธุรกิจ รวมถึงการเขียนโฆษณา การสร้างเนื้อหา การวิเคราะห์ข้อมูล การบริการลูกค้า และอีกมากมาย พร้อมตัวอย่างการใช้งานจริงที่ทดลองแล้วและให้ผลลัพธ์ดี"
    },
    {
      icon: <Crown className="h-8 w-8 text-amber-400" />,
      title: "โบนัส #2: Business Template Vault",
      description: "คลังเอกสารธุรกิจที่จำเป็นกว่า 50 แบบ (สัญญา, ใบเสนอราคา)",
      value: "มูลค่า 4,990 บาท",
      detailedDescription: "เทมเพลตสำเร็จรูปครบครันสำหรับการทำธุรกิจ รวมถึง Contract Templates, Proposal Templates, Workflow Documents, SOP, และเอกสารทางกฎหมายพื้นฐาน ทั้งหมดถูกออกแบบโดยผู้เชี่ยวชาญและใช้งานได้จริง"
    },
    {
      icon: <Gift className="h-8 w-8 text-amber-400" />,
      title: "โบนัส #3: Weekly Q&A Access",
      description: "สิทธิ์เข้าร่วม Group Coaching สดทุกสัปดาห์ 3 เดือน (สำหรับผู้ซื้อใน 48 ชม. แรก)",
      value: "มูลค่า 7,500 บาท",
      detailedDescription: "สิทธิพิเศษในการเข้าร่วมเซสชัน Q&A สดกับผู้สอนทุกสัปดาห์เป็นเวลา 3 เดือน ได้ถามคำถามเฉพาะเจาะจง รับคำแนะนำส่วนตัว และแลกเปลี่ยนประสบการณ์กับเพื่อนนักเรียนที่มีเป้าหมายเดียวกัน"
    },
    {
      icon: <Settings className="h-8 w-8 text-amber-400" />,
      title: "โบนัส #4: The Automation Arsenal",
      description: "คลังแสง n8n Templates และ AI Agent ส่วนตัวสำหรับสร้างระบบอัตโนมัติ",
      value: "มูลค่า 19,900 บาท",
      detailedDescription: "ชุดเครื่องมืออัตโนมัติที่ทรงพลังที่สุด ประกอบด้วย n8n Workflow Templates ที่พร้อมใช้งาน, Idea Engine GPT ส่วนตัวสำหรับการระดมสมอง, และ Custom AI Agents ที่จะช่วยทำงานต่างๆ แทนคุณ รวมมูลค่ากว่า 19,900 บาท"
    }
  ];

  const valueStack = [
    { item: "Freedom Engine Academy (คอร์สหลัก)", value: "29,000" },
    { item: "โบนัส #1: Ultimate AI Prompt Library", value: "2,990" },
    { item: "โบนัส #2: Business Template Vault", value: "4,990" },
    { item: "โบนัส #3: Weekly Q&A Access (3 เดือน)", value: "7,500" },
    { item: "โบนัส #4: The Automation Arsenal", value: "19,900" }
  ];

  const totalValue = valueStack.reduce((sum, item) => sum + parseInt(item.value.replace(",", "")), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-purple-500/10"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <Badge className="mb-6 bg-amber-500/20 text-amber-400 border-amber-400/30 px-4 py-2 text-sm font-medium">
            🚀 FLAGSHIP COURSE
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent leading-tight">
            เปลี่ยนไอเดียของคุณให้เป็น<br />
            'เครื่องจักรผลิตอิสรภาพ'<br />
            ที่ทำงานแทนคุณ 24 ชั่วโมง
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            คอร์สออนไลน์ภาคปฏิบัติเพียงคอร์สเดียว ที่จะพาคุณจากการมีแค่ "ไอเดีย" 
            ไปสู่การมี "ระบบธุรกิจอัตโนมัติ" ที่สร้างรายได้ให้คุณแม้ตอนหลับ
          </p>
          
          <Button 
            onClick={scrollToPricing}
            size="lg" 
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
          >
            ดูรายละเอียดคอร์สทั้งหมด
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">พร้อมการรับประกันความพึงพอใจ คืนเงินใน 14 วัน</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-amber-400">
            คุณเจอปัญหาเหล่านี้อยู่ใช่ไหม?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="text-red-400 text-4xl mb-4">😰</div>
              <h3 className="text-xl font-semibold mb-3">มี "ไอเดีย" แต่ไม่รู้จะเริ่มยังไง</h3>
              <p className="text-slate-300">
                มีความคิดดีๆ เยอะแยะ แต่ไม่รู้ว่าจะแปลงเป็นธุรกิจจริงได้อย่างไร
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="text-orange-400 text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-3">ไม่มีเวลาทำงานหนักตลอด 24 ชั่วโมง</h3>
              <p className="text-slate-300">
                อยากมีธุรกิจแต่ไม่อยากติดอยู่กับงานทุกวัน อยากได้เวลาเป็นของตัวเอง
              </p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="text-blue-400 text-4xl mb-4">🤔</div>
              <h3 className="text-xl font-semibold mb-3">ไม่รู้จะใช้เทคโนโลยียังไง</h3>
              <p className="text-slate-300">
                รู้ว่า AI และ Automation สำคัญ แต่ไม่รู้จะประยุกต์ใช้ในธุรกิจได้อย่างไร
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            ขอต้อนรับสู่ <span className="text-amber-400">Freedom Engine Academy</span>
          </h2>
          
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            คอร์สเดียวที่จะสอนคุณสร้าง "เครื่องจักรทำเงิน" ที่ทำงานแทนคุณ 24 ชั่วโมง 
            ด้วยการผสมผสานระหว่าง AI, Automation และกลยุทธ์ธุรกิจที่พิสูจน์แล้ว 
            ไม่ใช่แค่ทฤษฎี แต่เป็นภาคปฏิบัติจริงที่คุณทำตามได้ทันที
          </p>
        </div>
      </section>

      {/* Module Breakdown Section */}
      <section className="py-16 px-6 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
            5 โมดูลที่จะเปลี่ยนชีวิตคุณ
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {modules.map((module, index) => (
              <AccordionItem 
                key={index} 
                value={`module-${index}`}
                className="bg-slate-800/50 rounded-lg border border-slate-700/50 px-6"
              >
                <AccordionTrigger className="text-white hover:text-amber-400 text-left text-lg font-semibold py-6">
                  {module.title}
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 pb-6 text-base leading-relaxed">
                  {module.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bonus Stack Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
            โบนัสพิเศษ <span className="text-amber-400">มูลค่ากว่า 35,000 บาท</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {bonuses.map((bonus, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:border-amber-400/50 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {bonus.icon}
                  </div>
                  <CardTitle className="text-white text-xl mb-2">{bonus.title}</CardTitle>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30">
                    {bonus.value}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-300 leading-relaxed mb-4">
                    {bonus.description}
                  </p>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-amber-400/30 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400"
                      >
                        ดูรายละเอียดเพิ่มเติม
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-amber-400 text-xl flex items-center gap-3">
                          {bonus.icon}
                          {bonus.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30">
                          {bonus.value}
                        </Badge>
                        <p className="text-slate-300 leading-relaxed text-base">
                          {bonus.detailedDescription}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Offer & Pricing Section */}
      <section id="pricing-section" className="py-20 px-6 bg-gradient-to-r from-amber-500/10 via-blue-500/5 to-purple-500/10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                🎯 ข้อเสนอพิเศษสำหรับคุณ
              </h2>
              <p className="text-xl text-slate-300">
                สิ่งที่คุณจะได้รับทั้งหมด
              </p>
            </div>

            {/* Value Stack */}
            <div className="bg-slate-900/50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">รายการสิ่งที่คุณจะได้รับ</h3>
              <div className="space-y-3">
                {valueStack.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700/30 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-white">{item.item}</span>
                    </div>
                    <span className="text-amber-400 font-semibold">฿{item.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-600 mt-6 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">มูลค่ารวมทั้งหมด</span>
                  <span className="text-2xl font-bold text-slate-400 line-through">
                    ฿{totalValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Final Price */}
            <div className="text-center mb-8">
              <div className="text-6xl md:text-7xl font-bold text-amber-400 mb-4">
                ฿15,900
              </div>
              <p className="text-lg text-slate-300 mb-2">
                (หรือเลือกผ่อนชำระ 0% 10 เดือน เดือนละ ฿1,590)
              </p>
              <div className="flex items-center justify-center gap-2 text-green-400 mb-6">
                <Shield className="h-5 w-5" />
                <span className="font-medium">การรับประกันความพึงพอใจ 100% คืนเงินใน 14 วัน</span>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xl px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
              >
                <Link to="/checkout">
                  สมัครเรียนและสร้างเครื่องจักรของคุณทันที
                  <Crown className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>เข้าถึงทันทีหลังชำระเงิน</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>เนื้อหาใหม่ตลอดชีวิต</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcademyCoursePage;