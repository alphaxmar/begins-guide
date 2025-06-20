import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productSchema } from "@/lib/validators/product";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, FileText, Video, Download, Users, Wrench } from "lucide-react";
import ProductAssetInputs from "./product-form/ProductAssetInputs";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => void;
  defaultValues?: Partial<ProductFormValues>;
  isLoading?: boolean;
  submitButtonText?: string;
  initialData?: Tables<'products'> | null;
}

const PRODUCT_TYPE_OPTIONS = [
  { 
    value: 'course', 
    label: 'คอร์สเรียน', 
    description: 'คอร์สเรียนออนไลน์ที่มีบทเรียนและวิดีโอ',
    icon: Video
  },
  { 
    value: 'template', 
    label: 'เทมเพลต', 
    description: 'ไฟล์เทมเพลตสำหรับดาวน์โหลด เช่น Business Model Canvas',
    icon: FileText
  },
  { 
    value: 'ebook', 
    label: 'E-book', 
    description: 'หนังสือดิจิทัลในรูปแบบ PDF หรือ EPUB',
    icon: Download
  },
  { 
    value: 'video', 
    label: 'วิดีโอ', 
    description: 'วิดีโอเดี่ยวที่ไม่ใช่คอร์สเรียน',
    icon: Video
  },
  { 
    value: 'software', 
    label: 'ซอฟต์แวร์', 
    description: 'โปรแกรมหรือแอปพลิเคชันสำหรับดาวน์โหลด',
    icon: Wrench
  },
  { 
    value: 'service', 
    label: 'บริการ', 
    description: 'บริการที่ให้คำปรึกษาหรือทำงานให้',
    icon: Users
  },
  { 
    value: 'membership', 
    label: 'สมาชิก', 
    description: 'การเป็นสมาชิกหรือการเข้าถึงเนื้อหาพิเศษ',
    icon: Package
  }
];

const ProductForm: React.FC<ProductFormProps> = ({ 
  onSubmit, 
  defaultValues, 
  isLoading = false,
  submitButtonText = "บันทึก",
  initialData
}) => {
  const [templateFilePath, setTemplateFilePath] = useState(initialData?.template_file_path || "");
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      price: 0,
      product_type: "course",
      image_url: "",
      ...defaultValues,
    },
  });

  const watchedProductType = form.watch("product_type");
  const selectedProductTypeInfo = PRODUCT_TYPE_OPTIONS.find(opt => opt.value === watchedProductType);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    form.setValue("title", value);
    if (!form.formState.dirtyFields.slug) {
      form.setValue("slug", generateSlug(value));
    }
  };

  const handleSubmit = (values: ProductFormValues) => {
    // เพิ่ม template_file_path เข้าไปใน values หากมี
    const finalValues = {
      ...values,
      template_file_path: templateFilePath || undefined
    };
    onSubmit(finalValues as ProductFormValues);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {defaultValues ? "แก้ไขสินค้า" : "สร้างสินค้าใหม่"}
        </h1>
        <p className="text-muted-foreground">
          {defaultValues ? "อัปเดตข้อมูลสินค้าของคุณ" : "เพิ่มสินค้าใหม่เข้าสู่ระบบ"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Product Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                ประเภทสินค้า
              </CardTitle>
              <CardDescription>
                เลือกประเภทสินค้าที่ต้องการสร้าง
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="product_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ประเภทสินค้า</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกประเภทสินค้า" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_TYPE_OPTIONS.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {selectedProductTypeInfo && (
                      <FormDescription>
                        {selectedProductTypeInfo.description}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
              <CardDescription>
                ข้อมูลหลักของสินค้าที่จะแสดงให้ลูกค้าเห็น
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อสินค้า *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ระบุชื่อสินค้าของคุณ..." 
                        {...field}
                        onChange={(e) => handleTitleChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      ชื่อที่จะแสดงให้ลูกค้าเห็นในหน้าร้านค้า
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="url-slug-ของ-สินค้า" 
                        {...field}
                        onChange={(e) => {
                          form.setValue("slug", e.target.value, { shouldDirty: true });
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      URL ที่ใช้เข้าถึงสินค้า (ตัวอักษรเล็ก, ตัวเลข, และขีดกลางเท่านั้น)
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
                    <FormLabel>รายละเอียดสินค้า</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="อธิบายรายละเอียดเกี่ยวกับสินค้าของคุณ..." 
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      รายละเอียดที่จะช่วยให้ลูกค้าเข้าใจและตัดสินใจซื้อสินค้า
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>ราคาและการขาย</CardTitle>
              <CardDescription>
                กำหนดราคาขายของสินค้า
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ราคา (บาท) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      ราคาขายของสินค้าในหน่วยบาท (สามารถใส่ทศนิยมได้)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Media and Files */}
          <Card>
            <CardHeader>
              <CardTitle>ไฟล์และสื่อ</CardTitle>
              <CardDescription>
                อัปโหลดรูปภาพและไฟล์ที่เกี่ยวข้องกับสินค้า
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProductAssetInputs
                control={form.control}
                productType={watchedProductType as "course" | "template"}
                initialData={initialData}
                onTemplateFilePathChange={setTemplateFilePath}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL รูปภาพหน้าปก</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL ของรูปภาพที่จะแสดงเป็นหน้าปกสินค้า
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <a href="/admin/products">ยกเลิก</a>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "กำลังบันทึก..." : submitButtonText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
