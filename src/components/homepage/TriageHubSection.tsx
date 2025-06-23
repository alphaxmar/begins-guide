
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Target, Crown, Handshake } from "lucide-react";

const TriageHubSection = () => {
  return (
    <section className="mb-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">เลือกเส้นทางที่เหมาะกับคุณ</h2>
          <p className="text-xl text-gray-600">4 ทางเลือกสำหรับการเริ่มต้นธุรกิจของคุณ</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* เรียนรู้ด้วยตัวเอง */}
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg">เรียนรู้ด้วยตัวเอง</CardTitle>
              <CardDescription className="text-sm">สำหรับผู้ที่ชอบเรียนรู้เอง</CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                เริ่มต้นด้วยบทความและวิดีโอฟรี เรียนรู้พื้นฐานการทำธุรกิจและค้นหาไอเดีย
              </p>
              <Link to="/articles">
                <Button variant="outline" className="w-full" size="sm">
                  เริ่มเรียนรู้ฟรี
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* คอร์สและเครื่องมือ */}
          <Card className="hover:shadow-lg transition-shadow h-full">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg">คอร์สและเครื่องมือ</CardTitle>
              <CardDescription className="text-sm">สำหรับผู้ที่ต้องการเนื้อหาเฉพาะ</CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                เรียนคอร์สเฉพาะด้าน เช่น Micro-SaaS หรือซื้อเครื่องมือที่ต้องการใช้งาน
              </p>
              <Link to="/micro-saas-course">
                <Button variant="outline" className="w-full" size="sm">
                  ดูคอร์สทั้งหมด
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Begins.guide PRO - Featured */}
          <Card className="border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow relative h-full">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
              แนะนำ
            </Badge>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg text-purple-800">Begins.guide PRO</CardTitle>
              <CardDescription className="text-sm text-purple-600">สำหรับผู้ที่ต้องการทุกอย่าง</CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-purple-700 mb-6 text-sm leading-relaxed">
                เข้าถึงทุกคอร์ส ทุกเครื่องมือ และ AI Tools ทั้งหมดในราคาเดียว
              </p>
              <Link to="/pricing">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" size="sm">
                  อัปเกรดเป็น PRO
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* พาร์ทเนอร์ทางธุรกิจ */}
          <Card className="border-orange-200 bg-orange-50 hover:shadow-lg transition-shadow h-full">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg text-orange-800">พาร์ทเนอร์ทางธุรกิจ</CardTitle>
              <CardDescription className="text-sm text-orange-600">สำหรับองค์กรและนักลงทุน</CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-orange-700 mb-6 text-sm leading-relaxed">
                บริการให้คำปรึกษาและพัฒนา MVP แบบครบวงจรสำหรับโปรเจกต์ขนาดใหญ่
              </p>
              <Link to="/services/mvp-launchpad">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                  ปรึกษาโปรเจกต์
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TriageHubSection;
