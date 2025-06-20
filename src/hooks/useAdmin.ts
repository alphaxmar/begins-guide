
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const checkAdminRole = async (userId: string | undefined) => {
  if (!userId) {
    console.log('No user ID provided for admin check');
    return false;
  }
  
  try {
    console.log('Checking admin role for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin role:', error);
      // If profile doesn't exist, create it with default role
      if (error.code === 'PGRST116') {
        console.log('Profile not found, creating default profile');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, role: 'user' });
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
        return false;
      }
      return false;
    }
    
    console.log('User role:', data?.role);
    return data?.role === 'admin';
  } catch (error) {
    console.error('Admin role check error:', error);
    return false;
  }
};

export const useAdmin = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: isAdmin, isLoading: roleIsLoading, error } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: () => checkAdminRole(user?.id),
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
