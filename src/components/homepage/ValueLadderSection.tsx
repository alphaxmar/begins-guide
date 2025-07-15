import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, BookOpen, GraduationCap, Users } from "lucide-react";

const ValueLadderSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              เส้นทางสู่อิสรภาพทางการเงิน
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              การเดินทางของคุณจะเริ่มต้นจากการออกแบบ และพัฒนาไปสู่การสร้างเครื่องจักรผลิตอิสรภาพที่แท้จริง
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 - Design */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Compass className="h-10 w-10 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Design</h3>
              <h4 className="text-lg font-semibold mb-2 text-primary">Dreamlining Tool</h4>
              <p className="text-muted-foreground mb-4">
                ออกแบบชีวิตในฝันและคำนวณเป้าหมายทางการเงิน
              </p>
              <Link to="/dreamline" className="text-primary hover:text-primary/80 font-medium">
                เริ่มต้นฟรี →
              </Link>
            </div>

            {/* Step 2 - Learn */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-10 w-10 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Learn</h3>
              <h4 className="text-lg font-semibold mb-2 text-primary">Freedom Engine Book</h4>
              <p className="text-muted-foreground mb-4">
                เรียนรู้หลักการและกลยุทธ์การสร้างธุรกิจออนไลน์
              </p>
              <span className="text-muted-foreground font-medium">
                เร็วๆ นี้...
              </span>
            </div>

            {/* Step 3 - Build */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <GraduationCap className="h-10 w-10 text-purple-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Build</h3>
              <h4 className="text-lg font-semibold mb-2 text-primary">Freedom Engine Academy</h4>
              <p className="text-muted-foreground mb-4">
                สร้างธุรกิจออนไลน์ด้วยคอร์สเรียนเชิงปฏิบัติ
              </p>
              <span className="text-muted-foreground font-medium">
                เร็วๆ นี้...
              </span>
            </div>

            {/* Step 4 - Grow */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Users className="h-10 w-10 text-orange-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Grow</h3>
              <h4 className="text-lg font-semibold mb-2 text-primary">The Architects' Circle</h4>
              <p className="text-muted-foreground mb-4">
                ชุมชนผู้ประกอบการระดับสูงสำหรับการเติบโตอย่างยั่งยืน
              </p>
              <span className="text-muted-foreground font-medium">
                เร็วๆ นี้...
              </span>
            </div>
          </div>

          {/* Arrow indicators for desktop */}
          <div className="hidden md:flex justify-center items-center mt-8 space-x-16">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueLadderSection;