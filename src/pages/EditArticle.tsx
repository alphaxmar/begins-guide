
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
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";

const articleSchema = z.object({
  title: z.string().min(5, { message: "หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร" }),
  slug: z.string(), 
  content: z.string().min(50, { message: "เนื้อหาต้องมีอย่างน้อย 50 ตัวอักษร" }),
  cover_image_url: z.string().url({ message: "กรุณาใส่ URL ของรูปภาพที่ถูกต้อง" }).optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  status: z.enum(["draft", "published"], { required_error: "กรุณาเลือกสถานะ" }),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

const fetchArticleForEdit = async (slug: string) => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const EditArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: article, isLoading: isArticleLoading } = useQuery<Tables<'articles'>>({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleForEdit(slug!),
    enabled: !!slug && isAdmin,
  });

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: slug || "",
      content: "",
      cover_image_url: "",
      category: "",
      status: "draft",
    },
  });
  
  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        slug: article.slug,
        content: article.content || '',
        cover_image_url: article.cover_image_url || '',
        category: article.category || '',
        status: article.status as 'draft' | 'published',
      });
    }
  }, [article, form]);

  useEffect(() => {
    const isLoading = authLoading || adminLoading;
    if (!isLoading && !isAdmin) {
      toast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      navigate("/");
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const mutation = useMutation({
    mutationFn: async (updatedArticle: ArticleFormValues) => {
        if (!user || !isAdmin) throw new Error("User not authorized");
        if (!slug) throw new Error("Article slug not found");

        const { data, error } = await supabase
            .from("articles")
            .update({
                title: updatedArticle.title,
                content: updatedArticle.content,
                cover_image_url: updatedArticle.cover_image_url || null,
                category: updatedArticle.category || null,
                status: updatedArticle.status,
            })
            .eq("slug", slug)
            .select('slug, status')
            .single();

        if (error) throw error;
        return data;
    },
    onSuccess: (data) => {
        toast.success("อัปเดตบทความสำเร็จ!");
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        queryClient.invalidateQueries({ queryKey: ["article", slug] });
      
        if (data && data.status === 'published') {
            navigate(`/articles/${data.slug}`);
        } else {
            navigate('/admin');
        }
    },
    onError: (error) => {
        toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const onSubmit = (values: ArticleFormValues) => {
    mutation.mutate(values);
  };

  const isLoading = authLoading || adminLoading || !isAdmin;
  if (isLoading) {
    return <div className="text-center py-12">กำลังตรวจสอบสิทธิ์...</div>;
  }

  if (isArticleLoading) {
    return (
        <div className="py-12 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">กำลังแก้ไขบทความ...</h1>
            <div className="space-y-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
  }

  return (
    <div className="py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">แก้ไขบทความ</h1>
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
                  <Input placeholder="your-article-slug" {...field} readOnly className="bg-muted/50" />
                </FormControl>
                <FormDescription>Slug ไม่สามารถแก้ไขได้</FormDescription>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditArticle;
