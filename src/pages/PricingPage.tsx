import { useAuth } from '@/contexts/AuthContext';
import { useVipStatus } from '@/hooks/useVipStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';

const PricingPage = () => {
  const { user } = useAuth();
  const { isVip } = useVipStatus();

  const plans = [
    {
      name: "สมาชิกทั่วไป",
      price: "ฟรี",
      period: "",
      description: "เริ่มต้นเรียนรู้และสร้างธุรกิจของคุณ",
      features: [
        "เข้าถึงบทความฟรี",
        "เครื่องมือพื้นฐาน",
        "คอมมิวนิตี้",
        "อัปเดตข่าวสาร"
      ],
      buttonText: user ? "แพลนปัจจุบัน" : "เริ่มใช้งานฟรี",
      current: user && !isVip,
      popular: false,
      icon: <Star className="w-6 h-6" />
    },
    {
      name: "Pro Member",
      price: "2,990",
      period: "/ปี",
      description: "สำหรับผู้ประกอบการที่ต้องการเครื่องมือครบครัน",
      features: [
        "เข้าถึงเครื่องมือ AI ทั้งหมด",
        "Template และ Resources",
        "คอร์สออนไลน์พิเศษ",
        "การสนับสนุนแบบ Priority",
        "Workshop เอกสิทธิ์",
        "การวิเคราะห์ขั้นสูง"
      ],
      buttonText: isVip ? "แพลนปัจจุบัน" : "อัปเกรดเป็น Pro",
      current: isVip,
      popular: true,
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: "VIP Member",
      price: "9,990",
      period: "/ปี", 
      description: "สำหรับผู้ประกอบการระดับสูงที่ต้องการคำปรึกษาส่วนตัว",
      features: [
        "ทุกสิ่งใน Pro Member",
        "1:1 Consultation",
        "Custom Solution",
        "MVP Development Support",
        "Exclusive Mastermind Group",
        "Unlimited Access ตลอดชีวิต"
      ],
      buttonText: "ติดต่อเพื่อสอบถาม",
      current: false,
      popular: false,
      icon: <Crown className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            เลือกแพลนที่เหมาะกับคุณ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            เริ่มต้นฟรี หรืออัปเกรดเพื่อปลดล็อกฟีเจอร์และเครื่องมือที่มีประสิทธิภาพมากขึ้น
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl scale-105' 
                  : 'border border-gray-200 hover:border-blue-300'
              } ${
                plan.current ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-2 text-sm font-semibold">
                  ⭐ แนะนำ
                </div>
              )}
              
              {plan.current && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2 text-sm font-semibold">
                  ✅ แพลนปัจจุบัน
                </div>
              )}

              <CardHeader className={`text-center ${plan.popular || plan.current ? 'pt-12' : 'pt-8'}`}>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price === "ฟรี" ? plan.price : `฿${plan.price}`}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full mt-6 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
                      : plan.current 
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  disabled={plan.current}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">คำถามที่พบบ่อย</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">สามารถเปลี่ยนแพลนได้ไหม?</h3>
              <p className="text-gray-600">ได้ครับ คุณสามารถอัปเกรดหรือดาวน์เกรดแพลนได้ตลอดเวลา</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">มีการคืนเงินไหม?</h3>
              <p className="text-gray-600">มีการรับประกันคืนเงิน 30 วัน หากไม่พอใจ</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">การชำระเงินปลอดภัยไหม?</h3>
              <p className="text-gray-600">ใช่ครับ เราใช้ระบบการชำระเงินที่ปลอดภัยและเชื่อถือได้</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">ได้รับการสนับสนุนอย่างไร?</h3>
              <p className="text-gray-600">มีทีมงานคอยให้ความช่วยเหลือผ่านหลายช่องทาง</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
