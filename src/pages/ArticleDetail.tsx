import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const fetchArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: article, isLoading, isError } = useQuery<Tables<'articles'> | null>({
    queryKey: ["article", slug],
    queryFn: () => fetchArticleBySlug(slug!),
    enabled: !!slug,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!slug) throw new Error("Slug is required for deletion.");
      const { error } = await supabase.from("articles").delete().eq("slug", slug);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("บทความถูกลบแล้ว");
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate("/articles");
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการลบบทความ: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-1/4 mb-8" />
        <Skeleton className="h-96 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">ไม่พบบทความ</h2>
        <p className="text-muted-foreground mb-8">บทความที่คุณกำลังมองหาอาจถูกลบหรือไม่มีอยู่จริง</p>
        <Button asChild>
          <Link to="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารวมบทความ
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="py-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" asChild className="-ml-4">
           <Link to="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้ารวมบทความ
           </Link>
        </Button>

        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/articles/${slug}/edit`}>
                <Edit className="mr-2" />
                แก้ไข
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={deleteMutation.isPending}>
                  <Trash2 className="mr-2" />
                  {deleteMutation.isPending ? "กำลังลบ..." : "ลบ"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                  <AlertDialogDescription>
                    การกระทำนี้ไม่สามารถย้อนกลับได้ การลบบทความนี้จะลบข้อมูลออกจากเซิร์ฟเวอร์อย่างถาวร
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    ยืนยันการลบ
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{article.title}</h1>
      {article.cover_image_url && (
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="w-full h-auto max-h-[500px] object-cover rounded-lg my-8"
        />
      )}
      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content || "" }}
      />
    </article>
  );
};

export default ArticleDetail;
