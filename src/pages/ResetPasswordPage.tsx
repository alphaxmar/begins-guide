
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบอีเมลของคุณ');
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ลืมรหัสผ่าน</CardTitle>
          <CardDescription>
            {submitted 
              ? 'หากอีเมลที่คุณกรอกถูกต้อง คุณจะได้รับลิงก์สำหรับตั้งรหัสผ่านใหม่'
              : 'กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
             <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  ไม่ได้รับอีเมล? ลองตรวจสอบในโฟลเดอร์สแปม หรือลองใหม่อีกครั้ง
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>ลองอีกครั้ง</Button>
             </div>
          ) : (
            <form onSubmit={handleSubmit}>
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
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                </Button>
              </div>
            </form>
          )}
           <div className="mt-4 text-center text-sm">
             <Link to="/auth" className="underline">
              กลับไปหน้าเข้าสู่ระบบ
             </Link>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
