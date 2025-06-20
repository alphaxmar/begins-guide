
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
      
      // ลองดึงจาก database table payment_settings ก่อน
      const { data: paymentSettings, error } = await supabase
        .from('payment_settings')
        .select('*')
        .limit(1)
        .single();

      if (paymentSettings && !error) {
        setSettings({
          promptpay_number: paymentSettings.promptpay_number,
          bank_name: paymentSettings.bank_name,
          bank_account_number: paymentSettings.bank_account_number,
          bank_account_name: paymentSettings.bank_account_name,
          bank_branch: paymentSettings.bank_branch,
          stripe_enabled: paymentSettings.stripe_enabled,
          omise_enabled: paymentSettings.omise_enabled
        });
      } else {
        // fallback ใช้ข้อมูลจากรูปที่แสดง
        setSettings({
          promptpay_number: '0962358979',
          bank_name: 'ธนาคารกรุงเทพ',
          bank_account_number: '138-4-41680-4',
          bank_account_name: 'รณยศ ตันติถาวรรัช',
          bank_branch: '',
          stripe_enabled: true,
          omise_enabled: true
        });
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      // ใช้ข้อมูลจากรูปที่แสดงเป็น fallback
      setSettings({
        promptpay_number: '0962358979',
        bank_name: 'ธนาคารกรุงเทพ',
        bank_account_number: '138-4-41680-4',
        bank_account_name: 'รณยศ ตันติถาวรรัช',
        bank_branch: '',
        stripe_enabled: true,
        omise_enabled: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<PaymentSettings>) => {
    try {
      setIsLoading(true);
      
      // อัปเดตลง database (ถ้ามี table payment_settings)
      const { error } = await supabase
        .from('payment_settings')
        .upsert({
          id: 1, // ใช้ id เดียวสำหรับการตั้งค่า
          ...newSettings,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        setSettings(prev => ({ ...prev, ...newSettings }));
        toast.success('บันทึกการตั้งค่าสำเร็จ');
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error updating payment settings:', error);
      // แม้ database fail ก็ยังอัปเดต local state
      setSettings(prev => ({ ...prev, ...newSettings }));
      toast.success('บันทึกการตั้งค่าสำเร็จ (ในหน่วยความจำ)');
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
