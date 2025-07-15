import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDreamlines } from '@/hooks/useDreamlines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, BookOpen, GraduationCap, Users, Calculator, Edit3, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { summary, loading } = useDreamlines();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const targetMonthlyIncome = summary?.target_monthly_income || 0;
  const userName = user.email?.split('@')[0] || 'ผู้ใช้';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Welcome & Key Metric Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ยินดีต้อนรับ, {userName}!
          </h1>
          
          {targetMonthlyIncome > 0 ? (
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 max-w-2xl mx-auto">
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
                    onClick={() => navigate('/dreamline-tool')}
                    className="mt-2"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    แก้ไข/ดู Dreamline ของฉัน
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <Calculator className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  คุณยังไม่ได้ใช้เครื่องมือ Dreamlining
                </p>
                <Button onClick={() => navigate('/dreamline-tool')}>
                  <Calculator className="w-4 h-4 mr-2" />
                  เริ่มใช้เครื่องมือ Dreamlining
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Primary Upsell Section - The Book */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    คุณมี 'จุดหมาย' แล้ว... แล้ว 'แผนที่' ที่จะพาคุณไปล่ะ?
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg">
                    หนังสือ "The Freedom Engine" คือพิมพ์เขียวที่จะแปลงเป้าหมาย TMI ของคุณให้กลายเป็นแผนการที่เป็นจริงได้ 
                    ด้วยกลยุทธ์ที่ผ่านการพิสูจน์และระบบที่ทำงานอัตโนมัติ
                  </p>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/book')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    รับพิมพ์เขียวของคุณ (สั่งซื้อหนังสือ)
                  </Button>
                </div>
                <div className="order-1 md:order-2 text-center">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 max-w-sm mx-auto">
                    <BookOpen className="w-24 h-24 text-primary mx-auto mb-4" />
                    <div className="bg-primary/10 rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">The Freedom Engine</h3>
                      <p className="text-sm text-muted-foreground">
                        พิมพ์เขียวสร้างธุรกิจที่ทำงานแทนคุณ 24 ชั่วโมง
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Upsell Section - Academy */}
        <div className="mb-8">
          <Card className="border-muted">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">สำหรับผู้ที่พร้อมจะ 'สร้าง' ทันที</h3>
                <p className="text-muted-foreground mb-4">
                  Freedom Engine Academy คือคอร์สครบครันที่จะพาคุณจากศูนย์ไปสู่การมีธุรกิจที่ทำงานอัตโนมัติ
                </p>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/academy')}
                  className="text-primary hover:text-primary/80"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  ดูรายละเอียดคอร์ส Academy
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Engagement Section */}
        <div className="mb-8">
          <Card className="bg-secondary/10 border-secondary/20">
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
                  เข้าร่วมกลุ่ม Facebook ฟรี
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;