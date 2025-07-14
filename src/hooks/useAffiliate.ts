import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AffiliateData {
  affiliate_code: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
}

interface AffiliateSale {
  id: string;
  commission_amount: number;
  commission_rate: number;
  status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  purchase_id: string;
}

export const useAffiliate = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch user's affiliate data
  const { data: affiliateData, isLoading: isLoadingAffiliate } = useQuery({
    queryKey: ['affiliate', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as AffiliateData | null;
    },
    enabled: !!user?.id,
  });

  // Fetch affiliate sales data
  const { data: salesData, isLoading: isLoadingSales } = useQuery({
    queryKey: ['affiliate-sales', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('affiliate_sales')
        .select('*')
        .eq('affiliate_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AffiliateSale[];
    },
    enabled: !!user?.id && !!affiliateData,
  });

  // Create affiliate code mutation
  const createAffiliateCode = useMutation({
    mutationFn: async () => {
      setIsCreating(true);
      const { data, error } = await supabase.rpc('create_affiliate_code');
      
      if (error) throw error;
      return data as string;
    },
    onSuccess: (affiliateCode) => {
      toast.success(`🎉 Affiliate code สร้างเรียบร้อย: ${affiliateCode}`);
      queryClient.invalidateQueries({ queryKey: ['affiliate', user?.id] });
    },
    onError: (error) => {
      console.error('Error creating affiliate code:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้าง affiliate code');
    },
    onSettled: () => {
      setIsCreating(false);
    },
  });

  // Calculate statistics
  const stats = {
    totalSales: salesData?.length || 0,
    totalCommission: salesData?.reduce((sum, sale) => sum + Number(sale.commission_amount), 0) || 0,
    pendingCommission: salesData?.filter(sale => sale.status === 'pending')
      .reduce((sum, sale) => sum + Number(sale.commission_amount), 0) || 0,
    paidCommission: salesData?.filter(sale => sale.status === 'paid')
      .reduce((sum, sale) => sum + Number(sale.commission_amount), 0) || 0,
  };

  // Generate affiliate link
  const getAffiliateLink = (page = '') => {
    if (!affiliateData?.affiliate_code) return '';
    const baseUrl = window.location.origin;
    const path = page ? `/${page}` : '';
    return `${baseUrl}${path}?ref=${affiliateData.affiliate_code}`;
  };

  return {
    affiliateData,
    salesData,
    stats,
    isLoadingAffiliate,
    isLoadingSales,
    isCreating,
    createAffiliateCode: createAffiliateCode.mutate,
    getAffiliateLink,
    isAffiliate: !!affiliateData,
  };
};