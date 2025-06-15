
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
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
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Fetch ALL articles, regardless of status
const fetchAdminArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const AdminArticlesPage = () => {
  const queryClient = useQueryClient();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const { data: articles, isLoading } = useQuery<Tables<'articles'>[]>({
    queryKey: ["admin-articles"],
    queryFn: fetchAdminArticles,
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("articles").delete().eq("slug", slug);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("บทความถูกลบแล้ว");
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] }); // also invalidate public articles
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการลบบทความ: ${error.message}`);
    },
    onSettled: () => {
      setDeletingSlug(null);
    }
  });

  const handleDelete = (slug: string) => {
    setDeletingSlug(slug);
    deleteMutation.mutate(slug);
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">จัดการบทความ</h1>
          <p className="text-muted-foreground">สร้าง, แก้ไข, และลบบทความทั้งหมดในระบบ</p>
        </div>
        <Button asChild>
          <Link to="/articles/create">
            <PlusCircle />
            เขียนบทความใหม่
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>หัวข้อ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead>การกระทำ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><div className="flex gap-2 justify-end"><Skeleton className="h-9 w-9" /><Skeleton className="h-9 w-9" /></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">หัวข้อ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>วันที่สร้าง</TableHead>
                <TableHead className="text-right">การกระทำ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles && articles.length > 0 ? (
                articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>
                      <Badge variant={article.status === 'published' ? 'default' : 'outline'}>
                        {article.status === 'published' ? 'เผยแพร่' : 'แบบร่าง'}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.category || '-'}</TableCell>
                    <TableCell>{format(new Date(article.created_at), 'dd MMM yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/articles/${article.slug}/edit`}>
                            <Edit />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                              <AlertDialogDescription>
                                การกระทำนี้ไม่สามารถย้อนกลับได้ การลบบทความ "{article.title}" จะลบข้อมูลออกจากเซิร์ฟเวอร์อย่างถาวร
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(article.slug)}
                                className="bg-destructive hover:bg-destructive/90"
                                disabled={deleteMutation.isPending && deletingSlug === article.slug}
                              >
                                {deleteMutation.isPending && deletingSlug === article.slug ? 'กำลังลบ...' : 'ยืนยันการลบ'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    ยังไม่มีบทความ
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminArticlesPage;
