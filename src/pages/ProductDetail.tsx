import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, BookOpen, Loader2, Zap } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseAccess } from "@/hooks/useCourseAccess";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const fetchProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useQuery<Tables<'products'> | null>({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  const { hasAccess, isLoading: isAccessLoading, isError: isAccessError } = useCourseAccess(
    product?.product_type === 'course' ? product.id : undefined
  );

  const buyNowMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        toast.info("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
        navigate("/auth", { replace: true });
        throw new Error("User not authenticated");
      }
      const { error } = await supabase.rpc('create_order_for_current_user', { product_ids: [productId] });
      if (error) {
        throw new Error(`เกิดข้อผิดพลาดในการสั่งซื้อ: ${error.message}`);
      }
      return productId;
    },
    onSuccess: (productId) => {
      toast.success("สั่งซื้อสินค้าสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["purchaseStatus", user?.id, productId] });
      queryClient.invalidateQueries({ queryKey: ["purchased_products", user?.id] });
    },
    onError: (error: Error) => {
      if (error.message !== "User not authenticated") {
        toast.error(error.message);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="py-12 grid md:grid-cols-2 gap-12">
        <div>
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-12 w-full md:w-1/2 mt-4" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h2>
        <p className="text-muted-foreground mb-8">สินค้าที่คุณกำลังมองหาอาจไม่มีอยู่จริง</p>
        <Button asChild>
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารวมสินค้า
          </Link>
        </Button>
      </div>
    );
  }

  const purchaseButtons = (
    <>
      <Button
        size="lg"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => addToCart(product)}
        disabled={buyNowMutation.isPending}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        เพิ่มลงตะกร้า
      </Button>
      <Button
        size="lg"
        className="w-full sm:w-auto"
        onClick={() => buyNowMutation.mutate(product.id)}
        disabled={buyNowMutation.isPending}
      >
        {buyNowMutation.isPending ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Zap className="mr-2 h-5 w-5" />
        )}
        {buyNowMutation.isPending ? 'กำลังดำเนินการ...' : 'ซื้อเลย'}
      </Button>
    </>
  );

  return (
    <div className="py-12">
       <Button variant="ghost" asChild className="mb-4 -ml-4">
         <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารวมสินค้า
         </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          )}
        </div>
        <div className="space-y-6">
          <Badge variant={product.product_type === 'course' ? 'default' : 'secondary'} className="w-fit">
            {product.product_type === 'course' ? 'คอร์สออนไลน์' : 'เทมเพลต'}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
          <p className="text-lg text-muted-foreground">{product.description}</p>
          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-bold text-primary">{product.price.toLocaleString()} บาท</p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            {product.product_type === 'course' ? (
              <>
                {isAccessLoading ? (
                  <Button size="lg" className="w-full sm:w-auto" disabled>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    กำลังตรวจสอบ...
                  </Button>
                ) : hasAccess && !isAccessError ? (
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link to={`/courses/${product.slug}/learn`}>
                      <BookOpen className="mr-2 h-5 w-5" />
                      เข้าสู่บทเรียน
                    </Link>
                  </Button>
                ) : (
                  purchaseButtons
                )}
              </>
            ) : (
              purchaseButtons
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
