
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, TrendingUp } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          เริ่มต้นการเรียนรู้วันนี้
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-purple-100">
          เข้าร่วมกับนักเรียนมากกว่า 500 คนที่กำลังพัฒนาตนเองด้วยคอร์สเรียนของเรา
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/products">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl">
              ดูคอร์สเรียนทั้งหมด
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600 px-8 py-4">
              ดู Begins.guide PRO
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>เรียนออนไลน์ได้ทุกที่</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>ชุมชนนักเรียน</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>อัปเดตเนื้อหาใหม่</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
