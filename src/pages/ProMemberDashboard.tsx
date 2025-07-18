import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVipStatus } from '@/hooks/useVipStatus';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useDreamlines } from '@/hooks/useDreamlines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  GraduationCap,
  Wrench,
  Award,
  Calendar,
  Crown,
  Calculator,
  BarChart3,
  Lightbulb
} from 'lucide-react';

const ProMemberDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isVip } = useVipStatus();
  const { hasCourseAccess } = useCourseAccess();
  const { summary } = useDreamlines();

  const targetMonthlyIncome = summary?.target_monthly_income || 0;
  const userName = user?.email?.split('@')[0] || 'ผู้ใช้';

  // Redirect if not Pro Member level
  if (!hasCourseAccess || isVip) {
    navigate('/pricing');
    return null;
  }

  const proFeatures = [
    {
      title: 'Freedom Engine Academy',
      description: 'หลักสูตรวิดีโอครบชุดสำหรับสร้างธุรกิจ',
      icon: <GraduationCap className="w-6 h-6" />,
      action: () => navigate('/academy'),
      status: 'unlimited',
      progress: 85,
      badge: 'เข้าเรียนได้'
    },
    {
      title: 'AI Toolbox',
      description: 'เครื่องมือ AI ทั้งหมดไม่จำกัดการใช้งาน',
      icon: <Wrench className="w-6 h-6" />,
      action: () => navigate('/toolbox'),
      status: 'unlimited',
      progress: 100,
      badge: 'ไม่จำกัด'
    },
    {
      title: 'Templates & Toolkit',
      description: 'เทมเพลตและเครื่องมือครบชุด',
      icon: <Award className="w-6 h-6" />,
      action: () => navigate('/templates'),
      status: 'unlimited',
      progress: 100,
      badge: 'ดาวน์โหลดได้'
    },
    {
      title: 'Pro Workshop',
      description: 'Workshop เอกสิทธิ์สำหรับ Pro Member',
      icon: <Calendar className="w-6 h-6" />,
      action: () => navigate('/workshops'),
      status: 'scheduled',
      progress: 60,
      badge: 'มีกำหนดการ'
    },
    {
      title: 'Priority Support',
      description: 'การสนับสนุนแบบเร่งด่วน',
      icon: <Star className="w-6 h-6" />,
      action: () => navigate('/support'),
      status: 'available',
      progress: 100,
      badge: 'พร้อมใช้'
    },
    {
      title: 'Analytics Dashboard',
      description: 'ติดตามความก้าวหน้าและสถิติ',
      icon: <BarChart3 className="w-6 h-6" />,
      action: () => navigate('/analytics'),
      status: 'available',
      progress: 100,
      badge: 'ดูได้เลย'
    }
  ];

  const circleUpgradeBenefits = [
    'Live Workshop รายเดือนกับผู้เชี่ยวชาญ',
    'กลุ่มแชทส่วนตัว (Discord/Slack)',
    '1:1 Consultation Session',
    'Custom Solution สำหรับธุรกิจคุณ',
    'เข้าถึงคอนเทนต์ใหม่ก่อนใคร',
    'Network กับ Entrepreneurs ระดับสูง'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-3 rounded-full mb-6">
            <Zap className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <Badge variant="outline" className="mb-1 border-purple-200 text-purple-700">
                Pro Member
              </Badge>
              <p className="text-sm text-purple-600">Builder - สร้างธุรกิจ</p>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ยินดีต้อนรับ Pro Member, {userName}! ⚡
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            คุณได้ปลดล็อคทุกเครื่องมือแล้ว ตอนนี้ได้เวลาสร้างธุรกิจจริงๆ กัน!
          </p>
        </div>

        {/* Freedom Number Display */}
        {targetMonthlyIncome > 0 && (
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <Badge variant="outline" className="mb-4">
                  <Target className="w-4 h-4 mr-2" />
                  Freedom Number
                </Badge>
                <h2 className="text-lg font-semibold mb-2">
                  เป้าหมายรายได้ต่อเดือนของคุณ:
                </h2>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  ฿{targetMonthlyIncome.toLocaleString()} / เดือน
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dreamlining-calculator')}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    แก้ไข Freedom Number
                  </Button>
                  <Button
                    onClick={() => navigate('/analytics')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    ดู Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Action - Academy */}
        <Card className="mb-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Freedom Engine Academy</h2>
                </div>
                <p className="text-purple-100 mb-6 text-lg">
                  หลักสูตรวิดีโอครบชุดที่จะพาคุณจากศูนย์ไปสู่การมีธุรกิจที่ทำงานอัตโนมัติ
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/academy')}
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  เข้าเรียน Academy
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-2xl p-8">
                  <div className="text-6xl mb-4">🎓</div>
                  <Badge className="bg-white/20 text-white mb-2">Pro Exclusive</Badge>
                  <p className="text-sm text-purple-100">หลักสูตรการสร้างธุรกิจ</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">เครื่องมือและสิทธิ์ Pro Member ของคุณ</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={feature.action}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <Badge 
                        variant={feature.status === 'unlimited' ? 'default' : 'secondary'}
                        className={feature.status === 'unlimited' ? 'bg-purple-500' : 'bg-green-500'}
                      >
                        {feature.badge}
                      </Badge>
                      <span className="text-sm text-gray-500">{feature.progress}%</span>
                    </div>
                    <Progress value={feature.progress} className="h-2" />
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    เข้าใช้งาน
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Progress to Circle Member */}
        <Card className="mb-8 border-2 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              เส้นทางสู่ Circle Member
            </CardTitle>
            <CardDescription>
              คุณอยู่ในขั้นตอนที่ 3 จาก 4 ขั้นตอนของ Value Ladder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-blue-600">Beginner</p>
                <p className="text-xs text-gray-500">เสร็จแล้ว</p>
              </div>
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-green-600">Reader</p>
                <p className="text-xs text-gray-500">เสร็จแล้ว</p>
              </div>
              <div className="text-center p-3 bg-purple-100 rounded-lg border-2 border-purple-500">
                <Zap className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-purple-600">Pro Member</p>
                <p className="text-xs text-purple-600">ปัจจุบัน</p>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <Crown className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-400">Circle Member</p>
                <p className="text-xs text-gray-400">ถัดไป</p>
              </div>
            </div>
            <Progress value={75} className="h-3" />
            <p className="text-center text-sm text-gray-600 mt-2">75% เสร็จสิ้น</p>
          </CardContent>
        </Card>

        {/* Upgrade to Circle Member CTA */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-8">
            <div className="text-center">
              <Badge variant="destructive" className="mb-4">
                ประหยัด 83% - เหลือ ฿9,990 จาก ฿59,000
              </Badge>
              <h3 className="text-2xl font-bold mb-4">พร้อมเข้าร่วม The Architects' Circle หรือยัง?</h3>
              <p className="text-gray-600 mb-6">
                เข้าสู่ระดับสูงสุด พร้อมการสนับสนุนส่วนตัว Live Workshop และ Network ระดับสูง
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-600" />
                    สิ่งที่คุณจะได้เพิ่ม:
                  </h4>
                  <ul className="space-y-2">
                    {circleUpgradeBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6">
                    <div className="text-4xl mb-3">👑</div>
                    <h4 className="font-semibold mb-2">Circle Member</h4>
                    <p className="text-sm text-gray-600">Architect - สร้างอิมไพร์</p>
                    <Badge className="mt-2 bg-amber-500">The Architects' Circle</Badge>
                  </div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={() => navigate('/pricing')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                เข้าร่วม The Architects' Circle
                <Crown className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pro Community Section */}
        <Card className="mt-8 bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">เข้าร่วมชุมชน Pro Member</h3>
              <p className="text-muted-foreground mb-4">
                เชื่อมต่อกับ Pro Members คนอื่น แบ่งปันประสบการณ์การสร้างธุรกิจ
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/pro-community')}
                  className="border-purple-200 text-purple-600 hover:bg-purple-100"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Pro Community
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/workshops')}
                  className="border-purple-200 text-purple-600 hover:bg-purple-100"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Pro Workshop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ProMemberDashboard;
