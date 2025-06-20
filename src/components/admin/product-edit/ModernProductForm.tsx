
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";
import { Tables } from "@/integrations/supabase/types";

interface ModernProductFormProps {
  product: Tables<'products'>;
  onSubmit: (values: ProductFormValues) => void;
  isLoading: boolean;
}

const ModernProductForm = ({ product, onSubmit, isLoading }: ModernProductFormProps) => {
  return (
    <div className="p-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white text-xl">อัปเดตข้อมูลสินค้า</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-slate-800 text-white">
            <ProductForm 
              onSubmit={onSubmit} 
              defaultValues={product} 
              isLoading={isLoading} 
              submitButtonText="บันทึกการเปลี่ยนแปลง"
              initialData={product}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernProductForm;
