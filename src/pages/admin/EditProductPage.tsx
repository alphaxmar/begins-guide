
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

// สร้าง Loading Skeleton สำหรับธีมมืด
const ModernLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-8 bg-slate-700 rounded animate-pulse"></div>
          <div>
            <div className="w-32 h-6 bg-slate-700 rounded animate-pulse mb-2"></div>
            <div className="w-48 h-4 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="space-y-6">
              <div className="w-48 h-8 bg-slate-700 rounded animate-pulse"></div>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-24 h-4 bg-slate-700 rounded animate-pulse"></div>
                    <div className="w-full h-10 bg-slate-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProductPage = () => {
  const params = useParams();
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
    return <ModernLoadingSkeleton />;
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
