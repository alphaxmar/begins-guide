
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Target, 
  TrendingUp,
  Lightbulb,
  Search,
  FileText,
  Rocket,
  Mail,
  Phone,
  User,
  DollarSign,
  Calendar,
  MessageSquare
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MvpLaunchpadPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project_description: '',
    budget_range: '',
    preferred_start_time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('service_leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          project_description: formData.project_description,
          budget_range: formData.budget_range,
          preferred_start_time: formData.preferred_start_time
        }]);

      if (error) throw error;

      toast.success("ส่งใบสมัครสำเร็จ! เราจะติดต่อกลับภายใน 24-48 ชั่วโมง");
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        project_description: '',
        budget_range: '',
        preferred_start_time: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("เกิดข้อผิดพลาดในการส่งใบสมัคร กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const targetAudience = [
    {
      icon: TrendingUp,
      title: "ผู้ประกอบการที่มีวิสัยทัศน์",
      description: "ที่ต้องการเร่งสปีดการเปิดตัวสินค้า"
    },
    {
      icon: Users,
      title: "ผู้บริหารในองค์กร", 
      description: "ที่ต้องการทดลองนวัตกรรมใหม่ๆ"
    },
    {
      icon: Target,
      title: "นักลงทุน",
      description: "ที่ต้องการข้อมูลจริงจากตลาดเพื่อประกอบการตัดสินใจ"
    }
  ];

  const processSteps = [
    {
      phase: "Phase 1",
      title: "Discovery & Strategy",
      subtitle: "ค้นหาและวางกลยุทธ์",
      description: "เราจะทำงานร่วมกับคุณเพื่อตกผลึกไอเดีย, กำหนดกลุ่มเป้าหมาย, และวางกลยุทธ์ทางธุรกิจ",
      icon: Lightbulb
    },
    {
      phase: "Phase 2", 
      title: "Market Research",
      subtitle: "วิจัยตลาดเชิงลึก",
      description: "ทีมงานของเราจะทำการวิเคราะห์คู่แข่ง, ขนาดตลาด, และความต้องการของลูกค้า เพื่อให้แน่ใจว่าไอเดียของคุณมีที่ยืน",
      icon: Search
    },
    {
      phase: "Phase 3",
      title: "MVP Blueprint", 
      subtitle: "สร้างพิมพ์เขียวผลิตภัณฑ์",
      description: "เราจะออกแบบ User Flow, Wireframe, และกำหนดฟีเจอร์ที่สำคัญที่สุดสำหรับผลิตภัณฑ์ต้นแบบ (MVP)",
      icon: FileText
    },
    {
      phase: "Phase 4",
      title: "Development & Launch",
      subtitle: "พัฒนาและเปิดตัว", 
      description: "เราจะพัฒนา MVP ที่ใช้งานได้จริง และวางแผนการเปิดตัวเพื่อเก็บข้อมูลจากผู้ใช้กลุ่มแรก",
      icon: Rocket
    }
  ];

  const deliverables = [
    "รายงานการวิจัยตลาดและคู่แข่ง (Market Research Report)",
    "เอกสารแผนธุรกิจและกลยุทธ์ (Business Strategy Document)", 
    "ผลิตภัณฑ์ต้นแบบ (MVP) ที่ใช้งานได้จริง พร้อม Source Code",
    "รายงานผลการทดสอบตลาดและคำแนะนำในขั้นต่อไป"
  ];

  const budgetOptions = [
    "100,000 - 300,000 บาท",
    "300,000 - 500,000 บาท", 
    "500,000 - 1,000,000 บาท",
    "มากกว่า 1,000,000 บาท"
  ];

  const timeOptions = [
    "เริ่มทันที (ภายใน 1 สัปดาห์)",
    "ภายใน 1 เดือน",
    "ภายใน 2-3 เดือน",
    "ยังไม่แน่ใจ"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                มีไอเดียธุรกิจ<br />
                แต่ไม่มีเวลาลงมือทำ?<br />
                <span className="text-yellow-400">ให้เราปั้นไอเดียของคุณ</span><br />
                ให้เป็นผลิตภัณฑ์จริง<br />
                ที่พร้อมทดสอบตลาด
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                บริการให้คำปรึกษาและพัฒนา MVP แบบครบวงจร<br />
                ตั้งแต่การวิจัยตลาด, วางแผนธุรกิจ, จนถึงการสร้างผลิตภัณฑ์ต้นแบบ<br />
                โดยทีมงาน Begins.guide
              </p>
              
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl"
                onClick={scrollToForm}
              >
                ปรึกษาโปรเจกต์ของคุณ (ฟรี)
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Who Is This For Section */}
          <section className="mb-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  เราคือพาร์ทเนอร์สำหรับ...
                </h2>
                <p className="text-xl text-gray-600">
                  ผู้ที่ต้องการเปลี่ยนไอเดียให้เป็นผลิตภัณฑ์จริงอย่างมืออาชีพ
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {targetAudience.map((audience, index) => (
                  <Card key={index} className="border-blue-200 bg-blue-50 text-center">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <audience.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-blue-800">
                        {audience.title}
                      </h3>
                      <p className="text-blue-700">{audience.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="mb-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  เส้นทางจากไอเดียสู่ MVP ใน 4 ขั้นตอน
                </h2>
                <p className="text-xl text-gray-600">
                  กระบวนการทำงานที่พิสูจน์แล้วจากประสบการณ์จริง
                </p>
              </div>
              
              <div className="space-y-8">
                {processSteps.map((step, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center">
                            <step.icon className="h-10 w-10" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              {step.phase}
                            </Badge>
                            <h3 className="text-2xl font-bold">{step.title}</h3>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-3">
                            {step.subtitle}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={scrollToForm}
                >
                  นัดเวลาคุยรายละเอียด
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>

          {/* What You Get Section */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ผลลัพธ์ที่จับต้องได้
                </h2>
                <p className="text-xl text-gray-600">
                  สิ่งที่คุณจะได้รับจากการทำงานร่วมกับเรา
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deliverables.map((item, index) => (
                  <Card key={index} className="border-green-200 bg-green-50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-lg font-medium">{item}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  ทำไมต้องเลือก Begins.guide?
                </h2>
              </div>
              
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">ปรัชญาการทำงานของเรา</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1" />
                          <span><strong>Lean Methodology:</strong> เน้นการทดสอบตลาดเร็วและประหยัดต้นทุน</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1" />
                          <span><strong>User-Centric Design:</strong> สร้างผลิตภัณฑ์ที่แก้ปัญหาได้จริง</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1" />
                          <span><strong>Data-Driven Decisions:</strong> ใช้ข้อมูลจริงในการตัดสินใจ</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1" />
                          <span><strong>Long-term Partnership:</strong> เป็นพาร์ทเนอร์ในการเติบโตระยะยาว</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-16 w-16 text-white" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">ทีมงาน Begins.guide</h4>
                      <p className="text-gray-600">
                        ทีมผู้เชี่ยวชาญด้านการพัฒนาผลิตภัณฑ์<br />
                        และการสร้างธุรกิจดิจิทัล
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Application Form Section */}
          <section id="application-form" className="mb-20">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  พร้อมที่จะเปลี่ยนไอเดียของคุณให้เป็นความจริงแล้วหรือยัง?
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  เนื่องจากเราทุ่มเทให้กับทุกโปรเจกต์อย่างเต็มที่ เราจึงรับลูกค้าได้จำนวนจำกัดในแต่ละไตรมาส<br />
                  กรุณากรอกฟอร์มด้านล่างเพื่อเริ่มต้น
                </p>
              </div>
              
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
                  <CardTitle className="text-2xl">แบบฟอร์มคัดกรองเบื้องต้น</CardTitle>
                  <CardDescription className="text-blue-100">
                    ข้อมูลที่คุณให้จะช่วยให้เราเข้าใจโปรเจกต์ของคุณมากขึ้น
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <User className="inline h-4 w-4 mr-2" />
                        ชื่อ-นามสกุล *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="กรอกชื่อและนามสกุลของคุณ"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Mail className="inline h-4 w-4 mr-2" />
                        อีเมล *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="อีเมลสำหรับติดต่อกลับ"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Phone className="inline h-4 w-4 mr-2" />
                        เบอร์โทรศัพท์
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="หมายเลขโทรศัพท์ (ไม่บังคับ)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <MessageSquare className="inline h-4 w-4 mr-2" />
                        อธิบายไอเดียของคุณคร่าวๆ *
                      </label>
                      <Textarea
                        required
                        value={formData.project_description}
                        onChange={(e) => handleInputChange('project_description', e.target.value)}
                        placeholder="อธิบายไอเดียธุรกิจ, ปัญหาที่ต้องการแก้ไข, หรือผลิตภัณฑ์ที่ต้องการพัฒนา"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <DollarSign className="inline h-4 w-4 mr-2" />
                        งบประมาณเบื้องต้นสำหรับโปรเจกต์นี้ *
                      </label>
                      <Select
                        required
                        value={formData.budget_range}
                        onValueChange={(value) => handleInputChange('budget_range', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกช่วงงบประมาณ" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        <Calendar className="inline h-4 w-4 mr-2" />
                        ช่วงเวลาที่ต้องการเริ่มโปรเจกต์ *
                      </label>
                      <Select
                        required
                        value={formData.preferred_start_time}
                        onValueChange={(value) => handleInputChange('preferred_start_time', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกช่วงเวลา" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'กำลังส่ง...' : 'ส่งใบสมัครเพื่อปรึกษาโปรเจกต์'}
                      {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <p className="text-center text-gray-600 mt-6">
                หลังจากส่งฟอร์ม เราจะติดต่อกลับภายใน 24-48 ชั่วโมง<br />
                หากโปรเจกต์ของคุณผ่านการพิจารณาเบื้องต้น
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MvpLaunchpadPage;
