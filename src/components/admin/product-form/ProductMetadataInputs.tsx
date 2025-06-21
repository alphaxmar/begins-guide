
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ProductFormValues } from "../ProductForm";

interface ProductMetadataInputsProps {
  control: Control<ProductFormValues>;
  productType: string;
}

const ProductMetadataInputs: React.FC<ProductMetadataInputsProps> = ({ control, productType }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>หมวดหมู่</FormLabel>
            <FormControl>
              <Input placeholder="เช่น การตลาด, การเงิน, เทคโนโลยี" {...field} />
            </FormControl>
            <FormDescription>
              หมวดหมู่ของสินค้าเพื่อช่วยลูกค้าค้นหา
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {productType === 'course' && (
        <FormField
          control={control}
          name="certificate_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  เปิดใช้งานประกาศนียบัตร
                </FormLabel>
                <FormDescription>
                  ออกประกาศนียบัตรให้ผู้เรียนที่เรียนจบคอร์ส
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {(productType === 'template' || productType === 'ebook' || productType === 'software') && (
        <>
          <FormField
            control={control}
            name="download_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>จำนวนครั้งการดาวน์โหลด</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="ไม่จำกัด" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                  />
                </FormControl>
                <FormDescription>
                  จำนวนครั้งสูงสุดที่ผู้ซื้อสามารถดาวน์โหลดได้ (เว้นว่างไว้หากไม่จำกัด)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="download_expiry_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อายุลิงก์ดาวน์โหลด (ชั่วโมง)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="24" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 24)}
                  />
                </FormControl>
                <FormDescription>
                  ลิงก์ดาวน์โหลดจะหมดอายุภายในเวลาที่กำหนด
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default ProductMetadataInputs;
