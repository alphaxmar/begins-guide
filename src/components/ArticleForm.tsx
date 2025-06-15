
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
import { useEffect } from "react";

// Shared schema for article form
export const articleSchema = z.object({
  title: z.string().min(5, { message: "หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร" }),
  slug: z.string().min(3, { message: "Slug ต้องมีอย่างน้อย 3 ตัวอักษร" }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug ต้องเป็นรูปแบบ kebab-case (เช่น your-article-slug)" }),
  content: z.string().min(50, { message: "เนื้อหาต้องมีอย่างน้อย 50 ตัวอักษร" }),
  cover_image_url: z.string().url({ message: "กรุณาใส่ URL ของรูปภาพที่ถูกต้อง" }).optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  status: z.enum(["draft", "published"], { required_error: "กรุณาเลือกสถานะ" }),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

interface ArticleFormProps {
  onSubmit: (values: ArticleFormValues) => void;
  initialValues?: Partial<ArticleFormValues>;
  isPending: boolean;
  submitButtonText: string;
  isSlugDisabled?: boolean;
}

const ArticleForm = ({
  onSubmit,
  initialValues,
  isPending,
  submitButtonText,
  isSlugDisabled = false,
}: ArticleFormProps) => {
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: initialValues || {
      title: "",
      slug: "",
      content: "",
      cover_image_url: "",
      category: "",
      status: "draft",
    },
  });

  const titleValue = form.watch("title");

  // Effect to reset form when initialValues change (for edit page)
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues as ArticleFormValues);
    }
  }, [initialValues, form]);

  // Effect to generate slug from title (for create page)
  useEffect(() => {
    if (titleValue && !isSlugDisabled) {
      form.setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, form, isSlugDisabled]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>หัวข้อบทความ</FormLabel>
              <FormControl>
                <Input placeholder="หัวข้อที่น่าสนใจของคุณ" {...field} />
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
                <Input 
                  placeholder="your-article-slug" 
                  {...field} 
                  disabled={isSlugDisabled} 
                  readOnly={isSlugDisabled}
                  className={isSlugDisabled ? "bg-muted/50" : ""}
                />
              </FormControl>
              {isSlugDisabled && <FormDescription>Slug ไม่สามารถแก้ไขได้</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>เนื้อหาบทความ</FormLabel>
              <FormControl>
                <Textarea placeholder="เริ่มต้นเขียนเนื้อหาของคุณที่นี่..." className="min-h-[200px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cover_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL รูปภาพปก (ไม่บังคับ)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} value={field.value ?? ''}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>หมวดหมู่ (ไม่บังคับ)</FormLabel>
              <FormControl>
                <Input placeholder="เช่น การตลาด, การเงิน" {...field} value={field.value ?? ''}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สถานะ</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะของบทความ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">แบบร่าง (Draft)</SelectItem>
                  <SelectItem value="published">เผยแพร่ (Published)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                'แบบร่าง' จะไม่แสดงบนเว็บ, 'เผยแพร่' จะแสดงให้ทุกคนเห็น
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "กำลังบันทึก..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
};

export default ArticleForm;
