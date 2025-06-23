
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, TrendingUp, Users, CheckCircle2 } from "lucide-react";

const AIToolsSection = () => {
  return (
    <section className="mb-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          สร้างธุรกิจได้เร็วกว่าด้วยผู้ช่วย AI ส่วนตัวของคุณ
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          เครื่องมือ AI ที่ทำให้เราแตกต่างจากคู่แข่ง
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold mb-2">AI ช่วยคิดไอเดีย</h3>
              <p className="text-sm text-gray-600">หาไอเดียธุรกิจที่เหมาะกับคุณ</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold mb-2">AI วิเคราะห์ตลาด</h3>
              <p className="text-sm text-gray-600">วิเคราะห์โอกาสและคู่แข่ง</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-bold mb-2">AI ช่วยเขียน How-to</h3>
              <p className="text-sm text-gray-600">สร้างแผนการทำงานแบบขั้นตอน</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="font-bold mb-2">AI Tools อื่นๆ</h3>
              <p className="text-sm text-gray-600">เครื่องมือสำหรับทุกขั้นตอน</p>
            </CardContent>
          </Card>
        </div>
        
        <Link to="/pricing">
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white">
            ปลดล็อกเครื่องมือทั้งหมดด้วย PRO
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default AIToolsSection;
