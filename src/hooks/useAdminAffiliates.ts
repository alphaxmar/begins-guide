import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Affiliate {
  user_id: string;
  full_name: string;
  email: string;
  affiliate_code: string;
  status: string;
  created_at: string;
  total_sales: number;
  total_commission: number;
}

interface PendingCommission {
  id: string;
  affiliate_name: string;
  affiliate_code: string;
  commission_amount: number;
  commission_rate: number;
  created_at: string;
  product_title: string;
}

export const useAdminAffiliates = () => {
  const queryClient = useQueryClient();

  // ดึงรายชื่อ Affiliates ทั้งหมด
  const affiliatesQuery = useQuery({
    queryKey: ['admin-affiliates'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_all_affiliates');
      
      if (error) {
        console.error('Error fetching affiliates:', error);
        throw error;
      }
      
      return data as Affiliate[];
    },
  });

  // ดึงรายการ Commission ที่รอจ่าย
  const pendingCommissionsQuery = useQuery({
    queryKey: ['admin-pending-commissions'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_pending_commissions');
      
      if (error) {
        console.error('Error fetching pending commissions:', error);
        throw error;
      }
      
      return data as PendingCommission[];
    },
  });

  // อัปเดตสถานะ Affiliate
  const updateAffiliateStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase.rpc('update_affiliate_status', {
        p_user_id: userId,
        p_status: status
      });

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      toast.success(`อัปเดตสถานะ Affiliate เป็น ${status} แล้ว`);
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
    },
    onError: (error) => {
      console.error('Error updating affiliate status:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    },
  });

  // อนุมัติค่าคอมมิชชั่น
  const approveCommission = useMutation({
    mutationFn: async (saleId: string) => {
      const { error } = await supabase.rpc('approve_commission', {
        p_sale_id: saleId
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('อนุมัติค่าคอมมิชชั่นแล้ว');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-commissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
    },
    onError: (error) => {
      console.error('Error approving commission:', error);
      toast.error('เกิดข้อผิดพลาดในการอนุมัติค่าคอมมิชชั่น');
    },
  });

  return {
    affiliates: affiliatesQuery.data || [],
    pendingCommissions: pendingCommissionsQuery.data || [],
    isLoading: affiliatesQuery.isLoading || pendingCommissionsQuery.isLoading,
    error: affiliatesQuery.error || pendingCommissionsQuery.error,
    updateAffiliateStatus,
    approveCommission,
    refetch: () => {
      affiliatesQuery.refetch();
      pendingCommissionsQuery.refetch();
    },
  };
};