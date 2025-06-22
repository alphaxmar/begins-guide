
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NewsletterSignup from '@/components/NewsletterSignup';
import VipPackageCard from '@/components/VipPackageCard';
import { useVipPackages } from '@/hooks/useVipPackages';
import { ArrowRight, BookOpen, Download, Users, Star, CheckCircle, Target, Lightbulb, TrendingUp, Crown, Sparkles, Brain, BarChart3, Zap, FileText, Quote } from 'lucide-react';

const Index = () => {
  const { data: vipPackages, isLoading } = useVipPackages();
  const activeVipPackages = vipPackages?.filter(pkg => pkg.is_active) || [];

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              เปลี่ยนไอเดียให้เป็นธุรกิจจริง เริ่มต้นอย่างถูกวิธีที่ Begins.guide
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              แพลตฟอร์มความรู้, เครื่องมือ, และผู้ช่วย AI สำหรับผู้ประกอบการยุคใหม่
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="max-w-md mx-auto">
                <NewsletterSignup />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Link to="/pricing">
                  ดูรายละเอียด Begins.guide PRO
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Social Proof */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">เราได้รับความไว้วางใจจาก</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">1,000+</div>
              <div className="text-sm text-gray-500">ผู้ใช้งาน</div>
              <div className="text-2xl font-bold text-gray-400">50+</div>
              <div className="text-sm text-gray-500">ธุรกิจที่เริ่มต้น</div>
              <div className="text-2xl font-bold text-gray-400">95%</div>
              <div className="text-sm text-gray-500">ความพึงพอใจ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Problem & Solution */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-8">กำลังเจอปัญหาเหล่านี้อยู่ใช่ไหม?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Target className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <h3 className="font-semibold mb-2 text-red-700">ขาดไอเดีย</h3>
                  <p className="text-sm text-gray-600">ไม่มีไอเดียธุรกิจที่ชัดเจน</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="font-semibold mb-2 text-orange-700">ขาดความรู้</h3>
                  <p className="text-sm text-gray-600">ไม่รู้เรื่องการตลาดและการเงิน</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Download className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2 text-blue-700">ขาดเครื่องมือ</h3>
                  <p className="text-sm text-gray-600">ไม่มีแผนการหรือเครื่องมือ</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-semibold mb-2 text-purple-700">รู้สึกท่วมท้น</h3>
                  <p className="text-sm text-gray-600">ข้อมูลเยอะแต่ไม่รู้เริ่มจากไหน</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-xl text-gray-700 mb-4">
                <strong>Begins.guide</strong> ช่วยแก้ปัญหาเหล่านี้ได้อย่างไร?
              </p>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                เรารวบรวมความรู้, เครื่องมือ และ AI ที่จำเป็นทั้งหมดไว้ในที่เดียว 
                พร้อมชี้ทางที่ชัดเจนสำหรับทุกขั้นตอนของการสร้างธุรกิจ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: The Ecosystem Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">เลือกเส้นทางที่เหมาะกับคุณ</h2>
              <p className="text-xl text-gray-600">3 วิธีในการเริ่มต้นกับ Begins.guide</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Free Content */}
              <Card className="hover:shadow-xl transition-shadow h-full">
                <CardHeader className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <CardTitle className="text-xl">เรียนรู้ฟรี</CardTitle>
                  <CardDescription>เริ่มต้นเส้นทางของคุณ</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">
                    เริ่มต้นเส้นทางของคุณด้วยคลังบทความและวิดีโอคุณภาพสูงฟรี
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/articles">
                      อ่านบทความทั้งหมด
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Card 2: PRO Membership */}
              <Card className="hover:shadow-xl transition-shadow h-full border-2 border-yellow-400 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-black px-4 py-1">
                    <Crown className="mr-1 h-4 w-4" />
                    แนะนำ
                  </Badge>
                </div>
                <CardHeader className="text-center pt-6">
                  <Crown className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
                  <CardTitle className="text-xl">โปรเมมเบอร์ชิป</CardTitle>
                  <CardDescription>สำหรับการเติบโตไม่สิ้นสุด</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">
                    เข้าถึงทุกคอร์ส, ทุกเทมเพลต, และผู้ช่วย AI ทั้งหมดเพื่อการเติบโตที่ไม่สิ้นสุด
                  </p>
                  <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Link to="/pricing">
                      อัปเกรดเป็น PRO
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Card 3: Signature Course */}
              <Card className="hover:shadow-xl transition-shadow h-full border-2 border-purple-400">
                <CardHeader className="text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-purple-500" />
                  <CardTitle className="text-xl">โปรแกรมเรือธง</CardTitle>
                  <CardDescription>สำหรับความสำเร็จก้าวกระโดด</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">
                    โปรแกรมโค้ชชิ่ง 90 วัน สำหรับผู้ที่ต้องการสร้างธุรกิจให้สำเร็จอย่างก้าวกระโดด
                  </p>
                  <Button asChild variant="outline" className="w-full border-purple-400 text-purple-600 hover:bg-purple-50">
                    <Link to="/products">
                      ดูรายละเอียดโปรแกรม
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: AI Tools Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">
                สร้างธุรกิจได้เร็วกว่าด้วยผู้ช่วย AI ส่วนตัวของคุณ
              </h2>
              <p className="text-xl text-gray-600">เครื่องมือ AI ที่จะเปลี่ยนวิธีคิดเรื่องธุรกิจของคุณ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">AI ช่วยคิดไอเดีย</h3>
                  <p className="text-sm text-gray-600">สร้างไอเดียธุรกิจใหม่ๆ</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="font-semibold mb-2">AI เขียน How-to</h3>
                  <p className="text-sm text-gray-600">สร้างคู่มือการทำงาน</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-semibold mb-2">AI วิเคราะห์ตลาด</h3>
                  <p className="text-sm text-gray-600">วิเคราะห์โอกาสทางธุรกิจ</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <h3 className="font-semibold mb-2">Business Tools</h3>
                  <p className="text-sm text-gray-600">เครื่องมือธุรกิจครบครัน</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Link to="/pricing">
                  ปลดล็อกเครื่องมือทั้งหมดด้วย PRO
                  <Sparkles className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Featured Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">บทความแนะนำ</h2>
              <p className="text-xl text-gray-600">เนื้อหาล่าสุดที่จะช่วยให้คุณเก่งขึ้น</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">5 ขั้นตอนเริ่มต้นธุรกิจออนไลน์</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    เรียนรู้วิธีการเริ่มต้นธุรกิจออนไลน์ตั้งแต่เริ่มต้น พร้อมตัวอย่างจริง
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/articles">อ่านต่อ</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">วิธีหาไอเดียธุรกิจที่ขายได้</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    เทคนิคในการค้นหาไอเดียธุรกิจที่มีความต้องการจริงในตลาด
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/articles">อ่านต่อ</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">การวางแผนการเงินสำหรับธุรกิจใหม่</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    หลักการวางแผนการเงินและการจัดการเงินทุนสำหรับธุรกิจใหม่
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/articles">อ่านต่อ</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/articles">
                  ดูบทความทั้งหมด
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">เสียงจากผู้ใช้งานจริง</h2>
              <p className="text-xl text-gray-600">พวกเขาเปลี่ยนแปลงธุรกิจด้วย Begins.guide</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <Quote className="h-8 w-8 text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">
                    "Begins.guide ช่วยให้ผมเปลี่ยนจากพนักงานออฟฟิศมาเป็นเจ้าของธุรกิจออนไลน์ที่ประสบความสำเร็จ"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      กร
                    </div>
                    <div>
                      <p className="font-semibold">คุณกร สุขใจ</p>
                      <p className="text-sm text-gray-500">เจ้าของธุรกิจ E-commerce</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <Quote className="h-8 w-8 text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">
                    "เครื่องมือ AI ที่นี่ช่วยให้ผมวิเคราะห์ตลาดและหาไอเดียใหม่ๆ ได้ง่ายมาก"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      สมชาย
                    </div>
                    <div>
                      <p className="font-semibold">คุณสมชาย วิริยะ</p>
                      <p className="text-sm text-gray-500">ผู้ประกอบการใหม่</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <Quote className="h-8 w-8 text-gray-300 mb-4" />
                  <p className="text-gray-600 mb-4">
                    "เนื้อหาที่นี่ช่วยให้ผมมีรายได้เสริมจากการขายของออนไลน์ ตอนนี้มีเงินเก็บแล้ว!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      เมย์
                    </div>
                    <div>
                      <p className="font-semibold">น้องเมย์ ใสใส</p>
                      <p className="text-sm text-gray-500">นักศึกษา</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">พร้อมที่จะเริ่มต้นหรือยัง?</h2>
            <p className="text-xl mb-8 text-gray-300">
              ไม่ว่าคุณจะเป็น "น้องเมย์" "พี่กร" หรือ "คุณสมชาย" เราพร้อมช่วยให้คุณเปลี่ยนไอเดียเป็นความจริง
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg">
                <Link to="/pricing">
                  เข้าร่วม Begins.guide PRO วันนี้
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              ⭐ เริ่มต้นเส้นทางสู่ความสำเร็จของคุณวันนี้ ⭐
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
