
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserWithStats {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin' | 'partner';
  created_at: string;
  total_purchases: number;
  total_spent: number;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<UserWithStats[]> => {
      try {
        const { data, error } = await supabase.rpc('get_users_with_stats');
        if (error) {
          console.error('Error fetching users:', error);
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
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: 'user' | 'admin' | 'partner' }) => {
      try {
        const { error } = await supabase.rpc('admin_update_user_role', {
          target_user_id: userId,
          new_role: newRole
        });
        if (error) throw error;
      } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('เปลี่ยนสิทธิ์ผู้ใช้สำเร็จ');
    },
    onError: (error) => {
      console.error('Error updating user role:', error);
      toast.error('เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์ผู้ใช้');
    },
  });
};
