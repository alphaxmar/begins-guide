
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

interface AdminOrder {
  order_id: string;
  user_email: string;
  user_full_name: string;
  total_amount: number;
  status: OrderStatus;
  payment_provider: string;
  created_at: string;
  items_count: number;
}

export const useAdminOrders = (statusFilter?: string, limit = 50, offset = 0) => {
  return useQuery({
    queryKey: ['admin-orders', statusFilter, limit, offset],
    queryFn: async (): Promise<AdminOrder[]> => {
      try {
        const { data, error } = await supabase.rpc('get_admin_orders', {
          status_filter: statusFilter || null,
          limit_count: limit,
          offset_count: offset
        });
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching admin orders:', error);
        throw error;
      }
    },
    retry: 1,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: OrderStatus }) => {
      try {
        const { error } = await supabase.rpc('admin_update_order_status', {
          order_id: orderId,
          new_status: newStatus
        });
        if (error) throw error;
      } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
      toast.success('อัปเดตสถานะคำสั่งซื้อสำเร็จ');
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    },
  });
};
