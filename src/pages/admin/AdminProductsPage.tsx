
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Search, Filter, Edit, Eye, Trash2, Book, Upload, DownloadCloud, Archive, Copy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";

const PRODUCTS_PER_PAGE = 10;

interface ProductWithStats extends Tables<'products'> {
  total_sales?: number;
  total_buyers?: number;
  total_revenue?: number;
}

const fetchProducts = async (
  page: number,
  searchQuery?: string, 
  typeFilter?: "course" | "template", 
  statusFilter?: string,
  ownerFilter?: string,
  sortBy?: string,
  sortOrder?: "asc" | "desc"
) => {
  const offset = (page - 1) * PRODUCTS_PER_PAGE;
  
  let query = supabase
    .from("products")
    .select(`
      *,
      user_purchases!inner(count),
      order_items(quantity, price)
    `, { count: 'exact' })
    .range(offset, offset + PRODUCTS_PER_PAGE - 1);

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  if (typeFilter) {
    query = query.eq("product_type", typeFilter);
  }

  // Note: status filter will be implemented when status field is added
  // if (statusFilter && statusFilter !== "all") {
  //   query = query.eq("status", statusFilter);
  // }

  if (ownerFilter && ownerFilter !== "all") {
    if (ownerFilter === "admin") {
      query = query.is("instructor_id", null);
    } else {
      query = query.not("instructor_id", "is", null);
    }
  }

  // Sorting
  if (sortBy) {
    query = query.order(sortBy, { ascending: sortOrder === "asc" });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(error.message);
  }

  // Process data to include sales stats
  const productsWithStats = data?.map(product => ({
    ...product,
    total_buyers: product.user_purchases?.length || 0,
    total_revenue: product.order_items?.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0) || 0
  })) || [];

  return { products: productsWithStats, totalCount: count || 0 };
};

