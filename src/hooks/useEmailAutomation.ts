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
  userEmail: string;
  userName?: string;
  templateType: keyof EmailTemplate;
  customData?: Record<string, any>;
}

export const useEmailAutomation = () => {
  
  // Send automated email using existing email_notifications table
  const sendAutomatedEmail = useMutation({
    mutationFn: async ({ userEmail, userName, templateType, customData }: EmailAutomationData) => {
      
      // Prepare email data for email_notifications table
      const emailData = {
        recipient_email: userEmail,
        subject: getEmailSubject(templateType, userName),
        template_id: templateType,
        status: 'pending'
      };

      // Save to email_notifications
      const { data, error } = await supabase
        .from('email_notifications')
        .insert([emailData])
        .select()
        .single();

      if (error) throw error;

      // Simulate email sending
      await simulateEmailSending(data.id, templateType, userEmail, userName, customData);
      
      return data;
    },
    onSuccess: (data) => {
      console.log('Email queued successfully:', data);
    },
    onError: (error: any) => {
      console.error('Email automation error:', error);
      toast.error('เกิดข้อผิดพลาดในการส่งอีเมล');
    }
  });

  // Trigger welcome email sequence
  const sendWelcomeSequence = useMutation({
    mutationFn: async ({ userEmail, userName }: { userEmail: string; userName?: string }) => {
      const emails = [
        {
          templateType: 'welcome' as const,
          delay: 0, // Send immediately
        },
        {
          templateType: 'value_ladder_progression' as const,
          delay: 3 * 24 * 60 * 60 * 1000, // 3 days
        },
        {
          templateType: 'weekly_tips' as const,
          delay: 7 * 24 * 60 * 60 * 1000, // 1 week
        }
      ];

      const results = [];
      for (const email of emails) {
        // For immediate emails, send now. For delayed emails, just log (in real app, would schedule)
        if (email.delay === 0) {
          const result = await sendAutomatedEmail.mutateAsync({
            userEmail,
            userName,
            templateType: email.templateType,
            customData: { sequence: 'welcome' }
          });
          results.push(result);
        } else {
          console.log(`Scheduled ${email.templateType} email for ${userEmail} in ${email.delay}ms`);
        }
      }
      
      return results;
    }
  });

  // Send newsletter confirmation
  const sendNewsletterConfirmation = useMutation({
    mutationFn: async ({ userEmail, userName }: { userEmail: string; userName?: string }) => {
      return sendAutomatedEmail.mutateAsync({
        userEmail,
        userName,
        templateType: 'newsletter_confirmation',
        customData: {
          subscription_benefits: [
            'Weekly business tips and insights',
            'Exclusive case studies',
            'Early access to new content',
            'Special discounts and offers'
          ]
        }
      });
    }
  });

  // Send engagement follow-up
  const sendEngagementFollowup = useMutation({
    mutationFn: async ({ 
      userEmail, 
      userName, 
      lastActivity, 
      recommendedActions 
    }: { 
      userEmail: string; 
      userName?: string; 
      lastActivity: string;
      recommendedActions: string[];
    }) => {
      return sendAutomatedEmail.mutateAsync({
        userEmail,
        userName,
        templateType: 'engagement_followup',
        customData: {
          last_activity: lastActivity,
          recommended_actions: recommendedActions
        }
      });
    }
  });

  return {
    sendAutomatedEmail,
    sendWelcomeSequence,
    sendNewsletterConfirmation,
    sendEngagementFollowup,
    isLoading: sendAutomatedEmail.isPending || 
               sendWelcomeSequence.isPending || 
               sendNewsletterConfirmation.isPending ||
               sendEngagementFollowup.isPending
  };
};

// Helper function to get email subject based on template type
const getEmailSubject = (templateType: keyof EmailTemplate, userName?: string): string => {
  const subjects = {
    welcome: `ยินดีต้อนรับสู่ Begins.Guide ${userName ? `, ${userName}` : ''}! 🎉`,
    verification: 'ยืนยันอีเมลของคุณกับ Begins.Guide',
    newsletter_confirmation: 'ยืนยันการสมัครรับข่าวสารจาก Begins.Guide ✅',
    value_ladder_progression: 'เวลาก้าวไปขั้นต่อไปแล้ว! 🚀',
    weekly_tips: 'เคล็ดลับธุรกิจประจำสัปดาห์จาก Begins.Guide 💡',
    engagement_followup: 'คิดถึงคุณ! มาดูความคืบหน้าของคุณกัน 📈'
  };

  return subjects[templateType] || 'ข่าวสารจาก Begins.Guide';
};

// Simulate email sending (in real app, this would trigger actual email service)
const simulateEmailSending = async (
  emailId: string, 
  templateType: keyof EmailTemplate, 
  userEmail: string, 
  userName?: string,
  customData?: Record<string, any>
) => {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update status to sent
  const { error } = await supabase
    .from('email_notifications')
    .update({ status: 'sent' })
    .eq('id', emailId);

  if (error) {
    console.error('Error updating email status:', error);
  } else {
    console.log(`✅ Email sent: ${templateType} to ${userEmail}`, {
      userName,
      customData,
      timestamp: new Date().toISOString()
    });
  }
};

export default useEmailAutomation;
