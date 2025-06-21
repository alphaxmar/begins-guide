
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentSettings {
  promptpay_number?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  bank_branch?: string;
  stripe_enabled?: boolean;
  omise_enabled?: boolean;
}

export const usePaymentSettings = () => {
  const [settings, setSettings] = useState<PaymentSettings>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      console.log('Fetching payment settings...');
      
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching payment settings:', error);
        // Use fallback data if fetch fails
        const fallbackSettings = {
          promptpay_number: '0962358979',
          bank_name: 'ธนาคารกรุงเทพ',
          bank_account_number: '138-4-41680-4',
          bank_account_name: 'รณยศ ตันติถาวรรัช',
          bank_branch: '',
          stripe_enabled: true,
          omise_enabled: true
        };
        console.log('Using fallback settings:', fallbackSettings);
        setSettings(fallbackSettings);
      } else {
        console.log('Payment settings fetched successfully:', data);
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      // Use fallback data
      const fallbackSettings = {
        promptpay_number: '0962358979',
        bank_name: 'ธนาคารกรุงเทพ',
        bank_account_number: '138-4-41680-4',
        bank_account_name: 'รณยศ ตันติถาวรรัช',
        bank_branch: '',
        stripe_enabled: true,
        omise_enabled: true
      };
      console.log('Using fallback settings after error:', fallbackSettings);
      setSettings(fallbackSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<PaymentSettings>) => {
    try {
      setIsLoading(true);
      
      console.log('Updating payment settings:', newSettings);
      
      const { error } = await supabase
        .from('payment_settings')
        .upsert({
          id: 1,
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating payment settings:', error);
        toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        return false;
      }

      // Update local state
      setSettings(prev => ({ ...prev, ...newSettings }));
      toast.success('บันทึกการตั้งค่าสำเร็จ');
      console.log('Payment settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating payment settings:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    refetch: fetchSettings
  };
};
