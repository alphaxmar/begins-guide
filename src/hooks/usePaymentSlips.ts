import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PaymentSlip {
  id: string;
  order_id: string;
  user_id: string;
  slip_image_url: string;
  amount: number;
  transaction_date: string;
  bank_name: string;
  transfer_type: string;
  status: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  orders?: {
    id: string;
    user_id: string;
    total_amount: number;
    created_at: string;
    profiles?: {
      full_name: string;
      id: string;
    };
  };
}

export const usePaymentSlips = (status?: string) => {
  const [slips, setSlips] = useState<PaymentSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlips = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('payment_slips')
        .select(`
          *,
          orders!inner (
            id,
            user_id,
            total_amount,
            created_at,
            profiles!inner (
              full_name,
              id
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setSlips(data as any || []);
    } catch (err) {
      console.error('Error fetching payment slips:', err);
      setError('ไม่สามารถโหลดข้อมูลสลิปได้');
    } finally {
      setLoading(false);
    }
  };

  const updateSlipStatus = async (slipId: string, status: string, adminNotes?: string) => {
    try {
      const { error } = await supabase.rpc('update_payment_slip_status', {
        p_slip_id: slipId,
        p_status: status,
        p_admin_notes: adminNotes
      });

      if (error) throw error;

      // Send notification to user
      await supabase.functions.invoke('send-payment-notification', {
        body: {
          type: 'slip_reviewed',
          slipId: slipId,
          status: status,
          adminNotes: adminNotes
        }
      });

      toast.success('อัปเดตสถานะสำเร็จ');
      fetchSlips(); // Refresh the list
    } catch (err) {
      console.error('Error updating slip status:', err);
      toast.error('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  useEffect(() => {
    fetchSlips();
  }, [status]);

  return {
    slips,
    loading,
    error,
    updateSlipStatus,
    refetch: fetchSlips
  };
};

export const useUserPaymentSlips = () => {
  const [slips, setSlips] = useState<PaymentSlip[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserSlips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_slips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSlips(data || []);
    } catch (err) {
      console.error('Error fetching user payment slips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSlips();
  }, []);

  return {
    slips,
    loading,
    refetch: fetchUserSlips
  };
};