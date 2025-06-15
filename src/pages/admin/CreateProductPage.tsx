
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

      // Step 1: Insert product data without file path to get the product ID
      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert({
          title: values.title,
          slug: values.slug,
          price: values.price,
          product_type: values.product_type,
          description: values.description || null,
          image_url: values.image_url || null,
          instructor_id: user.id,
          template_file_path: null, // Initially null
        })
        .select()
        .single();
      
      if (insertError) {
        if (insertError.code === '23505') { // unique constraint violation
            throw new Error("Slug นี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนใหม่");
        }
        throw new Error(`เกิดข้อผิดพลาดในการสร้างข้อมูลสินค้า: ${insertError.message}`);
      }

      // Step 2: If it's a template with a file, upload it using the new product ID
      if (values.product_type === 'template' && values.template_file && values.template_file.length > 0) {
        const file = values.template_file[0];
        const sanitizedFileName = file.name.replace(/\s/g, '_');
        const filePath = `templates/${newProduct.id}/${sanitizedFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product_files')
          .upload(filePath, file);

        if (uploadError) {
          // Rollback: delete the product we just created if upload fails
          await supabase.from('products').delete().eq('id', newProduct.id);
          throw new Error(`ไม่สามารถอัปโหลดไฟล์เทมเพลตได้: ${uploadError.message} การสร้างสินค้าถูกยกเลิก`);
        }
        
        // Step 3: Update the product record with the new file path
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update({ template_file_path: filePath })
          .eq('id', newProduct.id)
          .select()
          .single();

        if (updateError) {
          // Rollback: delete the uploaded file and the product record if update fails
          await supabase.storage.from('product_files').remove([filePath]);
          await supabase.from('products').delete().eq('id', newProduct.id);
          throw new Error(`เกิดข้อผิดพลาดในการอัปเดตข้อมูลไฟล์: ${updateError.message} การสร้างสินค้าถูกยกเลิก`);
        }

        return updatedProduct;
      }
      
      // If not a template or no file, return the product created in step 1
      return newProduct;
    },
    onSuccess: (data) => {
      toast.success("สร้างสินค้าใหม่เรียบร้อยแล้ว!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });

      if (data && data.product_type === 'course') {
        toast.info("คุณจะถูกย้ายไปหน้าจัดการบทเรียนสำหรับคอร์สใหม่นี้");
        navigate(`/admin/products/${data.slug}/lessons`);
      } else {
        navigate("/admin/products");
      }
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
