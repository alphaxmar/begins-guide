
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const checkAdminRole = async (userId: string | undefined) => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase.rpc('current_user_has_role', { role_name: 'admin' });
    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
    return data || false;
  } catch (error) {
    console.error('Admin role check error:', error);
    return false;
  }
};

export const useAdmin = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: isAdmin, isLoading: roleIsLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: () => checkAdminRole(user?.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache role for 5 minutes
    retry: 1,
  });

  return { 
    isAdmin: isAdmin ?? false, 
    isLoading: authLoading || (!!user && roleIsLoading) 
  };
};
