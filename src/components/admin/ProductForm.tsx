
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useEffect } from "react";

const productSchema = z.object({
  title: z.string().min(3, { message: "ชื่อสินค้าต้องมีอย่างน้อย 3 ตัวอักษร" }),
  slug: z.string().min(3, { message: "Slug ต้องมีอย่างน้อย 3 ตัวอักษร" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug สามารถมีได้แค่ตัวอักษรเล็ก, ตัวเลข, และขีดกลาง (-)" }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: "ราคาต้องไม่ติดลบ" }),
  product_type: z.enum(["course", "template"], { required_error: "กรุณาเลือกประเภทสินค้า" }),
  image_url: z.string().url({ message: "URL รูปภาพไม่ถูกต้อง" }).optional().or(z.literal('')),
});

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
      ...initialData,
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
      });
    }
  }, [initialData, form]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    if (!form.formState.dirtyFields.slug) {
        form.setValue("slug", generateSlug(title), { shouldValidate: true });
    }
  };

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
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
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
                control={form.control}
                name="product_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ประเภทสินค้า</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกประเภท" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="course">คอร์ส</SelectItem>
                        <SelectItem value="template">เทมเพลต</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
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
