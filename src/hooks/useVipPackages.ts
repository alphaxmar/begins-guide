
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
      // For now, return mock data until we have proper VIP packages table
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
  });
};
