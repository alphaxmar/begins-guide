
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useVipStatus } from "./useVipStatus";
import { useAdmin } from "./useAdmin";

const checkAdvancedPurchase = async (userId: string, productId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("user_purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    console.error("Error checking purchase:", error);
    throw error;
  }
  
  return !!data;
};

type AccessType = 'admin' | 'vip' | 'purchased' | 'none';

export const useAdvancedCourseAccess = (productId?: string) => {
  const { user } = useAuth();
  const { isVip, isLoading: isVipLoading } = useVipStatus();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();

  const { data: hasPurchased, isLoading: isPurchaseLoading, isError } = useQuery({
    queryKey: ["advancedPurchaseStatus", user?.id, productId],
    queryFn: () => checkAdvancedPurchase(user!.id, productId!),
    enabled: !!user && !!productId,
  });

  const isLoading = isVipLoading || isAdminLoading || isPurchaseLoading;
  const hasAccess = isAdmin || isVip || (hasPurchased ?? false);

  const getAccessType = (): AccessType => {
    if (isAdmin) return 'admin';
    if (isVip) return 'vip';
    if (hasPurchased) return 'purchased';
    return 'none';
  };

  return { 
    hasAccess, 
    isLoading, 
    isError,
    accessType: getAccessType(),
    isVip,
    isAdmin,
    hasPurchased: hasPurchased ?? false
  };
};
