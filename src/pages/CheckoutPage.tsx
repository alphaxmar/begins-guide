
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import OmisePaymentForm from "@/components/payment/OmisePaymentForm";

const createOrder = async (productIds: string[]) => {
  const { data, error } = await supabase.rpc("create_order_for_current_user", {
    product_ids: productIds,
  });

  if (error) {
    throw new Error("เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ");
  }

  return data;
};

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState<string | null>(null);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (orderIdResult) => {
      setOrderId(orderIdResult);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      navigate("/cart");
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }

    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    // Create order when component mounts
    const productIds = cartItems.map((item) => item.id);
    createOrderMutation.mutate(productIds);

    // Load Omise script
    const script = document.createElement("script");
    script.src = "https://cdn.omise.co/omise.js";
    script.onload = () => {
      if (window.Omise) {
        window.Omise.setPublicKey(import.meta.env.VITE_OMISE_PUBLIC_KEY || "");
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [user, cartItems]);

  const handlePaymentSuccess = (chargeId: string) => {
    toast.success("ชำระเงินสำเร็จ! กำลังย้ายไปหน้าโปรไฟล์");
    clearCart();
    navigate("/profile");
  };

  const handlePaymentError = (error: string) => {
    toast.error(`ชำระเงินไม่สำเร็จ: ${error}`);
  };

  if (!user) {
    return null;
  }

  if (cartItems.length === 0) {
    return null;
  }

  if (createOrderMutation.isPending) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">กำลังสร้างคำสั่งซื้อ...</h1>
      </div>
    );
  }

  if (createOrderMutation.isError || !orderId) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
        <p className="text-muted-foreground mb-4">ไม่สามารถสร้างคำสั่งซื้อได้</p>
        <Button onClick={() => navigate("/cart")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปตะกร้าสินค้า
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate("/cart")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปตะกร้าสินค้า
        </Button>

        <h1 className="text-3xl font-bold mb-8">ชำระเงิน</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
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
                <div className="flex justify-between items-center text-lg font-bold pt-4">
                  <span>ยอดรวมทั้งหมด</span>
                  <span>{cartTotal.toLocaleString()} บาท</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <OmisePaymentForm
              amount={cartTotal}
              orderId={orderId}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
