import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LessonFormValues } from "@/components/admin/LessonForm";
import { Tables } from "@/integrations/supabase/types";
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

const fetchProductBySlug = async (slug: string) => {
  console.log("fetchProductBySlug called with slug:", slug, "typeof:", typeof slug);
  
  // แปลง slug ให้เป็น string ถ้าเป็น object
  const cleanSlug = typeof slug === 'object' ? String(slug) : slug;
  console.log("Clean slug:", cleanSlug);
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", cleanSlug)
    .maybeSingle();
    
  console.log("Product fetch result:", { data, error, searchedSlug: cleanSlug });
  
  if (error) {
    console.error("Error fetching product:", error);
    throw new Error(error.message);
  }
  
  return data;
};

const fetchLessonsByProductId = async (productId: string) => {
  console.log("Fetching lessons for product ID:", productId);
  
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("product_id", productId)
    .order("order", { ascending: true });
    
  console.log("Lessons fetch result:", { data, error });
  
  if (error) {
    console.error("Error fetching lessons:", error);
    throw new Error(error.message);
  }
  
  return data;
};

export const useLessonManager = (slug?: string) => {
  const queryClient = useQueryClient();

  console.log("useLessonManager called with slug:", slug, "typeof:", typeof slug);

  const { data: product, isLoading: isProductLoading, error: productError } = useQuery({
    queryKey: ["product-for-lessons", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug && slug !== 'undefined',
    retry: 3,
    retryDelay: 1000,
  });

  const { data: lessons, isLoading: areLessonsLoading, error: lessonsError } = useQuery<Tables<'lessons'>[]>({
    queryKey: ["lessons", product?.id],
    queryFn: () => fetchLessonsByProductId(product!.id),
    enabled: !!product,
    retry: 2,
  });
  
  const [localLessons, setLocalLessons] = useState<Tables<'lessons'>[]>([]);

  useEffect(() => {
    if (lessons) {
      setLocalLessons(lessons);
    }
  }, [lessons]);

  // Log errors for debugging
  useEffect(() => {
    if (productError) {
      console.error("Product error:", productError);
    }
    if (lessonsError) {
      console.error("Lessons error:", lessonsError);
    }
  }, [productError, lessonsError]);

  const lessonMutation = useMutation({
    mutationFn: async ({ values, lessonId }: { values: LessonFormValues; lessonId?: string }) => {
      if (!product) throw new Error("Product not found");

      const lessonData = {
        title: values.title,
        content: values.content || null,
        video_url: values.video_url || null,
      };

      if (lessonId) {
        const { data, error } = await supabase
          .from("lessons")
          .update({ ...lessonData, updated_at: new Date().toISOString() })
          .eq("id", lessonId)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const newOrder = lessons?.length ?? 0;
        const { data, error } = await supabase
          .from("lessons")
          .insert({ ...lessonData, product_id: product.id, order: newOrder })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data, variables) => {
      toast.success(variables.lessonId ? "อัปเดตบทเรียนเรียบร้อย" : "สร้างบทเรียนใหม่เรียบร้อย");
      queryClient.invalidateQueries({ queryKey: ["lessons", product?.id] });
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("ลบบทเรียนแล้ว");
      queryClient.invalidateQueries({ queryKey: ["lessons", product?.id] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const { error } = await supabase.rpc('update_lessons_order', {
        p_lesson_ids: orderedIds,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("บันทึกลำดับบทเรียนเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ["lessons", product?.id] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการบันทึกลำดับ: ${error.message}`);
      if (lessons) setLocalLessons(lessons);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;

    if (over && active.id !== over.id) {
      const oldIndex = localLessons.findIndex((item) => item.id === active.id);
      const newIndex = localLessons.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const newOrder = arrayMove(localLessons, oldIndex, newIndex);
      setLocalLessons(newOrder);
      
      const orderedIds = newOrder.map((item) => item.id);
      updateOrderMutation.mutate(orderedIds);
    }
  }

  return {
    product,
    localLessons,
    isLoading: isProductLoading || (!!product && areLessonsLoading),
    error: productError || lessonsError,
    lessonMutation,
    deleteLessonMutation,
    sensors,
    handleDragEnd,
  }
}
