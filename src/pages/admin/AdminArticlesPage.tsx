
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { PlusCircle, Edit, Trash2, Eye, Pin } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tables } from "@/integrations/supabase/types";
import ArticleStatusToggle from "@/components/admin/ArticleStatusToggle";
import ArticlePinToggle from "@/components/admin/ArticlePinToggle";
import ArticleImporter from "@/components/admin/ArticleImporter";
import { useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Article = Tables<'articles'> & {
  categories?: Tables<'categories'>;
};

const fetchAdminArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories(*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Article[];
};

const AdminArticlesPage = () => {
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [showImporter, setShowImporter] = useState(false);
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["admin-articles"],
    queryFn: fetchAdminArticles,
    enabled: isAdmin,
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("ลบบทความสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    },
  });

  if (adminLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">จัดการบทความ</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImporter(!showImporter)}
          >
            {showImporter ? 'ซ่อน' : 'แสดง'} เครื่องมือนำเข้า
          </Button>
          <Button asChild>
            <Link to="/admin/articles/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              เขียนบทความใหม่
            </Link>
          </Button>
        </div>
      </div>

      {showImporter && (
        <ArticleImporter />
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-6">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <Card key={article.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>/{article.slug}</span>
                      {article.categories && (
                        <Badge variant="secondary">
                          {article.categories.name}
                        </Badge>
                      )}
                      <Badge 
                        variant={article.status === 'published' ? 'default' : 'secondary'}
                      >
                        {article.status === 'published' ? 'เผยแพร่' : 'ร่าง'}
                      </Badge>
                      {article.is_featured_on_hub && (
                        <Badge variant="outline" className="text-yellow-600">
                          <Pin className="mr-1 h-3 w-3" />
                          แนะนำ
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {article.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ArticleStatusToggle 
                        articleSlug={article.slug}
                        currentStatus={article.status as 'draft' | 'published'}
                      />
                      <ArticlePinToggle 
                        articleSlug={article.slug}
                        isPinned={article.is_featured_on_hub || false}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/articles/${article.slug}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          ดู
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/articles/${article.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          แก้ไข
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            ลบ
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>ยืนยันการลบบทความ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              การดำเนินการนี้ไม่สามารถย้อนกลับได้ บทความ "{article.title}" จะถูกลบออกจากระบบถาวร
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteArticleMutation.mutate(article.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              ลบบทความ
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">ยังไม่มีบทความในระบบ</p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  คุณสามารถเริ่มต้นได้โดย:
                </p>
                <div className="flex justify-center gap-2">
                  <Button asChild>
                    <Link to="/admin/articles/create">เขียนบทความใหม่</Link>
                  </Button>
                  <Button variant="outline" onClick={() => setShowImporter(true)}>
                    นำเข้าจาก Static Pages
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminArticlesPage;
