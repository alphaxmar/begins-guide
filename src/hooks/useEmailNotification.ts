
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmailNotificationData {
  type: 'purchase_confirmation' | 'welcome' | 'password_reset';
  to: string;
  data?: {
    user_name?: string;
    order_id?: string;
    products?: Array<{ title: string; price: number }>;
    total_amount?: number;
    reset_link?: string;
  };
}

export const useEmailNotification = () => {
  return useMutation({
    mutationFn: async (emailData: EmailNotificationData) => {
      const { data, error } = await supabase.functions.invoke('send-email-notifications', {
        body: emailData,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
