
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Shield, TrendingUp } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";

const HeroSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            เปลี่ยนไอเดียให้เป็นธุรกิจจริง<br />
            <span className="text-yellow-400">เริ่มต้นอย่างถูกวิธี</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
            แพลตฟอร์มความรู้, เครื่องมือ, และผู้ช่วย AI สำหรับผู้ประกอบการยุคใหม่
          </p>
          
          <div className="mb-8">
            <NewsletterSignup />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/pricing">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3">
                สำรวจ Begins.guide PRO
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/articles">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600 px-8 py-3">
                เริ่มเรียนรู้ฟรี
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>500+ ผู้ประกอบการ</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>เครื่องมือครบครัน</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>ผลลัพธ์ที่พิสูจน์แล้ว</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
