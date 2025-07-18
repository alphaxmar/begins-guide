
import { Button } from "@/components/ui/button";
import { Chrome, Facebook, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";

interface SocialLoginButtonsProps {
  redirectTo?: string;
}

const SocialLoginButtons = ({ redirectTo }: SocialLoginButtonsProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    setLoading('google');
    
    try {
      await signInWithGoogle();
      toast.success('กำลังเข้าสู่ระบบด้วย Google...');
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      
      let errorMessage = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google';
      
      if (error.message.includes('popup_closed_by_user')) {
        errorMessage = 'การเข้าสู่ระบบถูกยกเลิก';
      } else if (error.message.includes('access_denied')) {
        errorMessage = 'การเข้าถึงถูกปฏิเสธ กรุณาอนุญาตการเข้าถึงเพื่อดำเนินการต่อ';
      } else if (error.message.includes('validation_failed') || error.message.includes('not enabled')) {
        errorMessage = 'การเข้าสู่ระบบด้วย Google ยังไม่พร้อมใช้งาน กรุณาใช้อีเมลและรหัสผ่าน';
      } else if (error.message.includes('network')) {
        errorMessage = 'ปัญหาการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ตและลองอีกครั้ง';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <Button 
        variant="outline" 
        onClick={handleGoogleLogin}
        disabled={loading !== null}
        className="relative w-full"
      >
        {loading === 'google' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}
        เข้าสู่ระบบด้วย Google
      </Button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">หรือ</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
