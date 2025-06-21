
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const checkPurchase = async (userId: string, productId: string): Promise<boolean> => {
  console.log("Checking purchase for user:", userId, "product:", productId);
  
  const { data, error } = await supabase
    .from("user_purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    console.error("Error checking purchase:", error);
    return false;
  }
  
  console.log("Purchase check result:", !!data);
  return !!data;
};

export const useCourseAccess = (productId?: string) => {
  const { user } = useAuth();

  const { data: hasAccess, isLoading, isError } = useQuery({
    queryKey: ["purchaseStatus", user?.id, productId],
    queryFn: () => checkPurchase(user!.id, productId!),
    enabled: !!user && !!productId,
  });

  console.log("Course access check - User:", user?.id, "Product:", productId, "Has access:", hasAccess);

  return { hasAccess: hasAccess ?? false, isLoading, isError };
};
