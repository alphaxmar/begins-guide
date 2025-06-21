
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
        
        // Use the safe admin check function
        const { data, error } = await supabase.rpc('is_current_user_admin');
        
        if (error) {
          console.error('Error checking admin role:', error);
          return false;
        }
        
        console.log('Admin check result:', data);
        return data || false;
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
