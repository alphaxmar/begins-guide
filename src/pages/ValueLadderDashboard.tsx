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
  Calculator, 
  BookOpen, 
  Zap, 
  Crown, 
  Target, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  GraduationCap,
  Wrench,
  Calendar,
  MessageSquare,
  Award,
  ExternalLink
} from 'lucide-react';

interface MembershipLevel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  features: string[];
}

const ValueLadderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isVip } = useVipStatus();
  const { hasBookAccess, hasCourseAccess } = useCourseAccess();
  const { dreamlines, summary } = useDreamlines();

  // Determine current membership level
  const getCurrentLevel = () => {
    if (isVip) return 'circle';
    if (hasCourseAccess) return 'pro';
    if (hasBookAccess) return 'reader';
    return 'beginner';
  };

  const currentLevel = getCurrentLevel();
  const targetMonthlyIncome = summary?.target_monthly_income || 0;
  const userName = user?.email?.split('@')[0] || 'ผู้ใช้';

  const membershipLevels: MembershipLevel[] = [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'Dreamer - เริ่มต้นการเดินทาง',
      icon: <Calculator className="w-5 h-5" />,
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      features: ['Dreamlining Calculator', 'บทความพื้นฐาน', 'Community Board']
    },
    {
      id: 'reader',
      name: 'Reader',
      description: 'Learner - มีพิมพ์เขียว',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-green-100',
      features: ['The Freedom Engine', 'Case Studies', 'AI ทดลอง 10 ครั้ง']
    },
    {
      id: 'pro',
      name: 'Pro Member',
      description: 'Builder - สร้างธุรกิจ',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      features: ['Freedom Engine Academy', 'AI Tools ไม่จำกัด', 'Priority Support']
    },
    {
      id: 'circle',
      name: 'Circle Member',
      description: 'Architect - สร้างอิมไพร์',
      icon: <Crown className="w-5 h-5" />,
      color: 'text-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      features: ['Live Workshop', '1:1 Consultation', 'Custom Solutions']
    }
  ];

  const getCurrentLevelIndex = () => {
    return membershipLevels.findIndex(level => level.id === currentLevel);
  };

  const progress = ((getCurrentLevelIndex() + 1) / membershipLevels.length) * 100;

  // Level-specific content and actions
  const getLevelContent = () => {
    switch (currentLevel) {
      case 'beginner':
        return {
          mainAction: {
            title: 'เริ่มต้นด้วย Dreamlining Calculator',
            description: 'คำนวณ "ตัวเลขแห่งอิสรภาพ" ของคุณ',
            button: 'เริ่มคำนวณ',
            action: () => navigate('/dreamlining-calculator'),
            icon: <Calculator className="w-6 h-6" />
          },
          quickActions: [
            {
              title: 'ดูบทความพื้นฐาน',
              description: 'เรียนรู้หลักการพื้นฐาน',
              action: () => navigate('/articles'),
              icon: <BookOpen className="w-4 h-4" />
            },
            {
              title: 'เข้าร่วม Community',
              description: 'แลกเปลี่ยนประสบการณ์',
              action: () => window.open('https://facebook.com/groups/beginsguide', '_blank'),
              icon: <Users className="w-4 h-4" />
            }
          ],
          nextStep: {
            title: 'พร้อมเป็น Reader แล้วหรือยัง?',
            description: 'รับพิมพ์เขียวฉบับเต็ม "The Freedom Engine"',
            button: 'อัปเกรดเป็น Reader',
            action: () => navigate('/pricing'),
            savings: '55% ส่วนลด'
          }
        };

      case 'reader':
        return {
          mainAction: {
            title: 'หนังสือ "The Freedom Engine"',
            description: 'เริ่มอ่านพิมพ์เขียวของคุณ',
            button: 'เปิดหนังสือ',
            action: () => navigate('/book'),
            icon: <BookOpen className="w-6 h-6" />
          },
          quickActions: [
            {
              title: 'Case Studies พิเศษ',
              description: 'ศึกษาตัวอย่างจริง',
              action: () => navigate('/case-studies'),
              icon: <Lightbulb className="w-4 h-4" />
            },
            {
              title: 'ทดลอง AI (10 ครั้ง)',
              description: 'ใช้เครื่องมือ AI เบื้องต้น',
              action: () => navigate('/toolbox'),
              icon: <Wrench className="w-4 h-4" />
            }
          ],
          nextStep: {
            title: 'พร้อมเป็น Pro Member?',
            description: 'ปลดล็อคหลักสูตรวิดีโอและเครื่องมือ AI ทั้งหมด',
            button: 'อัปเกรดเป็น Pro Member',
            action: () => navigate('/pricing'),
            savings: '49% ส่วนลด'
          }
        };

      case 'pro':
        return {
          mainAction: {
            title: 'Freedom Engine Academy',
            description: 'เข้าเรียนหลักสูตรวิดีโอครบชุด',
            button: 'เข้าเรียน Academy',
            action: () => navigate('/academy'),
            icon: <GraduationCap className="w-6 h-6" />
          },
          quickActions: [
            {
              title: 'AI Toolbox',
              description: 'เครื่องมือ AI ไม่จำกัด',
              action: () => navigate('/toolbox'),
              icon: <Wrench className="w-4 h-4" />
            },
            {
              title: 'Templates & Toolkit',
              description: 'เทมเพลตและเครื่องมือ',
              action: () => navigate('/templates'),
              icon: <Award className="w-4 h-4" />
            },
            {
              title: 'Pro Workshop',
              description: 'Workshop เอกสิทธิ์',
              action: () => navigate('/workshops'),
              icon: <Calendar className="w-4 h-4" />
            }
          ],
          nextStep: {
            title: 'พร้อมเป็น Circle Member?',
            description: 'เข้าร่วม The Architects\' Circle สำหรับการสนับสนุนส่วนตัว',
            button: 'เข้าร่วม Circle',
            action: () => navigate('/pricing'),
            savings: '83% ส่วนลด'
          }
        };

      case 'circle':
        return {
          mainAction: {
            title: 'The Architects\' Circle',
            description: 'เข้าถึงทุกอย่างในระดับสูงสุด',
            button: 'เปิด Circle Dashboard',
            action: () => navigate('/circle'),
            icon: <Crown className="w-6 h-6" />
          },
          quickActions: [
            {
              title: 'Live Workshop',
              description: 'Workshop สดรายเดือน',
              action: () => navigate('/live-workshops'),
              icon: <Calendar className="w-4 h-4" />
            },
            {
              title: '1:1 Consultation',
              description: 'จองเวลาพูดคุยส่วนตัว',
              action: () => navigate('/consultation'),
              icon: <MessageSquare className="w-4 h-4" />
            },
            {
              title: 'Custom Solutions',
              description: 'โซลูชันเฉพาะสำหรับคุณ',
              action: () => navigate('/custom-solutions'),
              icon: <Star className="w-4 h-4" />
            }
          ],
          nextStep: null // Already at the top level
        };

      default:
        return null;
    }
  };

  const levelContent = getLevelContent();
  const currentLevelInfo = membershipLevels.find(level => level.id === currentLevel);

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Welcome & Current Level Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ยินดีต้อนรับ, {userName}!
          </h1>
          
          {/* Current Level Badge */}
          {currentLevelInfo && (
            <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${currentLevelInfo.bgGradient} px-6 py-3 rounded-full mb-6`}>
              <span className={currentLevelInfo.color}>
                {currentLevelInfo.icon}
              </span>
              <div className="text-left">
                <Badge variant="outline" className="mb-1">
                  {currentLevelInfo.name}
                </Badge>
                <p className="text-sm text-gray-600">{currentLevelInfo.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* Value Ladder Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              การเดินทางใน Value Ladder
            </CardTitle>
            <CardDescription>
              คุณอยู่ในระดับ {currentLevelInfo?.name} ({getCurrentLevelIndex() + 1}/4)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {membershipLevels.map((level, index) => (
                  <div 
                    key={level.id} 
                    className={`text-center p-3 rounded-lg ${
                      index <= getCurrentLevelIndex() 
                        ? `bg-gradient-to-r ${level.bgGradient}` 
                        : 'bg-gray-100'
                    }`}
                  >
                    <div className={`flex justify-center mb-2 ${
                      index <= getCurrentLevelIndex() ? level.color : 'text-gray-400'
                    }`}>
                      {level.icon}
                    </div>
                    <p className={`text-xs font-medium ${
                      index <= getCurrentLevelIndex() ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {level.name}
                    </p>
                    {index === getCurrentLevelIndex() && (
                      <Badge variant="default" className="text-xs mt-1">ปัจจุบัน</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

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
                  ตัวเลขแห่งอิสรภาพของคุณ (TMI) คือ:
                </h2>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  ฿{targetMonthlyIncome.toLocaleString()} / เดือน
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dreamlining-calculator')}
                >
                  แก้ไข Freedom Number
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Action Card */}
        {levelContent?.mainAction && (
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {levelContent.mainAction.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{levelContent.mainAction.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">
                    {levelContent.mainAction.description}
                  </p>
                  <Button 
                    size="lg" 
                    onClick={levelContent.mainAction.action}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {levelContent.mainAction.button}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8">
                    <div className="text-6xl mb-4">
                      {currentLevel === 'beginner' && '🧮'}
                      {currentLevel === 'reader' && '📚'}
                      {currentLevel === 'pro' && '⚡'}
                      {currentLevel === 'circle' && '👑'}
                    </div>
                    <Badge className="mb-2">{currentLevelInfo?.name}</Badge>
                    <p className="text-sm text-gray-600">{currentLevelInfo?.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {levelContent?.quickActions && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">การดำเนินการด่วน</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {levelContent.quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        {action.icon}
                      </div>
                      <h4 className="font-semibold">{action.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Next Level Upsell */}
        {levelContent?.nextStep && (
          <Card className="bg-gradient-to-r from-amber/10 to-orange/10 border-amber/20">
            <CardContent className="p-8">
              <div className="text-center">
                <Badge variant="destructive" className="mb-4">
                  {levelContent.nextStep.savings}
                </Badge>
                <h3 className="text-2xl font-bold mb-2">{levelContent.nextStep.title}</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {levelContent.nextStep.description}
                </p>
                <Button 
                  size="lg" 
                  onClick={levelContent.nextStep.action}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  {levelContent.nextStep.button}
                  <TrendingUp className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Community Section */}
        <Card className="mt-8 bg-secondary/10 border-secondary/20">
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">เข้าร่วมชุมชนนักสร้างอิสรภาพ</h3>
              <p className="text-muted-foreground mb-4">
                เชื่อมต่อกับเพื่อนๆ ที่มีเป้าหมายเดียวกัน แลกเปลี่ยนประสบการณ์ และเรียนรู้ไปด้วยกัน
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open('https://facebook.com/groups/beginsguide', '_blank')}
              >
                <Users className="w-4 h-4 mr-2" />
                เข้าร่วมกลุ่ม Facebook
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ValueLadderDashboard;
