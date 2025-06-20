
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OmiseCheckoutButtonProps {
  productIds: string[];
  amount: number;
  className?: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    OmiseCard: any;
  }
}

const OmiseCheckoutButton = ({ 
  productIds, 
  amount, 
  className = "", 
  children,
  onSuccess 
}: OmiseCheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleOmisePayment = async () => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      return;
    }

    setLoading(true);
    
    try {
      // สร้าง order ก่อน
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-omise-order',
        {
          body: { product_ids: productIds }
        }
      );

      if (orderError) throw orderError;

      // เปิด Omise Card form
      window.OmiseCard.open({
        amount: amount * 100, // Convert to satang
        currency: 'THB',
        defaultPaymentMethod: 'credit_card',
        otherPaymentMethods: ['promptpay'],
        onCreateTokenSuccess: async (token: string) => {
          try {
            // ส่ง token ไปประมวลผลการชำระเงิน
            const { data, error } = await supabase.functions.invoke(
              'process-omise-payment',
              {
                body: {
                  token,
                  order_id: orderData.order_id,
                  amount: amount * 100
                }
              }
            );

            if (error) throw error;

            toast.success("การชำระเงินสำเร็จ!");
            onSuccess?.();
          } catch (error: any) {
            console.error('Payment processing error:', error);
            toast.error("เกิดข้อผิดพลาดในการประมวลผลการชำระเงิน");
          }
        },
        onFormClosed: () => {
          setLoading(false);
        }
      });
    } catch (error: any) {
      console.error('Omise payment error:', error);
      toast.error("เกิดข้อผิดพลาดในการเปิดหน้าชำระเงิน");
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleOmisePayment}
      disabled={loading || !user}
      className={className}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          กำลังประมวลผล...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          {children || "ชำระเงินด้วย Omise"}
        </>
      )}
    </Button>
  );
};

export default OmiseCheckoutButton;
