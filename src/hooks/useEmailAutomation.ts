import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailTemplate {
  welcome: string;
  verification: string;
  newsletter_confirmation: string;
  value_ladder_progression: string;
  weekly_tips: string;
  engagement_followup: string;
}

interface EmailAutomationData {
  email: string;
  name?: string;
  type: keyof EmailTemplate;
  customData?: Record<string, any>;
}

export const useEmailAutomation = () => {
  
  // Send welcome sequence
  const sendWelcomeSequence = useMutation({
    mutationFn: async ({ email, name, type }: EmailAutomationData) => {
      console.log(`📧 Sending welcome sequence to: ${email}`, {
        name,
        type,
        timestamp: new Date().toISOString()
      });

      // In a real app, this would integrate with email service
      // For now, we'll just log the action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, email, type: 'welcome' };
    },
    onSuccess: (data) => {
      console.log('✅ Welcome email sent successfully:', data);
      toast.success('ส่งอีเมลต้อนรับสำเร็จ!');
    },
    onError: (error: any) => {
      console.error('❌ Welcome email failed:', error);
      toast.error('เกิดข้อผิดพลาดในการส่งอีเมลต้อนรับ');
    }
  });

  // Send newsletter confirmation
  const sendNewsletterConfirmation = useMutation({
    mutationFn: async ({ email, name }: { email: string; name?: string }) => {
      console.log(`📧 Sending newsletter confirmation to: ${email}`, {
        name,
        timestamp: new Date().toISOString()
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, email, type: 'newsletter_confirmation' };
    },
    onSuccess: (data) => {
      console.log('✅ Newsletter confirmation sent successfully:', data);
      toast.success('ส่งอีเมลยืนยันการสมัครรับข่าวสารสำเร็จ!');
    },
    onError: (error: any) => {
      console.error('❌ Newsletter confirmation failed:', error);
      toast.error('เกิดข้อผิดพลาดในการส่งอีเมลยืนยัน');
    }
  });

  // Send engagement follow-up
  const sendEngagementFollowup = useMutation({
    mutationFn: async ({ 
      email, 
      name, 
      lastActivity 
    }: { 
      email: string; 
      name?: string; 
      lastActivity?: string;
    }) => {
      console.log(`📧 Sending engagement follow-up to: ${email}`, {
        name,
        lastActivity,
        timestamp: new Date().toISOString()
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, email, type: 'engagement_followup' };
    },
    onSuccess: (data) => {
      console.log('✅ Engagement follow-up sent successfully:', data);
      toast.success('ส่งอีเมลติดตามสำเร็จ!');
    },
    onError: (error: any) => {
      console.error('❌ Engagement follow-up failed:', error);
      toast.error('เกิดข้อผิดพลาดในการส่งอีเมลติดตาม');
    }
  });

  return {
    sendWelcomeSequence,
    sendNewsletterConfirmation,
    sendEngagementFollowup,
    isLoading: sendWelcomeSequence.isPending || 
               sendNewsletterConfirmation.isPending || 
               sendEngagementFollowup.isPending
  };
};
