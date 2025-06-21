
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { X, ShoppingCart, Gift, Download, BookOpen } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const CartPage = () => {
  const { cartItems, removeFromCart, itemCount, getFreeItems, getPaidItems, getPaidTotal, hasFreeItems, hasPaidItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const freeItems = getFreeItems();
  const paidItems = getPaidItems();
  const paidTotal = getPaidTotal();

  // Mutation for claiming all free products
  const claimFreeProductsMutation = useMutation({
    mutationFn: async (productIds: string[]) => {
      if (!user) throw new Error("User not authenticated");

      // Insert all free products at once
      const insertData = productIds.map(productId => ({
        user_id: user.id,
        product_id: productId,
      }));

      const { error } = await supabase
        .from("user_purchases")
        .insert(insertData);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`รับสินค้าฟรี ${freeItems.length} รายการสำเร็จ!`);
      // Remove free items from cart
      freeItems.forEach(item => removeFromCart(item.id));
      queryClient.invalidateQueries({ queryKey: ["purchased_products"] });
      queryClient.invalidateQueries({ queryKey: ["advancedPurchaseStatus"] });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast.success("คุณได้รับสินค้าฟรีเหล่านี้แล้ว!");
        freeItems.forEach(item => removeFromCart(item.id));
      } else {
        toast.error("เกิดข้อผิดพลาด: " + error.message);
      }
    },
  });

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    navigate("/checkout");
  };

  const handleClaimFreeItems = () => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    const freeProductIds = freeItems.map(item => item.id);
    claimFreeProductsMutation.mutate(freeProductIds);
  };

  if (itemCount === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">ตะกร้าสินค้าของคุณว่างเปล่า</h1>
        <p className="text-muted-foreground mb-6">ดูเหมือนว่าคุณยังไม่ได้เพิ่มสินค้าใดๆ ลงในตะกร้า</p>
        <Button asChild>
          <Link to="/products">เลือกชมสินค้า</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">ตะกร้าสินค้าของคุณ</h1>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
          {/* Free Items Section */}
          {hasFreeItems && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gift className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-green-600">สินค้าฟรี</h2>
              </div>
              <div className="space-y-4">
                {freeItems.map((item) => (
                  <Card key={item.id} className="flex items-center p-4 border-green-200 bg-green-50">
                    <img src={item.image_url || '/placeholder.svg'} alt={item.title} className="w-24 h-24 object-cover rounded-md mr-4" />
                    <div className="flex-grow">
                      <h2 className="font-semibold">{item.title}</h2>
                      <p className="text-sm text-muted-foreground">{item.product_type === 'course' ? 'คอร์สออนไลน์' : 'เทมเพลต'}</p>
                      <p className="text-lg font-bold mt-2 text-green-600">ฟรี</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </Card>
                ))}
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={handleClaimFreeItems}
                  disabled={claimFreeProductsMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {claimFreeProductsMutation.isPending ? (
                    "กำลังดำเนินการ..."
                  ) : (
                    <>
                      <Gift className="mr-2 h-4 w-4" />
                      รับสินค้าฟรีทั้งหมด ({freeItems.length} รายการ)
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Separator if both free and paid items exist */}
          {hasFreeItems && hasPaidItems && <Separator className="my-6" />}

          {/* Paid Items Section */}
          {hasPaidItems && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-600">สินค้าที่ต้องชำระเงิน</h2>
              </div>
              <div className="space-y-4">
                {paidItems.map((item) => (
                  <Card key={item.id} className="flex items-center p-4">
                    <img src={item.image_url || '/placeholder.svg'} alt={item.title} className="w-24 h-24 object-cover rounded-md mr-4" />
                    <div className="flex-grow">
                      <h2 className="font-semibold">{item.title}</h2>
                      <p className="text-sm text-muted-foreground">{item.product_type === 'course' ? 'คอร์สออนไลน์' : 'เทมเพลต'}</p>
                      <p className="text-lg font-bold mt-2">{item.price.toLocaleString()} บาท</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="md:col-span-1 space-y-4">
          {hasFreeItems && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600">สินค้าฟรี</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <span>จำนวนสินค้าฟรี</span>
                  <span>{freeItems.length} รายการ</span>
                </div>
              </CardContent>
            </Card>
          )}

          {hasPaidItems && (
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>สรุปรายการสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>ราคารวม ({paidItems.length} ชิ้น)</span>
                  <span>{paidTotal.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>ยอดรวมสุทธิ</span>
                  <span>{paidTotal.toLocaleString()} บาท</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  ดำเนินการชำระเงิน
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
