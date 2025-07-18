import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useVipStatus } from '@/hooks/useVipStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, TrendingUp, CheckCircle, Lock, ExternalLink, Lightbulb, Users, BarChart3, Calculator } from 'lucide-react';

interface Tool {
  id: number;
  name: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  category: string;
  requiredAccess: 'free' | 'book' | 'course' | 'vip';
  features: string[];
}

const tools: Tool[] = [
  {
    id: 0,
    name: "Dreamlining Calculator",
    description: "คำนวณ 'ตัวเลขแห่งอิสรภาพ' ของคุณ - เครื่องมือพื้นฐานสำหรับเริ่มต้นการวางแผนทางการเงิน",
    link: "/dreamlining-calculator",
    icon: <Calculator className="h-8 w-8" />,
    category: "เครื่องมือพื้นฐาน",
    requiredAccess: 'free',
    features: ["คำนวณความต้องการรายได้", "วางแผนการเงินเบื้องต้น", "บันทึกเป้าหมายส่วนตัว"]
  },
  {
    id: 1,
    name: "Begins.Guide AI ช่วยคิดไอเดีย",
    description: "เครื่องมือ AI ที่จะช่วยระดมความคิดและสร้างไอเดียธุรกิจใหม่ๆ ที่มีศักยภาพ",
    link: "https://chatgpt.com/g/g-685676541c10819186bff967858244a4-begins-guide-ai-chwy-khidai-ediiy",
    icon: <Lightbulb className="h-8 w-8" />,
    category: "การระดมความคิด",
    requiredAccess: 'book',
    features: ["สร้างไอเดียธุรกิจ", "วิเคราะห์ตลาด", "ข้อเสนอแนะ"]
  },
  {
    id: 2,
    name: "Buyer Persona AI",
    description: "วิเคราะห์และสร้าง Buyer Persona ที่ละเอียดและแม่นยำสำหรับธุรกิจของคุณ",
    link: "https://chatgpt.com/g/g-6877c7c8127481919f7b4e46dc13e774-begins-guide-buyer-persona-ai-tool",
    icon: <Users className="h-8 w-8" />,
    category: "การตลาด",
    requiredAccess: 'course',
    features: ["สร้าง Buyer Persona", "วิเคราะห์พฤติกรรม", "กลยุทธ์การตลาด"]
  },
  {
    id: 3,
    name: "SaaS Blueprint Generator",
    description: "สร้าง Blueprint และแผนการพัฒนาธุรกิจ SaaS แบบครบวงจร",
    link: "https://chatgpt.com/g/g-6877cbc753588191befecfd691b7cca6-begins-guide-the-saas-blueprint-generator",
    icon: <Brain className="h-8 w-8" />,
    category: "การพัฒนาผลิตภัณฑ์",
    requiredAccess: 'vip',
    features: ["แผน SaaS", "โมเดลธุรกิจ", "เทคโนโลยี Stack"]
  },
  {
    id: 4,
    name: "Idea Validator",
    description: "ตรวจสอบและประเมินความเป็นไปได้ของไอเดียธุรกิจก่อนลงทุนจริง",
    link: "https://chatgpt.com/g/g-6877d088cd0c8191b334b7701ec6b8d9-begins-guide-the-idea-validator",
    icon: <Target className="h-8 w-8" />,
    category: "การวิเคราะห์",
    requiredAccess: 'course',
    features: ["ประเมินไอเดีย", "วิเคราะห์ตลาด", "ความเสี่ยง"]
  },
  {
    id: 5,
    name: "SaaS Metrics Oracle",
    description: "วิเคราะห์และติดตามเมตริกสำคัญสำหรับธุรกิจ SaaS ของคุณ",
    link: "https://chatgpt.com/g/g-6877d5d305f88191a5ddbbaa7c93b0ce-begins-guide-the-saas-metrics-oracle",
    icon: <BarChart3 className="h-8 w-8" />,
    category: "การวิเคราะห์",
    requiredAccess: 'vip',
    features: ["KPI Dashboard", "Growth Metrics", "Revenue Analytics"]
  }
];

