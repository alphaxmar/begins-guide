
import React from 'react';
import { Star, Quote } from 'lucide-react';

const NoCodeTestimonialsSection = () => {
  const testimonials = [
    {
      name: "คุณนภัสสร จันทร์เพ็ญ",
      role: "Freelance Designer",
      image: "/placeholder.svg",
      content: "เรียนจบแล้วสามารถสร้างรายได้ 45,000 บาทในเดือนแรก จากการทำเว็บไซต์ให้ร้านค้าใกล้บ้าน ง่ายมากจริงๆ!",
      rating: 5,
      result: "รายได้ 45,000 บาท/เดือน"
    },
    {
      name: "คุณพีรพล สินธุรักษ์",
      role: "นักขาย -> Web Developer",
      image: "/placeholder.svg",
      content: "จากนักขายประกันที่เครียด กลายเป็น Freelancer ที่มีเวลาเป็นของตัวเอง และรายได้ดีกว่าเดิมถึง 3 เท่า",
      rating: 5,
      result: "เปลี่ยนอาชีพสำเร็จ"
    },
    {
      name: "คุณสาวิตรี มณีรัตน์",
      role: "แม่บ้าน -> Digital Entrepreneur",
      image: "/placeholder.svg",
      content: "เป็นแม่บ้านมา 5 ปี เรียนคอร์สนี้แล้วสามารถทำงานจากบ้านได้ รายได้เดือนละ 35,000 บาท ดูแลลูกได้ด้วย",
      rating: 5,
      result: "Work from Home สำเร็จ"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            เสียงจากนักเรียนจริง
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ฟังประสบการณ์จากคนที่เปลี่ยนชีวิตด้วยคอร์สนี้แล้ว
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg relative">
              <Quote className="h-8 w-8 text-blue-500 mb-4" />
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="border-t pt-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <div className="mt-4 bg-green-50 rounded-lg p-3">
                  <div className="text-sm font-semibold text-green-700">ผลลัพธ์:</div>
                  <div className="text-green-600">{testimonial.result}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600">
            <strong>มีนักเรียนกว่า 500+ คน</strong> ที่สร้างความสำเร็จจากคอร์สนี้แล้ว
          </p>
        </div>
      </div>
    </section>
  );
};

export default NoCodeTestimonialsSection;
