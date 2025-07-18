
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const checkVipStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking VIP status for user:', userId);
    
    // First check profile role with explicit Accept header
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error checking profile role:", profileError);
      // If profile doesn't exist, create it
      if (profileError.code === 'PGRST116') {
        console.log('Profile not found, creating default profile');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, role: 'user' });
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
        return false; // Return false for new users
      }
      
      // If it's a 406 error, log it specifically
      if (profileError.code === 'PGRST301' || (profileError as any).status === 406) {
        console.error('406 Not Acceptable error in profile check:', profileError);
        throw new Error('API format not acceptable - please check Accept headers');
      }
    }

    // Check if role is VIP in profiles
    if (profileData?.role === 'vip') {
      console.log('User has VIP role in profiles');
      return true;
    }

    // Also check VIP membership table with explicit Accept header
    const { data: vipData, error: vipError } = await supabase
      .from("vip_memberships")
      .select("id, is_active, end_date")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (vipError && vipError.code !== 'PGRST116') {
      console.error("Error checking VIP membership:", vipError);
      
      // If it's a 406 error, log it specifically
      if (vipError.code === 'PGRST301' || (vipError as any).status === 406) {
        console.error('406 Not Acceptable error in VIP membership check:', vipError);
        throw new Error('API format not acceptable - please check Accept headers');
      }
      
      throw vipError;
    }

    if (vipData) {
      // Check if membership is still valid
      if (!vipData.end_date || new Date(vipData.end_date) > new Date()) {
        console.log('User has active VIP membership');
        return true;
      }
    }

    console.log('User is not VIP');
    return false;
  } catch (error) {
    console.error("VIP status check error:", error);
    throw error;
  }
};

export const useVipStatus = () => {
  const { user } = useAuth();

  const { data: isVip, isLoading, isError, error } = useQuery({
    queryKey: ["vipStatus", user?.id],
    queryFn: () => checkVipStatus(user!.id),
    enabled: !!user,
    staleTime: 30 * 1000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 406 errors - they indicate a permanent issue
      if (error && (error as any).code === 'PGRST301' || (error as any).status === 406) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  if (error) {
    console.error('VIP status query error:', error);
  }

  return { isVip: isVip ?? false, isLoading, isError, error };
};
