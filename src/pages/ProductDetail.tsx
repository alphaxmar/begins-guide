
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, BookOpen, Loader2, Crown } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useAdvancedCourseAccess } from "@/hooks/useAdvancedCourseAccess";
import { useCart } from "@/contexts/CartContext";
import PaymentOptions from "@/components/payment/PaymentOptions";
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

  const { hasAccess, isLoading: isAccessLoading, isError: isAccessError, accessType, isVip } = useAdvancedCourseAccess(
    product?.product_type === 'course' ? product.id : undefined
  );

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

  const handlePaymentSuccess = () => {
    toast.success("การชำระเงินสำเร็จ!");
    queryClient.invalidateQueries({ queryKey: ["purchased_products"] });
    navigate("/profile");
  };

  const purchaseButtons = (
    <div className="space-y-4">
      <Button
        size="lg"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => addToCart(product)}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        เพิ่มลงตะกร้า
      </Button>
      
      <div className="w-full">
        <PaymentOptions
          productIds={[product.id]}
          amount={product.price}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    </div>
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
          <div className="flex items-center gap-2">
            <Badge variant={product.product_type === 'course' ? 'default' : 'secondary'} className="w-fit">
              {product.product_type === 'course' ? 'คอร์สออนไลน์' : 'เทมเพลต'}
            </Badge>
            {isVip && (
              <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Crown className="mr-1 h-3 w-3" />
                VIP Access
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
          <p className="text-lg text-muted-foreground">{product.description}</p>
          <div className="flex items-baseline gap-4">
            {isVip ? (
              <div className="space-y-2">
                <p className="text-4xl font-bold text-green-600">ฟรี สำหรับ VIP</p>
                <p className="text-sm text-muted-foreground line-through">
                  ราคาปกติ {product.price.toLocaleString()} บาท
                </p>
              </div>
            ) : (
              <p className="text-4xl font-bold text-primary">{product.price.toLocaleString()} บาท</p>
            )}
          </div>
          <div className="space-y-4">
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
                  <>
                    {!isVip && purchaseButtons}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">สำหรับสมาชิก VIP</span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        สมาชิก VIP สามารถเข้าถึงคอร์สนี้และคอร์สอื่นๆ ทั้งหมดได้ฟรี รวมถึงไฟล์ดาวน์โหลดทั้งหมด
                      </p>
                    </div>
                  </>
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
