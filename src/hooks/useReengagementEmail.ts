import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ReengagementEmailData {
  type: 'manual' | 'scheduled';
  user_id?: string;
}

export const useReengagementEmail = () => {
  const [isSending, setIsSending] = useState(false);

  const sendReengagementEmail = async (data: ReengagementEmailData) => {
    setIsSending(true);

    try {
      const { data: result, error } = await supabase.functions.invoke('send-reengagement-email', {
        body: data,
      });

      if (error) throw error;

      toast({
        title: "ส่งอีเมลสำเร็จ",
        description: result.message || "อีเมลกระตุ้นเตือนถูกส่งแล้ว",
      });

      return result;
    } catch (error: any) {
      console.error('Error sending re-engagement email:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งอีเมลได้",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const sendBulkReengagementEmails = async () => {
    return sendReengagementEmail({ type: 'scheduled' });
  };

  const sendManualReengagementEmail = async (userId: string) => {
    return sendReengagementEmail({ type: 'manual', user_id: userId });
  };

  return {
    sendReengagementEmail,
    sendBulkReengagementEmails,
    sendManualReengagementEmail,
    isSending,
  };
};