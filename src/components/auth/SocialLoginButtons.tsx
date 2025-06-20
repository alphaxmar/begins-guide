
import { Button } from "@/components/ui/button";
import { Chrome, Facebook, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { cleanupAuthState } from "@/utils/authCleanup";

interface SocialLoginButtonsProps {
  redirectTo?: string;
}

const SocialLoginButtons = ({ redirectTo }: SocialLoginButtonsProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setLoading(provider);
    
    try {
      cleanupAuthState();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`${provider} OAuth error:`, error);
      
      let errorMessage = `เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย ${provider === 'google' ? 'Google' : 'Facebook'}`;
      
      if (error.message.includes('popup_closed_by_user')) {
        errorMessage = 'การเข้าสู่ระบบถูกยกเลิก';
      } else if (error.message.includes('access_denied')) {
        errorMessage = 'การเข้าถึงถูกปฏิเสธ กรุณาอนุญาตการเข้าถึงเพื่อดำเนินการต่อ';
      } else if (error.message.includes('network')) {
        errorMessage = 'ปัญหาการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ตและลองอีกครั้ง';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button 
        variant="outline" 
        onClick={() => handleOAuthLogin('google')} 
        disabled={loading !== null}
        className="relative"
      >
        {loading === 'google' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      <Button 
        variant="outline" 
        onClick={() => handleOAuthLogin('facebook')} 
        disabled={loading !== null}
        className="relative"
      >
        {loading === 'facebook' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Facebook className="mr-2 h-4 w-4" />
        )}
        Facebook
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
