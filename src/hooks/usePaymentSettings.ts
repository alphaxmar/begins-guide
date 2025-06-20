
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
      // ในอนาคตจะดึงจาก database table payment_settings
      // ตอนนี้ใช้ค่าเริ่มต้น
      setSettings({
        promptpay_number: '0962358979',
        bank_name: 'ธนาคารกรุงเทพ',
        bank_account_number: '138-4-41680-4',
        bank_account_name: 'รชยศ ตันติการรีน',
        bank_branch: '',
        stripe_enabled: true,
        omise_enabled: true
      });
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      toast.error('เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่า');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<PaymentSettings>) => {
    try {
      setIsLoading(true);
      // ในอนาคตจะบันทึกลง database
      setSettings(prev => ({ ...prev, ...newSettings }));
      toast.success('บันทึกการตั้งค่าสำเร็จ');
    } catch (error) {
      console.error('Error updating payment settings:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
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
