
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  total_users: number;
  new_users_this_month: number;
  total_revenue: number;
  revenue_this_month: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  failed_orders: number;
}

interface TopSellingProduct {
  product_id: string;
  product_title: string;
  product_price: number;
  total_sales: number;
  total_revenue: number;
}

interface DailySalesStats {
  sale_date: string;
  daily_revenue: number;
  daily_orders: number;
}

const defaultStats: DashboardStats = {
  total_users: 0,
  new_users_this_month: 0,
  total_revenue: 0,
  revenue_this_month: 0,
  total_orders: 0,
  pending_orders: 0,
  completed_orders: 0,
  failed_orders: 0,
};

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      if (error) throw error;
      return data?.[0] || defaultStats;
    },
  });
};

export const useTopSellingProducts = (limit = 5) => {
  return useQuery({
    queryKey: ['top-selling-products', limit],
    queryFn: async (): Promise<TopSellingProduct[]> => {
      const { data, error } = await supabase.rpc('get_top_selling_products', { limit_count: limit });
      if (error) throw error;
      return data || [];
    },
  });
};

export const useDailySalesStats = (daysBack = 30) => {
  return useQuery({
    queryKey: ['daily-sales-stats', daysBack],
    queryFn: async (): Promise<DailySalesStats[]> => {
      const { data, error } = await supabase.rpc('get_daily_sales_stats', { days_back: daysBack });
      if (error) throw error;
      return data || [];
    },
  });
};
