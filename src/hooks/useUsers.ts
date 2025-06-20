
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserWithStats {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin' | 'partner' | 'vip';
  created_at: string;
  total_purchases: number;
  total_spent: number;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<UserWithStats[]> => {
      try {
        // Use the RPC function directly since it handles the auth.users join properly
        const { data, error } = await supabase.rpc('get_users_with_stats');
        
        if (error) {
          console.error('RPC Error fetching users:', error);
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error('Users fetch error:', error);
        throw error;
      }
    },
    retry: 1,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'user' | 'admin' | 'partner' | 'vip' }) => {
      try {
        // Update role in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: newRole, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (profileError) throw profileError;

        // If role is VIP, create VIP membership
        if (newRole === 'vip') {
          const { error: vipError } = await supabase
            .from('vip_memberships')
            .upsert({
              user_id: userId,
              is_active: true,
              start_date: new Date().toISOString(),
              end_date: null // ไม่มีวันหมดอายุ
            }, {
              onConflict: 'user_id'
            });

          if (vipError) throw vipError;
        } else {
          // If role is not VIP, deactivate VIP membership
          const { error: deactivateError } = await supabase
            .from('vip_memberships')
            .update({ is_active: false })
            .eq('user_id', userId);

          if (deactivateError) console.error('Error deactivating VIP:', deactivateError);
        }
      } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['vipStatus'] });
      toast.success('เปลี่ยนสิทธิ์ผู้ใช้สำเร็จ');
    },
    onError: (error) => {
      console.error('Error updating user role:', error);
      toast.error('เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์ผู้ใช้');
    },
  });
};
