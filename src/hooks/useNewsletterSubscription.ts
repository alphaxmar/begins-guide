import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewsletterSubscription {
  id: string;
  email: string;
  subscribed_at: string;
  status: 'active' | 'unsubscribed';
  source: string;
}

export const useNewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Subscribe to newsletter
  const subscribeToNewsletter = useMutation({
    mutationFn: async ({ email, source = 'pricing_page' }: { email: string; source?: string }) => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email,
            status: 'active',
            source,
            subscribed_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('เข้าร่วมรับข่าวสารสำเร็จ!', {
        description: 'คุณจะได้รับข้อมูลและคำแนะนำล่าสุดจากเรา'
      });
      setEmail('');
    },
    onError: (error: any) => {
      console.error('Newsletter subscription error:', error);
      if (error.message?.includes('duplicate')) {
        toast.info('อีเมลนี้ได้เข้าร่วมรับข่าวสารแล้ว');
      } else {
        toast.error('เกิดข้อผิดพลาดในการเข้าร่วมรับข่าวสาร');
      }
    }
  });

  // Unsubscribe from newsletter
  const unsubscribeFromNewsletter = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .update({ status: 'unsubscribed' })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('ยกเลิกการรับข่าวสารสำเร็จ');
    },
    onError: (error: any) => {
      console.error('Newsletter unsubscribe error:', error);
      toast.error('เกิดข้อผิดพลาดในการยกเลิกการรับข่าวสาร');
    }
  });

  // Check if email is subscribed
  const checkSubscription = useQuery({
    queryKey: ['newsletter-subscription', email],
    queryFn: async () => {
      if (!email) return null;
      
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('email', email)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!email
  });

  // Get all newsletter subscribers (admin only)
  const getNewsletterSubscribers = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('status', 'active')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleSubscribe = async (emailAddress: string, source?: string) => {
    setIsSubscribing(true);
    try {
      await subscribeToNewsletter.mutateAsync({ email: emailAddress, source });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribe = async (emailAddress: string) => {
    await unsubscribeFromNewsletter.mutateAsync(emailAddress);
  };

  return {
    email,
    setEmail,
    isSubscribing,
    subscribeToNewsletter,
    handleSubscribe,
    handleUnsubscribe,
    isSubscribed: !!checkSubscription.data,
    subscriberCount: getNewsletterSubscribers.data?.length || 0,
    subscribers: getNewsletterSubscribers.data || [],
    isLoading: checkSubscription.isLoading || subscribeToNewsletter.isPending
  };
};

export type { NewsletterSubscription };
