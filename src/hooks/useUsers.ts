
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
        // ลองใช้ profiles table โดยตรงก่อน หากไม่ได้ก็ใช้ RPC function
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            role,
            auth_users!inner(email, created_at)
          `);

        if (profilesError) {
          console.log('Profiles query failed, trying RPC:', profilesError);
          const { data, error } = await supabase.rpc('get_users_with_stats');
          if (error) {
            console.error('RPC Error fetching users:', error);
            throw error;
          }
          return data || [];
        }

        // Transform profiles data to match expected format
        return profilesData.map(profile => ({
          id: profile.id,
          email: profile.auth_users.email,
          full_name: profile.full_name,
          role: profile.role,
          created_at: profile.auth_users.created_at,
          total_purchases: 0,
          total_spent: 0
        }));
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
