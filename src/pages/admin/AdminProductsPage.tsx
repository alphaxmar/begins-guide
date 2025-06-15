
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const fetchProducts = async () => {
  // RLS is handled by Supabase, so only admins will get data
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const AdminProductsPage = () => {
  const queryClient = useQueryClient();
  const { data: products, isLoading, isError, error } = useQuery<Tables<'products'>[]>({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
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

  const handleDelete = (id: string) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) {
        deleteProductMutation.mutate(id);
    }
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

      {isLoading ? (
          <div className="rounded-md border">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="w-[80px] hidden sm:table-cell">รูปภาพ</TableHead>
                          <TableHead>ชื่อสินค้า</TableHead>
                          <TableHead>ประเภท</TableHead>
                          <TableHead>ราคา</TableHead>
                          <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                              <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                              <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </div>
      ) : isError ? (
        <p className="text-red-500">เกิดข้อผิดพลาด: {error?.message}</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">รูปภาพ</TableHead>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>ประเภท</TableHead>
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
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>
                      <Badge variant={product.product_type === 'course' ? 'default' : 'secondary'}>
                        {product.product_type === 'course' ? 'คอร์ส' : 'เทมเพลต'}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.price.toLocaleString()} บาท</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/products/${product.slug}/edit`}>แก้ไข</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    ยังไม่มีสินค้าในระบบ
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

export default AdminProductsPage;
