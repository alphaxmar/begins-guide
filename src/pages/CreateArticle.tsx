
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

const articleSchema = z.object({
  title: z.string().min(5, { message: "หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร" }),
  slug: z.string().min(3, { message: "Slug ต้องมีอย่างน้อย 3 ตัวอักษร" }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug ต้องเป็นรูปแบบ kebab-case (เช่น your-article-slug)" }),
  excerpt: z.string().min(10, { message: "บทคัดย่อต้องมีอย่างน้อย 10 ตัวอักษร" }).max(200, { message: "บทคัดย่อต้องไม่เกิน 200 ตัวอักษร" }),
  content: z.string().min(50, { message: "เนื้อหาต้องมีอย่างน้อย 50 ตัวอักษร" }),
  category: z.string().optional(),
  image_url: z.string().url({ message: "กรุณาใส่ URL ของรูปภาพที่ถูกต้อง" }).optional().or(z.literal('')),
});

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

const CreateArticle = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      image_url: "",
    },
  });

  const titleValue = form.watch("title");

  useEffect(() => {
    if (titleValue) {
      form.setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, form]);
  
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถสร้างบทความได้");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const mutation = useMutation({
    mutationFn: async (newArticle: z.infer<typeof articleSchema>) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("articles")
        .insert([{ ...newArticle, author_id: user.id, slug: form.getValues("slug") }])
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new Error("Slug นี้มีอยู่แล้ว กรุณาเปลี่ยนใหม่");
        }
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("สร้างบทความสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["featuredArticles"] });
      navigate(`/articles/${data.slug}`);
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const onSubmit = (values: z.infer<typeof articleSchema>) => {
    mutation.mutate(values);
  };

  if (authLoading || !user) {
    return <div className="text-center py-12">กำลังโหลด...</div>;
  }

  return (
    <div className="py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">เขียนบทความใหม่</h1>
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
                  <Input placeholder="your-article-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>บทคัดย่อ</FormLabel>
                <FormControl>
                  <Textarea placeholder="สรุปสั้นๆ เกี่ยวกับบทความของคุณ" {...field} />
                </FormControl>
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หมวดหมู่ (ไม่บังคับ)</FormLabel>
                <FormControl>
                  <Input placeholder="เช่น การตลาด, ธุรกิจ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL รูปภาพปก (ไม่บังคับ)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "กำลังสร้าง..." : "สร้างบทความ"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateArticle;
