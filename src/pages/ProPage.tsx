import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useVipStatus } from '@/hooks/useVipStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProMemberNav } from '@/components/ProMemberNav';
import { 
  Crown, 
  Wrench, 
  BarChart3, 
  BookOpen, 
  GraduationCap, 
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Heart,
  Brain,
  Target,
  ExternalLink
} from 'lucide-react';

const ProPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isVip } = useVipStatus();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();

  if (!isVip && !hasCourseAccess && !hasBookAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Crown className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Pro Member เท่านั้น</h1>
            <p className="text-gray-600 mb-6">
              หน้านี้สำหรับ Pro Member เท่านั้น กรุณาอัพเกรดสมาชิกเพื่อเข้าถึง
            </p>
            <Button onClick={() => navigate('/products')} className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
              อัพเกรดเป็น Pro Member
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const quickAccessItems = [
    {
      title: "AI Toolbox",
      description: "เข้าใช้เครื่องมือ AI ที่ออกแบบเฉพาะสำหรับ Pro Member",
      icon: <Wrench className="h-8 w-8" />,
      onClick: () => navigate('/toolbox'),
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50"
    },
    {
      title: "Analytics Dashboard", 
      description: "ติดตามสถิติและการใช้งานของคุณ",
      icon: <BarChart3 className="h-8 w-8" />,
      onClick: () => navigate('/analytics'),
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      title: "คอร์สเรียน",
      description: "เข้าสู่คอร์สเรียนและเนื้อหาพิเศษ",
      icon: <GraduationCap className="h-8 w-8" />,
      onClick: () => navigate('/courses'),
      gradient: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-50 to-blue-50",
      show: hasCourseAccess
    },
    {
      title: "หนังสือ",
      description: "อ่านหนังสือและเนื้อหาที่คุณซื้อ",
      icon: <BookOpen className="h-8 w-8" />,
      onClick: () => navigate('/book'),
      gradient: "from-amber-500 to-orange-600", 
      bgGradient: "from-amber-50 to-orange-50",
      show: hasBookAccess
    }
  ];

  const benefits = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "เครื่องมือ AI ครบชุด",
      description: "เข้าถึงเครื่องมือ AI ทุกตัวไม่จำกัด"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "เนื้อหาพิเศษ",
      description: "Case Study และ Template พิเศษ"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Access",
      description: "เข้าร่วมกลุ่ม Pro Member เท่านั้น"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Priority Support",
      description: "รับการสนับสนุนแบบเร่งด่วน"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <ProMemberNav />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full mb-6">
            <Crown className="h-6 w-6 text-amber-600" />
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              PRO MEMBER
            </Badge>
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 bg-clip-text text-transparent">
              ยินดีต้อนรับ Pro Member
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            คุณได้ปลดล็อคฟีเจอร์ทั้งหมดแล้ว! เริ่มต้นการเดินทางธุรกิจกับเครื่องมือระดับ Pro
          </p>
          
          <p className="text-lg text-gray-500">
            สวัสดี <span className="font-semibold text-blue-600">{user?.email}</span> 👋
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            <span className="flex items-center justify-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded"></div>
              Quick Access
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded"></div>
            </span>
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {quickAccessItems
              .filter(item => item.show !== false)
              .map((item, index) => (
                <Card 
                  key={index} 
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-0 bg-gradient-to-br ${item.bgGradient} relative overflow-hidden`}
                  onClick={item.onClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{
                    background: `linear-gradient(135deg, ${item.gradient.includes('blue') ? '#3B82F6' : item.gradient.includes('green') ? '#10B981' : item.gradient.includes('indigo') ? '#6366F1' : '#F59E0B'}, ${item.gradient.includes('purple') ? '#9333EA' : item.gradient.includes('emerald') ? '#059669' : item.gradient.includes('blue') ? '#2563EB' : '#EA580C'})`
                  }}></div>
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${item.gradient} text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center pb-6">
                    <ArrowRight className="h-5 w-5 mx-auto text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            <span className="flex items-center justify-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              สิทธิพิเศษของคุณ
            </span>
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 border border-blue-100 hover:border-blue-200">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
            สถิติการใช้งานของคุณ
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3 text-center">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
              <div className="text-gray-600">การใช้งาน AI Tools</div>
              <div className="text-sm text-blue-500 font-medium">ไม่จำกัด</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">Pro</div>
              <div className="text-gray-600">ระดับสมาชิก</div>
              <div className="text-sm text-purple-500 font-medium">สูงสุด</div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">การเข้าถึงเนื้อหา</div>
              <div className="text-sm text-green-500 font-medium">ปลดล็อคทั้งหมด</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 p-8 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4">
                🚀 พร้อมสร้างสิ่งยิ่งใหญ่แล้วหรือยัง?
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                เริ่มต้นใช้เครื่องมือ AI ระดับ Pro เพื่อขับเคลื่อนธุรกิจของคุณไปสู่ระดับใหม่
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/toolbox')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8"
                >
                  เริ่มใช้ AI Tools
                  <Wrench className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/courses')}
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8"
                >
                  เรียนคอร์ส
                  <GraduationCap className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProPage;
