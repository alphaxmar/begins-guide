
import React from 'react';
import { TrendingUp, DollarSign, Users, Zap, Calculator, Target } from 'lucide-react';

const NoCodeOpportunitySection = () => {
  return (
    <section id="opportunity-section" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            คณิตศาสตร์สู่รายได้ <span className="text-green-600">50,000 บาท/เดือน</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ดูตัวเลขจริงว่าทำไมธุรกิจ No-Code ถึงเป็นโอกาสทองในยุคนี้
          </p>
        </div>
        
        {/* Main Infographic */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">สร้างเว็บไซต์</h3>
              <p className="text-gray-600 mb-4">ใช้ No-Code Tools สร้างเว็บไซต์สวยงามโดยไม่ต้องเขียนโค้ด</p>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">5 วัน</div>
                <div className="text-sm text-gray-600">เวลาที่ใช้</div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">หาลูกค้า</h3>
              <p className="text-gray-600 mb-4">ใช้กลยุทธ์ดิจิทัลหาลูกค้าเป้าหมายแบบแม่นยำ</p>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-600">30 วัน</div>
                <div className="text-sm text-gray-600">ลูกค้าคนแรก</div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Scale ธุรกิจ</h3>
              <p className="text-gray-600 mb-4">ขยายธุรกิจด้วยระบบอัตโนมัติและทีมงาน</p>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">90 วัน</div>
                <div className="text-sm text-gray-600">เป้าหมาย 50K</div>
              </div>
            </div>
          </div>
          
          {/* Revenue Calculation */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">💰 การคำนวณรายได้จริง</h3>
              <p className="text-xl opacity-90">ตัวอย่างธุรกิจ Landing Page ราคา 15,000 บาท</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white/20 rounded-lg p-6">
                <Calculator className="h-8 w-8 mx-auto mb-3" />
                <div className="text-2xl font-bold">4 งาน</div>
                <div className="text-sm opacity-90">ต่อเดือน</div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-6">
                <DollarSign className="h-8 w-8 mx-auto mb-3" />
                <div className="text-2xl font-bold">15,000</div>
                <div className="text-sm opacity-90">บาท/งาน</div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-6">
                <Target className="h-8 w-8 mx-auto mb-3" />
                <div className="text-2xl font-bold">60,000</div>
                <div className="text-sm opacity-90">บาท/เดือน</div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-6">
                <TrendingUp className="h-8 w-8 mx-auto mb-3" />
                <div className="text-2xl font-bold">720,000</div>
                <div className="text-sm opacity-90">บาท/ปี</div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-lg opacity-90">
                นี่เป็นเพียงตัวอย่างเดียว! ธุรกิจ No-Code มีหลายรูปแบบที่ทำได้
              </p>
            </div>
          </div>
          
          {/* Market Opportunity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center bg-blue-50 rounded-xl p-6">
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-2">เร็ว</div>
              <p className="text-gray-600">สร้างเว็บไซต์ได้ใน 1 วัน แทนที่จะใช้เวลา 1 เดือน</p>
            </div>
            
            <div className="text-center bg-green-50 rounded-xl p-6">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-600 mb-2">ประหยัด</div>
              <p className="text-gray-600">ไม่ต้องจ้างโปรแกรมเมอร์ ประหยัดต้นทุนได้มากกว่า 80%</p>
            </div>
            
            <div className="text-center bg-purple-50 rounded-xl p-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-600 mb-2">สเกล</div>
              <p className="text-gray-600">ขยายธุรกิจได้ไม่จำกัด ด้วยระบบที่ยืดหยุ่น</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoCodeOpportunitySection;
