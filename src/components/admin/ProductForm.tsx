
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useEffect } from "react";
import { productSchema } from "@/lib/validators/product";
import ProductMetadataInputs from "./product-form/ProductMetadataInputs";
import ProductPricingInputs from "./product-form/ProductPricingInputs";
import ProductAssetInputs from "./product-form/ProductAssetInputs";

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => void;
  initialData?: Tables<'products'> | null;
  isLoading?: boolean;
  submitButtonText?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData, isLoading = false, submitButtonText = "บันทึก" }) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: 0,
      product_type: "course",
      image_url: "",
      image_file: undefined,
      ...initialData,
      template_file_path: initialData?.template_file_path || undefined,
      template_file: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        product_type: initialData.product_type || "course",
        image_url: initialData.image_url || "",
        template_file_path: initialData.template_file_path || undefined,
        image_file: undefined,
        template_file: undefined,
      });
    }
  }, [initialData, form]);

  const productType = form.watch("product_type");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "แก้ไขสินค้า" : "สร้างสินค้าใหม่"}</CardTitle>
        <CardDescription>
          {initialData ? "อัปเดตรายละเอียดสินค้าของคุณ" : "กรอกข้อมูลเพื่อสร้างสินค้าใหม่"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProductMetadataInputs control={form.control} form={form} />
            <ProductPricingInputs control={form.control} form={form} />
            <ProductAssetInputs control={form.control} productType={productType} initialData={initialData} />
            
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