const getAccessBadge = (requiredAccess: string) => {
  const badges = {
    free: { label: "Beginner", variant: "outline" as const },
    book: { label: "Reader", variant: "default" as const },
    course: { label: "Pro Member", variant: "secondary" as const },
    vip: { label: "Circle Member", variant: "destructive" as const }
  };
  return badges[requiredAccess as keyof typeof badges] || badges.book;
};

export default function ToolboxPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();
  const { isVip } = useVipStatus();

  const canAccessTool = (requiredAccess: string) => {
    // Circle Member (VIP) can access everything
    if (isVip) return true;
    // Pro Member can access pro, book, and free tools
    if (hasCourseAccess && (requiredAccess === 'course' || requiredAccess === 'book' || requiredAccess === 'free')) return true;
    // Reader can access book and free tools
    if (hasBookAccess && (requiredAccess === 'book' || requiredAccess === 'free')) return true;
    // Everyone can access free tools
    if (requiredAccess === 'free') return true;
    return false;
  };

  // Show access denied only if user has no access at all (including free tools)
  if (!hasBookAccess && !hasCourseAccess && !isVip && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">สร้างบัญชีฟรี</h1>
            <p className="text-gray-600 mb-6">
              สร้างบัญชี Beginner ฟรีเพื่อเข้าถึงเครื่องมือพื้นฐานและเริ่มต้นการเดินทางสู่อิสรภาพทางการเงิน
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full mb-4">
              สร้างบัญชีฟรี
            </Button>
            <Button onClick={() => navigate('/pricing')} variant="outline" className="w-full">
              ดูแพ็คเกจทั้งหมด
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const categories = [...new Set(tools.map(tool => tool.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Toolbox
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            เครื่องมือ AI เฉพาะทางที่จะช่วยเร่งการเติบโตของธุรกิจคุณ
          </p>
        </div>

        {/* Tools Grid */}
        <div className="max-w-7xl mx-auto">
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></div>
                {category}
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tools
                  .filter(tool => tool.category === category)
                  .map((tool) => {
                    const hasAccess = canAccessTool(tool.requiredAccess);
                    const accessBadge = getAccessBadge(tool.requiredAccess);
                    
                    return (
                      <Card key={tool.id} className={`relative transition-all duration-300 hover:shadow-lg ${hasAccess ? 'hover:shadow-blue-100 border-blue-200' : 'opacity-75'}`}>
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl ${hasAccess ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                              {tool.icon}
                            </div>
                            <Badge variant={accessBadge.variant} className="text-xs">
                              {accessBadge.label}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg leading-tight">
                            {tool.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {tool.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">ฟีเจอร์หลัก:</p>
                            <ul className="space-y-1">
                              {tool.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>

                        <CardFooter>
                          {hasAccess ? (
                            <Button
                              onClick={() => window.open(tool.link, '_blank')}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              เปิดใช้งานเครื่องมือ
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          ) : (
                            <div className="w-full space-y-2">
                              <Button disabled className="w-full">
                                <Lock className="mr-2 h-4 w-4" />
                                ต้องอัพเกรดเพื่อใช้งาน
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => navigate('/pricing')}
                                className="w-full text-xs"
                              >
                                ดูแพ็คเกจ
                              </Button>
                            </div>
                          )}
                        </CardFooter>

                        {!hasAccess && (
                          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-lg"></div>
                        )}
                      </Card>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              พร้อมที่จะก้าวสู่ระดับ "Architect" แล้วหรือยัง?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              เข้าร่วม The Architects' Circle และเข้าถึงเครื่องมือ AI ทั้งหมด พร้อมการสนับสนุนอย่างต่อเนื่อง
            </p>
            {!isVip && (
              <Button 
                size="lg" 
                onClick={() => navigate('/pricing')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
              >
                อัปเกรดสู่ The Architects' Circle
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
