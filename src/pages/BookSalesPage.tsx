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
  FileText
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
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm font-medium">
                  บันไดขั้นที่ 2: ผลิตภัณฑ์หลัก
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  พิมพ์เขียวสร้าง <span className="text-primary">'บริษัท AI'</span> ของคุณเอง ที่ทำงานแทนคุณ 24 ชั่วโมง
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  สูตรสำเร็จที่ผสมผสานจิตวิทยาการตลาด, โมเดลธุรกิจ Fastlane, และปรัชญาไลฟ์สไตล์ เพื่อสร้างอาณาจักรธุรกิจตัวคนเดียวที่ยั่งยืน
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => handlePurchase('ebook')}
                >
                  <BookOpen className="mr-2" />
                  สั่งซื้อ E-book (฿350)
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  onClick={() => handlePurchase('physical')}
                >
                  <FileText className="mr-2" />
                  สั่งซื้อหนังสือเล่ม (฿450)
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-96 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="absolute inset-4 bg-white rounded-md flex flex-col justify-center items-center text-center p-6">
                    <div className="text-2xl font-bold text-primary mb-2">THE</div>
                    <div className="text-4xl font-black text-foreground mb-2">FREEDOM</div>
                    <div className="text-2xl font-bold text-primary mb-4">ENGINE</div>
                    <div className="text-sm text-muted-foreground">พิมพ์เขียวสร้างธุรกิจอัตโนมัติ</div>
                    <div className="text-xs text-muted-foreground mt-2">begins.guide</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Big Promise Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                หนังสือเล่มนี้ไม่ได้สอนให้คุณทำงานหนักขึ้น
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                แต่จะสอนให้คุณสร้าง <span className="font-semibold text-primary">'เครื่องจักร'</span> ที่ทำงานแทนคุณ 
                ผ่านการผสมผสานเทคโนโลยี AI, ระบบอัตโนมัติ, และหลักการทางจิตวิทยา 
                เพื่อให้คุณได้มีเวลาใช้ชีวิตอย่างที่คุณต้องการจริงๆ ไม่ใช่เป็นทาสของธุรกิจของตัวเอง
              </p>
            </div>
          </div>
        </section>

        {/* What You'll Discover Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                สิ่งที่คุณจะค้นพบในเล่ม
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">หลักการ C.N.E.S.T.</h3>
                      <p className="text-muted-foreground">กฎ 5 ข้อของธุรกิจสร้างอิสรภาพที่พิสูจน์แล้วจากผู้ประกอบการหลายพันคน</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">วิธีจัดตั้ง "ทีมงาน AI"</h3>
                      <p className="text-muted-foreground">ให้ AI ทำงานแทนคุณในทุกด้าน ตั้งแต่การตลาดไปจนถึงการบริการลูกค้า</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">พิมพ์เขียวเครื่องจักรการตลาด</h3>
                      <p className="text-muted-foreground">สร้างระบบการตลาดอัตโนมัติที่ดึงดูดลูกค้าและขายได้เองตลอด 24 ชั่วโมง</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">บทบาทใหม่ "CEO 2 ชั่วโมง"</h3>
                      <p className="text-muted-foreground">วิธีบริหารธุรกิจได้อย่างมีประสิทธิภาพด้วยเวลาเพียง 2 ชั่วโมงต่อวัน</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">จิตวิทยาการขาย 2.0</h3>
                      <p className="text-muted-foreground">เทคนิคการขายที่ใช้จิตวิทยาผสมกับเทคโนโลยีเพื่อผลลัพธ์สูงสุด</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">ปรัชญาไลฟ์สไตล์แบบยั่งยืน</h3>
                      <p className="text-muted-foreground">วิธีสร้างสมดุลระหว่างความสำเร็จทางธุรกิจและความสุขในชีวิต</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Bonus Section */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  พิเศษ! ไม่ใช่แค่หนังสือ แต่คือบัตรผ่านสู่ชุมชน begins.guide
                </h2>
                <p className="text-xl text-muted-foreground">
                  เมื่อคุณซื้อหนังสือ คุณจะได้รับสิทธิพิเศษเหล่านี้ทันที
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="pt-6">
                    <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-3">สถานะ 'Reader'</h3>
                    <p className="text-muted-foreground">
                      อัปเกรดสถานะบนแพลตฟอร์ม เข้าถึงเนื้อหาพิเศษและคุณสมบัติขั้นสูง
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="pt-6">
                    <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-3">Case Study พิเศษ</h3>
                    <p className="text-muted-foreground">
                      เข้าถึงกรณีศึกษาแบบเจาะลึกที่ไม่มีในเล่ม พร้อมวิเคราะห์ step-by-step
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="pt-6">
                    <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-3">Book Club Board</h3>
                    <p className="text-muted-foreground">
                      เข้าร่วมชุมชนผู้อ่าน ถาม-ตอบกับผู้เขียนและเพื่อนๆ ที่มีเป้าหมายเดียวกัน
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                การเดินทางสู่อิสรภาพของคุณเริ่มต้นที่นี่
              </h2>
              <p className="text-xl text-muted-foreground">
                เลือกรูปแบบที่เหมาะกับคุณและเริ่มสร้าง Freedom Engine ของคุณตั้งแต่วันนี้
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => handlePurchase('ebook')}
                >
                  <BookOpen className="mr-2" />
                  สั่งซื้อ E-book (฿350)
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  onClick={() => handlePurchase('physical')}
                >
                  <FileText className="mr-2" />
                  สั่งซื้อหนังสือเล่ม (฿450)
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                💝 การันตี 30 วัน หากไม่พอใจ เราคืนเงิน 100%
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BookSalesPage;