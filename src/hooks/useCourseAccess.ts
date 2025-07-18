
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const checkPurchase = async (userId: string, type?: string): Promise<{ hasBookAccess: boolean; hasCourseAccess: boolean }> => {
  console.log("Checking purchases for user:", userId);
  
  const { data: purchases, error } = await supabase
    .from("user_purchases")
    .select("product_id, product:products(product_type)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error checking purchases:", error);
    return { hasBookAccess: false, hasCourseAccess: false };
  }
  
  const hasBookAccess = purchases?.some(p => p.product?.product_type === 'ebook') ?? false;
  const hasCourseAccess = purchases?.some(p => p.product?.product_type === 'course') ?? false;
  
  console.log("Purchase check result - Book:", hasBookAccess, "Course:", hasCourseAccess);
  return { hasBookAccess, hasCourseAccess };
};

export const useCourseAccess = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userPurchases", user?.id],
    queryFn: () => checkPurchase(user!.id),
    enabled: !!user,
  });

  return {
    hasBookAccess: data?.hasBookAccess ?? false,
    hasCourseAccess: data?.hasCourseAccess ?? false,
    isLoading,
    isError
  };
};
