import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { useDreamlines } from '@/hooks/useDreamlines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  Wrench,
  ExternalLink,
  Calculator
} from 'lucide-react';

const ReaderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasBookAccess } = useCourseAccess();
  const { summary } = useDreamlines();

  const targetMonthlyIncome = summary?.target_monthly_income || 0;
  const userName = user?.email?.split('@')[0] || 'ผู้ใช้';

  // Redirect if not Reader level
  if (!hasBookAccess) {
    navigate('/pricing');
    return null;
  }

  const readerFeatures = [
    {
      title: 'หนังสือ "The Freedom Engine"',
      description: 'พิมพ์เขียวฉบับเต็มที่จะเปลี่ยนชีวิตคุณ',
      icon: <BookOpen className="w-6 w-6" />,
      action: () => navigate('/book'),
      status: 'available',
      progress: 100
    },
    {
      title: 'Case Studies พิเศษ',
      description: 'ศึกษาตัวอย่างการสร้างธุรกิจจริง',
      icon: <Lightbulb className="w-6 w-6" />,
      action: () => navigate('/case-studies'),
      status: 'available',
      progress: 100
    },
    {
      title: 'Begins.Guide AI',
      description: 'ทดลองใช้เครื่องมือ AI (10 ครั้ง)',
      icon: <Wrench className="w-6 w-6" />,
      action: () => navigate('/toolbox'),
      status: 'limited',
      progress: 70
    },
    {
      title: 'Community Board',
      description: 'เข้าถึงบอร์ดสนทนาของชุมชน',
      icon: <Users className="w-6 w-6" />,
      action: () => window.open('https://facebook.com/groups/beginsguide', '_blank'),
      status: 'available',
      progress: 100
    }
  ];

  const nextLevelBenefits = [
    'Freedom Engine Academy (หลักสูตรวิดีโอครบชุด)',
    'เครื่องมือ AI ทั้งหมดไม่จำกัด',
    'Toolkit และ Template ครบชุด',
    'Priority Support',
    'Workshop เอกสิทธิ์'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 px-6 py-3 rounded-full mb-6">
            <BookOpen className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <Badge variant="outline" className="mb-1 border-green-200 text-green-700">
                Reader Level
              </Badge>
              <p className="text-sm text-green-600">Learner - มีพิมพ์เขียวแล้ว</p>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ยินดีต้อนรับ Reader, {userName}! 📚
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            คุณได้รับพิมพ์เขียวแล้ว ตอนนี้ได้เวลาเริ่มเรียนรู้และวางแผนธุรกิจกัน
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
                  ตัวเลขแห่งอิสรภาพของคุณ (TMI) คือ:
                </h2>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-4">
                  ฿{targetMonthlyIncome.toLocaleString()} / เดือน
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dreamlining-calculator')}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  แก้ไข Freedom Number
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Action - Read the Book */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">เริ่มอ่าน "The Freedom Engine"</h2>
                </div>
                <p className="text-green-100 mb-6 text-lg">
                  พิมพ์เขียวฉบับเต็มที่จะแปลงเป้าหมายของคุณให้กลายเป็นแผนการที่เป็นจริงได้
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/book')}
                  className="bg-white text-green-600 hover:bg-green-50"
                >
                  เปิดหนังสือเลย
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-2xl p-8">
                  <div className="text-6xl mb-4">📖</div>
                  <Badge className="bg-white/20 text-white mb-2">Reader Exclusive</Badge>
                  <p className="text-sm text-green-100">พิมพ์เขียวสู่อิสรภาพทางการเงิน</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reader Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">สิ่งที่คุณเข้าถึงได้ใน Reader Level</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {readerFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={feature.action}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={feature.status === 'available' ? 'default' : 'secondary'}
                      className={feature.status === 'available' ? 'bg-green-500' : ''}
                    >
                      {feature.status === 'available' ? 'เข้าถึงได้' : 'จำกัด'}
                    </Badge>
                  </div>
                  {feature.status === 'limited' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>การใช้งาน</span>
                        <span>{feature.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-400 h-2 rounded-full" 
                          style={{ width: `${feature.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full">
                    {feature.title === 'Community Board' ? (
                      <>
                        เข้าร่วม
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </>
                    ) : (
                      <>
                        เข้าใช้งาน
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Progress to Next Level */}
        <Card className="mb-8 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              เส้นทางสู่ Pro Member
            </CardTitle>
            <CardDescription>
              คุณอยู่ในขั้นตอนที่ 2 จาก 4 ขั้นตอนของ Value Ladder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-blue-600">Beginner</p>
                <p className="text-xs text-gray-500">เสร็จแล้ว</p>
              </div>
              <div className="text-center p-3 bg-green-100 rounded-lg border-2 border-green-500">
                <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-green-600">Reader</p>
                <p className="text-xs text-green-600">ปัจจุบัน</p>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="w-5 h-5 text-gray-400 mx-auto mb-2">⚡</div>
                <p className="text-xs font-medium text-gray-400">Pro Member</p>
                <p className="text-xs text-gray-400">ถัดไป</p>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="w-5 h-5 text-gray-400 mx-auto mb-2">👑</div>
                <p className="text-xs font-medium text-gray-400">Circle Member</p>
                <p className="text-xs text-gray-400">เป้าหมายสูงสุด</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade to Pro Member CTA */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8">
            <div className="text-center">
              <Badge variant="destructive" className="mb-4">
                ประหยัด 49% - เหลือ ฿2,990 จาก ฿5,900
              </Badge>
              <h3 className="text-2xl font-bold mb-4">พร้อมก้าวสู่ Pro Member แล้วหรือยัง?</h3>
              <p className="text-gray-600 mb-6">
                ปลดล็อคหลักสูตรวิดีโอครบชุด เครื่องมือ AI ทั้งหมด และเริ่มสร้างธุรกิจจริงๆ
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold mb-3">สิ่งที่คุณจะได้เพิ่ม:</h4>
                  <ul className="space-y-2">
                    {nextLevelBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-6">
                    <div className="text-4xl mb-3">⚡</div>
                    <h4 className="font-semibold mb-2">Pro Member</h4>
                    <p className="text-sm text-gray-600">Builder - สร้างธุรกิจ</p>
                  </div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={() => navigate('/pricing')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                อัปเกรดเป็น Pro Member เลย
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Section */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">เข้าร่วมชุมชน Reader</h3>
              <p className="text-muted-foreground mb-4">
                แบ่งปันประสบการณ์การอ่านและถามคำถามเกี่ยวกับเนื้อหาในหนังสือ
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open('https://facebook.com/groups/beginsguide', '_blank')}
                className="border-green-200 text-green-600 hover:bg-green-100"
              >
                <Users className="w-4 h-4 mr-2" />
                เข้าร่วมกลุ่ม Reader
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ReaderDashboard;
