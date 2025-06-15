
import { Control, UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormValues } from "../ProductForm";

interface ProductMetadataInputsProps {
  control: Control<ProductFormValues>;
  form: UseFormReturn<ProductFormValues>;
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

const ProductMetadataInputs: React.FC<ProductMetadataInputsProps> = ({ control, form }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!form.formState.dirtyFields.slug) {
        form.setValue("slug", generateSlug(title), { shouldValidate: true });
    }
  };

  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ชื่อสินค้า</FormLabel>
            <FormControl>
              <Input placeholder="เช่น คอร์สการตลาดออนไลน์ 101" {...field} onChange={handleTitleChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug (สำหรับ URL)</FormLabel>
            <FormControl>
              <Input placeholder="เช่น online-marketing-101" {...field} />
            </FormControl>
            <FormDescription>
              ส่วนนี้จะปรากฏใน URL ของสินค้า ควรเป็นภาษาอังกฤษและไม่มีเว้นวรรค
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>คำอธิบายสินค้า</FormLabel>
            <FormControl>
              <Textarea placeholder="บอกรายละเอียดเกี่ยวกับสินค้าของคุณ..." className="min-h-[100px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProductMetadataInputs;
