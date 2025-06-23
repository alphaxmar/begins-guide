
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Users, Gift } from 'lucide-react';
import StripeCheckoutButton from '@/components/payment/StripeCheckoutButton';

const NoCodePricingSection = () => {
  // This would be the actual product ID for the No-Code Webpreneur course
  const courseProductId = "nocode-webpreneur-course"; // This should be replaced with actual product ID

  return (
    <section id="pricing-section" className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            เริ่มต้นเปลี่ยนชีวิตวันนี้
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            ลงทุน 3,990 บาท เพื่อสร้างรายได้หลักหมื่นต่อเดือนตลอดชีวิต
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 relative overflow-hidden">
            {/* Special offer badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-500 text-black font-bold px-6 py-2 rounded-full text-sm">
                🔥 เปิดจำหน่ายครั้งแรก ลด 43%
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-4">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl font-bold text-yellow-400">3,990 บาท</div>
                    <div className="text-2xl text-gray-300 line-through">6,990 บาท</div>
                  </div>
                  <p className="text-lg text-blue-100">ชำระครั้งเดียว • เข้าถึงได้ตลอดชีวิต</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">สิ่งที่คุณจะได้รับ:</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>คอร์สเรียน 8 โมดูล (มูลค่า 4,990 บาท)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>เทมเพลตและเครื่องมือ 50+ ชิ้น (มูลค่า 1,500 บาท)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>เข้ากลุ่ม VIP นักเรียน (มูลค่า 500 บาท)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>อัปเดตฟรีตลอดชีวิต</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>รับประกันคืนเงิน 30 วัน</span>
                    </div>
                  </div>
                </div>
                
                {/* Bonus section */}
                <div className="bg-yellow-500/20 rounded-xl p-6 border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="h-6 w-6 text-yellow-400" />
                    <span className="font-bold text-yellow-400">โบนัสพิเศษ!</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>• 1-on-1 Consultation 30 นาที (มูลค่า 1,500 บาท)</div>
                    <div>• Template Web Agency Proposal (มูลค่า 990 บาท)</div>
                    <div>• Checklist การหาลูกค้า 100 วิธี (มูลค่า 490 บาท)</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white/20 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold mb-4 text-center">เริ่มเรียนได้ทันที</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-400" />
                      <span>เรียนได้ 24/7 ตามสะดวก</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-green-400" />
                      <span>สำหรับมือใหม่ 100%</span>
                    </div>
                  </div>
                  
                  <StripeCheckoutButton
                    productIds={[courseProductId]}
                    amount={3990}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 text-lg"
                  />
                  
                  <p className="text-center text-sm text-blue-100 mt-4">
                    💳 ชำระผ่าน Stripe ปลอดภัย 100%
                  </p>
                </div>
                
                <div className="text-center text-sm text-blue-100">
                  <p>⚡ Limited Time: เหลือเพียง 48 ชั่วโมง</p>
                  <p>👥 เหลือที่ว่าง: 27/50 คน</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Money back guarantee */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3 bg-green-600 rounded-full px-6 py-3">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">รับประกันคืนเงิน 30 วัน</span>
            </div>
            <p className="text-blue-100 mt-4 max-w-2xl mx-auto">
              หากคุณไม่พอใจกับคอร์สเรียน เราคืนเงินให้ 100% ไม่ถามคำถาม
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoCodePricingSection;
