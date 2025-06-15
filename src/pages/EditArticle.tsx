
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/integrations/supabase/types";
import ArticleForm, { ArticleFormValues } from "@/components/ArticleForm";

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

  // Prepare initial values for the form, ensuring no nulls are passed for controlled components
  const initialFormValues = article ? {
    title: article.title,
    slug: article.slug,
    content: article.content || '',
    cover_image_url: article.cover_image_url || '',
    category: article.category || '',
    status: article.status as 'draft' | 'published',
  } : undefined;

  return (
    <div className="py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">แก้ไขบทความ</h1>
      <ArticleForm
        onSubmit={onSubmit}
        isPending={mutation.isPending}
        submitButtonText="บันทึกการเปลี่ยนแปลง"
        initialValues={initialFormValues}
        isSlugDisabled={true}
      />
    </div>
  );
};

export default EditArticle;
