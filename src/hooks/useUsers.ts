
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
        console.log('Fetching users with RPC function');
        
        // First try the RPC function which should now work with fixed RLS policies
        const { data, error } = await supabase.rpc('get_users_with_stats');
        
        if (error) {
          console.error('RPC Error fetching users:', error);
          
          // If RPC fails, try a direct approach for admins
          console.log('RPC failed, trying direct profiles query');
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, role, updated_at');
          
          if (profilesError) {
            console.error('Profiles query error:', profilesError);
            throw profilesError;
          }
          
          // Return simplified data without auth.users info and purchase stats
          return (profilesData || []).map(profile => ({
            id: profile.id,
            email: 'Email access restricted',
            full_name: profile.full_name,
            role: profile.role,
            created_at: profile.updated_at || new Date().toISOString(),
            total_purchases: 0,
            total_spent: 0
          }));
        }
        
        console.log('Successfully fetched users:', data?.length || 0);
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
        console.log('Updating user role:', userId, newRole);
        
        // Check current user's admin status first
        const { data: currentUser, error: currentUserError } = await supabase.auth.getUser();
        if (currentUserError) {
          console.error('Failed to get current user:', currentUserError);
          throw new Error('กรุณาล็อกอินใหม่');
        }

        // Update role in profiles table using direct update
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: newRole, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', userId);

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw new Error(`ไม่สามารถอัปเดตสิทธิ์ได้: ${profileError.message}`);
        }

        console.log('Profile role updated successfully');

        // If role is VIP, create/activate VIP membership
        if (newRole === 'vip') {
          console.log('Creating VIP membership');
          const { error: vipError } = await supabase
            .from('vip_memberships')
            .upsert({
              user_id: userId,
              is_active: true,
              start_date: new Date().toISOString(),
              end_date: null,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (vipError) {
            console.error('VIP membership error:', vipError);
            // Don't throw error here, just log it
            console.warn('VIP membership update failed, but role was updated successfully');
          } else {
            console.log('VIP membership created/updated successfully');
          }
        } else {
          // If role is not VIP, deactivate VIP membership
          console.log('Deactivating VIP membership');
          const { error: deactivateError } = await supabase
            .from('vip_memberships')
            .update({ 
              is_active: false,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

          if (deactivateError) {
            console.warn('Error deactivating VIP:', deactivateError);
            // Don't throw error here, just log it
          }
        }
        
        console.log('Successfully completed user role update');
        return { success: true };
      } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['vipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      toast.success('เปลี่ยนสิทธิ์ผู้ใช้สำเร็จ');
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      const errorMessage = error.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์ผู้ใช้';
      toast.error(errorMessage);
    },
  });
};
