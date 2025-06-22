
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, ArrowRight, Users, Clock, Target, Star, TrendingUp, Award, Shield } from "lucide-react";
import { toast } from "sonner";

const ProgramPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    setLoading(true);
    try {
      // Placeholder for enrollment logic
      toast.success("ขอบคุณสำหรับความสนใจ! เราจะติดต่อกลับไปเร็วๆ นี้");
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast.error('เกิดข้อผิดพลาดในการสมัคร');
    } finally {
      setLoading(false);
    }
  };

  const programModules = [
    {
      week: "สัปดาห์ที่ 1-2",
      title: "การหาและตรวจสอบไอเดีย",
      description: "เรียนรู้วิธีหาไอเดียธุรกิจที่มีโอกาสสำเร็จสูง และตรวจสอบความเป็นไปได้ของตลาด"
    },
    {
      week: "สัปดาห์ที่ 3-4",
      title: "การสร้าง MVP และทดสอบตลาด",
      description: "สร้างผลิตภัณฑ์ต้นแบบ (MVP) และทดสอบกับลูกค้าเป้าหมายจริง"
    },
    {
      week: "สัปดาห์ที่ 5-6",
      title: "การสร้างแบรนด์และการตลาดออนไลน์",
      description: "พัฒนาแบรนด์และเรียนรู้กลยุทธ์การตลาดออนไลน์ที่มีประสิทธิภาพ"
    },
    {
      week: "สัปดาห์ที่ 7-8",
      title: "การขายและการเติบโต",
      description: "เทคนิคการขายที่ใช้ได้จริง และการวางแผนเพื่อการเติบโตอย่างยั่งยืน"
    },
    {
      week: "สัปดาห์ที่ 9-10",
      title: "การจัดการและการขยายธุรกิจ",
      description: "เรียนรู้การจัดการทีม การเงิน และการขยายธุรกิจไปสู่ขั้นต่อไป"
    },
    {
      week: "สัปดาห์ที่ 11-12",
      title: "การปรับปรุงและการเตรียมพร้อมสำหรับอนาคต",
      description: "ปรับปรุงธุรกิจตามข้อมูลที่ได้ และเตรียมพร้อมสำหรับการเติบโตระยะยาว"
    }
  ];

  const valueStack = [
    { item: "เนื้อหาหลัก 12 โมดูล", value: "50,000", description: "คอร์สเรียนแบบเชิงลึกครบทุกด้าน" },
    { item: "Live Group Coaching 12 ครั้ง", value: "60,000", description: "โค้ชชิ่งสดกับผู้เชี่ยวชาญ" },
    { item: "Exclusive Community ตลอดชีพ", value: "30,000", description: "เครือข่ายผู้ประกอบการคุณภาพสูง" },
    { item: "เทมเพลตและเครื่องมือพิเศษ", value: "25,000", description: "เครื่องมือที่ใช้ได้จริงในการทำธุรกิจ" },
    { item: "การติดตามผลแบบ 1-on-1", value: "40,000", description: "การดูแลเฉพาะบุคคลตลอดโปรแกรม" },
    { item: "โบนัสพิเศษ", value: "15,000", description: "มาสเตอร์คลาสและเวิร์กช็อปเพิ่มเติม" }
  ];

  const totalValue = valueStack.reduce((sum, item) => sum + parseInt(item.value), 0);
  const programPrice = 29900;

  const testimonials = [
    {
      name: "คุณนิรันดร์ เศรษฐกิจ",
      role: "ผู้ก่อตั้ง TechStart Co.",
      content: "โปรแกรมนี้เปลี่ยนชีวิตผมจริงๆ จากไม่มีไอเดียอะไรเลย มาเป็นเจ้าของธุรกิจที่มีรายได้เดือนละ 200,000 บาทภายใน 6 เดือน",
      result: "รายได้ 200,000 บาท/เดือน",
      avatar: "นิ"
    },
    {
      name: "คุณสุดารัตน์ ใจดี",
      role: "ผู้ก่อตั้ง Handmade by Sue",
      content: "ผมไม่เคยคิดว่าธุรกิจเล็กๆ ของผมจะเติบโตได้ขนาดนี้ ตอนนี้มีพนักงาน 15 คนแล้ว และยังขยายต่อไป",
      result: "พนักงาน 15 คน",
      avatar: "สุ"
    },
    {
      name: "คุณธนกร ก้าวหน้า",
      role: "ผู้ก่อตั้ง Digital Agency",
      content: "การมี mentor และ community ที่ดีทำให้ผมไม่รู้สึกเหงาในการทำธุรกิจ ทุกคนช่วยเหลือกันจริงๆ",
      result: "เครือข่ายธุรกิจกว่า 50 คน",
      avatar: "ธ"
    }
  ];

  const faqs = [
    {
      question: "ต้องมีพื้นฐานมาก่อนไหม?",
      answer: "ไม่ต้องมีพื้นฐานเลย โปรแกรมออกแบบมาสำหรับผู้เริ่มต้นโดยเฉพาะ"
    },
    {
      question: "ใช้เวลาเรียนกี่ชั่วโมงต่อสัปดาห์?",
      answer: "ประมาณ 5-8 ชั่วโมงต่อสัปดาห์ รวมดูวิดีโอ ทำแบบฝึกหัด และเข้าร่วม Live Session"
    },
    {
      question: "ถ้าไม่พอใจสามารถขอเงินคืนได้ไหม?",
      answer: "ได้ครับ เรามีการรับประกันความพึงพอใจ 30 วันแรก หากไม่พอใจขอเงินคืนได้ 100%"
    },
    {
      question: "สามารถเข้าร่วม Community ได้นานแค่ไหน?",
      answer: "เข้าร่วมได้ตลอดชีพ! แม้โปรแกรมจะจบแล้ว คุณยังสามารถเป็นส่วนหนึ่งของ community ได้ต่อไป"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Section 1: The Transformation Headline */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-yellow-500 text-black mb-6 px-4 py-2">
              <Award className="mr-2 h-4 w-4" />
              โปรแกรมเรือธง
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              จากไอเดียสู่ธุรกิจที่ทำเงินใน 90 วัน
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              โปรแกรมเดียวที่ให้คุณครบทั้งความรู้, การลงมือทำ, และการสนับสนุนส่วนตัว
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>จำกัด 20 ที่นั่ง/รุ่น</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>12 สัปดาห์</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>รับประกันผลลัพธ์</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Section 2: The Problem & The Dream */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-red-800">คุณกำลังประสบปัญหาเหล่านี้อยู่ใช่ไหม?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>มีไอเดียแต่ไม่รู้จะเริ่มยังไง</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>กลัวความเสี่ยงและการลงทุน</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>ไม่มีใครคอยแนะนำ ต้องลองผิดลองถูกเอง</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>ไม่รู้จะหาลูกค้าจากไหน</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>เริ่มแล้วแต่ไม่เห็นผลลัพธ์</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>รู้สึกเหงาและท้อแท้ในการทำธุรกิจคนเดียว</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center my-12">
              <h2 className="text-3xl font-bold mb-4">แต่จินตนาการดูว่า...</h2>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-8">
                  <p className="text-xl text-green-800 mb-4">
                    ถ้าคุณมีธุรกิจที่ทำเงินให้คุณได้ทุกเดือน... มีเครือข่ายผู้ประกอบการที่คอยสนับสนุน... 
                    และมีความมั่นใจในทุกการตัดสินใจทางธุรกิจ
                  </p>
                  <p className="text-lg text-green-700">
                    ชีวิตของคุณจะเปลี่ยนไปอย่างไร?
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 3: Introducing the Solution */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">แนะนำ "Zero to Launch Blueprint"</h2>
            <p className="text-xl text-gray-700 mb-8">
              โปรแกรมโค้ชชิ่งเข้มข้น 90 วัน ที่จะพาคุณจากการไม่มีอะไรเลย ไปสู่การมีธุรกิจที่ทำเงินได้จริง
            </p>
            <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">โปรแกรมนี้ไม่ใช่แค่คอร์สเรียน</h3>
                <p className="text-lg">
                  แต่เป็นการร่วมเดินทางกับ mentor ผู้เชี่ยวชาญ และเพื่อนร่วมทางที่มีความมุ่งมั่นเดียวกัน
                  เพื่อสร้างธุรกิจที่ประสบความสำเร็จ
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: Module Breakdown */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">เนื้อหาโปรแกรม 12 สัปดาห์</h2>
              <p className="text-xl text-gray-600">ออกแบบมาให้คุณลงมือทำได้จริงในทุกขั้นตอน</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programModules.map((module, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{module.week}</Badge>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{module.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: The Value Stack */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">สิ่งที่คุณจะได้รับทั้งหมด</h2>
              <p className="text-xl text-gray-600">มูลค่ารวมกว่า {totalValue.toLocaleString()} บาท</p>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {valueStack.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.item}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {parseInt(item.value).toLocaleString()} บาท
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <div>
                        <h3 className="text-xl font-bold">รวมมูลค่าทั้งหมด</h3>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {totalValue.toLocaleString()} บาท
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 6: The Offer & Pricing */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">แต่คุณลงทุนเพียง</h2>
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-4 border-yellow-400">
              <CardContent className="p-12">
                <div className="text-6xl font-bold mb-4">
                  {programPrice.toLocaleString()} บาท
                </div>
                <p className="text-xl mb-6">หรือผ่อนชำระ 3 งวด งวดละ 10,000 บาท</p>
                <p className="text-lg mb-8 text-green-100">
                  ประหยัดไปกว่า {(totalValue - programPrice).toLocaleString()} บาท!
                </p>
                
                <Button 
                  size="lg" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl"
                  onClick={handleEnroll}
                  disabled={loading}
                >
                  {loading ? (
                    "กำลังโหลด..."
                  ) : (
                    <>
                      สมัครเข้าร่วมโปรแกรมรุ่นถัดไป
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 7: Urgency & Scarcity */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-red-500 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">⚠️ รับจำนวนจำกัดเพียง 20 ที่นั่งต่อรุ่น</h2>
                <p className="text-xl mb-4">
                  เพื่อรับประกันคุณภาพของการโค้ชชิ่งและการดูแลเฉพาะบุคคล
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm">ที่นั่งเหลือ</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">7</div>
                    <div className="text-sm">วันก่อนปิดรับสมัคร</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">90</div>
                    <div className="text-sm">วันเปลี่ยนชีวิต</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 8: Testimonials & Case Studies */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">เรื่องราวความสำเร็จจากนักเรียนรุ่นก่อน</h2>
              <p className="text-xl text-gray-600">พวกเขาทำได้ คุณก็ทำได้</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white mb-4">{testimonial.result}</Badge>
                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
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
          </div>
        </section>

        {/* Section 9: The Guarantee */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4 text-blue-800">การรับประกันความพึงพอใจ 30 วัน</h2>
                <p className="text-lg text-blue-700 mb-4">
                  เราเชื่อมั่นในคุณภาพของโปรแกรมมากจนรับประกันว่า 
                  หากคุณไม่พอใจภายใน 30 วันแรก เราจะคืนเงินให้ 100%
                </p>
                <p className="text-blue-600">
                  ไม่มีเงื่อนไข ไม่มีข้อแม้ ความเสี่ยงเป็นศูนย์สำหรับคุณ
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 10: FAQ for the Program */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">คำถามที่พบบ่อย</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final Call-to-Action */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">พร้อมที่จะเปลี่ยนชีวิตของคุณแล้วใช่ไหม?</h2>
          <p className="text-xl mb-8 text-purple-100">
            อย่าให้โอกาสนี้ผ่านไป เหลือเพียง 12 ที่นั่งสำหรับรุ่นถัดไป
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl"
              onClick={handleEnroll}
              disabled={loading}
            >
              {loading ? (
                "กำลังโหลด..."
              ) : (
                <>
                  สมัครตอนนี้ในราคา {programPrice.toLocaleString()} บาท
                  <ArrowRight className="ml-2 h-6 w-6" />
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-purple-200">
            🎯 รับประกัน 30 วัน • 💳 ผ่อนชำระได้ • 🚀 เริ่มต้นธุรกิจใน 90 วัน
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProgramPage;
