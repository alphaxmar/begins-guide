
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="mb-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">เรื่องราวความสำเร็จจากสมาชิก</h2>
          <p className="text-xl text-gray-600">พวกเขาทำได้ คุณก็ทำได้เหมือนกัน</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Begins.guide ช่วยให้ผมเริ่มต้นธุรกิจออนไลน์ได้สำเร็จ ตอนนี้มีรายได้เดือนละ 50,000 บาท"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ส
                </div>
                <div>
                  <p className="font-bold">คุณสมชาย ใจดี</p>
                  <p className="text-gray-500 text-sm">ผู้ก่อตั้ง Online Shop</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "เครื่องมือ AI ช่วยให้ผมประหยัดเวลาไปมากมาย สามารถมีธุรกิจควบคู่กับงานประจำได้"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ก
                </div>
                <div>
                  <p className="font-bold">คุณกิตติ ทำดี</p>
                  <p className="text-gray-500 text-sm">Freelancer</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "จากที่ไม่รู้จะเริ่มยังไง ตอนนี้มีธุรกิจครบ 6 เดือนแล้ว ขอบคุณ Begins.guide มากครับ"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  น
                </div>
                <div>
                  <p className="font-bold">น้องนุช สร้างฝัน</p>
                  <p className="text-gray-500 text-sm">นักเรียนปี 4</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
