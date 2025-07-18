import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Mail, Lock } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(true);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('กรุณากรอกอีเมล');
      return;
    }
    if (!password.trim()) {
      toast.error('กรุณากรอกรหัสผ่าน');
      return;
    }

    setLoading(true);
    
    try {
      await signIn(email, password, acceptNewsletter);
      toast.success('เข้าสู่ระบบสำเร็จ!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('เข้าสู่ระบบไม่สำเร็จ', {
        description: error.message || 'กรุณาตรวจสอบอีเมลและรหัสผ่าน'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('กรุณากรอกอีเมล');
      return;
    }
    if (!password.trim()) {
      toast.error('กรุณากรอกรหัสผ่าน');
      return;
    }
    if (password.length < 6) {
      toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);
    
    try {
      await signUp(email, password, acceptNewsletter);
      toast.success('สมัครสมาชิกสำเร็จ!', {
        description: 'ยินดีต้อนรับสู่ BeginS Guide'
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('สมัครสมาชิกไม่สำเร็จ', {
        description: error.message || 'กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary mb-2">Begins.Guide</h1>
          </Link>
          <p className="text-gray-600">เข้าสู่ระบบหรือสร้างบัญชีใหม่</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">เข้าสู่ระบบ</TabsTrigger>
            <TabsTrigger value="signup">สมัครสมาชิก</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  เข้าสู่ระบบ
                </CardTitle>
                <CardDescription>
                  ใส่อีเมลเพื่อรับลิงก์เข้าสู่ระบบ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">อีเมล</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">รหัสผ่าน</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="รหัสผ่าน"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="login-newsletter"
                      checked={acceptNewsletter}
                      onCheckedChange={(checked) => setAcceptNewsletter(checked as boolean)}
                    />
                    <label
                      htmlFor="login-newsletter"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      รับข่าวสารและเคล็ดลับจาก Begins.Guide
                    </label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังเข้าสู่ระบบ...
                      </>
                    ) : (
                      'เข้าสู่ระบบ'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  สมัครสมาชิก
                </CardTitle>
                <CardDescription>
                  สร้างบัญชีใหม่เพื่อเริ่มต้นเรียนรู้
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">อีเมล</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">รหัสผ่าน</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="signup-newsletter"
                      checked={acceptNewsletter}
                      onCheckedChange={(checked) => setAcceptNewsletter(checked as boolean)}
                    />
                    <label
                      htmlFor="signup-newsletter"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      รับข่าวสารและเคล็ดลับจาก Begins.Guide
                    </label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังสมัครสมาชิก...
                      </>
                    ) : (
                      'สมัครสมาชิกฟรี'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            เมื่อคุณสมัครสมาชิก คุณยอมรับ{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              นโยบายความเป็นส่วนตัว
            </Link>{' '}
            และ{' '}
            <Link to="/terms" className="text-primary hover:underline">
              เงื่อนไขการใช้งาน
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
