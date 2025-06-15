
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error('กรุณากรอกรหัสผ่านใหม่');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('อัปเดตรหัสผ่านสำเร็จ! คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว');
      await supabase.auth.signOut();
      navigate('/auth');
    }
    setLoading(false);
  };
  
  if (!session) {
      return (
        <div className="flex flex-col text-center justify-center items-center py-12 space-y-4">
            <p className="text-muted-foreground">กำลังตรวจสอบข้อมูลการยืนยัน...</p>
            <p className="text-sm text-muted-foreground max-w-xs">หน้านี้สำหรับผู้ที่ได้รับลิงก์รีเซ็ตรหัสผ่านทางอีเมลเท่านั้น</p>
        </div>
      );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ตั้งรหัสผ่านใหม่</CardTitle>
          <CardDescription>กรอกรหัสผ่านใหม่สำหรับบัญชีของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">รหัสผ่านใหม่</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'กำลังบันทึก...' : 'บันทึกรหัสผ่านใหม่'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;
