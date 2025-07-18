import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVipStatus } from '@/hooks/useVipStatus';
import { useDreamlines } from '@/hooks/useDreamlines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Target, 
  TrendingUp, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  MessageSquare,
  Video,
  Trophy,
  Sparkles,
  ChevronRight,
  UserCheck,
  Zap,
  Diamond,
  Rocket,
  Building2,
  HeartHandshake,
  Calculator,
  BarChart3
} from 'lucide-react';

const CircleMemberDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isVip } = useVipStatus();
  const { summary } = useDreamlines();

  const targetMonthlyIncome = summary?.target_monthly_income || 0;
  const userName = user?.email?.split('@')[0] || 'Architect';

  // Redirect if not Circle Member level
  if (!isVip) {
    navigate('/pricing');
    return null;
  }

  const circleFeatures = [
    {
      title: 'Live Monthly Workshop',
      description: 'Workshop เอกสิทธิ์รายเดือนกับผู้เชี่ยวชาญ',
      icon: <Video className="w-6 h-6" />,
      action: () => navigate('/live-workshops'),
      status: 'live',
      nextDate: '15 มีนาคม 2024',
      badge: 'Live ทุกเดือน'
    },
    {
      title: '1:1 Consultation',
      description: 'การปรึกษาส่วนตัวสำหรับกลยุทธ์ธุรกิจ',
      icon: <UserCheck className="w-6 h-6" />,
      action: () => navigate('/consultation-booking'),
      status: 'available',
      nextDate: 'จองได้เลย',
      badge: '60 นาที/เดือน'
    },
    {
      title: 'The Architects Circle',
      description: 'กลุ่มแชทส่วนตัวสำหรับ Circle Members เท่านั้น',
      icon: <MessageSquare className="w-6 h-6" />,
      action: () => navigate('/architects-circle'),
      status: 'exclusive',
      nextDate: 'พร้อมใช้',
      badge: 'Discord VIP'
    },
    {
      title: 'Custom Solution',
      description: 'โซลูชันที่ปรับแต่งเฉพาะสำหรับธุรกิจคุณ',
      icon: <Building2 className="w-6 h-6" />,
      action: () => navigate('/custom-solutions'),
      status: 'premium',
      nextDate: 'ตามคำร้อง',
      badge: 'Bespoke'
    },
    {
      title: 'Early Access',
      description: 'เข้าถึงคอนเทนต์และคอร์สใหม่ก่อนใคร',
      icon: <Rocket className="w-6 h-6" />,
      action: () => navigate('/early-access'),
      status: 'beta',
      nextDate: 'อัปเดตใหม่',
      badge: 'Beta Access'
    },
    {
      title: 'Success Mentorship',
      description: 'การพี่เลี้ยงระยะยาวสำหรับการเติบโต',
      icon: <HeartHandshake className="w-6 h-6" />,
      action: () => navigate('/mentorship'),
      status: 'ongoing',
      nextDate: 'ติดตาม 24/7',
      badge: 'Personal Mentor'
    }
  ];

  const achievementMilestones = [
    { name: 'Freedom Engine Graduate', completed: true, icon: '🎓' },
    { name: 'First Revenue Stream', completed: true, icon: '💰' },
    { name: 'Automated System Builder', completed: true, icon: '⚙️' },
    { name: 'Empire Architect', completed: false, icon: '🏛️' },
    { name: 'Mentorship Leader', completed: false, icon: '👨‍🏫' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Crown Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-100 px-6 py-3 rounded-full mb-6">
            <Crown className="w-6 h-6 text-amber-600" />
            <div className="text-left">
              <Badge variant="outline" className="mb-1 border-amber-200 text-amber-700 bg-amber-50">
                Circle Member
              </Badge>
              <p className="text-sm text-amber-600">Architect - สร้างอิมไพร์</p>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ยินดีต้อนรับสู่ The Architects' Circle, {userName}! 👑
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            คุณได้เข้าสู่ระดับสูงสุดแล้ว - ต่อจากนี้เราจะช่วยให้คุณสร้างอิมไพร์ธุรกิจของตัวเอง
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <Diamond className="w-5 h-5" />
            <span className="font-semibold">Elite Member Since</span>
            <Badge className="bg-amber-500">2024</Badge>
          </div>
        </div>

        {/* Empire Progress */}
        {targetMonthlyIncome > 0 && (
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge variant="outline" className="border-white text-white mb-4">
                    <Target className="w-4 h-4 mr-2" />
                    Empire Freedom Number
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">
                    เป้าหมายอิมไพร์ของคุณ:
                  </h2>
                  <p className="text-4xl md:text-5xl font-bold mb-4">
                    ฿{targetMonthlyIncome.toLocaleString()} / เดือน
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/dreamlining-calculator')}
                      className="bg-white/20 border-white text-white hover:bg-white hover:text-amber-600"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      ปรับเป้าหมาย
                    </Button>
                    <Button
                      onClick={() => navigate('/empire-analytics')}
                      className="bg-white text-amber-600 hover:bg-amber-50"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Empire Analytics
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/10 rounded-2xl p-8">
                    <div className="text-6xl mb-4">🏛️</div>
                    <Badge className="bg-white/20 text-white mb-2">Empire Builder</Badge>
                    <p className="text-sm text-amber-100">การสร้างอิมไพร์ธุรกิจ</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Live Workshop */}
        <Card className="mb-8 border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500 rounded-lg text-white">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="destructive" className="mb-1">Live ในวันที่ 15 มีนาคม</Badge>
                    <h2 className="text-xl font-bold">Workshop เดือนนี้</h2>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  "Scaling Your Empire: Advanced Automation Strategies"
                </h3>
                <p className="text-gray-600 mb-6">
                  เรียนรู้เทคนิคการขยายธุรกิจอัตโนมัติระดับสูง และการสร้างระบบที่รองรับการเติบโตแบบ exponential
                </p>
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/live-workshops')}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    เข้าร่วม Workshop
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/workshop-materials')}
                  >
                    ดูเอกสารประกอบ
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 rounded-2xl p-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <Badge className="bg-amber-500 text-white mb-2">Circle Exclusive</Badge>
                  <p className="text-sm text-amber-700">20:00 - 22:00 น.</p>
                  <p className="text-xs text-gray-600 mt-1">พร้อมบันทึกวิดีโอ</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Circle Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            สิทธิ์เอกสิทธิ์ Circle Member ของคุณ
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circleFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer hover:scale-105" onClick={feature.action}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Badge 
                      variant="outline"
                      className={`${
                        feature.status === 'live' ? 'border-red-200 text-red-600' :
                        feature.status === 'exclusive' ? 'border-purple-200 text-purple-600' :
                        feature.status === 'premium' ? 'border-amber-200 text-amber-600' :
                        'border-green-200 text-green-600'
                      }`}
                    >
                      {feature.badge}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{feature.nextDate}</p>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full group">
                    เข้าใช้งาน
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievement Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Empire Building Milestones
            </CardTitle>
            <CardDescription>
              ติดตามความก้าวหน้าในการสร้างอิมไพร์ธุรกิจของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4 mb-6">
              {achievementMilestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`text-center p-4 rounded-lg border-2 ${
                    milestone.completed 
                      ? 'bg-amber-50 border-amber-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-2">{milestone.icon}</div>
                  {milestone.completed ? (
                    <CheckCircle className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 mx-auto mb-2" />
                  )}
                  <p className={`text-xs font-medium ${
                    milestone.completed ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {milestone.name}
                  </p>
                </div>
              ))}
            </div>
            <Progress value={60} className="h-3" />
            <p className="text-center text-sm text-gray-600 mt-2">3 จาก 5 milestones เสร็จสิ้น</p>
          </CardContent>
        </Card>

        {/* Value Ladder Completion */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Value Ladder Journey เสร็จสิ้น
            </CardTitle>
            <CardDescription>
              คุณได้เดินทางผ่านทุกขั้นตอนของ Freedom Engine Value Ladder แล้ว
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
              <div className="text-center p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-purple-600">Pro Member</p>
                <p className="text-xs text-gray-500">เสร็จแล้ว</p>
              </div>
              <div className="text-center p-3 bg-amber-100 rounded-lg border-2 border-amber-500">
                <Crown className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-amber-600">Circle Member</p>
                <p className="text-xs text-amber-600">สำเร็จ! 🎉</p>
              </div>
            </div>
            <Progress value={100} className="h-3" />
            <p className="text-center text-sm text-green-600 mt-2 font-semibold">
              🎉 ขอแสดงความยินดี! คุณเป็น Elite Member แล้ว
            </p>
          </CardContent>
        </Card>

        {/* Circle Network */}
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-8">
            <div className="text-center">
              <Crown className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">The Architects' Circle Network</h3>
              <p className="text-muted-foreground mb-6">
                เชื่อมต่อกับ Circle Members ระดับสูงคนอื่น สร้าง Network แห่งความสำเร็จ
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold">156 Members</h4>
                  <p className="text-sm text-gray-600">Active Circle Members</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold">24/7 Chat</h4>
                  <p className="text-sm text-gray-600">Discord VIP Channel</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-semibold">98% Success</h4>
                  <p className="text-sm text-gray-600">Achievement Rate</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => navigate('/architects-circle')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  เข้าร่วม Circle Chat
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/consultation-booking')}
                  className="border-purple-200 text-purple-600 hover:bg-purple-100"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  จอง 1:1 Consultation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default CircleMemberDashboard;
