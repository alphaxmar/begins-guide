
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NewsletterSignup from '@/components/NewsletterSignup';
import { ArrowRight, BookOpen, Download, Users, Star, CheckCircle, Target, Lightbulb, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              เปลี่ยนจาก "ไอเดีย" ไปสู่ "การลงมือทำ"
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Begins Guide - แพลตฟอร์มช่วยเหลือคนไทยที่ต้องการเริ่มต้นทำธุรกิจ 
              ด้วยเนื้อหาความรู้ฟรี คอร์สออนไลน์ และเครื่องมือที่จำเป็น
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Link to="/products">
                  <Star className="mr-2 h-5 w-5" />
                  เริ่มต้นด้วย VIP Package
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/articles">
                  เรียนรู้ฟรี จากบทความ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">ค้นพบไอเดีย</h3>
                <p className="text-sm text-blue-100">หาไอเดียธุรกิจที่เหมาะกับคุณ</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">เรียนรู้ความรู้</h3>
                <p className="text-sm text-blue-100">ความรู้ที่นำไปใช้ได้จริง</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/20 rounded-full p-4 mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">ลงมือทำ</h3>
                <p className="text-sm text-blue-100">เครื่องมือสำหรับเริ่มต้น</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">คุณเจอปัญหาเหล่านี้ไหม?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-red-200">
                <CardContent className="p-6 text-center">
                  <div className="text-red-500 mb-4">😕</div>
                  <h3 className="font-semibold mb-2 text-red-700">ขาดไอเดีย</h3>
                  <p className="text-sm text-gray-600">ไม่มีไอเดียธุรกิจที่ชัดเจน</p>
                </CardContent>
              </Card>
              <Card className="border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="text-orange-500 mb-4">🤔</div>
                  <h3 className="font-semibold mb-2 text-orange-700">ขาดความรู้</h3>
                  <p className="text-sm text-gray-600">ไม่รู้เรื่องการตลาดและการเงิน</p>
                </CardContent>
              </Card>
              <Card className="border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-blue-500 mb-4">🛠️</div>
                  <h3 className="font-semibold mb-2 text-blue-700">ขาดเครื่องมือ</h3>
                  <p className="text-sm text-gray-600">ไม่มีแผนการหรือเครื่องมือ</p>
                </CardContent>
              </Card>
              <Card className="border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="text-purple-500 mb-4">😵‍💫</div>
                  <h3 className="font-semibold mb-2 text-purple-700">รู้สึกท่วมท้น</h3>
                  <p className="text-sm text-gray-600">ข้อมูลเยอะแต่ไม่รู้เริ่มจากไหน</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* User Personas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">เหมาะสำหรับใคร?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      เมย์
                    </div>
                    <div>
                      <CardTitle className="text-xl">น้องเมย์</CardTitle>
                      <CardDescription>นักศึกษา/First Jobber (22 ปี)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    ต้องการหารายได้เสริมเพื่อแบ่งเบาภาระและเก็บเงินก้อนแรก
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      ไอเดียธุรกิจลงทุนน้อย
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      บทความสอนทีละขั้นตอน
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      คอร์สราคาประหยัด
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      กร
                    </div>
                    <div>
                      <CardTitle className="text-xl">พี่กร</CardTitle>
                      <CardDescription>พนักงานออฟฟิศ (32 ปี)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    ต้องการทำอาชีพเสริม หรือลาออกมาทำธุรกิจของตัวเองใน 1-2 ปี
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Case Study ของคนที่ทำสำเร็จ
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      เทมเพลต Business Model Canvas
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      VIP Package เข้าถึงทั้งหมด
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      สมชาย
                    </div>
                    <div>
                      <CardTitle className="text-xl">คุณสมชาย</CardTitle>
                      <CardDescription>ผู้ว่างงาน/มองหาอาชีพใหม่ (45 ปี)</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    ต้องการสร้างธุรกิจของตัวเองเพื่อเป็นอาชีพหลักอย่างมั่นคง
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      คำแนะนำที่เชื่อถือได้
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      แผนการที่ชัดเจน
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      VIP ครบวงจร
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Package Highlight */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-yellow-500 text-black">แนะนำ</Badge>
            <h2 className="text-3xl font-bold mb-6">VIP Package - ทางลัดสู่ความสำเร็จ</h2>
            <p className="text-lg text-gray-600 mb-8">
              เข้าถึงคอร์สและเครื่องมือทั้งหมดได้ไม่จำกัด ในราคาเดียว
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  คอร์สออนไลน์ทั้งหมด
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />การตลาดออนไลน์</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />การวางแผนทางการเงิน</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />การพัฒนาผลิตภัณฑ์</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />และอื่นๆ อีกมากมาย</li>
                </ul>
              </div>
              
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Download className="h-5 w-5 mr-2 text-purple-500" />
                  เครื่องมือและเทมเพลต
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Business Model Canvas</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />แผนธุรกิจ Template</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Marketing Plan Template</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />เครื่องมือคำนวณการเงิน</li>
                </ul>
              </div>
            </div>

            <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold">
              <Link to="/products">
                <Star className="mr-2 h-5 w-5" />
                ดู VIP Package
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">สิ่งที่คุณจะได้รับ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <CardTitle>บทความความรู้ฟรี</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    บทความคุณภาพสูงที่จะช่วยให้คุณเข้าใจธุรกิจมากขึ้น
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <CardTitle>คอร์สจากผู้เชี่ยวชาญ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    เรียนรู้จากผู้ที่มีประสบการณ์ตรงในการทำธุรกิจ
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Download className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <CardTitle>เครื่องมือที่ใช้ได้จริง</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    เทมเพลตและเครื่องมือที่ช่วยให้คุณวางแผนได้ง่ายขึ้น
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">รับข้อมูลข่าวสารและเทคนิคใหม่ๆ</h2>
            <p className="text-xl mb-8 text-blue-100">
              สมัครรับข้อมูลข่าวสารและเทคนิคการทำธุรกิจที่มีประโยชน์ส่งตรงถึงอีเมลคุณ
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">พร้อมที่จะเริ่มต้นแล้วหรือยัง?</h2>
            <p className="text-xl mb-8 text-gray-300">
              ไม่ว่าคุณจะเป็น "น้องเมย์" "พี่กร" หรือ "คุณสมชาย" เราพร้อมช่วยให้คุณเปลี่ยนไอเดียเป็นความจริง
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Link to="/products">
                  เริ่มต้นเลย
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-300 text-gray-300 hover:bg-gray-800">
                <Link to="/articles">อ่านบทความฟรี</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
