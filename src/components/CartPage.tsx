
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { X, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import StripeCheckoutButton from "@/components/payment/StripeCheckoutButton";

const CartPage = () => {
  const { cartItems, removeFromCart, cartTotal, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCheckout = () => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    navigate("/checkout");
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
            <CardFooter className="flex flex-col gap-2">
              <Button size="lg" className="w-full" onClick={handleCheckout}>
                ดำเนินการชำระเงิน
              </Button>
              <StripeCheckoutButton
                amount={cartTotal}
                className="w-full"
                onSuccess={() => {
                  // Stripe จะ redirect ไปยัง success page
                }}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
