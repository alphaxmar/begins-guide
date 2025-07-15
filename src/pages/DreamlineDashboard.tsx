import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDreamlines } from '@/hooks/useDreamlines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Target, Calculator, TrendingUp, BookOpen, Users, Lock, Edit3 } from 'lucide-react';

const DreamlineDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { summary, loading } = useDreamlines();

  useEffect(() => {
    if (!user) {
      navigate('/dreamline');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const freedomNumber = summary?.target_monthly_income || 0;
  const hasData = freedomNumber > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Target className="w-4 h-4 mr-2" />
            Personal Dashboard
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ยินดีต้อนรับ, {user.email?.split('@')[0] || 'ผู้ใช้'}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            นี่คือแดชบอร์ดส่วนตัวของคุณ ติดตามความก้าวหน้าและเข้าถึงเครื่องมือต่างๆ ได้ที่นี่
          </p>
        </div>

        {hasData ? (
          /* With Data Layout */
          <div className="space-y-8">
            {/* Freedom Number Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <Badge variant="outline" className="mb-4">
                    <Calculator className="w-4 h-4 mr-2" />
                    Your Freedom Number
                  </Badge>
                  <h2 className="text-2xl font-semibold mb-2">
                    Target Monthly Income (TMI)
                  </h2>
                  <p className="text-5xl md:text-6xl font-bold text-primary mb-4">
                    ฿{freedomNumber.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground mb-6">
                    ต่อเดือน - นี่คือรายได้ที่คุณต้องการเพื่อให้ชีวิตในฝันกลายเป็นจริง
                  </p>
                  <Button
                    onClick={() => navigate('/dreamline-tool')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    แก้ไขข้อมูลความฝัน
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">สิ่งที่อยากมี</CardTitle>
                  <CardDescription>Having Goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    ฿{summary?.total_having.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">ต่อปี</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">สิ่งที่อยากเป็น</CardTitle>
                  <CardDescription>Being Goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    ฿{summary?.total_being.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">ต่อปี</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">สิ่งที่อยากทำ</CardTitle>
                  <CardDescription>Doing Goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">
                    ฿{summary?.total_doing.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">ต่อปี</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>ค่าใช้จ่ายรายเดือนปัจจุบัน</CardTitle>
                <CardDescription>ค่าใช้จ่ายพื้นฐานที่คุณต้องการรักษาไว้</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary mb-2">
                  ฿{summary?.monthly_basic_expenses.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-muted-foreground">
                  ต่อเดือน - ค่าใช้จ่ายพื้นฐานสำหรับการดำรงชีวิต
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* No Data Layout */
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">ยังไม่มีข้อมูลความฝัน</h2>
                <p className="text-muted-foreground">
                  คุณยังไม่ได้กรอกข้อมูลในเครื่องมือ Dreamlining เริ่มต้นวางแผนชีวิตในฝันของคุณกันเลย!
                </p>
                <Button
                  onClick={() => navigate('/dreamline-tool')}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  เริ่มใช้เครื่องมือ Dreamlining
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upsell Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="bg-background">
                  <Lock className="w-4 h-4 mr-2" />
                  Coming Soon
                </Badge>
                <h3 className="text-2xl font-bold">Freedom Engine Academy</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  เรียนรู้วิธีการสร้างธุรกิจออนไลน์เพื่อให้บรรลุ Freedom Number ของคุณ 
                  พร้อมแผนงานและเครื่องมือที่จำเป็นทั้งหมด
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mt-6 max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Step-by-Step Course</p>
                      <p className="text-sm text-muted-foreground">คอร์สเรียนแบบเป็นขั้นตอน</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Community Support</p>
                      <p className="text-sm text-muted-foreground">ชุมชนผู้เรียนและพี่เลี้ยง</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <div className="text-left">
                      <p className="font-semibold">Proven Strategy</p>
                      <p className="text-sm text-muted-foreground">กลยุทธ์ที่ผ่านการพิสูจน์</p>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" disabled className="mt-6">
                  <Lock className="w-4 h-4 mr-2" />
                  เรียนรู้เพิ่มเติม (เร็วๆ นี้)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Quick Actions</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dreamline-tool')}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              แก้ไขความฝัน
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
            >
              <Users className="w-4 h-4 mr-2" />
              จัดการโปรไฟล์
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              <Target className="w-4 h-4 mr-2" />
              กลับหน้าหลัก
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamlineDashboard;