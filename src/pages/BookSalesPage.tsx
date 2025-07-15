import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  BookOpen, 
  Users, 
  Target, 
  Zap, 
  Crown,
  MessageSquare,
  FileText,
  Shield,
  Compass,
  Settings,
  Bot,
  Lightbulb
} from 'lucide-react';

const BookSalesPage = () => {
  const handlePurchase = (type: 'ebook' | 'physical') => {
    // TODO: Implement purchase logic
    console.log(`Purchase ${type} book`);
  };

  return (
    <>
      <Helmet>
        <title>The Freedom Engine - พิมพ์เขียวสร้างบริษัท AI ของคุณเอง | begins.guide</title>
        <meta name="description" content="สูตรสำเร็จที่ผสมผสานจิตวิทยาการตลาด, โมเดลธุรกิจ Fastlane, และปรัชญาไลฟ์สไตล์ เพื่อสร้างอาณาจักรธุรกิจตัวคนเดียวที่ยั่งยืน" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section - สร้างความเชื่อมโยงทันที */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  คุณมี <span className="text-primary">"เป้าหมาย"</span> แล้ว...<br />
                  นี่คือ <span className="text-primary">"แผนที่"</span><br />
                  ที่จะพาคุณไปให้ถึง
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  ขอแนะนำหนังสือ <span className="font-semibold text-foreground">"The Freedom Engine"</span>: พิมพ์เขียวฉบับสมบูรณ์สำหรับการสร้าง 'บริษัท AI ของคุณ' ที่ทำงานแทนคุณ 24 ชั่วโมง
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
                  onClick={() => handlePurchase('ebook')}
                >
                  <BookOpen className="mr-2" />
                  สั่งซื้อ E-book (฿350)
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-2"
                  onClick={() => handlePurchase('physical')}
                >
                  <FileText className="mr-2" />
                  สั่งซื้อหนังสือเล่ม (฿450)
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 rounded-2xl blur-3xl"></div>
                <img 
                  src="/lovable-uploads/54b3235a-03dc-4da3-87d4-07bc51ee7683.png" 
                  alt="The Freedom Engine Blueprint Book Cover" 
                  className="relative w-80 h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* The Bridge Section - จาก "ปัญหา" สู่ "ทางออก" */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="text-primary">"ตัวเลข"</span> ในฝันของคุณจะไร้ความหมาย...<br />
                หากไม่มียานพาหนะที่ถูกต้อง
              </h2>
              <div className="text-xl text-muted-foreground leading-relaxed space-y-4 text-left">
                <p>
                  การค้นพบ <span className="font-semibold text-primary">'ตัวเลขแห่งอิสรภาพ' (TMI)</span> ของคุณคือชัยชนะก้าวแรกที่ยิ่งใหญ่ แต่ในเวลาเดียวกันมันก็ได้สร้างคำถามใหม่ที่ใหญ่กว่าเดิม:
                </p>
                <blockquote className="text-2xl font-medium text-center py-6 px-8 bg-primary/10 rounded-lg border-l-4 border-primary">
                  "แล้วฉันจะสร้างรายได้ตามเป้าหมายนั้นได้อย่างไร?"
                </blockquote>
                <p>
                  การทำงานหนักในระบบเดิมๆ หรือการขายเวลาแบบฟรีแลนซ์ไม่ใช่คำตอบ... <span className="font-semibold text-foreground">หนังสือเล่มนี้คือคำตอบ</span> มันคือพิมพ์เขียวของ <span className="font-semibold text-primary">'ยานพาหนะ'</span> ที่ออกแบบมาเพื่อพาคุณไปสู่จุดหมายนั้นโดยเฉพาะ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* "Peek Inside" Section - สร้างความคุ้มค่า */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                สิ่งที่คุณจะค้นพบในพิมพ์เขียวเล่มนี้:
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Compass className="w-8 h-8 text-primary mt-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">🧭 แผนที่ 3 เลน</h3>
                          <p className="text-muted-foreground">ทำความเข้าใจกฎของความมั่งคั่งและเลือกเดินทางบน "เลนเร็ว" (Fastlane) ที่ถูกต้อง</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Settings className="w-8 h-8 text-primary mt-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">⚙️ หลักการ C.N.E.S.T.</h3>
                          <p className="text-muted-foreground">กฎฟิสิกส์ 5 ข้อที่ธุรกิจสร้างอิสรภาพทุกประเภทต้องมี หากขาดข้อใดข้อหนึ่งไปก็คือความล้มเหลว</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Bot className="w-8 h-8 text-primary mt-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">🤖 การจัดตั้งทีมงาน AI</h3>
                          <p className="text-muted-foreground">Workshop การใช้ ChatGPT, Midjourney, และเครื่องมืออื่นๆ ให้ทำงานแทนคุณ เหมือนมีพนักงานที่เก่งที่สุดในโลก</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Zap className="w-8 h-8 text-primary mt-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">⚡ เครื่องจักรการตลาดอัตโนมัติ</h3>
                          <p className="text-muted-foreground">พิมพ์เขียวการสร้างระบบที่เปลี่ยนคนแปลกหน้าเป็นลูกค้า แม้ในขณะที่คุณหลับ</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Crown className="w-8 h-8 text-primary mt-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">👑 บทบาทใหม่ของคุณ</h3>
                          <p className="text-muted-foreground">วิธีคิดและทำงานในฐานะ "CEO 2 ชั่วโมง" เพื่อควบคุมเครื่องจักรและใช้ชีวิตอิสระอย่างแท้จริง</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Lightbulb className="w-8 h-8 text-primary mt-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">💡 เทคนิคลับ</h3>
                          <p className="text-muted-foreground">กลยุทธ์และเคล็ดลับที่ไม่มีที่ไหนสอน จากประสบการณ์จริงในการสร้างธุรกิจออนไลน์</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The "Secret Weapon" Section - สร้างความแตกต่าง */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-12">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Shield className="w-20 h-20 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">🔓</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  นี่ไม่ใช่แค่หนังสือ... แต่มันคือ <span className="text-primary">"บัตรผ่าน"</span> สู่ชุมชนของเรา
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  ทุกการสั่งซื้อหนังสือ 'The Freedom Engine' ไม่ว่าจะในรูปแบบใด คุณจะได้รับ <span className="font-semibold text-foreground">'รหัสลับ'</span> ท้ายเล่มสำหรับนำไปปลดล็อกสถานะ 'Reader' บนแพลตฟอร์ม begins.guide ซึ่งมอบสิทธิ์ให้คุณเข้าถึง:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="pt-6">
                    <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-3">Case Study พิเศษ</h3>
                    <p className="text-muted-foreground">
                      เจาะลึกการสร้าง Freedom Engine ของ 'ครูริน' (ที่ไม่มีให้อ่านที่ไหน)
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="pt-6">
                    <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-3">Book Club Forum</h3>
                    <p className="text-muted-foreground">
                      พื้นที่พิเศษสำหรับถามคำถามเกี่ยวกับเนื้อหาในเล่มและแลกเปลี่ยนความเห็นกับเพื่อนๆ ผู้อ่าน
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="pt-6">
                    <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-3">สถานะ Reader</h3>
                    <p className="text-muted-foreground">
                      อัปเกรดสถานะบนแพลตฟอร์ม เข้าถึงเนื้อหาพิเศษและคุณสมบัติขั้นสูง
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final Offer Section - ปิดการขาย */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                ทั้งหมดนี้ คือแผนที่และบัตรผ่านสู่การเดินทางครั้งใหม่ของคุณ...
              </h2>
              <p className="text-2xl text-muted-foreground font-medium">
                ในราคาที่น้อยกว่าค่ากาแฟของคุณในหนึ่งเดือน
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-xl px-10 py-8 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  onClick={() => handlePurchase('ebook')}
                >
                  <BookOpen className="mr-3 w-6 h-6" />
                  สั่งซื้อ E-book ทันที (฿350)
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-xl px-10 py-8 border-2 font-semibold hover:bg-primary/5 transform hover:scale-105 transition-all duration-200"
                  onClick={() => handlePurchase('physical')}
                >
                  <FileText className="mr-3 w-6 h-6" />
                  สั่งซื้อหนังสือเล่ม (฿450)
                </Button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">การันตีความปลอดภัย</span>
                </div>
                <p className="text-green-700">
                  💝 การันตี 30 วัน หากไม่พอใจ เราคืนเงิน 100%
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BookSalesPage;