
import { Button } from "@/components/ui/button";
import { Chrome, Facebook, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { cleanupAuthState } from "@/utils/authCleanup";

const SocialLoginButtons = () => {
  const [loading, setLoading] = useState(false);

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    
    try {
      cleanupAuthState();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
      }
    } catch (error: any) {
      console.error('OAuth error:', error);
      toast.error(`เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย ${provider === 'google' ? 'Google' : 'Facebook'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button 
        variant="outline" 
        onClick={() => handleOAuthLogin('google')} 
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      <Button 
        variant="outline" 
        onClick={() => handleOAuthLogin('facebook')} 
        disabled={loading}
      >
        {loading ? (
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
