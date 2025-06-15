
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import { useAuth } from "@/contexts/AuthContext";

const CreateProductPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const createProductMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("products")
        .insert({
          title: values.title,
          slug: values.slug,
          price: values.price,
          product_type: values.product_type,
          description: values.description || null,
          image_url: values.image_url || null,
          instructor_id: user.id,
        })
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') { // unique constraint violation
            throw new Error("Slug นี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนใหม่");
        }
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      toast.success("สร้างสินค้าใหม่เรียบร้อยแล้ว!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/admin/products");
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const handleSubmit = (values: ProductFormValues) => {
    createProductMutation.mutate(values);
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <ProductForm onSubmit={handleSubmit} isLoading={createProductMutation.isPending} submitButtonText="สร้างสินค้า"/>
      </div>
    </div>
  );
};

export default CreateProductPage;
