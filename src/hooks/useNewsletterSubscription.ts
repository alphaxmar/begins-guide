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
      console.log(`📧 Subscribing to newsletter: ${email}`, {
        source,
        timestamp: new Date().toISOString()
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would save to database
      // For now, we'll just return success
      return {
        id: `sub_${Date.now()}`,
        email,
        status: 'active',
        source,
        subscribed_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      toast.success('เข้าร่วมรับข่าวสารสำเร็จ!', {
        description: 'คุณจะได้รับข้อมูลและคำแนะนำล่าสุดจากเรา'
      });
      setEmail('');
    },
    onError: (error: any) => {
      console.error('Newsletter subscription error:', error);
      toast.error('เกิดข้อผิดพลาดในการเข้าร่วมรับข่าวสาร', {
        description: 'กรุณาลองใหม่อีกครั้ง'
      });
    }
  });

  // Unsubscribe from newsletter (Mock implementation)
  const unsubscribeFromNewsletter = useMutation({
    mutationFn: async (email: string) => {
      console.log('Mock: Unsubscribing email from newsletter:', email);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        email,
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      toast.success('ยกเลิกการรับข่าวสารสำเร็จ');
    },
    onError: (error: any) => {
      console.error('Newsletter unsubscribe error:', error);
      toast.error('เกิดข้อผิดพลาดในการยกเลิกการรับข่าวสาร');
    }
  });

  // Check if email is subscribed (Mock implementation)
  const checkSubscription = useQuery({
    queryKey: ['newsletter-subscription', email],
    queryFn: async () => {
      if (!email) return null;
      
      console.log('Mock: Checking subscription status for:', email);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock: randomly return subscribed or not (for demo purposes)
      const isSubscribed = Math.random() > 0.5;
      
      return isSubscribed ? {
        id: Math.random().toString(36).substr(2, 9),
        email,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } : null;
    },
    enabled: !!email
  });

  // Get all newsletter subscribers (admin only) - Mock implementation
  const getNewsletterSubscribers = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      console.log('Mock: Fetching newsletter subscribers');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for demo
      const mockSubscribers = [
        {
          id: '1',
          email: 'user1@example.com',
          status: 'active',
          subscribed_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          source: 'homepage'
        },
        {
          id: '2',
          email: 'user2@example.com',
          status: 'active',
          subscribed_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          source: 'auth_page'
        },
        {
          id: '3',
          email: 'user3@example.com',
          status: 'active',
          subscribed_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          source: 'pricing_page'
        }
      ];
      
      return mockSubscribers;
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
