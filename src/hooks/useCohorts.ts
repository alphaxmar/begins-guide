
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Cohort {
  id: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  max_students: number;
  current_students: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  community_link?: string;
  live_session_notes?: string;
}

export interface LiveSession {
  id: string;
  created_at: string;
  updated_at: string;
  cohort_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_url?: string;
  recording_url?: string;
  notes?: string;
  week_number?: number;
}

export interface CohortEnrollment {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  cohort_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'dropped';
}

// Hook for fetching cohorts by product
export const useCohortsByProduct = (productId?: string) => {
  return useQuery({
    queryKey: ["cohorts", productId],
    queryFn: async () => {
      if (!productId) return [];
      
      try {
        const { data, error } = await supabase
          .from("cohorts" as any)
          .select("*")
          .eq("product_id", productId)
          .order("start_date", { ascending: true });

        if (error) {
          console.error("Error fetching cohorts:", error);
          throw error;
        }
        
        return (data || []) as unknown as Cohort[];
      } catch (error) {
        console.error("Failed to fetch cohorts:", error);
        return [];
      }
    },
    enabled: !!productId,
  });
};

// Hook for checking user enrollment in cohort
export const useUserCohortEnrollment = (cohortId?: string) => {
  return useQuery({
    queryKey: ["cohort-enrollment", cohortId],
    queryFn: async () => {
      if (!cohortId) return null;
      
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user?.id) return null;

        const { data, error } = await supabase
          .from("cohort_enrollments" as any)
          .select("*")
          .eq("cohort_id", cohortId)
          .eq("user_id", user.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching enrollment:", error);
          throw error;
        }
        
        return data as unknown as CohortEnrollment | null;
      } catch (error) {
        console.error("Failed to fetch enrollment:", error);
        return null;
      }
    },
    enabled: !!cohortId,
  });
};

// Hook for fetching live sessions for a cohort
export const useLiveSessionsByCohort = (cohortId?: string) => {
  return useQuery({
    queryKey: ["live-sessions", cohortId],
    queryFn: async () => {
      if (!cohortId) return [];
      
      try {
        const { data, error } = await supabase
          .from("live_sessions" as any)
          .select("*")
          .eq("cohort_id", cohortId)
          .order("scheduled_at", { ascending: true });

        if (error) {
          console.error("Error fetching live sessions:", error);
          throw error;
        }
        
        return (data || []) as unknown as LiveSession[];
      } catch (error) {
        console.error("Failed to fetch live sessions:", error);
        return [];
      }
    },
    enabled: !!cohortId,
  });
};

// Hook for creating cohort enrollment
export const useCreateCohortEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cohortId, userId }: { cohortId: string; userId: string }) => {
      try {
        const { data, error } = await supabase
          .from("cohort_enrollments" as any)
          .insert({
            cohort_id: cohortId,
            user_id: userId,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating enrollment:", error);
          throw error;
        }
        
        return data as unknown as CohortEnrollment;
      } catch (error) {
        console.error("Failed to create enrollment:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("ลงทะเบียนสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["cohort-enrollment"] });
    },
    onError: (error: any) => {
      console.error("Enrollment error:", error);
      toast.error("เกิดข้อผิดพลาด: " + error.message);
    },
  });
};
