
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const checkVipStatus = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("vip_memberships")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error checking VIP status:", error);
    return false;
  }
  
  return !!data;
};

export const useVipStatus = () => {
  const { user } = useAuth();

  const { data: isVip, isLoading, isError } = useQuery({
    queryKey: ["vipStatus", user?.id],
    queryFn: () => checkVipStatus(user!.id),
    enabled: !!user,
  });

  return { isVip: isVip ?? false, isLoading, isError };
};
