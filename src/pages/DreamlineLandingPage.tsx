import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Target, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DreamlineLandingPage = () => {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dreamline-tool');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "อีเมลและรหัสผ่านจำเป็นต้องกรอก",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      toast({
        title: "สมัครสมาชิกสำเร็จ!",
        description: "ยินดีต้อนรับสู่ Begins.guide คุณสามารถเริ่มใช้เครื่องมือได้เลย",
      });
      navigate('/dreamline-tool');
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถสมัครสมาชิกได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            <Zap className="w-4 h-4 mr-2" />
            เครื่องมือฟรี จาก Begins.guide
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            คุณรู้หรือไม่ว่า{' '}
            <span className="text-primary">"ราคาของชีวิตในฝัน"</span>{' '}
            อาจจะ<span className="text-accent">ถูกกว่าที่คุณคิด?</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            เครื่องมือ Interactive Dreamlining จะช่วยให้คุณคำนวณ "รายได้เป้าหมายต่อเดือน" 
            ที่แท้จริงเพื่อให้ชีวิตในฝันของคุณกลายเป็นจริง
          </p>

          {/* Signup Form */}
          <Card className="max-w-md mx-auto mb-12 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">เริ่มต้นฟรีทันที</CardTitle>
              <CardDescription>
                ไม่มีค่าใช้จ่าย | ไม่ต้องใส่บัตรเครดิต | ใช้งานได้ทันที
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <Input
                  type="email"
                  placeholder="อีเมลของคุณ"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="password"
                  placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  minLength={6}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={loading}
                >
                  {loading ? "กำลังสร้างบัญชี..." : "สร้างบัญชีและเริ่มใช้งาน"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>ผู้ใช้งานมากกว่า 10,000+ คน</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>ความแม่นยำ 95%</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>ใช้งานง่าย 100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            เครื่องมือที่จะเปลี่ยนชีวิตคุณ
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">คำนวณเป้าหมายชัดเจน</h3>
                <p className="text-muted-foreground">
                  เปลี่ยนความฝันที่คลุมเครือให้กลายเป็นตัวเลขที่ชัดเจนและวัดผลได้
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">คำนวณ TMI แบบเรียลไทม์</h3>
                <p className="text-muted-foreground">
                  ระบบคำนวณ Target Monthly Income ของคุณอัตโนมัติ เมื่อคุณกรอกข้อมูล
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">บันทึกและติดตาม</h3>
                <p className="text-muted-foreground">
                  ข้อมูลถูกบันทึกไว้อย่างปลอดภัย กลับมาดูและแก้ไขได้ตลอดเวลา
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              ใช้งานได้ใน 3 ขั้นตอนง่ายๆ
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">กรอกความฝัน</h3>
                <p className="text-muted-foreground">
                  เขียนสิ่งที่คุณอยากมี อยากเป็น อยากทำ ลงในตารางพร้อมราคา
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">ใส่ค่าใช้จ่ายพื้นฐาน</h3>
                <p className="text-muted-foreground">
                  กรอกค่าใช้จ่ายรายเดือนปัจจุบันของคุณ
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">ได้คำตอบ TMI</h3>
                <p className="text-muted-foreground">
                  ระบบจะคำนวณรายได้เป้าหมายต่อเดือนที่คุณต้องการให้ความฝันเป็นจริง
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            พร้อมที่จะรู้ "ราคาแห่งความฝัน" ของคุณแล้วหรือยัง?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            เริ่มต้นเส้นทางสู่ความเป็นอิสระทางการเงินวันนี้
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            เริ่มต้นใช้งานฟรี
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DreamlineLandingPage;