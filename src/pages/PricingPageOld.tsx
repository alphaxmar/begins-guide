import { useAuth } from '@/contexts/AuthContext';
import { useVipStatus } from '@/hooks/useVipStatus';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, Calculator, BookOpen } from 'lucide-react';

const PricingPage = () => {
  const { user } = useAuth();
  const { isVip } = useVipStatus();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();

  const plans = [
    {
      id: "beginner",
      name: "Beginner",
      price: "ฟรี",
      period: "",
      description: "เริ่มต้นการเดินทางสู่อิสรภาพทางการเงิน",
      features: [
        "Dreamlining Calculator ไม่จำกัด",
        "เข้าถึงบทความพื้นฐาน",
        "Interactive Dreamlining Tool",
        "Community Board เบื้องต้น"
      ],
      buttonText: user ? "ใช้งานอยู่" : "สร้างบัญชีฟรี",
      current: user && !hasBookAccess && !hasCourseAccess && !isVip,
      popular: false,
      icon: <Calculator className="w-6 h-6" />,
      buttonAction: () => window.location.href = '/auth'
    },
    {
      id: "reader", 
      name: "Reader",
      price: "450",
      period: "/ครั้งเดียว",
      description: "พิมพ์เขียวฉบับเต็มพร้อมเครื่องมือเสริม",
      features: [
        "ทุกอย่างใน Beginner",
        "หนังสือ 'The Freedom Engine'",
        "ปลดล็อก Case Study พิเศษ",
        "เข้าถึง Community Board",
        "Begins.Guide AI (ทดลอง 10 ครั้ง)"
      ],
      buttonText: hasBookAccess ? "แพลนปัจจุบัน" : "ซื้อหนังสือ",
      current: hasBookAccess && !hasCourseAccess && !isVip,
      popular: false,
      icon: <BookOpen className="w-6 h-6" />,
      buttonAction: () => window.location.href = '/products'
    },
    {
      id: "pro",
      name: "Pro Member", 
      price: "2,990",
      period: "/ปี",
      description: "หลักสูตรปฏิบัติการและเครื่องมือ AI ครบชุด",
      features: [
        "ทุกอย่างใน Reader",
        "Freedom Engine Academy (วิดีโอทั้งหมด)",
        "เครื่องมือ AI ทั้งหมดไม่จำกัด",
        "Toolkit และ Template ครบชุด",
        "การสนับสนุนแบบ Priority",
        "Workshop เอกสิทธิ์"
      ],
      buttonText: hasCourseAccess ? "แพลนปัจจุบัน" : "อัปเกรดเป็น Pro",
      current: hasCourseAccess && !isVip,
      popular: true,
      icon: <Zap className="w-6 h-6" />,
      buttonAction: () => console.log('Pro signup')
    },
    {
      id: "circle",
      name: "Circle Member",
      price: "9,990", 
      period: "/ปี",
      description: "The Architects' Circle - ชุมชนระดับสูงสุด",
      features: [
        "ทุกอย่างใน Pro Member",
        "Live Workshop รายเดือน",
        "กลุ่มแชทส่วนตัว (Discord/Slack)",
        "1:1 Consultation",
        "Custom Solution",
        "คอนเทนต์ใหม่ก่อนใคร"
      ],
      buttonText: isVip ? "แพลนปัจจุบัน" : "เข้าร่วม Circle",
      current: isVip,
      popular: false,
      icon: <Crown className="w-6 h-6" />,
      buttonAction: () => console.log('Circle signup')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            The Begins.Guide Value Ladder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            จาก Dreamer สู่ Architect - เลือกระดับที่เหมาะกับการเดินทางของคุณ
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
            <Star className="h-4 w-4" />
            <span>เริ่มฟรี → ปรับเปลี่ยนได้ตลอดเวลา</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
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
                      <span className="text-gray-700 text-sm">{feature}</span>
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
                  onClick={plan.buttonAction}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Value Ladder Explanation */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Begins.Guide Journey: From Dreamer to Architect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  เริ่มต้นที่ Beginner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ทดลองใช้ Dreamlining Calculator ฟรี และเริ่มต้นวางแผนเส้นทางสู่อิสรภาพทางการเงินของคุณ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  ก้าวสู่ Reader
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  รับพิมพ์เขียวฉบับเต็ม "The Freedom Engine" พร้อม Case Studies และเครื่องมือเสริม
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  ปฏิบัติการใน Pro Member
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  เข้าถึงหลักสูตรวิดีโอครบชุด เครื่องมือ AI ทั้งหมด และ Toolkit สำหรับลงมือทำจริง
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-600" />
                  มาสเตอร์ใน Circle Member
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  เข้าร่วม The Architects' Circle ชุมชนระดับสูงสุด พร้อมการสนับสนุนส่วนตัวและ Workshop สด
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">คำถามที่พบบ่อย</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">สามารถอัปเกรดหรือดาวน์เกรดได้ไหม?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ได้ครับ คุณสามารถอัปเกรดได้ตลอดเวลา และเราจะคิดราคาแบบ Pro-rated สำหรับระยะเวลาที่เหลือ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">มี Free Trial สำหรับ Pro Member ไหม?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ระดับ Beginner และ Reader ทำหน้าที่เป็น Free Trial ให้คุณได้ทดลองระบบก่อนอัปเกรดเป็น Pro Member
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Circle Member ต่างจาก Pro Member อย่างไร?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Circle Member จะได้รับการสนับสนุนส่วนตัว Live Workshop และอยู่ในกลุ่มแชทพิเศษ สำหรับผู้ที่ต้องการการพัฒนาอย่างเข้มข้น
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold mb-4">เริ่มต้นการเดินทางของคุณวันนี้</h3>
              <p className="text-gray-600 mb-8">
                ไม่ว่าคุณจะเป็นผู้เริ่มต้นหรือผู้ประกอบการมืออาชีพ เรามีเครื่องมือที่เหมาะกับคุณ
              </p>
              <div className="space-x-4">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/dreamlining-calculator'}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  เริ่มฟรีเลย
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.location.href = '/toolbox'}
                >
                  ดูเครื่องมือทั้งหมด
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
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
