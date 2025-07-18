import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useVipStatus } from '@/hooks/useVipStatus';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, Calculator, BookOpen, ShoppingCart, Users, Video, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  current: boolean;
  popular: boolean;
  icon: React.ReactNode;
  buttonAction: () => void;
}

const PricingPage = () => {
  const { user } = useAuth();
  const { isVip } = useVipStatus();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();
  const navigate = useNavigate();

  // Handle signup and navigation actions
  const handleSignup = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/dashboard');
    }
  };

  const handleBookPurchase = () => {
    navigate('/book');
  };

  const handleProSignup = () => {
    // In a real app, this would integrate with payment provider (Stripe, etc.)
    console.log('Redirecting to Pro Member checkout...');
    // navigate('/checkout?plan=pro');
    alert('Pro Member checkout coming soon! Contact support for early access.');
  };

  const handleCircleSignup = () => {
    // In a real app, this would integrate with payment provider (Stripe, etc.)
    console.log('Redirecting to Circle Member checkout...');
    // navigate('/checkout?plan=circle');
    alert('Circle Member registration coming soon! Contact support for early access.');
  };

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
      buttonAction: handleSignup
    },
    {
      id: "reader", 
      name: "Reader",
      price: "450",
      originalPrice: "990",
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
      buttonAction: handleBookPurchase
    },
    {
      id: "pro",
      name: "Pro Member", 
      price: "2,990",
      originalPrice: "5,900",
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
      buttonAction: handleProSignup
    },
    {
      id: "circle",
      name: "Circle Member",
      price: "9,990",
      originalPrice: "59,000", 
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
      buttonAction: handleCircleSignup
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
          <div className="space-y-3 mb-4">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm">
              <span className="animate-pulse">🔥</span>
              <span className="font-semibold">ราคาโปรโมชั่นพิเศษ - ปรับขึ้นทุกเดือน!</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
              <Star className="h-4 w-4" />
              <span>เริ่มฟรี → ปรับเปลี่ยนได้ตลอดเวลา</span>
            </div>
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
                  {plan.originalPrice ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl line-through text-gray-400">
                          ฿{plan.originalPrice}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          ลด {Math.round((1 - parseInt(plan.price.replace(/,/g, '')) / parseInt(plan.originalPrice.replace(/,/g, ''))) * 100)}%
                        </Badge>
                      </div>
                      <div>
                        <span className="text-3xl font-bold text-red-600">
                          ฿{plan.price}
                        </span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price === "ฟรี" ? plan.price : `฿${plan.price}`}
                      </span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  )}
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

        {/* Feature Comparison Table */}
        <div className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">เปรียบเทียบฟีเจอร์ทุกแพลน</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="text-left p-4 font-semibold">ฟีเจอร์</th>
                  <th className="text-center p-4 font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <Calculator className="w-5 h-5 text-gray-600" />
                      <span>Beginner</span>
                      <Badge variant="outline" className="text-xs">ฟรี</Badge>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <span>Reader</span>
                      <Badge variant="outline" className="text-xs">฿450</Badge>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      <span>Pro Member</span>
                      <Badge className="text-xs bg-purple-500">฿2,990</Badge>
                    </div>
                  </th>
                  <th className="text-center p-4 font-semibold">
                    <div className="flex flex-col items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-600" />
                      <span>Circle Member</span>
                      <Badge className="text-xs bg-amber-500">฿9,990</Badge>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    category: "เครื่องมือพื้นฐาน",
                    features: [
                      { name: "Dreamlining Calculator", beginner: true, reader: true, pro: true, circle: true },
                      { name: "Interactive Dreamlining Tool", beginner: true, reader: true, pro: true, circle: true },
                      { name: "บทความพื้นฐาน", beginner: true, reader: true, pro: true, circle: true },
                      { name: "Community Board เบื้องต้น", beginner: true, reader: true, pro: true, circle: true }
                    ]
                  },
                  {
                    category: "เนื้อหาและการเรียนรู้",
                    features: [
                      { name: "หนังสือ 'The Freedom Engine'", beginner: false, reader: true, pro: true, circle: true },
                      { name: "Case Study พิเศษ", beginner: false, reader: true, pro: true, circle: true },
                      { name: "Freedom Engine Academy (วิดีโอ)", beginner: false, reader: false, pro: true, circle: true },
                      { name: "Toolkit และ Template", beginner: false, reader: false, pro: true, circle: true }
                    ]
                  },
                  {
                    category: "เครื่องมือ AI และอัตโนมัติ",
                    features: [
                      { name: "Begins.Guide AI", beginner: false, reader: "10 ครั้ง", pro: "ไม่จำกัด", circle: "ไม่จำกัด" },
                      { name: "AI Toolbox ครบชุด", beginner: false, reader: false, pro: true, circle: true },
                      { name: "เครื่องมือสร้างคอนเทนต์", beginner: false, reader: false, pro: true, circle: true }
                    ]
                  },
                  {
                    category: "การสนับสนุนและชุมชน",
                    features: [
                      { name: "Community Board", beginner: "เบื้องต้น", reader: true, pro: true, circle: true },
                      { name: "Priority Support", beginner: false, reader: false, pro: true, circle: true },
                      { name: "กลุ่มแชทส่วนตัว", beginner: false, reader: false, pro: false, circle: true },
                      { name: "1:1 Consultation", beginner: false, reader: false, pro: false, circle: "60 นาที/เดือน" }
                    ]
                  },
                  {
                    category: "Workshop และอีเวนต์",
                    features: [
                      { name: "Workshop เอกสิทธิ์", beginner: false, reader: false, pro: true, circle: true },
                      { name: "Live Workshop รายเดือน", beginner: false, reader: false, pro: false, circle: true },
                      { name: "เนื้อหาใหม่ก่อนใคร", beginner: false, reader: false, pro: false, circle: true },
                      { name: "Custom Solution", beginner: false, reader: false, pro: false, circle: true }
                    ]
                  }
                ].map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="p-4 font-semibold text-gray-800 bg-gradient-to-r from-gray-100 to-gray-50">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, featureIndex) => (
                      <tr key={featureIndex} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-700">{feature.name}</td>
                        <td className="p-4 text-center">
                          {typeof feature.beginner === 'boolean' ? (
                            feature.beginner ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-300">–</span>
                            )
                          ) : (
                            <span className="text-sm text-blue-600 font-medium">{feature.beginner}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.reader === 'boolean' ? (
                            feature.reader ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-300">–</span>
                            )
                          ) : (
                            <span className="text-sm text-green-600 font-medium">{feature.reader}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.pro === 'boolean' ? (
                            feature.pro ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-300">–</span>
                            )
                          ) : (
                            <span className="text-sm text-purple-600 font-medium">{feature.pro}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.circle === 'boolean' ? (
                            feature.circle ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-300">–</span>
                            )
                          ) : (
                            <span className="text-sm text-amber-600 font-medium">{feature.circle}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
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
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">คำถามที่พบบ่อย</h2>
          
          <div className="space-y-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="animate-pulse">🔥</span>
                  ราคาโปรโมชั่นนี้จะเปลี่ยนแปลงเมื่อไหร่?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  <strong>ราคาจะปรับขึ้นทุกเดือน!</strong> ตอนนี้คุณได้รับส่วนลดสูงสุด Reader ลด 55%, Pro Member ลด 49%, Circle Member ลด 83% จากราคาปกติ 
                  หากคุณสมัครตอนนี้ จะล็อกราคาโปรโมชั่นไว้ตลอดการใช้งาน
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">สามารถอัปเกรดหรือดาวน์เกรดได้ไหม?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ได้ครับ คุณสามารถอัปเกรดได้ตลอดเวลา และเราจะคิดราคาแบบ Pro-rated สำหรับระยะเวลาที่เหลือ
                  การดาวน์เกรดจะมีผลในรอบการต่ออายุถัดไป
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
                  คุณสามารถใช้ AI Tools ได้ 10 ครั้งฟรีในระดับ Reader
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Circle Member ต่างจาก Pro Member อย่างไร?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  Circle Member จะได้รับการสนับสนุนส่วนตัว Live Workshop และอยู่ในกลุ่มแชทพิเศษ สำหรับผู้ที่ต้องการการพัฒนาอย่างเข้มข้น
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-amber-500" />
                    Live Workshop รายเดือนพร้อมผู้เชี่ยวชาญ
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-500" />
                    กลุ่มแชทส่วนตัว Discord/Slack
                  </li>
                  <li className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-amber-500" />
                    1:1 Consultation 60 นาที/เดือน
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">การชำระเงินและการยกเลิก</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <p>
                    <strong>การชำระเงิน:</strong> รับชำระผ่าน Credit Card, QR Code, และ Bank Transfer
                  </p>
                  <p>
                    <strong>การยกเลิก:</strong> สามารถยกเลิกได้ตลอดเวลา ไม่มีค่าปรับ โดยจะหยุดการต่ออายุในรอบถัดไป
                  </p>
                  <p>
                    <strong>รีฟันด์:</strong> มี Money-back guarantee 30 วันสำหรับ Pro และ Circle Member
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Tools มีอะไรบ้าง และใช้งานอย่างไร?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <p>เครื่องมือ AI ของเราประกอบด้วย:</p>
                  <ul className="space-y-2 text-sm ml-4">
                    <li>• Business Idea Generator - สร้างไอเดียธุรกิจ</li>
                    <li>• Market Research Assistant - วิเคราะห์ตลาด</li>
                    <li>• Content Creator - สร้างคอนเทนต์การตลาด</li>
                    <li>• Financial Planner - วางแผนการเงิน</li>
                    <li>• Pitch Deck Builder - สร้างงานนำเสนอ</li>
                  </ul>
                  <p className="text-sm">
                    Reader ใช้ได้ 10 ครั้ง/เดือน, Pro และ Circle ใช้ไม่จำกัด
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Freedom Engine Academy มีเนื้อหาอะไรบ้าง?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <p>หลักสูตรวิดีโอครบชุด ประกอบด้วย:</p>
                  <ul className="space-y-2 text-sm ml-4">
                    <li>• โมดูล 1: Mindset และการวางแผน (2 ชั่วโมง)</li>
                    <li>• โมดูล 2: Market Research และ Validation (3 ชั่วโมง)</li>
                    <li>• โมดูล 3: Product Development (4 ชั่วโมง)</li>
                    <li>• โมดูล 4: Marketing และ Sales (5 ชั่วโมง)</li>
                    <li>• โมดูล 5: Automation และ Scaling (3 ชั่วโมง)</li>
                    <li>• โมดูล 6: Advanced Strategies (2 ชั่วโมง)</li>
                  </ul>
                  <p className="text-sm font-semibold">
                    รวม 19 ชั่วโมงของเนื้อหาคุณภาพสูง + Bonus Materials
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">มีการรับประกันความสำเร็จไหม?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <p>
                    เรามั่นใจในคุณภาพของเนื้อหา และเสนอการรับประกัน:
                  </p>
                  <ul className="space-y-2 text-sm ml-4">
                    <li>• <strong>Reader:</strong> รับประกันความพึงพอใจ 30 วัน</li>
                    <li>• <strong>Pro Member:</strong> Money-back guarantee 30 วัน</li>
                    <li>• <strong>Circle Member:</strong> Success guarantee - หากไม่เห็นผลใน 90 วัน รีฟันด์ 100%</li>
                  </ul>
                  <p className="text-sm font-semibold text-blue-600">
                    คุณไม่มีอะไรต้องเสียถ้าลองและไม่พอใจ!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">สามารถใช้งานผ่านมือถือได้ไหม?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ได้ครับ! ระบบของเรา Responsive Design ใช้งานได้บนทุกอุปกรณ์ 
                  มี Progressive Web App (PWA) ที่สามารถติดตั้งเหมือน Native App 
                  และมี Mobile App (iOS/Android) กำลังจะเปิดตัวเร็วๆ นี้
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">หากต้องการความช่วยเหลือเพิ่มเติม</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <p>ติดต่อทีมสนับสนุนของเราได้ที่:</p>
                  <ul className="space-y-2 text-sm">
                    <li>📧 Email: support@begins.guide</li>
                    <li>💬 Live Chat: บนเว็บไซต์ (จันทร์-ศุกร์ 9:00-18:00)</li>
                    <li>📱 Line: @begins.guide</li>
                    <li>📞 โทร: 02-xxx-xxxx (Pro และ Circle Members)</li>
                  </ul>
                  <p className="text-sm">
                    <strong>Response Time:</strong> Beginner/Reader (24-48 ชม.), Pro (4-8 ชม.), Circle (1-2 ชม.)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto border-2 border-red-200 shadow-2xl">
            <CardContent className="p-12">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm mb-6">
                <span className="animate-pulse">⚡</span>
                <span className="font-semibold">ราคาโปรโมชั่นสิ้นสุดเร็วๆ นี้!</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">เริ่มต้นการเดินทางของคุณวันนี้</h3>
              <p className="text-gray-600 mb-2">
                ไม่ว่าคุณจะเป็นผู้เริ่มต้นหรือผู้ประกอบการมืออาชีพ เรามีเครื่องมือที่เหมาะกับคุณ
              </p>
              <p className="text-red-600 font-semibold mb-8 text-sm">
                🔥 จองราคาพิเศษก่อนปรับขึ้นเดือนหน้า - ลดสูงสุด 83%
              </p>
              <div className="space-x-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/dreamlining-calculator')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  เริ่มฟรีเลย
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/toolbox')}
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
