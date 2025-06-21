
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
        console.log('Fetching users with stats...');
        
        // Use the RPC function that handles admin permission checking
        const { data, error } = await supabase.rpc('get_users_with_stats');
        
        if (error) {
          console.error('RPC Error:', error);
          throw new Error(`ไม่สามารถดึงข้อมูลผู้ใช้ได้: ${error.message}`);
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
        console.log('=== Starting role update ===');
        console.log('User ID:', userId);
        console.log('New Role:', newRole);
        
        // Check if current user is admin first
        const { data: currentUser, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Auth error:', userError);
          throw new Error('กรุณาล็อกอินใหม่');
        }
        
        console.log('Current user ID:', currentUser.user?.id);
        
        // Check current user's role
        const { data: currentProfile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.user?.id)
          .single();
          
        if (profileError) {
          console.error('Profile check error:', profileError);
          throw new Error('ไม่สามารถตรวจสอบสิทธิ์ได้');
        }
        
        if (currentProfile?.role !== 'admin') {
          throw new Error('คุณไม่มีสิทธิ์ในการเปลี่ยนบทบาทผู้ใช้');
        }
        
        console.log('Admin permission confirmed, updating role...');
        
        // Update role in profiles table
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: newRole,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (updateError) {
          console.error('Role update error:', updateError);
          throw new Error(`ไม่สามารถอัปเดตสิทธิ์ได้: ${updateError.message}`);
        }

        console.log('Role updated successfully in profiles table');

        // Handle VIP membership
        if (newRole === 'vip') {
          console.log('Creating/updating VIP membership...');
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
            console.warn('VIP membership error:', vipError);
            // Don't throw error, just warn
          } else {
            console.log('VIP membership created/updated successfully');
          }
        } else {
          // Deactivate VIP membership if role is not VIP
          console.log('Deactivating VIP membership...');
          const { error: deactivateError } = await supabase
            .from('vip_memberships')
            .update({ 
              is_active: false,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

          if (deactivateError) {
            console.warn('Error deactivating VIP:', deactivateError);
          }
        }
        
        console.log('=== Role update completed successfully ===');
        return { success: true };
      } catch (error) {
        console.error('=== Role update failed ===');
        console.error('Error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['vipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      toast.success('เปลี่ยนสิทธิ์ผู้ใช้สำเร็จแล้ว!');
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      const errorMessage = error.message || 'เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์ผู้ใช้';
      toast.error(errorMessage);
    },
  });
};
