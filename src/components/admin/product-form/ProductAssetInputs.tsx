
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductFormValues } from "../ProductForm";
import { ChangeEvent, useState } from "react";
import { Tables } from "@/integrations/supabase/types";

interface ProductAssetInputsProps {
  control: Control<ProductFormValues>;
  productType: "course" | "template";
  initialData?: Tables<'products'> | null;
}

const ProductAssetInputs: React.FC<ProductAssetInputsProps> = ({ control, productType, initialData }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

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
        name="image_file"
        render={({ field: { onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>รูปภาพหน้าปก</FormLabel>
            {imagePreview && (
              <div className="my-2">
                <img src={imagePreview} alt="Image Preview" className="w-40 h-auto rounded-md object-cover" />
              </div>
            )}
            <FormControl>
              <Input
                {...fieldProps}
                type="file"
                value={undefined} // Needed for file inputs in react-hook-form
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const files = event.target.files;
                  if (files && files.length > 0) {
                    setImagePreview(URL.createObjectURL(files[0]));
                    onChange(files);
                  } else {
                    setImagePreview(initialData?.image_url || null);
                    onChange(null);
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              อัปโหลดไฟล์รูปภาพหน้าปก (ขนาดไม่เกิน 5MB) หากมีรูปเดิมอยู่แล้วจะถูกเขียนทับ
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProductAssetInputs;
