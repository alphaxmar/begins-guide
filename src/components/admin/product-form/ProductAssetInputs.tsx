
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductFormValues } from "../ProductForm";
import { ChangeEvent, useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import FileUpload from "../FileUpload";

interface ProductAssetInputsProps {
  control: Control<ProductFormValues>;
  productType: "course" | "template";
  initialData?: Tables<'products'> | null;
  onTemplateFilePathChange?: (path: string) => void;
}

const ProductAssetInputs: React.FC<ProductAssetInputsProps> = ({ 
  control, 
  productType, 
  initialData,
  onTemplateFilePathChange
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

  return (
    <>
      {productType === 'template' && (
        <div className="space-y-4">
          <FormLabel>ไฟล์เทมเพลต</FormLabel>
          <FileUpload
            productId={initialData?.id}
            currentFilePath={initialData?.template_file_path || ""}
            onFileUploaded={(filePath) => {
              if (onTemplateFilePathChange) {
                onTemplateFilePathChange(filePath);
              }
            }}
            accept=".zip,.pdf,.png,.jpg,.jpeg,.docx,.xlsx,.pptx"
            label="อัปโหลดไฟล์เทมเพลต"
            description="อัปโหลดไฟล์เทมเพลตที่ลูกค้าจะได้รับหลังจากซื้อ (รองรับ .zip, .pdf, .png, .jpeg, .docx, .xlsx, .pptx)"
          />
          
          <FormField
            control={control}
            name="template_file"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <FormItem className="hidden">
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                value={undefined}
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
