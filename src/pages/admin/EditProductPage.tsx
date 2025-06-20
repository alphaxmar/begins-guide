
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductEditContainer from "@/components/admin/product-edit/ProductEditContainer";
import ProductEditErrorStates from "@/components/admin/product-edit/ProductEditErrorStates";
import ProductEditLoadingSkeleton from "@/components/admin/product-edit/ProductEditLoadingSkeleton";

const fetchProductBySlug = async (slug: string) => {
  console.log("Fetching product with slug:", slug);
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  
  console.log("Product fetch result:", { data, error });
  
  if (error) {
    console.error("Error fetching product:", error);
    throw new Error(error.message);
  }
  
  return data;
};

const EditProductPage = () => {
  const params = useParams();
  // ใช้ params.id แทน params.slug เพราะใน route เป็น :id
  const slug = params.id;

  console.log("EditProductPage - slug from params.id:", slug);
  console.log("EditProductPage - all params:", params);

  const { data: product, isLoading: isProductLoading, isError, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => {
      if (!slug) {
        throw new Error("Slug is required");
      }
      return fetchProductBySlug(slug);
    },
    enabled: !!slug,
  });

  console.log("Product query state:", { product, isProductLoading, isError, error });

  // Show error if no slug is provided
  if (!slug) {
    return <ProductEditErrorStates type="no-slug" />;
  }

  if (isProductLoading) {
    return <ProductEditLoadingSkeleton />;
  }

  if (isError) {
    return <ProductEditErrorStates type="error" errorMessage={error?.message} />;
  }

  if (!product) {
    return <ProductEditErrorStates type="not-found" slug={slug} />;
  }

  return <ProductEditContainer product={product} slug={slug} />;
};

export default EditProductPage;
