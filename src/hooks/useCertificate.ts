import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Certificate {
  id: string;
  certificate_number: string;
  completion_date: string;
  issued_date: string;
  product_id: string;
  user_id: string;
}

interface CertificateWithCourse extends Certificate {
  course: {
    title: string;
    slug: string;
  };
  user: {
    full_name: string;
  };
}

export const useCertificate = (courseId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if user has completed the course and can get certificate
  const { data: canGetCertificate, isLoading: isCheckingCompletion } = useQuery({
    queryKey: ["course-completion", courseId, user?.id],
    queryFn: async () => {
      if (!user?.id || !courseId) return false;
      
      const { data, error } = await supabase.rpc('has_user_completed_course', {
        p_user_id: user.id,
        p_course_id: courseId
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!courseId,
  });

  // Get existing certificate for the course
  const { data: certificate, isLoading: isLoadingCertificate } = useQuery({
    queryKey: ["certificate", courseId, user?.id],
    queryFn: async () => {
      if (!user?.id || !courseId) return null;
      
      const { data, error } = await supabase
        .from("certificates")
        .select(`
          *,
          course:products(title, slug)
        `)
        .eq("user_id", user.id)
        .eq("product_id", courseId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Get user profile separately
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      
      return {
        ...data,
        user: { full_name: profile?.full_name || user.email || "ผู้เรียน" }
      } as CertificateWithCourse;
    },
    enabled: !!user?.id && !!courseId,
  });

  // Generate certificate mutation
  const generateCertificate = useMutation({
    mutationFn: async (courseId: string) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase.rpc('generate_certificate', {
        p_user_id: user.id,
        p_course_id: courseId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificate", courseId, user?.id] });
      toast.success("ใบรับรองถูกสร้างเรียบร้อยแล้ว!");
    },
    onError: (error: any) => {
      toast.error(error.message || "เกิดข้อผิดพลาดในการสร้างใบรับรอง");
    },
  });

  // Get all certificates for user
  const { data: userCertificates, isLoading: isLoadingUserCertificates } = useQuery({
    queryKey: ["user-certificates", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("certificates")
        .select(`
          *,
          course:products(title, slug)
        `)
        .eq("user_id", user.id)
        .order("issued_date", { ascending: false });
      
      if (error) throw error;
      
      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      
      return (data || []).map(cert => ({
        ...cert,
        user: { full_name: profile?.full_name || user.email || "ผู้เรียน" }
      })) as CertificateWithCourse[];
    },
    enabled: !!user?.id,
  });

  return {
    canGetCertificate,
    isCheckingCompletion,
    certificate,
    isLoadingCertificate,
    generateCertificate,
    userCertificates,
    isLoadingUserCertificates,
  };
};