
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const NoCodeFAQSection = () => {
  const faqs = [
    {
      question: "ฉันไม่มีพื้นฐานเทคนิคเลย เรียนได้ไหม?",
      answer: "ได้แน่นอน! คอร์สนี้ออกแบบมาสำหรับมือใหม่ 100% เราจะสอนตั้งแต่เริ่มต้น ไม่ต้องมีความรู้ด้านเทคนิคมาก่อน"
    },
    {
      question: "ต้องใช้เวลาเรียนเท่าไหร่?",
      answer: "คอร์สรวม 26 ชั่วโมง แบ่งเป็น 65 บทเรียน คุณสามารถเรียนได้ตามสะดวก แนะนำให้เรียนวันละ 1-2 ชั่วโมง จะจบใน 2-3 สัปดาห์"
    },
    {
      question: "เครื่องมือ No-Code ต้องเสียค่าใช้จ่ายเพิ่มไหม?",
      answer: "เครื่องมือส่วนใหญ่มี Free Plan ให้ใช้เรียน เมื่อเริ่มมีลูกค้าแล้วค่อยอัปเกรดเป็น Pro (ประมาณ 500-1,500 บาท/เดือน) ซึ่งถือว่าน้อยมากเมื่อเทียบกับรายได้ที่ได้"
    },
    {
      question: "รับประกันว่าจะหาลูกค้าได้จริงไหม?",
      answer: "เราไม่สามารถรับประกันผลลัพธ์ 100% ได้ เพราะขึ้นกับความพยายามของแต่ละคน แต่เรามีแนวทางและกลยุทธ์ที่พิสูจน์แล้วจากนักเรียนหลายร้อยคน"
    },
    {
      question: "ถ้าไม่พอใจจะคืนเงินได้ไหม?",
      answer: "ได้ครับ! เรามีนโยบายคืนเงิน 30 วัน หากคุณไม่พอใจด้วยเหตุผลใดก็ตาม เราจะคืนเงินให้ 100% ไม่ถามคำถาม"
    },
    {
      question: "เรียนจบแล้วจะได้ใบรับรองไหม?",
      answer: "ได้ครับ! เมื่อเรียนจบทุกโมดูลและส่ง Workshop ครบ คุณจะได้รับ Certificate of Completion ที่สามารถใช้แสดงความสามารถกับลูกค้าได้"
    },
    {
      question: "มีการสนับสนุนหลังเรียนจบไหม?",
      answer: "มีครับ! คุณจะได้เข้ากลุ่ม VIP ตลอดชีวิต มีการอัปเดตเนื้อหาใหม่ฟรี และมี Q&A session ทุกเดือน"
    },
    {
      question: "แตกต่างจากคอร์สอื่นยังไง?",
      answer: "คอร์สเรานำเสนอแนวทางที่ใช้ได้จริง มีตัวอย่างผลงานจริง และมีนักเรียนที่ประสบความสำเร็จมากกว่า 500+ คน ไม่ใช่แค่ทฤษฎี"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            คำถามที่พบบ่อย
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            คำตอบสำหรับคำถามที่นักเรียนส่วนใหญ่สงสัย
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline bg-gray-50 px-6 py-6 text-left">
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="border-t pt-6">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-4">
            ยังมีคำถามอื่นๆ อีกไหม?
          </p>
          <a 
            href="mailto:support@begins.guide" 
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ติดต่อเราได้ที่ support@begins.guide
          </a>
        </div>
      </div>
    </section>
  );
};

export default NoCodeFAQSection;
