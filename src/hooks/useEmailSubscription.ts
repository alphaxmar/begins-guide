
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

// Note: We'll need to create a newsletter_subscribers table later
export const useNewsletterSubscription = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      // For now, we'll just store in a simple way
      // In production, this would integrate with a proper newsletter service
      const { data, error } = await supabase
        .from('email_logs')
        .insert({
          recipient_email: email,
          subject: 'Newsletter Subscription',
          status: 'subscribed'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('สมัครรับข่าวสารสำเร็จ!');
    },
    onError: (error) => {
      console.error('Newsletter subscription error:', error);
      toast.error('เกิดข้อผิดพลาดในการสมัครรับข่าวสาร');
    },
  });
};

export const useWelcomeEmail = () => {
  return useMutation({
    mutationFn: async (userEmail: string) => {
      const { data, error } = await supabase.functions.invoke('send-email-notifications', {
        body: {
          type: 'welcome',
          to: userEmail,
          data: {
            user_name: 'สมาชิกใหม่'
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
    },
  });
};