const AdminProductsPage = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "course" | "template">("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-products", currentPage, searchQuery, typeFilter, statusFilter, ownerFilter, sortBy, sortOrder],
    queryFn: () => fetchProducts(
      currentPage,
      searchQuery, 
      typeFilter === "all" ? undefined : typeFilter, 
      statusFilter,
      ownerFilter,
      sortBy,
      sortOrder
    ),
  });

  const { products = [], totalCount = 0 } = data || {};
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const product = products?.find(p => p.id === productId);
      if (product) {
        // ลบรูปภาพ
        if (product.image_url) {
          try {
            const imagePath = new URL(product.image_url).pathname.split('/product_images/')[1];
            if (imagePath) {
              await supabase.storage.from('product_images').remove([imagePath]);
            }
          } catch (e) {
            console.warn("Could not delete product image:", e);
          }
        }
        
        // ลบไฟล์เทมเพลต
        if (product.template_file_path) {
          await supabase.storage.from('product_files').remove([product.template_file_path]);
        }
      }

      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("ลบสินค้าเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setSelectedProducts([]);
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการลบสินค้า: ${error.message}`);
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      const { error } = await supabase.from('products').delete().in('id', productIds);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success(`ลบสินค้า ${selectedProducts.length} รายการเรียบร้อยแล้ว`);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setSelectedProducts([]);
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการลบสินค้า: ${error.message}`);
    }
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${title}"?\n\nการกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า ${selectedProducts.length} รายการ?\n\nการกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      bulkDeleteMutation.mutate(selectedProducts);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedProducts(checked ? products.map(p => p.id) : []);
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => 
      checked 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const getProductTypeBadge = (type: string) => {
    const variants = {
      course: { variant: "default" as const, label: "คอร์ส" },
      template: { variant: "secondary" as const, label: "เทมเพลต" }
    };
    const config = variants[type as keyof typeof variants] || variants.course;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const exportToCSV = () => {
    if (!products || products.length === 0) {
      toast.error("ไม่มีข้อมูลสำหรับส่งออก");
      return;
    }

    const csvHeaders = ["ชื่อสินค้า", "ประเภท", "เจ้าของ", "ราคา", "ยอดขาย", "ผู้ซื้อ", "รายได้รวม", "วันที่สร้าง"];
    const csvData = products.map(product => [
      product.title,
      product.product_type === 'course' ? 'คอร์ส' : 'เทมเพลต',
      product.instructor_id ? 'Partner' : 'Admin',
      product.price.toLocaleString(),
      product.total_buyers || 0,
      `${product.total_buyers || 0} คน`,
      `${(product.total_revenue || 0).toLocaleString()} บาท`,
      new Date(product.created_at).toLocaleDateString('th-TH')
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success("ส่งออกข้อมูลเรียบร้อยแล้ว");
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">จัดการสินค้า</h1>
          <p className="text-muted-foreground">ศูนย์กลางบัญชาการร้านค้า - จัดการคอร์สและเทมเพลตทั้งหมด</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <DownloadCloud className="mr-2 h-4 w-4" />
            ส่งออก CSV
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/products/import">
              <Upload className="mr-2 h-4 w-4" />
              นำเข้า CSV
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/products/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              สร้างสินค้าใหม่
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="ค้นหาจากชื่อสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={(value: "all" | "course" | "template") => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกประเภท</SelectItem>
                <SelectItem value="course">คอร์ส</SelectItem>
                <SelectItem value="template">เทมเพลต</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ownerFilter} onValueChange={(value) => {
              setOwnerFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="เจ้าของ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกคน</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <span className="text-sm font-medium">
              เลือกแล้ว {selectedProducts.length} รายการ
            </span>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                ลบรายการที่เลือก
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[80px] hidden sm:table-cell">รูปภาพ</TableHead>
                <TableHead>ชื่อสินค้า / เจ้าของ</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>ยอดขาย / ผู้ซื้อ</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>วันที่อัปเดต</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-500">เกิดข้อผิดพลาด: {error?.message}</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedProducts.length === products.length && products.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="hidden w-[100px] sm:table-cell">รูปภาพ</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("title")}
                  >
                    ชื่อสินค้า / เจ้าของ
                    {sortBy === "title" && (
                      <span className="ml-2">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("total_revenue")}
                  >
                    ยอดขาย / ผู้ซื้อ
                    {sortBy === "total_revenue" && (
                      <span className="ml-2">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("price")}
                  >
                    ราคา
                    {sortBy === "price" && (
                      <span className="ml-2">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("updated_at")}
                  >
                    วันที่อัปเดต
                    {sortBy === "updated_at" && (
                      <span className="ml-2">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt={product.title}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={product.image_url || "/placeholder.svg"}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-muted-foreground">
                            /{product.slug}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {product.instructor_id ? 'Partner' : 'Admin'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getProductTypeBadge(product.product_type)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-green-600">
                            {(product.total_revenue || 0).toLocaleString()} บาท
                          </div>
                          <div className="text-muted-foreground">
                            {product.total_buyers || 0} คน
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{product.price.toLocaleString()} บาท</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(product.updated_at).toLocaleDateString('th-TH')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* Quick Actions */}
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/products/${product.slug}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/products/${product.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          {product.product_type === 'course' && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link to={`/admin/products/${product.slug}/lessons`}>
                                <Book className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}

                          {/* More Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>การจัดการ</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link to={`/products/${product.slug}`} target="_blank">
                                  <Eye className="h-4 w-4 mr-2" />
                                  ดูหน้าสินค้า
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/products/${product.slug}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  แก้ไขสินค้า
                                </Link>
                              </DropdownMenuItem>
                              {product.product_type === 'course' && (
                                <DropdownMenuItem asChild>
                                  <Link to={`/admin/products/${product.slug}/lessons`}>
                                    <Book className="h-4 w-4 mr-2" />
                                    จัดการบทเรียน
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                สร้างสำเนา
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="h-4 w-4 mr-2" />
                                เก็บเข้าคลัง
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(product.id, product.title)} 
                                className="text-red-500 focus:text-red-500 focus:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                ลบสินค้า
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      {searchQuery || typeFilter !== "all" || ownerFilter !== "all" ? 
                        "ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา" : 
                        "ยังไม่มีสินค้าในระบบ"
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Summary Information */}
      {products && products.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          แสดง {products.length} จาก {totalCount} รายการ
          {searchQuery && ` จากการค้นหา "${searchQuery}"`}
          {typeFilter !== "all" && ` ประเภท "${typeFilter === 'course' ? 'คอร์ส' : 'เทมเพลต'}"`}
          {ownerFilter !== "all" && ` เจ้าของ "${ownerFilter === 'admin' ? 'Admin' : 'Partner'}"`}
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
