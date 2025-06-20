
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import PaymentOptions from "@/components/payment/PaymentOptions";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }

    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }
  }, [user, cartItems]);

  if (!user) {
    return null;
  }

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate("/cart")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปตะกร้าสินค้า
        </Button>

        <h1 className="text-3xl font-bold mb-8">ชำระเงิน</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.product_type === 'course' ? 'คอร์สออนไลน์' : 'เทมเพลต'}
                      </p>
                    </div>
                    <span className="font-semibold">{item.price.toLocaleString()} บาท</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-lg font-bold pt-4 border-t">
                  <span>ยอดรวมทั้งหมด</span>
                  <span className="text-2xl text-green-600">{cartTotal.toLocaleString()} บาท</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div>
            <PaymentOptions
              productIds={cartItems.map(item => item.id)}
              amount={cartTotal}
              onSuccess={() => {
                navigate("/checkout-success");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
