
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCohortsByProduct, useUserCohortEnrollment } from "@/hooks/useCohorts";
import CohortDashboard from "@/components/cohort/CohortDashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";

const CohortPage: React.FC = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { user } = useAuth();

  // Fetch product by slug
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["cohort-product", productSlug],
    queryFn: async () => {
      if (!productSlug) return null;
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", productSlug)
        .eq("product_type", "cohort_program" as any)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!productSlug,
  });

  // Fetch cohorts for this product
  const { data: cohorts, isLoading: isCohortsLoading } = useCohortsByProduct(product?.id);

  // Get active cohort (for now, get the first active or upcoming one)
  const activeCohort = cohorts?.find(c => c.status === 'active') || 
                      cohorts?.find(c => c.status === 'upcoming');

  // Check if user is enrolled in the cohort
  const { data: enrollment, isLoading: isEnrollmentLoading } = useUserCohortEnrollment(activeCohort?.id);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isProductLoading || isCohortsLoading || isEnrollmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">ไม่พบโปรแกรม</h2>
            <p className="text-muted-foreground">โปรแกรมที่คุณกำลังมองหาไม่มีอยู่</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activeCohort) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">ยังไม่มีรุ่นเปิด</h2>
            <p className="text-muted-foreground">
              โปรแกรม "{product.title}" ยังไม่มีรุ่นที่เปิดให้ลงทะเบียน
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
            <p className="text-muted-foreground">
              คุณยังไม่ได้ลงทะเบียนในโปรแกรม "{product.title}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              กรุณาติดต่อผู้ดูแลระบบหากคุณได้ชำระเงินแล้ว
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <CohortDashboard cohort={activeCohort} productTitle={product.title} />
      </div>
    </div>
  );
};

export default CohortPage;
