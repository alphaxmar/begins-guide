
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

const NoCodeHeroSection = () => {
  const scrollToPricing = () => {
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-yellow-500 text-black font-bold px-4 py-2 text-sm">
              🔥 สุดฮิต! มีนักเรียนแล้ว 500+ คน
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              สร้างธุรกิจออนไลน์<br />
              <span className="text-yellow-400">50,000 บาท/เดือน</span><br />
              โดยไม่ต้องเขียนโค้ด
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              คอร์ส No-Code Webpreneur ที่จะสอนคุณสร้างธุรกิจออนไลน์ด้วย No-Code Tools 
              ในเวลาเพียง 90 วัน พร้อมแนวทางที่พิสูจน์แล้วจากผู้ประสบความสำเร็จจริง
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-400" />
                <span>90 วันสู่ธุรกิจแรก</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                <span>สำหรับมือใหม่ 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <span>ROI ที่พิสูจน์แล้ว</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg"
                onClick={scrollToPricing}
              >
                🚀 ลงทะเบียนเรียนเลย
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-purple-900 px-8 py-4 text-lg"
                onClick={() => document.getElementById('opportunity-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                ดูรายละเอียดเพิ่มเติม
              </Button>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm">รับประกันคืนเงิน 30 วัน</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm">อัปเดตฟรีตลอดชีวิต</span>
              </div>
            </div>
          </div>
          
          <div className="lg:text-right">
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400">3,990 บาท</div>
                    <div className="text-lg text-gray-300 line-through">6,990 บาท</div>
                    <div className="text-sm text-green-400 font-semibold">ประหยัด 43%</div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>8 โมดูลครบครัน</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>เข้าถึงได้ตลอดชีวิต</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>เทมเพลตและเครื่องมือฟรี</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>กลุ่มนักเรียน VIP</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3"
                    onClick={scrollToPricing}
                  >
                    เริ่มเรียนทันที
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoCodeHeroSection;
