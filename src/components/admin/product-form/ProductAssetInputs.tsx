
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductFormValues } from "../ProductForm";
import { ChangeEvent } from "react";
import { Tables } from "@/integrations/supabase/types";

interface ProductAssetInputsProps {
  control: Control<ProductFormValues>;
  productType: "course" | "template";
  initialData?: Tables<'products'> | null;
}

const ProductAssetInputs: React.FC<ProductAssetInputsProps> = ({ control, productType, initialData }) => {
  return (
    <>
      {productType === 'template' && (
        <FormField
          control={control}
          name="template_file"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>ไฟล์เทมเพลต</FormLabel>
              <FormControl>
                <Input
                  name={name}
                  onBlur={onBlur}
                  ref={ref}
                  type="file"
                  accept=".zip,.pdf,.png,.jpg,.jpeg"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChange(event.target.files);
                  }}
                />
              </FormControl>
              <FormDescription>
                {initialData?.template_file_path
                  ? `มีไฟล์อยู่แล้ว: ${initialData.template_file_path.split('/').pop()}. อัปโหลดไฟล์ใหม่เพื่อทับไฟล์เดิม`
                  : "อัปโหลดไฟล์เทมเพลต (.zip, .pdf, .png, .jpeg)"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL รูปภาพหน้าปก</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/image.jpg" {...field} />
            </FormControl>
            <FormDescription>
              วาง URL ของรูปภาพที่ต้องการใช้เป็นหน้าปก
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProductAssetInputs;
