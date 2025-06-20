
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WelcomeEmailData {
  userEmail: string;
  userName?: string;
}

export const useWelcomeEmail = () => {
  return useMutation({
    mutationFn: async ({ userEmail, userName }: WelcomeEmailData) => {
      const { data, error } = await supabase.functions.invoke('send-email-notifications', {
        body: {
          type: 'welcome',
          to: userEmail,
          data: {
            user_name: userName || 'สมาชิกใหม่'
          }
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      console.log('Welcome email sent successfully');
    },
    onError: (error) => {
      console.error('Welcome email error:', error);
      // Don't show toast error for welcome email as it's automatic
    },
  });
};
