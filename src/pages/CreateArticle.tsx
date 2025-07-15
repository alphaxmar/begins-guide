
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import ArticleForm, { ArticleFormValues } from "@/components/ArticleForm";
import AdminLayout from "@/components/admin/AdminLayout";

type ArticleMutationSuccess = {
  slug: string;
  status: "draft" | "published";
} | null;

const CreateArticle = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const isLoading = authLoading || adminLoading;
    if (!isLoading && !isAdmin) {
      toast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      navigate("/");
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const mutation = useMutation<ArticleMutationSuccess, Error, ArticleFormValues>({
    mutationFn: async (newArticle) => {
      if (!user) throw new Error("User not authenticated");
      if (!isAdmin) throw new Error("User not authorized");

      const { data, error } = await supabase
        .from("articles")
        .insert([{
          title: newArticle.title,
          slug: newArticle.slug,
          content: newArticle.content,
          excerpt: newArticle.excerpt,
          author_id: user.id,
          cover_image_url: newArticle.cover_image_url || null,
          category_id: newArticle.category_id || null,
          status: newArticle.status,
          is_featured_on_hub: newArticle.is_featured_on_hub,
          recommended_product_id: newArticle.recommended_product_id || null,
          seo_title: newArticle.seo_title || null,
          seo_description: newArticle.seo_description || null,
        }])
        .select('slug, status')
        .single();
      
      if (error) {
        if (error.code === '23505') {
          throw new Error("Slug นี้มีอยู่แล้ว กรุณาเปลี่ยนใหม่");
        }
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("สร้างบทความสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      
      if (data && data.status === 'published') {
        navigate(`/articles/${data.slug}`);
      } else {
        navigate('/admin/articles');
      }
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  const onSubmit = (values: ArticleFormValues) => {
    mutation.mutate(values);
  };

  if (authLoading || adminLoading || !isAdmin) {
    return (
      <AdminLayout>
        <div className="text-center py-12">กำลังตรวจสอบสิทธิ์...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">เขียนบทความใหม่</h1>
        <ArticleForm
          onSubmit={onSubmit}
          isPending={mutation.isPending}
          submitButtonText="สร้างบทความ"
        />
      </div>
    </AdminLayout>
  );
};

export default CreateArticle;
