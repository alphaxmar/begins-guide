
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

interface EmailLog {
  id: string;
  template_id?: string;
  recipient_email: string;
  subject: string;
  status: string;
  error_message?: string;
  sent_by?: string;
  created_at: string;
}

export const useEmailTemplates = () => {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: async (): Promise<EmailTemplate[]> => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

export const useEmailLogs = () => {
  return useQuery({
    queryKey: ['email-logs'],
    queryFn: async (): Promise<EmailLog[]> => {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('email_templates')
        .insert(template)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast.success('สร้างเทมเพลตอีเมลสำเร็จ');
    },
    onError: (error) => {
      console.error('Error creating email template:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้างเทมเพลต');
    },
  });
};

export const useSendBulkEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      recipients, 
      subject, 
      content 
    }: { 
      recipients: string[]; 
      subject: string; 
      content: string; 
    }) => {
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: { recipients, subject, content }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-logs'] });
      toast.success('ส่งอีเมลสำเร็จ');
    },
    onError: (error) => {
      console.error('Error sending bulk email:', error);
      toast.error('เกิดข้อผิดพลาดในการส่งอีเมล');
    },
  });
};
