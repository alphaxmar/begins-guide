
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Smartphone, Copy, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PromptPayCheckoutProps {
  productIds: string[];
  amount: number;
  onSuccess?: () => void;
}

const PromptPayCheckout = ({ productIds, amount, onSuccess }: PromptPayCheckoutProps) => {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string>("");
  const { user } = useAuth();

  const generatePromptPayQR = async () => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-promptpay-payment',
        {
          body: {
            product_ids: productIds,
            amount: amount
          }
        }
      );

      if (error) throw error;

      setQrCode(data.qr_code);
      setPaymentRef(data.payment_ref);
      
      // เริ่มการตรวจสอบสถานะการชำระเงิน
      checkPaymentStatus(data.payment_ref);
    } catch (error: any) {
      console.error('PromptPay generation error:', error);
      toast.error("เกิดข้อผิดพลาดในการสร้าง QR Code");
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (ref: string) => {
    const checkInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          'check-promptpay-status',
          {
            body: { payment_ref: ref }
          }
        );

        if (error) throw error;

        if (data.status === 'completed') {
          clearInterval(checkInterval);
          setLoading(false);
          toast.success("การชำระเงินสำเร็จ!");
          onSuccess?.();
        } else if (data.status === 'failed') {
          clearInterval(checkInterval);
          setLoading(false);
          toast.error("การชำระเงินไม่สำเร็จ");
        }
      } catch (error) {
        console.error('Payment status check error:', error);
      }
    }, 3000); // ตรวจสอบทุก 3 วินาที

    // หยุดตรวจสอบหลัง 10 นาที
    setTimeout(() => {
      clearInterval(checkInterval);
      if (loading) {
        setLoading(false);
        toast.error("หมดเวลาการชำระเงิน กรุณาลองใหม่");
      }
    }, 600000);
  };

  const copyPaymentRef = () => {
    navigator.clipboard.writeText(paymentRef);
    toast.success("คัดลอกหมายเลขอ้างอิงแล้ว");
  };

  if (qrCode) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Smartphone className="h-5 w-5" />
            สแกน QR Code เพื่อชำระเงิน
          </CardTitle>
          <CardDescription>
            ใช้แอปธนาคารที่รองรับ PromptPay สแกน QR Code ด้านล่าง
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <img src={qrCode} alt="PromptPay QR Code" className="w-48 h-48" />
          </div>
          
          <div className="text-center space-y-2">
            <p className="font-semibold text-lg">จำนวนเงิน: {amount.toLocaleString()} บาท</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">หมายเลขอ้างอิง: {paymentRef}</span>
              <Button variant="ghost" size="sm" onClick={copyPaymentRef}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">รอการยืนยันการชำระเงิน...</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      onClick={generatePromptPayQR}
      disabled={loading || !user}
      className="w-full"
      size="lg"
      variant="outline"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          กำลังสร้าง QR Code...
        </>
      ) : (
        <>
          <Smartphone className="mr-2 h-5 w-5" />
          ชำระเงินด้วย PromptPay
        </>
      )}
    </Button>
  );
};

export default PromptPayCheckout;
