
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
}

export const useVipPackages = () => {
  return useQuery({
    queryKey: ['vip-packages'],
    queryFn: async () => {
      // Try to fetch from a future vip_packages table, fallback to mock data
      try {
        const { data, error } = await supabase
          .from('vip_packages')
          .select('*')
          .eq('is_active', true);
        
        if (error) throw error;
        return data as VipPackage[];
      } catch (error) {
        // Fallback to mock data that matches the current design
        const mockPackages: VipPackage[] = [
          {
            id: 'vip-premium',
            name: 'แพ็กเกจ VIP Premium',
            description: 'เข้าถึงคอร์สและเทมเพลตทั้งหมดไม่จำกัด',
            price: 2999,
            duration_months: null, // ตลอดชีวิต
            features: [
              'เข้าถึงคอร์สออนไลน์ทั้งหมด',
              'ดาวน์โหลดเทมเพลตทั้งหมด',
              'อัปเดตเนื้อหาใหม่ฟรี',
              'สนับสนุนลูกค้า VIP',
              'เข้าถึงเนื้อหาพิเศษ'
            ],
            is_active: true,
            created_at: new Date().toISOString()
          }
        ];
        
        return mockPackages;
      }
    }
  });
};

export const useVipPackageMutations = () => {
  const queryClient = useQueryClient();

  const createPackage = useMutation({
    mutationFn: async (packageData: Omit<VipPackage, 'id' | 'created_at'>) => {
      try {
        const { data, error } = await supabase
          .from('vip_packages')
          .insert([packageData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        // Mock creation for MVP
        const newPackage: VipPackage = {
          ...packageData,
          id: `vip-${Date.now()}`,
          created_at: new Date().toISOString()
        };
        return newPackage;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-packages'] });
    }
  });

  const updatePackage = useMutation({
    mutationFn: async (updatedPackage: VipPackage) => {
      try {
        const { data, error } = await supabase
          .from('vip_packages')
          .update(updatedPackage)
          .eq('id', updatedPackage.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        // Mock update for MVP
        return updatedPackage;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vip-packages'] });
    }
  });

  const deletePackage = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('vip_packages')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      } catch (error) {
        // Mock delete for MVP
        console.log('Mock delete:', id);
      }
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
