
import { useAuth } from '@/contexts/AuthContext';
import { useVipStatus } from '@/hooks/useVipStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, ExternalLink, Brain, FileText, TrendingUp, Sparkles, MessageSquare, Tag, Target } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AIToolsPage = () => {
  const { user } = useAuth();
  const { isVip, isLoading } = useVipStatus();

  // Redirect non-authenticated users to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Block non-VIP users
  if (!isVip) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              เครื่องมือ AI Power Tools
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              เครื่องมือนี้เฉพาะสำหรับสมาชิก VIP เท่านั้น
            </p>
            <Card className="border-yellow-200 bg-yellow-50 max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  อัปเกรดเป็น VIP เพื่อเข้าถึง:
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1 mb-4">
                  <li>• AI ช่วยคิดไอเดียธุรกิจ</li>
                  <li>• AI เขียน How-to Guide</li>
                  <li>• AI วิเคราะห์ตลาด</li>
                  <li>• เครื่องมือตั้งชื่อธุรกิจ</li>
                  <li>• เครื่องมือสร้างสโลแกน</li>
                  <li>• เครื่องมือไอเดียการตลาด</li>
                </ul>
                <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <a href="/products?type=vip">
                    <Crown className="mr-2 h-4 w-4" />
                    อัปเกรดเป็น VIP
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // VIP content
  const aiTools = [
    {
      id: 1,
      title: "AI ช่วยคิดไอเดีย",
      description: "ระบบ AI ที่ช่วยให้คุณค้นหาไอเดียธุรกิจที่เหมาะสมกับตัวคุณ",
      icon: Brain,
      color: "blue",
      url: "https://chatgpt.com/g/g-685676541c10819186bff967858244a4-kaaraich-ai-chwy-khidai-ediiy-erimtnthurkicch",
      features: ["วิเคราะห์ความสนใจ", "เสนอไอเดียที่เป็นไปได้", "ประเมินความเสี่ยง"]
    },
    {
      id: 2,
      title: "AI เขียน How-to",
      description: "AI ที่ช่วยเขียน How-to Guide และคู่มือการทำงานต่างๆ",
      icon: FileText,
      color: "green",
      url: "https://chatgpt.com/g/g-68567a1707f881919f9e3aba1022f81e-ai-chwy-ekhiiyn-how-to",
      features: ["เขียนคู่มือทีละขั้นตอน", "จัดระเบียบเนื้อหา", "ปรับแต่งตามกลุ่มเป้าหมาย"]
    },
    {
      id: 3,
      title: "AI วิเคราะห์ตลาด",
      description: "วิเคราะห์ความเป็นไปได้ของตลาดและโอกาสทางธุรกิจ",
      icon: TrendingUp,
      color: "purple",
      url: "https://chatgpt.com/g/g-68567c6745f4819187c768c54d71a441-ai-chwy-wiekhraaahkhwaamepnaipaidkh-ngtlaad",
      features: ["วิเคราะห์คู่แข่ง", "ประเมินขนาดตลาด", "คาดการณ์แนวโน้ม"]
    }
  ];

  const aiPoweredTools = [
    {
      title: "เครื่องมือตั้งชื่อธุรกิจ",
      description: "AI Generator สำหรับสร้างชื่อธุรกิจที่น่าจดจำ",
      icon: Tag
    },
    {
      title: "เครื่องมือสร้างสโลแกน",
      description: "สร้างสโลแกนที่ติดหูและสื่อความหมาย",
      icon: MessageSquare
    },
    {
      title: "เครื่องมือไอเดียการตลาด",
      description: "คิดไอเดียการตลาดที่เหมาะกับธุรกิจของคุณ",
      icon: Target
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'green':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'purple':
        return 'border-purple-200 bg-purple-50 text-purple-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Badge className="bg-yellow-500 text-white text-lg px-6 py-2">
                <Crown className="mr-2 h-5 w-5" />
                VIP เท่านั้น
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              เครื่องมือ AI Power Tools
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              เครื่องมือ AI ที่จะช่วยให้คุณเริ่มต้นธุรกิจได้เร็วขึ้น พร้อมคำแนะนำจากผู้เชี่ยวชาญ
            </p>
          </div>

          {/* AI Consultation Tools */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Sparkles className="mr-3 h-6 w-6 text-yellow-600" />
              AI Consultation Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiTools.map((tool) => (
                <Card key={tool.id} className={`hover:shadow-lg transition-shadow ${getColorClasses(tool.color)}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-full bg-white/80`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-current rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full">
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        เริ่มใช้งาน
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI-Powered Tools */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Brain className="mr-3 h-6 w-6 text-purple-600" />
              AI-Powered Business Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {aiPoweredTools.map((tool, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-purple-200 bg-purple-50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-full bg-white/80">
                        <tool.icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg text-purple-800">{tool.title}</CardTitle>
                    </div>
                    <CardDescription className="text-purple-700">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            
            {/* Single access button for all AI-Powered Tools */}
            <div className="text-center">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <a 
                  href="https://chatgpt.com/g/g-68567eeb9910819188c4e122411ef4c3-ai-powered-business-tools-for-lovable" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  เข้าใช้งาน AI Business Tools
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <Card className="border-yellow-200 bg-yellow-50 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <p className="text-yellow-800 text-sm">
                  <Crown className="inline h-4 w-4 mr-1" />
                  เครื่องมือ AI Power Tools เป็นสิทธิพิเศษสำหรับสมาชิก VIP เท่านั้น 
                  เครื่องมือเหล่านี้จะช่วยให้คุณประหยัดเวลาและได้ไอเดียที่ดีกว่าในการเริ่มต้นธุรกิจ
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolsPage;
