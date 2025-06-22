
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useVipStatus } from "@/hooks/useVipStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Crown, Check, Sparkles, Brain, FileText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PricingPage = () => {
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
    "เข้าถึงเนื้อหาใหม่ก่อนใคร",
    "ไม่มีข้อจำกัดในการดาวน์โหลด"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-yellow-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Begins.guide PRO
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              ปลดล็อกศักยภาพการเริ่มต้นธุรกิจของคุณด้วยเครื่องมือครบครัน
            </p>
          </div>

          {/* Annual/Monthly Toggle */}
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

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <Card className="relative border-2">
              <CardHeader>
                <CardTitle className="text-2xl">แพลนฟรี</CardTitle>
                <CardDescription>เริ่มต้นการเรียนรู้</CardDescription>
                <div className="text-3xl font-bold">ฟรี</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    อ่านบทความทั้งหมด
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    ดูรายละเอียดคอร์ส
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    ซื้อสินค้าแยกชิ้น
                  </li>
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
                  แนะนำ
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
                        {annualPrice.toLocaleString()} บาท
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
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
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
                        เริ่มใช้ PRO เลย
                      </>
                    )}
                  </Button>
                )}
                
                <p className="text-xs text-center text-gray-500">
                  * ยกเลิกได้ทุกเมื่อ ไม่มีค่าผูกมัด
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI-Powered Tools</h3>
                <p className="text-gray-600 text-sm">
                  เครื่องมือ AI ที่จะช่วยให้คุณเริ่มต้นธุรกิจได้เร็วขึ้น
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">เนื้อหาครบครัน</h3>
                <p className="text-gray-600 text-sm">
                  คอร์สและเทมเพลตที่จะช่วยให้คุณเริ่มต้นธุรกิจได้อย่างเป็นระบบ
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">อัปเดตต่อเนื่อง</h3>
                <p className="text-gray-600 text-sm">
                  เนื้อหาใหม่ๆ และเครื่องมือใหม่ๆ เพิ่มเข้ามาเรื่อยๆ
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">คำถามที่พบบ่อย</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
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
                  <h3 className="font-semibold mb-2">มีช่วงทดลองใช้ฟรีไหม?</h3>
                  <p className="text-gray-600 text-sm">
                    เรามีเนื้อหาฟรีให้ทดลองใช้ก่อน และคุณสามารถยกเลิกได้ทุกเมื่อหากไม่พอใจ
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
