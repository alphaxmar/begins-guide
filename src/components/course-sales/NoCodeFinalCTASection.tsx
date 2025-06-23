
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, Users } from 'lucide-react';

const NoCodeFinalCTASection = () => {
  const scrollToPricing = () => {
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            อย่าปล่อยให้โอกาสผ่านไป
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            ในขณะที่คุณกำลังคิด มีคนอื่นเริ่มสร้างธุรกิจไปแล้ว<br />
            <strong>การเปลี่ยนแปลงเริ่มต้นที่การตัดสินใจ</strong>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/20 rounded-xl p-6">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">เหลือเวลา</div>
              <div className="text-lg">48 ชั่วโมง</div>
              <div className="text-sm opacity-80">ราคาพิเศษนี้</div>
            </div>
            
            <div className="bg-white/20 rounded-xl p-6">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">เหลือที่ว่าง</div>
              <div className="text-lg">27 คน</div>
              <div className="text-sm opacity-80">จาก 50 คน</div>
            </div>
            
            <div className="bg-white/20 rounded-xl p-6">
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">ROI เฉลี่ย</div>
              <div className="text-lg">1,200%</div>
              <div className="text-sm opacity-80">ใน 6 เดือน</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">💭 จินตนาการถึงอนาคตของคุณ...</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-bold mb-2">❌ หากคุณไม่เริ่มวันนี้:</h4>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• ยังคงทำงานเก็บเงินทีละนิด</li>
                  <li>• มองดูคนอื่นประสบความสำเร็จ</li>
                  <li>• เสียโอกาสในตลาด No-Code Boom</li>
                  <li>• ยังไม่มีรายได้ Passive Income</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">✅ หากคุณเริ่มวันนี้:</h4>
                <ul className="space-y-1 text-sm opacity-90">
                  <li>• มีความรู้สร้างรายได้หลักหมื่น</li>
                  <li>• เป็นผู้เชี่ยวชาญ No-Code ในไทย</li>
                  <li>• มีอิสระทางการเงินและเวลา</li>
                  <li>• สร้างธุรกิจที่ใช่สำหรับคุณ</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-6 text-2xl"
              onClick={scrollToPricing}
            >
              🚀 เปลี่ยนชีวิตเริ่มต้นเดี๋ยวนี้
            </Button>
            
            <p className="text-lg text-blue-100">
              ⚡ เพียง 3,990 บาท • เข้าถึงได้ตลอดชีวิต • รับประกันคืนเงิน 30 วัน
            </p>
            
            <div className="text-sm text-blue-200">
              <p>"การลงทุนที่ดีที่สุดคือการลงทุนในตัวเอง" - Warren Buffett</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoCodeFinalCTASection;
