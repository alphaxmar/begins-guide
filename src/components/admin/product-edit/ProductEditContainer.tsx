
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
import ModernProductEditLayout from "./ModernProductEditLayout";
import ModernProductForm from "./ModernProductForm";

interface ProductEditContainerProps {
  product: Tables<'products'>;
  slug: string;
  showLessonsSection?: boolean;
}

const ProductEditContainer = ({ product, slug, showLessonsSection = true }: ProductEditContainerProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateProductMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      let newImageUrl = product.image_url;
      let newTemplateFilePath = product.template_file_path;

      // Handle new image upload
      if (values.image_file && values.image_file.length > 0) {
        const file = values.image_file[0];
        const sanitizedFileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const filePath = `${product.id}/${sanitizedFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product_images')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`อัปโหลดรูปภาพไม่สำเร็จ: ${uploadError.message}`);
        }
        
        const { data: urlData } = supabase.storage.from('product_images').getPublicUrl(filePath);
        newImageUrl = urlData.publicUrl;
        
        // Attempt to delete the old image if it exists
        if (product.image_url) {
          try {
            const oldPath = new URL(product.image_url).pathname.split('/product_images/')[1];
            if (oldPath && oldPath !== filePath) {
              await supabase.storage.from('product_images').remove([oldPath]);
            }
          } catch (e) {
            console.warn("Could not parse or delete old image file:", e);
          }
        }
      }

      // Handle template file changes
      const oldTemplateFilePath = product.template_file_path;
      if (values.product_type === 'template' && values.template_file && values.template_file.length > 0) {
        const file = values.template_file[0];
        const sanitizedFileName = file.name.replace(/\s/g, '_');
        const filePath = `templates/${product.id}/${sanitizedFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product_files')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw new Error(`อัปโหลดไฟล์ไม่สำเร็จ: ${uploadError.message}`);
        newTemplateFilePath = filePath;
        
        if (oldTemplateFilePath && oldTemplateFilePath !== filePath) {
            await supabase.storage.from('product_files').remove([oldTemplateFilePath]);
        }
      } else if (values.product_type === 'course' && oldTemplateFilePath) {
        await supabase.storage.from('product_files').remove([oldTemplateFilePath]);
        newTemplateFilePath = null;
      }

      const { data, error: updateError } = await supabase
        .from("products")
        .update({
          title: values.title,
          slug: values.slug,
          price: values.price,
          product_type: values.product_type as any,
          description: values.description || null,
          image_url: newImageUrl,
          template_file_path: newTemplateFilePath,
        })
        .eq("id", product.id)
        .select()
        .single();
        
      if (updateError) {
        if (updateError.code === '23505') {
            throw new Error("Slug นี้มีอยู่แล้วในระบบ กรุณาเปลี่ยนใหม่");
        }
        throw new Error(updateError.message);
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("✅ บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว!", {
        description: `สินค้า "${data.title}" ได้รับการอัปเดตแล้ว`,
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", slug] });
      queryClient.invalidateQueries({ queryKey: ["product", data.slug] });
      
      // หน่วงเวลาเล็กน้อยเพื่อให้ผู้ใช้เห็น toast ก่อนที่จะ redirect
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    },
    onError: (error) => {
      toast.error("❌ เกิดข้อผิดพลาดในการบันทึก", {
        description: error.message,
        duration: 4000,
      });
    },
  });

  const handleSubmit = (values: ProductFormValues) => {
    updateProductMutation.mutate(values);
  };

  return (
    <ModernProductEditLayout product={product}>
      <ModernProductForm 
        product={product}
        onSubmit={handleSubmit}
        isLoading={updateProductMutation.isPending}
        showLessonsSection={showLessonsSection}
      />
    </ModernProductEditLayout>
  );
};

export default ProductEditContainer;
