
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import ArticleForm, { ArticleFormValues } from "@/components/ArticleForm";

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
          author_id: user.id,
          cover_image_url: newArticle.cover_image_url || null,
          status: newArticle.status,
          category: newArticle.category || null,
        }])
        .select('slug, status')
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation for slug
          throw new Error("Slug นี้มีอยู่แล้ว กรุณาเปลี่ยนใหม่");
        }
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("สร้างบทความสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      
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

  if (authLoading || adminLoading || !isAdmin) {
    return <div className="text-center py-12">กำลังตรวจสอบสิทธิ์...</div>;
  }

  return (
    <div className="py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">เขียนบทความใหม่</h1>
      <ArticleForm
        onSubmit={onSubmit}
        isPending={mutation.isPending}
        submitButtonText="สร้างบทความ"
      />
    </div>
  );
};

export default CreateArticle;
