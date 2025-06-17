import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Search, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";

const fetchProducts = async (searchQuery?: string, typeFilter?: "course" | "template", statusFilter?: string) => {
  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  if (typeFilter) {
    query = query.eq("product_type", typeFilter);
  }

  // Note: เมื่อมีการเพิ่ม status field ในอนาคต จะใช้ filter นี้
  // if (statusFilter && statusFilter !== "all") {
  //   query = query.eq("status", statusFilter);
  // }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const AdminProductsPage = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "course" | "template">("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: products, isLoading, isError, error } = useQuery<Tables<'products'>[]>({
    queryKey: ["admin-products", searchQuery, typeFilter, statusFilter],
    queryFn: () => fetchProducts(
      searchQuery, 
      typeFilter === "all" ? undefined : typeFilter, 
      statusFilter
    ),
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      // ลบไฟล์ที่เกี่ยวข้องก่อน
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

      // ลบข้อมูลในฐานข้อมูล
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("ลบสินค้าเรียบร้อยแล้ว");
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Query จะรีเฟรชอัตโนมัติเมื่อ searchQuery เปลี่ยน
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">จัดการสินค้า</h1>
          <p className="text-muted-foreground">จัดการคอร์สและเทมเพลตทั้งหมดในระบบ</p>
        </div>
        <Button asChild>
          <Link to="/admin/products/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            สร้างสินค้าใหม่
          </Link>
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
          <Select value={typeFilter} onValueChange={(value: "all" | "course" | "template") => setTypeFilter(value)}>
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

          {/* เตรียมไว้สำหรับ status filter ในอนาคต */}
          {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="published">เผยแพร่</SelectItem>
              <SelectItem value="draft">ร่าง</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden sm:table-cell">รูปภาพ</TableHead>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>เจ้าของ</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">รูปภาพ</TableHead>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>เจ้าของ</TableHead>
                <TableHead>ราคา</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
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
                        <p className="text-sm text-muted-foreground">/{product.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.product_type === 'course' ? 'default' : 'secondary'}>
                        {product.product_type === 'course' ? 'คอร์ส' : 'เทมเพลต'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {product.instructor_id ? 'Partner' : 'Admin'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{product.price.toLocaleString()} บาท</span>
                    </TableCell>
                    <TableCell>
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
                              ดูหน้าสินค้า
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/products/${product.slug}/edit`}>
                              แก้ไขสินค้า
                            </Link>
                          </DropdownMenuItem>
                          {product.product_type === 'course' && (
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/products/${product.slug}/lessons`}>
                                จัดการบทเรียน
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product.id, product.title)} 
                            className="text-red-500 focus:text-red-500 focus:bg-red-50"
                          >
                            ลบสินค้า
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    {searchQuery || typeFilter !== "all" ? 
                      "ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา" : 
                      "ยังไม่มีสินค้าในระบบ"
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Summary Information */}
      {products && products.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          แสดง {products.length} รายการ
          {searchQuery && ` จากการค้นหา "${searchQuery}"`}
          {typeFilter !== "all" && ` ประเภท "${typeFilter === 'course' ? 'คอร์ส' : 'เทมเพลต'}"`}
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
