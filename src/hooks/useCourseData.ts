
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const fetchProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("product_type", "course")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

const fetchLessonsByProductId = async (productId: string) => {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("product_id", productId)
    .order("order", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const useCourseData = (slug?: string) => {
  const { data: product, isLoading: isProductLoading } = useQuery<Tables<'products'> | null>({
    queryKey: ["course-product", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  const { data: lessons, isLoading: areLessonsLoading } = useQuery<Tables<'lessons'>[]>({
    queryKey: ["course-lessons", product?.id],
    queryFn: () => fetchLessonsByProductId(product!.id),
    enabled: !!product,
  });

  return {
    product,
    lessons,
    isLoading: isProductLoading || (!!product && areLessonsLoading),
  };
};
