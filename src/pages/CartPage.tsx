
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { X, ShoppingCart, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const createOrder = async (productIds: string[]) => {
  if (!productIds || productIds.length === 0) {
    throw new Error("ไม่มีสินค้าในตะกร้า");
  }
  const { data, error } = await supabase.rpc("create_order_for_current_user", {
    product_ids: productIds,
  });

  if (error) {
    console.error("Error creating order:", error);
    // แปลข้อความ error ที่ผู้ใช้พอจะเข้าใจได้
    if (error.message.includes("User must be authenticated")) {
      throw new Error("กรุณาเข้าสู่ระบบเพื่อดำเนินการสั่งซื้อ");
    }
    throw new Error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
  }

  return data;
};


const CartPage = () => {
  const { cartItems, removeFromCart, cartTotal, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast({
        title: "สั่งซื้อสำเร็จ!",
        description: "คุณสามารถเข้าดูสินค้าของคุณได้ที่หน้าโปรไฟล์",
      });
      clearCart();
      navigate("/profile");
    },
    onError: (error: Error) => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถดำเนินการสั่งซื้อได้",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "กรุณาเข้าสู่ระบบ",
        description: "คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถชำระเงินได้",
        variant: "destructive",
      });
      navigate("/auth", { state: { from: location } });
      return;
    }

    const productIds = cartItems.map((item) => item.id);
    mutation.mutate(productIds);
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
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
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
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>สรุปรายการสั่งซื้อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>ราคารวม ({itemCount} ชิ้น)</span>
                <span>{cartTotal.toLocaleString()} บาท</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>ยอดรวมสุทธิ</span>
                <span>{cartTotal.toLocaleString()} บาท</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full" onClick={handleCheckout} disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                ดำเนินการชำระเงิน
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
