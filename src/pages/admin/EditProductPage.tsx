
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenCheck } from "lucide-react";

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
          product_type: values.product_type,
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
        {product && product.product_type === 'course' && (
            <div className="flex justify-end mb-4">
                <Link to={`/admin/products/${product.slug}/lessons`}>
                    <Button variant="outline">
                        <BookOpenCheck className="mr-2 h-4 w-4" />
                        จัดการบทเรียน
                    </Button>
                </Link>
            </div>
        )}
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
