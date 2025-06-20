
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
    if (!email.trim() || !password) {
      toast.error('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoading(true);
    
    try {
      await signIn(email, password);
      toast.success('เข้าสู่ระบบสำเร็จ!');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง');
      } else {
        toast.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    if (password.length < 6) {
      toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);
    
    try {
      await signUp(email, password);
      toast.success('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยัน');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message.includes('User already registered')) {
        toast.error('อีเมลนี้ได้ลงทะเบียนแล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น');
      } else {
        toast.error('เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">เข้าสู่ระบบ</TabsTrigger>
          <TabsTrigger value="signup">สมัครสมาชิก</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>เข้าสู่ระบบ</CardTitle>
              <CardDescription>กรอกข้อมูลเพื่อเข้าสู่บัญชีของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="m@example.com" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">รหัสผ่าน</Label>
                      <Link
                        to="/reset-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        ลืมรหัสผ่าน?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังเข้าสู่ระบบ...
                      </>
                    ) : (
                      'เข้าสู่ระบบ'
                    )}
                  </Button>
                </div>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    หรือเข้าสู่ระบบด้วย
                  </span>
                </div>
              </div>
              <SocialLoginButtons />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>สมัครสมาชิก</CardTitle>
              <CardDescription>สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="signup-email">อีเมล</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="m@example.com" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-password">รหัสผ่าน</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        กำลังสร้างบัญชี...
                      </>
                    ) : (
                      'สร้างบัญชี'
                    )}
                  </Button>
                </div>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    หรือสมัครด้วย
                  </span>
                </div>
              </div>
              <SocialLoginButtons />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;
