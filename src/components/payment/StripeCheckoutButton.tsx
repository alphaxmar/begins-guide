
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";

interface StripeCheckoutButtonProps {
  productIds?: string[];
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const StripeCheckoutButton = ({ 
  productIds, 
  amount, 
  onSuccess, 
  onError,
  className = ""
}: StripeCheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { getPaidItems, removeFromCart } = useCart();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน");
      return;
    }

    // Use provided productIds or get paid items from cart
    const idsToUse = productIds || getPaidItems().map(item => item.id);
    
    if (idsToUse.length === 0) {
      toast.error("ไม่มีสินค้าที่ต้องชำระเงิน");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: { productIds: idsToUse }
      });

      if (error) throw error;

      if (data?.url) {
        // เปิด Stripe checkout ในแท็บใหม่
        window.open(data.url, '_blank');
        
        // ถ้าเป็นการซื้อจากตะกร้า ให้ลบเฉพาะสินค้าที่ต้องชำระเงิน
        if (!productIds) {
          const paidItems = getPaidItems();
          paidItems.forEach(item => removeFromCart(item.id));
        }
        
        onSuccess?.();
      } else {
        throw new Error("ไม่ได้รับ URL สำหรับการชำระเงิน");
      }
    } catch (err: any) {
      console.error("Stripe checkout error:", err);
      const errorMessage = err?.message || "เกิดข้อผิดพลาดในการสร้างการชำระเงิน";
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || amount <= 0}
      className={`w-full ${className}`}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          กำลังดำเนินการ...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          ชำระเงิน {amount.toLocaleString()} บาท
        </>
      )}
    </Button>
  );
};

export default StripeCheckoutButton;
