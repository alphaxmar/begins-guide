
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, ArrowRight, Users, Clock, Target, Star, TrendingUp, Award, Shield, Play, BookOpen, Calendar, MessageCircle, FileText, Zap, Trophy, Heart, CheckCircle2, Mail, Phone, Video } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StripeCheckoutButton from "@/components/payment/StripeCheckoutButton";

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

  // Scroll to pricing section
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const programModules = [
    {
      week: "สัปดาห์ที่ 1-2",
      title: "Foundation: การหาและตรวจสอบไอเดีย",
      description: "เรียนรู้วิธีหาไอเดียธุรกิจที่มีโอกาสสำเร็จสูง และตรวจสอบความเป็นไปได้ของตลาด",
      lessons: [
        "การระดมสมองและหาไอเดีย 10 วิธี",
        "การวิเคราะห์คู่แข่งและตลาด",
        "การทดสอบไอเดียด้วย Landing Page"
      ]
    },
    {
      week: "สัปดาห์ที่ 3-4",
      title: "Build: การสร้าง MVP และทดสอบตลาด",
      description: "สร้างผลิตภัณฑ์ต้นแบบ (MVP) และทดสอบกับลูกค้าเป้าหมายจริง",
      lessons: [
        "หลักการออกแบบ MVP ที่ใช้ได้จริง",
        "การสร้าง Prototype ด้วยเครื่องมือฟรี",
        "การหาและสัมภาษณ์ลูกค้าเป้าหมาย"
      ]
    },
    {
      week: "สัปดาห์ที่ 5-6",
      title: "Brand: การสร้างแบรนด์และการตลาดออนไลน์",
      description: "พัฒนาแบรนด์และเรียนรู้กลยุทธ์การตลาดออนไลน์ที่มีประสิทธิภาพ",
      lessons: [
        "การออกแบบ Brand Identity ที่น่าจดจำ",
        "กลยุทธ์ Content Marketing ที่ขายได้",
        "การใช้ Social Media สร้างแบรนด์"
      ]
    },
    {
      week: "สัปดาห์ที่ 7-8",
      title: "Sell: การขายและการเติบโต",
      description: "เทคนิคการขายที่ใช้ได้จริง และการวางแผนเพื่อการเติบโตอย่างยั่งยืน",
      lessons: [
        "Sales Funnel ที่เปลี่ยน Lead เป็น Customer",
        "เทคนิคการปิดการขายออนไลน์",
        "การวิเคราะห์และปรับปรุง Conversion Rate"
      ]
    },
    {
      week: "สัปดาห์ที่ 9-10",
      title: "Scale: การจัดการและการขยายธุรกิจ",
      description: "เรียนรู้การจัดการทีม การเงิน และการขยายธุรกิจไปสู่ขั้นต่อไป",
      lessons: [
        "การวางระบบและกระบวนการทำงาน",
        "การจัดการการเงินและ Cash Flow",
        "การสร้างทีมและวัฒนธรรมองค์กร"
      ]
    },
    {
      week: "สัปดาห์ที่ 11-12",
      title: "Optimize: การปรับปรุงและการเตรียมพร้อมสำหรับอนาคต",
      description: "ปรับปรุงธุรกิจตามข้อมูลที่ได้ และเตรียมพร้อมสำหรับการเติบโตระยะยาว",
      lessons: [
        "การใช้ Data ในการตัดสินใจทางธุรกิจ",
        "การวางแผนกลยุทธ์ระยะยาว",
        "การเตรียมความพร้อมสำหรับการลงทุน"
      ]
    }
  ];

  const bonusStack = [
    { 
      item: "เนื้อหาหลัก 12 โมดูล", 
      value: "80,000", 
      description: "คอร์สเรียนแบบเชิงลึกครบทุกด้านของการสร้างธุรกิจ",
      icon: <BookOpen className="h-6 w-6" />
    },
    { 
      item: "Live Group Coaching 12 ครั้ง", 
      value: "120,000", 
      description: "โค้ชชิ่งสดกับผู้เชี่ยวชาญทุกสัปดาห์ พร้อมถาม-ตอบแบบเรียลไทม์",
      icon: <Video className="h-6 w-6" />
    },
    { 
      item: "Exclusive Community ตลอดชีพ", 
      value: "50,000", 
      description: "เครือข่ายผู้ประกอบการคุณภาพสูง และการสนับสนุนต่อเนื่อง",
      icon: <Users className="h-6 w-6" />
    },
    { 
      item: "เทมเพลตและเครื่องมือพิเศษ", 
      value: "40,000", 
      description: "เครื่องมือที่ใช้ได้จริงในการทำธุรกิจ รวม 50+ Templates",
      icon: <FileText className="h-6 w-6" />
    },
    { 
      item: "การติดตามผลแบบ 1-on-1", 
      value: "60,000", 
      description: "การดูแลเฉพาะบุคคลตลอดโปรแกรม พร้อม Accountability Partner",
      icon: <Target className="h-6 w-6" />
    },
    { 
      item: "โบนัสพิเศษ: Masterclass Sessions", 
      value: "30,000", 
      description: "เซสชันพิเศษจากผู้เชี่ยวชาญแขกรับเชิญ",
      icon: <Star className="h-6 w-6" />
    }
  ];

  const totalValue = bonusStack.reduce((sum, item) => sum + parseInt(item.value), 0);
  const programPrice = 29900;
  const originalPrice = 79900;

  const testimonials = [
    {
      name: "คุณนิรันดร์ เศรษฐกิจ",
      role: "ผู้ก่อตั้ง TechStart Co.",
      content: "โปรแกรมนี้เปลี่ยนชีวิตผมจริงๆ จากไม่มีไอเดียอะไรเลย มาเป็นเจ้าของธุรกิจที่มีรายได้เดือนละ 200,000 บาทภายใน 6 เดือน การมี mentor และ community ที่คอยช่วยเหลือทำให้ผมไม่รู้สึกโดดเดี่ยว",
      result: "รายได้ 200,000 บาท/เดือน",
      avatar: "นิ",
      rating: 5
    },
    {
      name: "คุณสุดารัตน์ ใจดี",
      role: "ผู้ก่อตั้ง Handmade by Sue",
      content: "ผมไม่เคยคิดว่าธุรกิจเล็กๆ ของผมจะเติบโตได้ขนาดนี้ ตอนนี้มีพนักงาน 15 คนแล้ว และยังขยายต่อไป โปรแกรมนี้สอนทุกขั้นตอนอย่างละเอียด และมีเครื่องมือที่ใช้ได้จริง",
      result: "พนักงาน 15 คน",
      avatar: "สุ",
      rating: 5
    },
    {
      name: "คุณธนกร ก้าวหน้า",
      role: "ผู้ก่อตั้ง Digital Agency",
      content: "การมี mentor และ community ที่ดีทำให้ผมไม่รู้สึกเหงาในการทำธุรกิจ ทุกคนช่วยเหลือกันจริงๆ และได้เครือข่ายธุรกิจที่มีคุณค่ามากมาย ตอนนี้มีลูกค้าประจำกว่า 20 ราย",
      result: "เครือข่ายธุรกิจกว่า 50 คน",
      avatar: "ธ",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "ต้องมีพื้นฐานทางธุรกิจมาก่อนไหม?",
      answer: "ไม่ต้องมีพื้นฐานเลย โปรแกรมออกแบบมาสำหรับผู้เริ่มต้นโดยเฉพาะ เราจะสอนตั้งแต่ขั้นพื้นฐานไปจนถึงขั้นสูง"
    },
    {
      question: "ใช้เวลาเรียนกี่ชั่วโมงต่อสัปดาห์?",
      answer: "ประมาณ 8-12 ชั่วโมงต่อสัปดาห์ รวมดูวิดีโอ ทำแบบฝึกหัด เข้าร่วม Live Session และทำการบ้าน"
    },
    {
      question: "ถ้าไม่พอใจสามารถขอเงินคืนได้ไหม?",
      answer: "ได้ครับ เรามีการรับประกันความพึงพอใจ 30 วันแรก หากไม่พอใจและทำการบ้านครบตามที่กำหนด สามารถขอเงินคืนได้ 100%"
    },
    {
      question: "สามารถเข้าร่วม Community ได้นานแค่ไหน?",
      answer: "เข้าร่วมได้ตลอดชีพ! แม้โปรแกรมจะจบแล้ว คุณยังสามารถเป็นส่วนหนึ่งของ community ได้ต่อไป"
    },
    {
      question: "มีการสนับสนุนหลังจบโปรแกรมไหม?",
      answer: "มีครับ นอกจาก Community แล้ว ยังมี Alumni Network และ Follow-up Session ทุก 3 เดือนสำหรับผู้จบโปรแกรม"
    },
    {
      question: "ถ้าไม่สามารถเข้าร่วม Live Session ได้ทุกครั้ง?",
      answer: "ไม่เป็นไร เราจะบันทึก Live Session ทุกครั้งให้ดูย้อนหลังได้ และมี Office Hours เพิ่มเติมสำหรับคำถามส่วนตัว"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Section 1: Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-yellow-500 text-black mb-6 px-4 py-2">
                <Trophy className="mr-2 h-4 w-4" />
                โปรแกรมเรือธง
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                จากไอเดียสู่ธุรกิจที่ทำเงิน<br />
                <span className="text-yellow-400">ใน 90 วัน</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
                โปรแกรมโค้ชชิ่งเข้มข้นเดียวในไทยที่ให้คุณครบทั้งความรู้, การลงมือทำ, และการสนับสนุนส่วนตัว
              </p>
              
              {/* Video placeholder */}
              <div className="bg-black/30 rounded-xl p-8 mb-8 max-w-2xl mx-auto">
                <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center mb-4">
                  <Play className="h-16 w-16 text-white/70" />
                </div>
                <p className="text-sm text-purple-200">ดูวิดีโอแนะนำโปรแกรม (2 นาที)</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl"
                  onClick={scrollToPricing}
                >
                  สมัครเข้าร่วมโปรแกรม
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </div>

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
                  <Shield className="h-5 w-5" />
                  <span>รับประกันผลลัพธ์</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Social Proof */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-gray-600">ได้รับความไว้วางใจจาก</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Placeholder for partner logos */}
              <div className="bg-gray-200 h-12 w-32 rounded"></div>
              <div className="bg-gray-200 h-12 w-32 rounded"></div>
              <div className="bg-gray-200 h-12 w-32 rounded"></div>
              <div className="bg-gray-200 h-12 w-32 rounded"></div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Section 3: Problem & Agitation */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-8 text-red-800 text-center">
                    คุณกำลังติดอยู่ในวงจรนี้อยู่ใช่ไหม?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">มีไอเดียดีๆ แต่ไม่รู้จะเริ่มยังไง</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">กลัวความเสี่ยงและการลงทุนผิดพลาด</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">ไม่มีใครคอยแนะนำ ต้องลองผิดลองถูกเอง</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">เสียเวลาและเงินไปกับข้อมูลที่ไม่ได้ผล</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">ไม่รู้จะหาลูกค้าจากไหนและขายยังไง</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">เริ่มแล้วแต่ไม่เห็นผลลัพธ์ที่ชัดเจน</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">รู้สึกเหงาและท้อแท้ในการทำธุรกิจคนเดียว</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">ไม่มีเครือข่ายหรือพี่เลี้ยงที่เข้าใจ</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-12">
                    <p className="text-xl text-red-700 font-semibold">
                      ผลก็คือ... <span className="font-bold">คุณยังคงอยู่ที่เดิม และความฝันก็ยังเป็นแค่ความฝัน</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center my-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">แต่ลองจินตนาการดูว่า...</h2>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-8 md:p-12">
                    <div className="text-center mb-8">
                      <Heart className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    </div>
                    <p className="text-xl md:text-2xl text-green-800 mb-6 leading-relaxed">
                      ถ้าคุณมีธุรกิจที่ทำเงินให้คุณได้สม่ำเสมอทุกเดือน... 
                    </p>
                    <p className="text-xl md:text-2xl text-green-800 mb-6 leading-relaxed">
                      มีเครือข่ายผู้ประกอบการที่คอยสนับสนุนและแลกเปลี่ยนประสบการณ์... 
                    </p>
                    <p className="text-xl md:text-2xl text-green-800 mb-8 leading-relaxed">
                      และมีความมั่นใจในทุกการตัดสินใจทางธุรกิจ
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      ชีวิตของคุณจะเปลี่ยนไปอย่างไร? 🚀
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Section 4: The Solution */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                ขอแนะนำ <span className="text-blue-600">"Zero to Launch Blueprint"</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                โปรแกรมโค้ชชิ่งเข้มข้น 90 วัน ที่ออกแบบมาเพื่อพาคุณจากการไม่มีอะไรเลย 
                ไปสู่การมีธุรกิจที่ทำเงินได้จริงและยั่งยืน
              </p>
              <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
                <CardContent className="p-8 md:p-12">
                  <Zap className="h-16 w-16 mx-auto mb-6" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">
                    นี่ไม่ใช่แค่คอร์สเรียนธรรมดา
                  </h3>
                  <p className="text-lg md:text-xl leading-relaxed">
                    แต่เป็นการเดินทางแบบ Hand-on-Hand กับ mentor ผู้เชี่ยวชาญ 
                    และเพื่อนร่วมทางที่มีความมุ่งมั่นเดียวกัน เพื่อสร้างธุรกิจที่ประสบความสำเร็จอย่างแท้จริง
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 5: Meet The Instructor */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">พบกับผู้ก่อตั้งและ Mentor หลัก</h2>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 md:p-12 text-white">
                      <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <span className="text-4xl font-bold">B</span>
                      </div>
                      <h3 className="text-2xl font-bold text-center mb-2">คุณ [ชื่อผู้ก่อตั้ง]</h3>
                      <p className="text-center text-blue-100">ผู้ก่อตั้ง Begins Guide</p>
                    </div>
                    <div className="p-8 md:p-12">
                      <h4 className="text-xl font-bold mb-4">เรื่องราวที่เริ่มต้นจากความล้มเหลว</h4>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        "ผมเคยล้มเหลวในการทำธุรกิจ 3 ครั้ง ก่อนที่จะค้นพบสูตรสำเร็จที่แท้จริง 
                        ผมเข้าใจดีว่าการเริ่มต้นธุรกิจคนเดียวมันยากแค่ไหน"
                      </p>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        "วันนี้ผมได้สร้างธุรกิจที่ทำรายได้หลายล้านบาทต่อปี และช่วยให้ผู้ประกอบการมากกว่า 500 คน 
                        เริ่มต้นธุรกิจของพวกเขาเองได้สำเร็จ"
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-500">500+ นักเรียน</Badge>
                        <Badge className="bg-blue-500">7 ปีประสบการณ์</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 6: Curriculum Breakdown */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">เนื้อหาโปรแกรม 12 สัปดาห์</h2>
                <p className="text-xl text-gray-600">ออกแบบมาให้คุณลงมือทำได้จริงในทุกขั้นตอน</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {programModules.map((module, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <Badge variant="outline">{module.week}</Badge>
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription className="text-base">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold mb-3 text-gray-700">บทเรียนในโมดูลนี้:</h4>
                      <ul className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Section 7: Bonus Stack */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">สิ่งที่คุณจะได้รับทั้งหมด</h2>
                <p className="text-xl text-gray-600">มูลค่ารวมกว่า <span className="font-bold text-red-500">{totalValue.toLocaleString()}</span> บาท</p>
              </div>
              
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {bonusStack.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{item.item}</h3>
                          <p className="text-gray-600 mt-1">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {parseInt(item.value).toLocaleString()} บาท
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                        <div>
                          <h3 className="text-2xl font-bold">รวมมูลค่าทั้งหมด</h3>
                          <p className="text-gray-600">หากซื้อแยกทีละรายการ</p>
                        </div>
                        <div className="text-3xl font-bold text-yellow-600">
                          {totalValue.toLocaleString()} บาท
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 8: Testimonials */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">เรื่องราวความสำเร็จจากนักเรียนรุ่นก่อน</h2>
                <p className="text-xl text-gray-600">พวกเขาทำได้ คุณก็ทำได้เหมือนกัน</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="hover:shadow-xl transition-shadow">
                    <CardContent className="p-8">
                      <div className="flex text-yellow-500 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <Badge className="bg-green-500 text-white mb-4 text-sm">
                        ✨ {testimonial.result}
                      </Badge>
                      <p className="text-gray-700 mb-6 leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4 text-lg">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{testimonial.name}</p>
                          <p className="text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Section 9: The Offer & Pricing */}
          <section id="pricing-section" className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">ข้อเสนอพิเศษ</h2>
              <p className="text-xl text-gray-600 mb-8">
                มูลค่าทั้งหมด {totalValue.toLocaleString()} บาท
              </p>
              
              <Card className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white border-4 border-yellow-400 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                    ลดพิเศษ 63%
                  </Badge>
                </div>
                <CardContent className="p-12">
                  <div className="mb-8">
                    <div className="text-2xl mb-2">ราคาปกติ</div>
                    <div className="text-4xl font-bold line-through text-red-200 mb-4">
                      {originalPrice.toLocaleString()} บาท
                    </div>
                    <div className="text-3xl mb-2">แต่คุณลงทุนเพียง</div>
                    <div className="text-7xl font-bold mb-4">
                      {programPrice.toLocaleString()}
                    </div>
                    <div className="text-2xl">บาท</div>
                  </div>
                  
                  <p className="text-xl mb-6 text-green-100">
                    หรือผ่อนชำระ 3 งวด งวดละ 10,000 บาท (ไม่มีดอกเบี้ย)
                  </p>
                  <p className="text-lg mb-8 text-green-100">
                    🎉 ประหยัดไปทันที {(originalPrice - programPrice).toLocaleString()} บาท!
                  </p>
                  
                  {user ? (
                    <StripeCheckoutButton
                      productIds={['signature-course']} // This should be actual product ID
                      amount={programPrice}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl"
                    />
                  ) : (
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
                          สมัครเข้าร่วมโปรแกรมทันที
                          <ArrowRight className="ml-2 h-6 w-6" />
                        </>
                      )}
                    </Button>
                  )}
                  
                  <div className="mt-8 space-y-2 text-green-100">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span>รับประกัน 30 วัน</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <span>ผ่อนชำระได้</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>เริ่มต้นธุรกิจใน 90 วัน</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 10: Risk Reversal (การรับประกัน) */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-8 md:p-12 text-center">
                  <Shield className="h-20 w-20 text-blue-600 mx-auto mb-6" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-800">
                    การรับประกันความพึงพอใจ 30 วัน
                  </h2>
                  <p className="text-lg md:text-xl text-blue-700 mb-6 leading-relaxed">
                    เราเชื่อมั่นในคุณภาพของโปรแกรมมากจนรับประกันว่า 
                    หากคุณทำการบ้านครบตามที่กำหนดและไม่พอใจภายใน 30 วันแรก 
                  </p>
                  <p className="text-2xl font-bold text-blue-800 mb-6">
                    เราจะคืนเงินให้ 100% ไม่มีเงื่อนไข
                  </p>
                  <p className="text-blue-600">
                    ความเสี่ยงเป็นศูนย์สำหรับคุณ ให้โอกาสตัวเองเปลี่ยนแปลงชีวิต
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 11: FAQ */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">คำถามที่พบบ่อย</h2>
                <p className="text-xl text-gray-600">ตอบทุกข้อสงสัยก่อนตัดสินใจ</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-3 text-blue-700">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">ยังมีคำถามอื่นๆ อีกไหม?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    ส่งอีเมลถาม
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    โทรสอบถาม
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Final Call-to-Action */}
          <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              พร้อมที่จะเปลี่ยนชีวิตของคุณแล้วใช่ไหม?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              อย่าให้โอกาสนี้ผ่านไป เหลือเพียง 12 ที่นั่งสำหรับรุ่นถัดไป
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/20 rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">12</div>
                <div className="text-lg">ที่นั่งเหลือ</div>
              </div>
              <div className="bg-white/20 rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">7</div>
                <div className="text-lg">วันก่อนปิดรับสมัคร</div>
              </div>
              <div className="bg-white/20 rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">90</div>
                <div className="text-lg">วันเปลี่ยนชีวิต</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {user ? (
                <StripeCheckoutButton
                  productIds={['signature-course']} // This should be actual product ID
                  amount={programPrice}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl"
                />
              ) : (
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
              )}
            </div>
            <p className="text-sm text-purple-200">
              🎯 รับประกัน 30 วัน • 💳 ผ่อนชำระได้ • 🚀 เริ่มต้นธุรกิจใน 90 วัน
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramPage;
