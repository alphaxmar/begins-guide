
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface VipPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_months: number | null;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export const useVipPackages = () => {
  return useQuery({
    queryKey: ['vip-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vip_packages')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data as VipPackage[];
    }
  });
};
