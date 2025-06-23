
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, TrendingUp } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          พร้อมที่จะเริ่มต้นหรือยัง?
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-purple-100">
          เข้าร่วมกับผู้ประกอบการมากกว่า 500 คนที่เชื่อมั่นใน Begins.guide
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/pricing">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl">
              เข้าร่วม Begins.guide PRO วันนี้
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>รับประกันความพึงพอใจ</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>ชุมชนผู้ประกอบการ</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>เครื่องมือ AI ครบครัน</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
