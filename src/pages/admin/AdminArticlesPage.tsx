import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Eye, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ArticleSearchAndFilter from "@/components/admin/ArticleSearchAndFilter";
import ArticleBulkActions from "@/components/admin/ArticleBulkActions";
import ArticleStatusToggle from "@/components/admin/ArticleStatusToggle";
import ArticlePinToggle from "@/components/admin/ArticlePinToggle";

const ITEMS_PER_PAGE = 10;

// Fetch ALL articles, regardless of status
const fetchAdminArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const AdminArticlesPage = () => {
  const queryClient = useQueryClient();
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: articles, isLoading } = useQuery<Tables<'articles'>[]>({
    queryKey: ["admin-articles"],
    queryFn: fetchAdminArticles,
  });

  // Get unique categories for filter
  const categories = useMemo(() => {
    if (!articles) return [];
    return Array.from(new Set(articles.filter(a => a.category).map(a => a.category!)));
  }, [articles]);

  // Filter and search articles
  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    
    return articles.filter(article => {
      const matchesSearch = !searchQuery || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || article.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [articles, searchQuery, statusFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("articles").delete().eq("slug", slug);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("บทความถูกลบแล้ว");
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการลบบทความ: ${error.message}`);
    },
    onSettled: () => {
      setDeletingSlug(null);
    }
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ slugs, status }: { slugs: string[], status: "draft" | "published" }) => {
      const { error } = await supabase
        .from("articles")
        .update({ status })
        .in("slug", slugs);
      if (error) throw error;
    },
    onSuccess: (_, { status, slugs }) => {
      toast.success(`อัปเดตสถานะ ${slugs.length} บทความเป็น "${status === "published" ? "เผยแพร่" : "แบบร่าง"}" แล้ว`);
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      setSelectedItems([]);
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${error.message}`);
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (slugs: string[]) => {
      const { error } = await supabase.from("articles").delete().in("slug", slugs);
      if (error) throw error;
    },
    onSuccess: (_, slugs) => {
      toast.success(`ลบบทความ ${slugs.length} รายการแล้ว`);
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      setSelectedItems([]);
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการลบบทความ: ${error.message}`);
    }
  });

  const handleDelete = (slug: string) => {
    setDeletingSlug(slug);
    deleteMutation.mutate(slug);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedArticles.map(article => article.slug));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (slug: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, slug]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== slug));
    }
  };

  const exportCSV = () => {
    if (!filteredArticles.length) return;
    
    const headers = ["หัวข้อ", "สถานะ", "หมวดหมู่", "ผู้เขียน", "วันที่สร้าง", "วันที่อัปเดต"];
    const csvContent = [
      headers.join(","),
      ...filteredArticles.map(article => [
        `"${article.title}"`,
        article.status === "published" ? "เผยแพร่" : "แบบร่าง",
        `"${article.category || "-"}"`,
        "Admin",
        format(new Date(article.created_at), 'dd/MM/yyyy'),
        format(new Date(article.updated_at), 'dd/MM/yyyy')
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `articles_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">จัดการบทความ</h1>
          <p className="text-muted-foreground">เครื่องมือจัดการเนื้อหาเชิงรุก - ค้นหา, กรอง, และจัดการบทความอย่างมืออาชีพ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/articles/import">
              <Upload className="h-4 w-4 mr-2" />
              นำเข้า CSV
            </Link>
          </Button>
          <Button asChild>
            <Link to="/articles/create">
              <PlusCircle className="h-4 w-4 mr-2" />
              เขียนบทความใหม่
            </Link>
          </Button>
        </div>
      </div>

      <ArticleSearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
        onExportCSV={exportCSV}
      />

      <ArticleBulkActions
        selectedItems={selectedItems}
        onClearSelection={() => setSelectedItems([])}
        onBulkPublish={(slugs) => bulkUpdateMutation.mutate({ slugs, status: "published" })}
        onBulkDraft={(slugs) => bulkUpdateMutation.mutate({ slugs, status: "draft" })}
        onBulkDelete={(slugs) => bulkDeleteMutation.mutate(slugs)}
        isLoading={bulkUpdateMutation.isPending || bulkDeleteMutation.isPending}
      />

      {isLoading ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead className="w-16">รูปปก</TableHead>
                <TableHead>หัวข้อ / ผู้เขียน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>วันที่อัปเดต</TableHead>
                <TableHead>การกระทำ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-12 w-16 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><div className="flex gap-2"><Skeleton className="h-9 w-9" /><Skeleton className="h-9 w-9" /><Skeleton className="h-9 w-9" /></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === paginatedArticles.length && paginatedArticles.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-20">รูปปก</TableHead>
                  <TableHead className="w-[30%]">หัวข้อ / ผู้เขียน</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead>ปักหมุด</TableHead>
                  <TableHead>วันที่อัปเดต</TableHead>
                  <TableHead className="text-right">การกระทำ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedArticles && paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(article.slug)}
                          onCheckedChange={(checked) => handleSelectItem(article.slug, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <img
                          src={article.cover_image_url || article.image_url || "/placeholder.svg"}
                          alt={article.title}
                          className="w-16 h-12 object-cover rounded border"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-2">{article.title}</p>
                          <p className="text-sm text-muted-foreground">โดย Admin</p>
                          {article.excerpt && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{article.excerpt}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ArticleStatusToggle
                          articleSlug={article.slug}
                          currentStatus={article.status}
                        />
                      </TableCell>
                      <TableCell>{article.category || '-'}</TableCell>
                      <TableCell>
                        <ArticlePinToggle
                          articleSlug={article.slug}
                          isPinned={article.is_pinned_on_hub || false}
                        />
                      </TableCell>
                      <TableCell>{format(new Date(article.updated_at), 'dd MMM yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/articles/${article.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/articles/${article.slug}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
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
                    <TableCell colSpan={8} className="h-24 text-center">
                      {searchQuery || statusFilter !== "all" || categoryFilter !== "all" ? 
                        "ไม่พบบทความที่ตรงกับเงื่อนไขการค้นหา" : 
                        "ยังไม่มีบทความ"
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Summary Information */}
      {filteredArticles && (
        <div className="mt-4 text-sm text-muted-foreground">
          แสดง {paginatedArticles.length} จาก {filteredArticles.length} รายการ
          {searchQuery && ` | ค้นหา: "${searchQuery}"`}
          {statusFilter !== "all" && ` | สถานะ: ${statusFilter === "published" ? "เผยแพร่" : "แบบร่าง"}`}
          {categoryFilter !== "all" && ` | หมวดหมู่: ${categoryFilter}`}
        </div>
      )}
    </div>
  );
};

export default AdminArticlesPage;
