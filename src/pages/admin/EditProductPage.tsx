
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const fetchProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  
  if (error) throw new Error(error.message);
  return data;
};

const EditProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: product, isLoading: isProductLoading, isError, error } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  const updateProductMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (!product) throw new Error("Product not found");

      const { data, error } = await supabase
        .from("products")
        .update({
          ...values,
          description: values.description || null,
          image_url: values.image_url || null,
        })
        .eq("id", product.id)
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') { // unique constraint violation for slug
            throw new Error("Slug นี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนใหม่");
        }
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("อัปเดตสินค้าเรียบร้อยแล้ว!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      queryClient.invalidateQueries({ queryKey: ["product", data.slug] });
      navigate("/admin/products");
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  if (isProductLoading) {
    return (
        <div className="py-8 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-24 w-full" /></div>
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (isError) {
    return <p className="text-red-500 py-8">เกิดข้อผิดพลาด: {error.message}</p>;
  }

  if (!product) {
    return <p className="text-muted-foreground py-8">ไม่พบสินค้าที่ต้องการแก้ไข</p>;
  }
  
  const handleSubmit = (values: ProductFormValues) => {
    updateProductMutation.mutate(values);
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <ProductForm 
          onSubmit={handleSubmit} 
          initialData={product} 
          isLoading={updateProductMutation.isPending} 
          submitButtonText="อัปเดตสินค้า"
        />
      </div>
    </div>
  );
};

export default EditProductPage;
