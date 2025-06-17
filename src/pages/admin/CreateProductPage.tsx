
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

      let newProduct: any = null;
      const uploadedImage = { path: '', url: '' };
      const uploadedTemplate = { path: '' };

      try {
        // Step 1: Insert product data with null file/image paths to get the product ID
        const { data, error: insertError } = await supabase
          .from("products")
          .insert({
            title: values.title,
            slug: values.slug,
            price: values.price,
            product_type: values.product_type as any,
            description: values.description || null,
            image_url: null,
            instructor_id: user.id,
            template_file_path: null,
          })
          .select()
          .single();
        
        if (insertError) {
          if (insertError.code === '23505') throw new Error("Slug นี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนใหม่");
          throw new Error(`เกิดข้อผิดพลาดในการสร้างข้อมูลสินค้า: ${insertError.message}`);
        }
        newProduct = data;

        // Step 2: Upload image if it exists
        if (values.image_file && values.image_file.length > 0) {
          const file = values.image_file[0];
          const sanitizedFileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
          const filePath = `${newProduct.id}/${sanitizedFileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product_images')
            .upload(filePath, file);

          if (uploadError) throw new Error(`อัปโหลดรูปภาพไม่สำเร็จ: ${uploadError.message}`);
          
          uploadedImage.path = filePath;
          const { data: urlData } = supabase.storage.from('product_images').getPublicUrl(filePath);
          uploadedImage.url = urlData.publicUrl;
        }

        // Step 3: Upload template file if it's a template product
        if (values.product_type === 'template' && values.template_file && values.template_file.length > 0) {
          const file = values.template_file[0];
          const sanitizedFileName = file.name.replace(/\s/g, '_');
          const filePath = `templates/${newProduct.id}/${sanitizedFileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product_files')
            .upload(filePath, file);

          if (uploadError) throw new Error(`ไม่สามารถอัปโหลดไฟล์เทมเพลตได้: ${uploadError.message}`);
          uploadedTemplate.path = filePath;
        }
        
        // Step 4: Update the product record with the new file paths/URLs
        if (uploadedImage.url || uploadedTemplate.path) {
          const { data: updatedProduct, error: updateError } = await supabase
            .from('products')
            .update({ 
              image_url: uploadedImage.url || null,
              template_file_path: uploadedTemplate.path || null,
            })
            .eq('id', newProduct.id)
            .select()
            .single();

          if (updateError) throw new Error(`เกิดข้อผิดพลาดในการอัปเดตข้อมูลไฟล์: ${updateError.message}`);
          return updatedProduct;
        }

        return newProduct;
      } catch (error) {
        // Rollback on any failure during the process
        if (newProduct) {
          if (uploadedImage.path) {
            await supabase.storage.from('product_images').remove([uploadedImage.path]);
          }
          if (uploadedTemplate.path) {
            await supabase.storage.from('product_files').remove([uploadedTemplate.path]);
          }
          await supabase.from('products').delete().eq('id', newProduct.id);
        }
        throw new Error(`${(error as Error).message} การสร้างสินค้าถูกยกเลิก`);
      }
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
