
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId) {
        toast.error("ไม่พบข้อมูลการชำระเงิน");
        setProcessing(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('process-payment', {
          body: { sessionId }
        });

        if (error) throw error;

        if (data?.success) {
          setSuccess(true);
          toast.success("ชำระเงินสำเร็จ! คุณสามารถเข้าถึงสินค้าที่ซื้อได้แล้ว");
        } else {
          throw new Error("การยืนยันการชำระเงินไม่สำเร็จ");
        }
      } catch (err: any) {
        console.error("Payment processing error:", err);
        toast.error(err?.message || "เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [sessionId]);

  if (processing) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">กำลังประมวลผลการชำระเงิน</h2>
              <p className="text-muted-foreground">กรุณารอสักครู่...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!success) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-xl">✕</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">การชำระเงินไม่สำเร็จ</h2>
              <p className="text-muted-foreground mb-4">เกิดข้อผิดพลาดในการประมวลผลการชำระเงิน</p>
              <Button asChild>
                <Link to="/cart">กลับไปยังตะกร้าสินค้า</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">ชำระเงินสำเร็จ!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            ขอบคุณสำหรับการสั่งซื้อ คุณสามารถเข้าถึงสินค้าที่ซื้อได้แล้ว
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/profile">
                <Package className="mr-2 h-4 w-4" />
                ดูสินค้าของฉัน
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/products">
                <ArrowRight className="mr-2 h-4 w-4" />
                เลือกซื้อสินค้าเพิ่มเติม
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccessPage;
