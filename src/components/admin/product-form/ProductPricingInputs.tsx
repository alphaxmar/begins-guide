
import { Control, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormValues } from "../ProductForm";

interface ProductPricingInputsProps {
  control: Control<ProductFormValues>;
  form: UseFormReturn<ProductFormValues>;
}

const ProductPricingInputs: React.FC<ProductPricingInputsProps> = ({ control, form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ราคา (บาท)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="เช่น 1990" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="product_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ประเภทสินค้า</FormLabel>
            <Select onValueChange={(value) => {
              field.onChange(value);
              if (value === 'course' || value === 'cohort_program') {
                form.setValue('template_file', undefined);
              }
            }} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="course">คอร์ส</SelectItem>
                <SelectItem value="template">เทมเพลต</SelectItem>
                <SelectItem value="cohort_program">Signature Course (Cohort Program)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductPricingInputs;
