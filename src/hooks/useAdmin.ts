
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useAdmin = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: isAdmin, isLoading: roleIsLoading, error } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID provided for admin check');
        return false;
      }
      
      try {
        console.log('Checking admin role using RPC function...');
        
        // Use direct SQL query to check admin role to avoid type issues
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin role:', error);
          return false;
        }
        
        const isAdminUser = data?.role === 'admin';
        console.log('Admin check result:', isAdminUser);
        return isAdminUser;
      } catch (error) {
        console.error('Admin role check error:', error);
        return false;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache role for 5 minutes
    retry: 1,
  });

  if (error) {
    console.error('Admin check query error:', error);
  }

  return { 
    isAdmin: isAdmin ?? false, 
    isLoading: authLoading || (!!user && roleIsLoading),
    error
  };
};
