
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Crown, Zap, Users, Shield, TrendingUp, Star, Play, CheckCircle2, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                เปลี่ยนไอเดียให้เป็นธุรกิจจริง<br />
                <span className="text-yellow-400">เริ่มต้นอย่างถูกวิธี</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
                แพลตฟอร์มความรู้, เครื่องมือ, และผู้ช่วย AI สำหรับผู้ประกอบการยุคใหม่
              </p>
              
              <div className="mb-8">
                <NewsletterSignup />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/pricing">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3">
                    ดูรายละเอียด Begins.guide PRO
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>500+ ผู้ประกอบการ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span>เครื่องมือครบครัน</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>ผลลัพธ์ที่พิสูจน์แล้ว</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-gray-600">ได้รับความไว้วางใจจาก</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="bg-gray-200 h-12 w-32 rounded"></div>
              <div className="bg-gray-200 h-12 w-32 rounded"></div>
              <div className="bg-gray-200 h-12 w-32 rounded"></div>
              <div className="bg-gray-200 h-12 w-32 rounded"></div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Problem & Solution */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                กำลังเจอปัญหาเหล่านี้อยู่ใช่ไหม?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg">ขาดไอเดียธุรกิจที่เป็นรูปธรรม</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg">ไม่รู้จะเริ่มต้นจากจุดไหน</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg">กลัวความเสี่ยงและการลงทุนผิดพลาด</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg">ขาดเครื่องมือและความรู้ที่เป็นระบบ</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg">ไม่มีใครคอยแนะนำและให้กำลังใจ</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-lg">รู้สึกท่วมท้นกับข้อมูลมากมาย</span>
                  </div>
                </div>
              </div>
              
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-green-800">
                    Begins.guide ช่วยแก้ปัญหาเหล่านี้ได้ทุกข้อ
                  </h3>
                  <p className="text-lg text-green-700">
                    ด้วยระบบเรียนรู้ที่เป็นขั้นตอน เครื่องมือ AI ที่ช่วยลดเวลา และชุมชนที่คอยสนับสนุน
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* The Ecosystem Showcase */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">เลือกเส้นทางที่เหมาะกับคุณ</h2>
                <p className="text-xl text-gray-600">3 ทางเลือกสำหรับการเริ่มต้นธุรกิจของคุณ</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Content */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">เรียนรู้ฟรี</CardTitle>
                    <CardDescription>เริ่มต้นเส้นทางของคุณ</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      เริ่มต้นเส้นทางของคุณด้วยคลังบทความและวิดีโอคุณภาพสูงฟรี
                    </p>
                    <Link to="/articles">
                      <Button variant="outline" className="w-full">
                        อ่านบทความทั้งหมด
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* PRO Membership */}
                <Card className="border-purple-200 hover:shadow-lg transition-shadow relative">
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                    แนะนำ
                  </Badge>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <Crown className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">PRO Membership</CardTitle>
                    <CardDescription>สำหรับการเรียนรู้อย่างจริงจัง</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      เข้าถึงทุกคอร์ส, ทุกเทมเพลต, และผู้ช่วย AI ทั้งหมดเพื่อการเติบโตที่ไม่สิ้นสุด
                    </p>
                    <Link to="/pricing">
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        อัปเกรดเป็น PRO
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Signature Course */}
                <Card className="border-yellow-200 hover:shadow-lg transition-shadow relative">
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black">
                    Premium
                  </Badge>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">โปรแกรมเรือธง</CardTitle>
                    <CardDescription>สำหรับผลลัพธ์ที่แน่นอน</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      โปรแกรมโค้ชชิ่ง 90 วัน สำหรับผู้ที่ต้องการสร้างธุรกิจให้สำเร็จอย่างก้าวกระโดด
                    </p>
                    <Link to="/program">
                      <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                        ดูรายละเอียดโปรแกรม
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* AI Tools Showcase */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                สร้างธุรกิจได้เร็วกว่าด้วยผู้ช่วย AI ส่วนตัวของคุณ
              </h2>
              <p className="text-xl text-gray-600 mb-12">
                เครื่องมือ AI ที่ทำให้เราแตกต่างจากคู่แข่ง
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">AI ช่วยคิดไอเดีย</h3>
                    <p className="text-sm text-gray-600">หาไอเดียธุรกิจที่เหมาะกับคุณ</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">AI วิเคราะห์ตลาด</h3>
                    <p className="text-sm text-gray-600">วิเคราะห์โอกาสและคู่แข่ง</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">AI ช่วยเขียน How-to</h3>
                    <p className="text-sm text-gray-600">สร้างแผนการทำงานแบบขั้นตอน</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-bold mb-2">AI Tools อื่นๆ</h3>
                    <p className="text-sm text-gray-600">เครื่องมือสำหรับทุกขั้นตอน</p>
                  </CardContent>
                </Card>
              </div>
              
              <Link to="/pricing">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white">
                  ปลดล็อกเครื่องมือทั้งหมดด้วย PRO
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Featured Articles */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">บทความแนะนำ</h2>
                <p className="text-xl text-gray-600">เนื้อหาคุณภาพสูงที่จะช่วยให้คุณเริ่มต้นได้ทันที</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <Badge className="mb-3">เริ่มต้น</Badge>
                    <h3 className="font-bold text-lg mb-2">10 ไอเดียธุรกิจที่ทำได้จริงในปี 2024</h3>
                    <p className="text-gray-600 text-sm">ไอเดียธุรกิจที่ไม่ต้องลงทุนเยอะ แต่มีโอกาสทำเงินสูง...</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <Badge className="mb-3">การตลาด</Badge>
                    <h3 className="font-bold text-lg mb-2">วิธีหาลูกค้าคนแรกในวันที่ 1</h3>
                    <p className="text-gray-600 text-sm">เทคนิคการหาลูกค้าที่ใช้ได้ผลจริง แม้จะเป็นธุรกิจใหม่...</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-r from-purple-400 to-pink-500 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <Badge className="mb-3">เครื่องมือ</Badge>
                    <h3 className="font-bold text-lg mb-2">เครื่องมือฟรีที่ทุกสตาร์ทอัปต้องมี</h3>
                    <p className="text-gray-600 text-sm">รวมเครื่องมือฟรีที่จะช่วยให้ธุรกิจของคุณดูมืออาชีพ...</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center mt-8">
                <Link to="/articles">
                  <Button variant="outline" size="lg">
                    ดูบทความทั้งหมด
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">เรื่องราวความสำเร็จจากสมาชิก</h2>
                <p className="text-xl text-gray-600">พวกเขาทำได้ คุณก็ทำได้เหมือนกัน</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex text-yellow-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">
                      "Begins.guide ช่วยให้ผมเริ่มต้นธุรกิจออนไลน์ได้สำเร็จ ตอนนี้มีรายได้เดือนละ 50,000 บาท"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        ส
                      </div>
                      <div>
                        <p className="font-bold">คุณสมชาย ใจดี</p>
                        <p className="text-gray-500 text-sm">ผู้ก่อตั้ง Online Shop</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex text-yellow-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">
                      "เครื่องมือ AI ช่วยให้ผมประหยัดเวลาไปมากมาย สามารถมีธุรกิจควบคู่กับงานประจำได้"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        ก
                      </div>
                      <div>
                        <p className="font-bold">คุณกิตติ ทำดี</p>
                        <p className="text-gray-500 text-sm">Freelancer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex text-yellow-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">
                      "จากที่ไม่รู้จะเริ่มยังไง ตอนนี้มีธุรกิจครบ 6 เดือนแล้ว ขอบคุณ Begins.guide มากครับ"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        น
                      </div>
                      <div>
                        <p className="font-bold">น้องนุช สร้างฝัน</p>
                        <p className="text-gray-500 text-sm">นักเรียนปี 4</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>

        {/* Final Call to Action */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              พร้อมที่จะเริ่มต้นหรือยัง?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              เข้าร่วมกับผู้ประกอบการมากกว่า 500 คนที่เชื่อมั่นใน Begins.guide
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/pricing">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl">
                  เข้าร่วม Begins.guide PRO วันนี้
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>รับประกันความพึงพอใจ</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>ชุมชนผู้ประกอบการ</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>เครื่องมือ AI ครบครัน</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
