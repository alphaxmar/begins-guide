
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  updated_at: string;
}

export const useVipPackages = () => {
  return useQuery({
    queryKey: ['vip-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vip_packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching VIP packages:', error);
        throw error;
      }

      // Convert JSONB features to string array
      const packages: VipPackage[] = (data || []).map(pkg => ({
        ...pkg,
        features: Array.isArray(pkg.features) ? pkg.features : []
      }));

      return packages;
    }
  });
};

export const useVipPackageMutations = () => {
  const queryClient = useQueryClient();

  const createPackage = useMutation({
    mutationFn: async (packageData: Omit<VipPackage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('vip_packages')
        .insert([{
          ...packageData,
          features: packageData.features // JSONB will handle array conversion
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        features: Array.isArray(data.features) ? data.features : []
      } as VipPackage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-packages'] });
    }
  });

  const updatePackage = useMutation({
    mutationFn: async (updatedPackage: VipPackage) => {
      const { data, error } = await supabase
        .from('vip_packages')
        .update({
          name: updatedPackage.name,
          description: updatedPackage.description,
          price: updatedPackage.price,
          duration_months: updatedPackage.duration_months,
          features: updatedPackage.features, // JSONB will handle array conversion
          is_active: updatedPackage.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedPackage.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        features: Array.isArray(data.features) ? data.features : []
      } as VipPackage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-packages'] });
    }
  });

  const deletePackage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vip_packages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-packages'] });
    }
  });

  return {
    createPackage,
    updatePackage,
    deletePackage
  };
};
