
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Play, FileText, Download, Clock } from 'lucide-react';

const NoCodeModulesSection = () => {
  const modules = [
    {
      id: 1,
      title: "โมดูล 1: รู้จักกับ No-Code Ecosystem",
      duration: "2 ชั่วโมง",
      lessons: 6,
      description: "เรียนรู้พื้นฐานและเครื่องมือ No-Code ที่จำเป็น",
      content: [
        "รู้จักกับ No-Code คืออะไร และทำไมถึงเป็นอนาคต",
        "แนะนำเครื่องมือ No-Code ยอดนิยม (Webflow, Bubble, Airtable)",
        "เปรียบเทียบข้อดี-ข้อเสียของแต่ละเครื่องมือ",
        "วางแผนเลือกเครื่องมือที่เหมาะกับธุรกิจของคุณ",
        "สร้างบัญชีและเตรียมเครื่องมือพื้นฐาน",
        "Workshop: วิเคราะห์โครงการแรกของคุณ"
      ]
    },
    {
      id: 2,
      title: "โมดูล 2: การออกแบบ UX/UI แบบมืออาชีพ",
      duration: "3 ชั่วโมง",
      lessons: 8,
      description: "สร้าง User Experience ที่ดีและ Interface ที่สวยงาม",
      content: [
        "หลักการ UX Design พื้นฐาน",
        "การวิจัยและทำความเข้าใจผู้ใช้",
        "การออกแบบ User Journey และ Wireframe",
        "หลักการ Visual Design และ Color Theory",
        "การใช้ Figma สำหรับการออกแบบ",
        "การสร้าง Design System",
        "Mobile-First Design Strategy",
        "Workshop: ออกแบบเว็บไซต์แรกของคุณ"
      ]
    },
    {
      id: 3,
      title: "โมดูล 3: สร้างเว็บไซต์ด้วย Webflow",
      duration: "4 ชั่วโมง",
      lessons: 10,
      description: "มาสเตอร์ Webflow เพื่อสร้างเว็บไซต์ระดับมืออาชีพ",
      content: [
        "รู้จักกับ Webflow Interface และ Workspace",
        "การสร้าง Layout และ Grid System",
        "การใช้ Components และ Symbols",
        "การทำ Responsive Design",
        "การเพิ่ม Animations และ Interactions",
        "การเชื่อมต่อ CMS และ Database",
        "การ Optimize ความเร็วและ SEO",
        "การ Publish และ Deploy เว็บไซต์",
        "การแก้ไขปัญหาที่พบบ่อย",
        "Workshop: สร้างเว็บไซต์สำหรับธุรกิจจริง"
      ]
    },
    {
      id: 4,
      title: "โมดูล 4: ระบบฐานข้อมูลและ Automation",
      duration: "3 ชั่วโมง",
      lessons: 7,
      description: "สร้างระบบหลังบ้านที่ทำงานอัตโนมัติ",
      content: [
        "การใช้ Airtable เป็น Database",
        "การออกแบบ Data Structure",
        "การเชื่อมต่อ Webflow กับ External Database",
        "การสร้างระบบ Forms และ Data Collection",
        "รู้จักกับ Zapier และ Automation",
        "การสร้าง Workflow อัตโนมัติ",
        "Workshop: สร้างระบบ CRM อัตโนมัติ"
      ]
    },
    {
      id: 5,
      title: "โมดูล 5: E-commerce และ Payment Integration",
      duration: "3 ชั่วโมง",
      lessons: 8,
      description: "สร้างร้านค้าออนไลน์และระบบชำระเงิน",
      content: [
        "การสร้าง E-commerce Store ด้วย Webflow",
        "การตั้งค่า Product Catalog",
        "การเชื่อมต่อ Payment Gateway (Stripe, PayPal)",
        "การจัดการ Inventory และ Orders",
        "การสร้างระบบ Member และ Login",
        "การทำ Email Marketing Automation",
        "การวิเคราะห์ยอดขายและ Conversion",
        "Workshop: สร้างร้านค้าออนไลน์ครบครัน"
      ]
    },
    {
      id: 6,
      title: "โมดูล 6: Digital Marketing และ SEO",
      duration: "4 ชั่วโมง",
      lessons: 9,
      description: "ทำการตลาดออนไลน์และเพิ่มการมองเห็น",
      content: [
        "SEO On-Page และ Technical SEO",
        "การใช้ Google Analytics และ Search Console",
        "การทำ Content Marketing",
        "Social Media Marketing Strategy",
        "การใช้ Facebook Ads และ Google Ads",
        "Email Marketing และ Lead Generation",
        "การวิเคราะห์ Competitor",
        "การสร้าง Marketing Funnel",
        "Workshop: วางแผนการตลาด 90 วัน"
      ]
    },
    {
      id: 7,
      title: "โมดูล 7: การหาลูกค้าและ Client Acquisition",
      duration: "3 ชั่วโมง",
      lessons: 7,
      description: "กลยุทธ์หาลูกค้าและปิดการขายอย่างมืออาชีพ",
      content: [
        "การวิเคราะห์ Target Market",
        "การสร้าง Value Proposition",
        "การเขียน Proposal ที่ชนะใจ",
        "เทคนิคการ Pitch และ Presentation",
        "การต่อรองราคาและปิดการขาย",
        "การสร้างความสัมพันธ์กับลูกค้าระยะยาว",
        "Workshop: หาลูกค้า 3 ราย ใน 30 วัน"
      ]
    },
    {
      id: 8,
      title: "โมดูล 8: Scale Business และ Passive Income",
      duration: "4 ชั่วโมง",
      lessons: 10,
      description: "ขยายธุรกิจและสร้างรายได้แบบ Passive",
      content: [
        "การสร้างทีมงานและ Outsourcing",
        "การสร้างระบบ Process และ Documentation",
        "การพัฒนา Digital Products",
        "การสร้าง Online Course และ Membership",
        "การสร้าง SaaS หรือ Software Business",
        "การสร้าง Affiliate และ Partnership",
        "การบริหารการเงินธุรกิจ",
        "Legal และ Tax Considerations",
        "การวางแผนอนาคตธุรกิจ",
        "Workshop: วางแผน Scale ธุรกิจใน 1 ปี"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            8 โมดูลครบครัน
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            เรียนรู้ทีละขั้นตอนจากศูนย์จนสร้างธุรกิจได้เงินจริง
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {modules.map((module) => (
              <AccordionItem 
                key={module.id} 
                value={`module-${module.id}`}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline bg-gray-50 px-6 py-6">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                      {module.id}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {module.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          {module.lessons} บทเรียน
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="border-t pt-6">
                    <p className="text-gray-700 mb-6">{module.description}</p>
                    <h4 className="font-semibold text-gray-900 mb-4">รายละเอียดบทเรียน:</h4>
                    <ul className="space-y-2">
                      {module.content.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">รวมทั้งหมด</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">26 ชั่วโมง</div>
                  <div className="text-gray-600">วิดีโอเนื้อหา</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">65 บทเรียน</div>
                  <div className="text-gray-600">แบ่งย่อยละเอียด</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">8 Workshop</div>
                  <div className="text-gray-600">ลงมือทำจริง</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoCodeModulesSection;
