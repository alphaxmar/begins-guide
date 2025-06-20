
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const checkVipStatus = async (userId: string): Promise<boolean> => {
  try {
    // Check VIP membership table first
    const { data: vipData, error: vipError } = await supabase
      .from("vip_memberships")
      .select("id")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (vipError && vipError.code !== 'PGRST116') {
      console.error("Error checking VIP membership:", vipError);
    }

    if (vipData) return true;

    // Also check role in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error checking profile role:", profileError);
      return false;
    }

    return profileData?.role === 'vip';
  } catch (error) {
    console.error("VIP status check error:", error);
    return false;
  }
};

export const useVipStatus = () => {
  const { user } = useAuth();

  const { data: isVip, isLoading, isError } = useQuery({
    queryKey: ["vipStatus", user?.id],
    queryFn: () => checkVipStatus(user!.id),
    enabled: !!user,
    staleTime: 30 * 1000, // Cache for 30 seconds
  });

  return { isVip: isVip ?? false, isLoading, isError };
};
