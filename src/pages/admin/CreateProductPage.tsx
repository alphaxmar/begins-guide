
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import ProductLessonsSection from "@/components/admin/product-edit/ProductLessonsSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateProductPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [createdProduct, setCreatedProduct] = useState<Tables<'products'> | null>(null);

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
            category: values.category || null,
            start_date: values.start_date ? new Date(values.start_date).toISOString() : null,
            end_date: values.end_date ? new Date(values.end_date).toISOString() : null,
            certificate_enabled: values.certificate_enabled || false,
            download_limit: values.download_limit || null,
            download_expiry_hours: values.download_expiry_hours || 24,
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
      toast.success("✅ สร้างสินค้าใหม่เรียบร้อยแล้ว!", {
        description: `สินค้า "${data.title}" ถูกสร้างเรียบร้อยแล้ว`,
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setCreatedProduct(data);
    },
    onError: (error) => {
      console.error("Product creation error:", error);
      toast.error(`❌ เกิดข้อผิดพลาดในการสร้างสินค้า`, {
        description: error.message,
        duration: 4000,
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      if (!createdProduct) throw new Error("No product to update");

      let newImageUrl = createdProduct.image_url;
      let newTemplateFilePath = createdProduct.template_file_path;

      // Handle new image upload
      if (values.image_file && values.image_file.length > 0) {
        const file = values.image_file[0];
        const sanitizedFileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const filePath = `${createdProduct.id}/${sanitizedFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product_images')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`อัปโหลดรูปภาพไม่สำเร็จ: ${uploadError.message}`);
        }
        
        const { data: urlData } = supabase.storage.from('product_images').getPublicUrl(filePath);
        newImageUrl = urlData.publicUrl;
        
        // Attempt to delete the old image if it exists
        if (createdProduct.image_url) {
          try {
            const oldPath = new URL(createdProduct.image_url).pathname.split('/product_images/')[1];
            if (oldPath && oldPath !== filePath) {
              await supabase.storage.from('product_images').remove([oldPath]);
            }
          } catch (e) {
            console.warn("Could not parse or delete old image file:", e);
          }
        }
      }

      // Handle template file changes
      const oldTemplateFilePath = createdProduct.template_file_path;
      if (values.product_type === 'template' && values.template_file && values.template_file.length > 0) {
        const file = values.template_file[0];
        const sanitizedFileName = file.name.replace(/\s/g, '_');
        const filePath = `templates/${createdProduct.id}/${sanitizedFileName}`;

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
        .eq("id", createdProduct.id)
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
      setCreatedProduct(data);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.slug] });
    },
    onError: (error) => {
      toast.error("❌ เกิดข้อผิดพลาดในการบันทึก", {
        description: error.message,
        duration: 4000,
      });
    },
  });

  const handleSubmit = (values: ProductFormValues) => {
    if (createdProduct) {
      updateProductMutation.mutate(values);
    } else {
      createProductMutation.mutate(values);
    }
  };

  const handleFinishAndGoBack = () => {
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/admin/products")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปรายการสินค้า
          </Button>
          <div className="text-white">
            <h1 className="text-lg font-semibold">
              {createdProduct ? "แก้ไขสินค้า" : "สร้างสินค้าใหม่"}
            </h1>
            {createdProduct && (
              <p className="text-sm text-slate-400">{createdProduct.title}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Product Information Section */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <CardTitle className="text-white text-xl">ข้อมูลสินค้า</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-slate-800 text-white">
                <ProductForm 
                  onSubmit={handleSubmit} 
                  defaultValues={createdProduct ? {
                    title: createdProduct.title,
                    slug: createdProduct.slug,
                    description: createdProduct.description || '',
                    price: createdProduct.price,
                    product_type: createdProduct.product_type as any,
                    image_url: createdProduct.image_url || '',
                    category: createdProduct.category || '',
                    start_date: createdProduct.start_date || '',
                    end_date: createdProduct.end_date || '',
                    certificate_enabled: createdProduct.certificate_enabled || false,
                    download_limit: createdProduct.download_limit || undefined,
                    download_expiry_hours: createdProduct.download_expiry_hours || 24,
                    template_file_path: createdProduct.template_file_path || '',
                  } : undefined}
                  isLoading={createProductMutation.isPending || updateProductMutation.isPending}
                  submitButtonText={createdProduct ? "บันทึกการเปลี่ยนแปลง" : "สร้างสินค้า"}
                  initialData={createdProduct}
                />
              </div>
            </CardContent>
          </Card>

          {/* Episodes Section - Show only after product is created and is a course */}
          {createdProduct && createdProduct.product_type === 'course' && (
            <ProductLessonsSection product={createdProduct} />
          )}

          {/* Finish Button - Show only after product is created */}
          {createdProduct && (
            <div className="flex justify-center">
              <Button
                onClick={handleFinishAndGoBack}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                เสร็จสิ้น - กลับไปรายการสินค้า
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
