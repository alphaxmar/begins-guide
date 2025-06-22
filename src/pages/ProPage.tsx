
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useVipStatus } from "@/hooks/useVipStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Crown, Check, Sparkles, Brain, FileText, TrendingUp, Zap, Users, Star, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProPage = () => {
  const { user } = useAuth();
  const { isVip } = useVipStatus();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planType: 'monthly' | 'annual') => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    if (isVip) {
      toast.info("คุณเป็นสมาชิก PRO อยู่แล้ว");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription-checkout', {
        body: { planType }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้าง subscription');
    } finally {
      setLoading(false);
    }
  };

  const monthlyPrice = 990;
  const annualPrice = 9900;
  const monthlySavings = (monthlyPrice * 12) - annualPrice;

  const features = [
    "เข้าถึงคอร์สออนไลน์ทั้งหมดไม่จำกัด",
    "ดาวน์โหลดเทมเพลตทั้งหมดฟรี",
    "AI ช่วยคิดไอเดียธุรกิจ",
    "AI เขียน How-to Guide",
    "AI วิเคราะห์ตลาด",
    "เครื่องมือตั้งชื่อธุรกิจ",
    "เครื่องมือสร้างสโลแกน",
    "เครื่องมือไอเดียการตลาด",
    "เข้าร่วม Workshop พิเศษสำหรับสมาชิกทุกเดือน",
    "เข้าถึง Private Community",
    "เข้าถึงเนื้อหาใหม่ก่อนใคร",
    "รับเนื้อหาและเครื่องมือใหม่ๆ ในอนาคตอัตโนมัติ"
  ];

  const freeFeatures = [
    "อ่านบทความทั้งหมด",
    "ดูรายละเอียดคอร์ส",
    "ซื้อสินค้าแยกชิ้น"
  ];

  const aiTools = [
    {
      icon: Brain,
      title: "AI ช่วยคิดไอเดีย",
      description: "สร้างไอเดียธุรกิจใหม่ๆ ที่เป็นไปได้จริง"
    },
    {
      icon: FileText,
      title: "AI เขียน How-to",
      description: "สร้างคู่มือการทำงานอย่างเป็นระบบ"
    },
    {
      icon: TrendingUp,
      title: "AI วิเคราะห์ตลาด",
      description: "วิเคราะห์โอกาสทางธุรกิจอย่างลึกซึ้ง"
    },
    {
      icon: Zap,
      title: "Business Tools",
      description: "เครื่องมือธุรกิจครบครัน AI-powered"
    }
  ];

  const testimonials = [
    {
      name: "คุณกร สุขใจ",
      role: "เจ้าของธุรกิจ E-commerce",
      content: "PRO membership ช่วยให้ผมเปลี่ยนจากพนักงานออฟฟิศมาเป็นเจ้าของธุรกิจออนไลน์ที่ประสบความสำเร็จ",
      avatar: "กร"
    },
    {
      name: "คุณสมชาย วิริยะ",
      role: "ผู้ประกอบการใหม่",
      content: "เครื่องมือ AI ที่นี่ช่วยให้ผมวิเคราะห์ตลาดและหาไอเดียใหม่ๆ ได้ง่ายมาก คุ้มค่าเกินราคา",
      avatar: "สมชาย"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Section 1: Value Proposition Hero */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="h-12 w-12 text-yellow-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Begins.guide PRO
              </h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">เข้าถึงทุกองค์ความรู้, ทุกเครื่องมือ, และผู้ช่วย AI ในที่เดียว</h2>
            <p className="text-xl text-gray-700 mb-8">
              หยุดการลองผิดลองถูก ประหยัดเวลาและเงินของคุณด้วย Begins.guide PRO
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        {/* Section 2: Pricing Table */}
        <section className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className={`text-lg ${!isAnnual ? 'font-semibold text-yellow-600' : 'text-gray-600'}`}>
              รายเดือน
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-yellow-600"
            />
            <Label htmlFor="billing-toggle" className={`text-lg ${isAnnual ? 'font-semibold text-yellow-600' : 'text-gray-600'}`}>
              รายปี
            </Label>
            {isAnnual && (
              <Badge className="bg-green-500 text-white">
                ประหยัด {monthlySavings.toLocaleString()} บาท
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-2">
              <CardHeader>
                <CardTitle className="text-2xl">แพลนฟรี</CardTitle>
                <CardDescription>เริ่มต้นการเรียนรู้</CardDescription>
                <div className="text-3xl font-bold">ฟรี</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  แพลนปัจจุบัน
                </Button>
              </CardContent>
            </Card>

            {/* PRO Plan */}
            <Card className="relative border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-600 text-white px-6 py-2">
                  <Crown className="mr-1 h-4 w-4" />
                  คุ้มค่าที่สุด
                </Badge>
              </div>
              
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-600" />
                  Begins.guide PRO
                </CardTitle>
                <CardDescription>เข้าถึงทุกอย่างไม่จำกัด</CardDescription>
                <div className="space-y-2">
                  {isAnnual ? (
                    <>
                      <div className="text-3xl font-bold text-yellow-600">
                        {annualPrice.toLocaleString()} บาท/ปี
                      </div>
                      <div className="text-sm text-gray-600">
                        ({(annualPrice / 12).toLocaleString()} บาท/เดือน)
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl font-bold text-yellow-600">
                      {monthlyPrice.toLocaleString()} บาท/เดือน
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {isVip ? (
                  <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                    <Crown className="mr-2 h-4 w-4" />
                    คุณเป็นสมาชิก PRO อยู่แล้ว
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3"
                    size="lg"
                    onClick={() => handleSubscribe(isAnnual ? 'annual' : 'monthly')}
                    disabled={loading}
                  >
                    {loading ? (
                      "กำลังโหลด..."
                    ) : (
                      <>
                        <Crown className="mr-2 h-4 w-4" />
                        เริ่มต้นใช้งาน PRO
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: What You Get */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">สิ่งที่คุณจะได้รับ</h2>
            <p className="text-xl text-gray-600">ทุกสิ่งที่จำเป็นสำหรับการสร้างธุรกิจที่ประสบความสำเร็จ</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: AI Tools Spotlight */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">ผู้ช่วย AI ที่จะเปลี่ยนธุรกิจของคุณ</h2>
            <p className="text-xl text-gray-600">เครื่องมือ AI ที่ไม่เหมือนใครและหาไม่ได้จากที่อื่น</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {aiTools.map((tool, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <tool.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 5: Comparison Table */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">เปรียบเทียบแพลน</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="font-semibold">ฟีเจอร์</div>
                  <div className="font-semibold">Free User</div>
                  <div className="font-semibold text-yellow-600">PRO Member</div>
                  
                  <div className="py-2">คอร์สออนไลน์</div>
                  <div className="py-2">ดูรายละเอียดเท่านั้น</div>
                  <div className="py-2 text-green-600">✅ เข้าถึงไม่จำกัด</div>
                  
                  <div className="py-2">เครื่องมือ AI</div>
                  <div className="py-2">❌ ไม่สามารถใช้งาน</div>
                  <div className="py-2 text-green-600">✅ ใช้งานเต็มฟังก์ชัน</div>
                  
                  <div className="py-2">เทมเพลต</div>
                  <div className="py-2">ซื้อแยกชิ้น</div>
                  <div className="py-2 text-green-600">✅ ดาวน์โหลดทั้งหมดฟรี</div>
                  
                  <div className="py-2">Community</div>
                  <div className="py-2">❌ ไม่มีสิทธิ์</div>
                  <div className="py-2 text-green-600">✅ Private Community</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 6: Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">เสียงจากสมาชิก PRO</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 7: FAQ */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">คำถามที่พบบ่อย</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">สามารถยกเลิกได้เมื่อไหร่?</h3>
                <p className="text-gray-600 text-sm">
                  คุณสามารถยกเลิกได้ทุกเมื่อจากหน้า Account Settings โดยจะมีผลในรอบการเรียกเก็บเงินถัดไป
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">ชำระเงินช่องทางไหนได้บ้าง?</h3>
                <p className="text-gray-600 text-sm">
                  รองรับบัตรเครดิต/เดบิต และ PromptPay ผ่านระบบ Stripe ที่ปลอดภัย
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">ถ้ามีคอร์สใหม่ออกมาต้องจ่ายเพิ่มไหม?</h3>
                <p className="text-gray-600 text-sm">
                  ไม่ต้องจ่ายเพิ่ม! สมาชิก PRO เข้าถึงเนื้อหาใหม่ทั้งหมดอัตโนมัติ
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">มีช่วงทดลองใช้ฟรีไหม?</h3>
                <p className="text-gray-600 text-sm">
                  เรามีเนื้อหาฟรีให้ทดลองใช้ก่อน และคุณสามารถยกเลิกได้ทุกเมื่อหากไม่พอใจ
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 8: Final Call-to-Action */}
        <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">พร้อมที่จะเริ่มต้นแล้วใช่ไหม?</h2>
          <p className="text-xl mb-8 text-gray-300">
            เข้าร่วมกับผู้ประกอบการนับพันคนที่เปลี่ยนไอเดียเป็นความจริงด้วย Begins.guide PRO
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg"
              onClick={() => handleSubscribe(isAnnual ? 'annual' : 'monthly')}
              disabled={loading || isVip}
            >
              {isVip ? (
                <>
                  <Crown className="mr-2 h-5 w-5" />
                  คุณเป็นสมาชิก PRO แล้ว
                </>
              ) : loading ? (
                "กำลังโหลด..."
              ) : (
                <>
                  <Crown className="mr-2 h-5 w-5" />
                  เริ่มใช้ PRO เลย {isAnnual ? `${annualPrice.toLocaleString()} บาท/ปี` : `${monthlyPrice.toLocaleString()} บาท/เดือน`}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            ⭐ ยกเลิกได้ทุกเมื่อ ไม่มีค่าผูกมัด ⭐
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProPage;
