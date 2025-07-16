import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, BookOpen, Loader2, Crown, Download, Star, Users, Clock, Check } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useAdvancedCourseAccess } from "@/hooks/useAdvancedCourseAccess";
import { useCart } from "@/contexts/CartContext";
import PaymentOptions from "@/components/payment/PaymentOptions";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  // Mutation for claiming free products
  const claimFreeProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("user_purchases")
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("รับสินค้าฟรีสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["purchased_products"] });
      queryClient.invalidateQueries({ queryKey: ["advancedPurchaseStatus"] });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.success("คุณได้รับสินค้านี้แล้ว!");
      } else {
        toast.error("เกิดข้อผิดพลาด: " + error.message);
      }
    },
  });

  const handlePaymentSuccess = () => {
    toast.success("การชำระเงินสำเร็จ!");
    queryClient.invalidateQueries({ queryKey: ["purchased_products"] });
    navigate("/profile");
  };

  const handleClaimFreeProduct = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    claimFreeProductMutation.mutate(product.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-2xl">❌</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">ไม่พบสินค้า</h2>
          <p className="text-muted-foreground mb-8 text-lg">สินค้าที่คุณกำลังมองหาอาจไม่มีอยู่จริง</p>
          <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-all duration-300">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้ารวมสินค้า
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isFree = product.price === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="hover:bg-white/50 transition-colors">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับไปหน้ารวมสินค้า
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Product Image & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <div className="relative group">
              <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-2xl bg-white">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">ไม่มีรูปภาพ</span>
                  </div>
                )}
              </div>
              
              {/* Floating badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge 
                  variant={product.product_type === 'course' ? 'default' : 'secondary'} 
                  className="shadow-lg backdrop-blur-sm bg-white/90 text-gray-800 border-0"
                >
                  {product.product_type === 'course' ? '🎓 คอร์สออนไลน์' : '📄 เทมเพลต'}
                </Badge>
                {isFree && (
                  <Badge className="shadow-lg backdrop-blur-sm bg-green-500 text-white border-0">
                    ✨ ฟรี
                  </Badge>
                )}
                {isVip && (
                  <Badge className="shadow-lg backdrop-blur-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Crown className="mr-1 h-3 w-3" />
                    VIP
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Details Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                      {product.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <span className="text-gray-600 ml-1">4.9</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>1,234 นักเรียน</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>อัพเดทล่าสุด: มีนาคม 2024</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>

                  {/* Features List */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">สิ่งที่คุณจะได้รับ:</h3>
                    <div className="grid gap-2">
                      {[
                        "เนื้อหาครบถ้วนทุกขั้นตอน",
                        "ไฟล์ดาวน์โหลดพร้อมใช้งาน",
                        "อัพเดทเนื้อหาตลอดชีวิต",
                        "ใบรับรองหลังจบคอร์ส",
                        "กลุ่มสนับสนุนเฉพาะสมาชิก"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VIP Info */}
                  {product.product_type === 'course' && !isVip && !isFree && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold text-yellow-800 text-lg">สำหรับสมาชิก VIP</span>
                      </div>
                      <p className="text-yellow-700 leading-relaxed">
                        สมาชิก VIP สามารถเข้าถึงคอร์สนี้และคอร์สอื่นๆ ทั้งหมดได้ฟรี รวมถึงไฟล์ดาวน์โหลดทั้งหมด
                        พร้อมสิทธิพิเศษมากมาย
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Payment Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  สั่งซื้อสินค้า
                </CardTitle>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Price Display */}
                  <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
                    {isFree ? (
                      <div>
                        <p className="text-5xl font-bold text-green-600 mb-2">ฟรี</p>
                        <p className="text-sm text-gray-500">ไม่มีค่าใช้จ่าย</p>
                      </div>
                    ) : isVip ? (
                      <div>
                        <p className="text-5xl font-bold text-green-600 mb-2">ฟรี</p>
                        <p className="text-sm text-gray-500">สำหรับสมาชิก VIP</p>
                        <p className="text-xs text-gray-400 line-through mt-1">
                          ราคาปกติ ฿{product.price.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-5xl font-bold text-blue-600 mb-2">
                          ฿{product.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">ราคาเต็ม ไม่มีค่าธรรมเนียมเพิ่มเติม</p>
                      </div>
                    )}
                  </div>

                  {/* Product Summary */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600">สินค้า</span>
                      <span className="text-sm font-semibold text-gray-900 text-right max-w-[200px]">
                        {product.title}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">ประเภท</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {product.product_type === 'course' ? 'คอร์สออนไลน์' : 'เทมเพลต'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>รวมทั้งหมด</span>
                      <span className="text-blue-600">
                        {isFree || isVip ? 'ฟรี' : `฿${product.price.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    {(() => {
                      // Free product logic
                      if (isFree) {
                        if (!user) {
                          return (
                            <Button 
                              size="lg" 
                              onClick={() => navigate("/auth")} 
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              เข้าสู่ระบบเพื่อรับฟรี
                            </Button>
                          );
                        }

                        if (product.product_type === 'course') {
                          if (hasAccess) {
                            return (
                              <Button size="lg" asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                <Link to={`/courses/${product.slug}/learn`}>
                                  <BookOpen className="mr-2 h-5 w-5" />
                                  เริ่มเรียนเลย
                                </Link>
                              </Button>
                            );
                          } else {
                            return (
                              <Button 
                                size="lg" 
                                onClick={handleClaimFreeProduct}
                                disabled={claimFreeProductMutation.isPending}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                {claimFreeProductMutation.isPending ? (
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                  <BookOpen className="mr-2 h-5 w-5" />
                                )}
                                รับคอร์สฟรี
                              </Button>
                            );
                          }
                        } else {
                          // Template product
                          if (hasAccess) {
                            return (
                              <Button 
                                size="lg" 
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                                onClick={() => {
                                  toast.success("ดาวน์โหลดเทมเพลตฟรี");
                                }}
                              >
                                <Download className="mr-2 h-5 w-5" />
                                ดาวน์โหลดเลย
                              </Button>
                            );
                          } else {
                            return (
                              <Button 
                                size="lg" 
                                onClick={handleClaimFreeProduct}
                                disabled={claimFreeProductMutation.isPending}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                {claimFreeProductMutation.isPending ? (
                                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                  <Download className="mr-2 h-5 w-5" />
                                )}
                                รับเทมเพลตฟรี
                              </Button>
                            );
                          }
                        }
                      }

                      // Paid product logic
                      if (product.product_type === 'course') {
                        if (isAccessLoading) {
                          return (
                            <Button size="lg" className="w-full" disabled>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              กำลังตรวจสอบ...
                            </Button>
                          );
                        } else if (hasAccess && !isAccessError) {
                          return (
                            <Button size="lg" asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                              <Link to={`/courses/${product.slug}/learn`}>
                                <BookOpen className="mr-2 h-5 w-5" />
                                เริ่มเรียนเลย
                              </Link>
                            </Button>
                          );
                        } else {
                          return (
                            <div className="space-y-4">
                              {!isVip && (
                                <>
                                  <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={() => addToCart(product)}
                                  >
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    เพิ่มลงตะกร้า
                                  </Button>
                                  
                                  <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                      <span className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                      <span className="bg-white px-4 text-gray-500 font-medium">หรือซื้อทันที</span>
                                    </div>
                                  </div>
                                  
                                  <PaymentOptions
                                    productIds={[product.id]}
                                    amount={product.price}
                                    onSuccess={handlePaymentSuccess}
                                  />
                                </>
                              )}
                            </div>
                          );
                        }
                      } else {
                        return (
                          <div className="space-y-4">
                            <Button
                              size="lg"
                              variant="outline"
                              className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={() => addToCart(product)}
                            >
                              <ShoppingCart className="mr-2 h-5 w-5" />
                              เพิ่มลงตะกร้า
                            </Button>
                            
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300" />
                              </div>
                              <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-gray-500 font-medium">หรือซื้อทันที</span>
                              </div>
                            </div>
                            
                            <PaymentOptions
                              productIds={[product.id]}
                              amount={product.price}
                              onSuccess={handlePaymentSuccess}
                            />
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* Security Badge */}
                  <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-2 w-2 text-white" />
                    </div>
                    การชำระเงินปลอดภัย 100%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
