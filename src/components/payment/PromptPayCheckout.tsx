
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PromptPayCheckoutProps {
  productIds: string[];
  totalAmount: number;
  onSuccess?: () => void;
}

const PromptPayCheckout: React.FC<PromptPayCheckoutProps> = ({
  productIds,
  totalAmount,
  onSuccess
}) => {
  const { user } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'checking' | 'completed'>('idle');

  const generatePromptPayQR = async () => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน');
      return;
    }

    setIsLoading(true);
    try {
      // เรียก edge function เพื่อสร้าง PromptPay QR Code
      const { data, error } = await supabase.functions.invoke('create-promptpay-payment', {
        body: {
          product_ids: productIds,
          amount: totalAmount
        }
      });

      if (error) throw error;

      setQrCodeUrl(data.qr_code);
      setOrderId(data.payment_ref);
      setPaymentStatus('pending');
      
      toast.success('สร้าง QR Code สำเร็จ กรุณาสแกนเพื่อชำระเงิน');
    } catch (error: any) {
      console.error('Error creating PromptPay payment:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้าง QR Code');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId) return;

    setPaymentStatus('checking');
    try {
      // เรียก edge function เพื่อตรวจสอบสถานะการชำระเงิน
      const { data, error } = await supabase.functions.invoke('check-promptpay-status', {
        body: { payment_ref: orderId }
      });

      if (error) throw error;

      if (data.status === 'completed') {
        setPaymentStatus('completed');
        toast.success('ชำระเงินสำเร็จแล้ว!');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.info('ยังไม่พบการชำระเงิน กรุณารอสักครู่');
        setPaymentStatus('pending');
      }
    } catch (error: any) {
      console.error('Error checking payment status:', error);
      toast.error('เกิดข้อผิดพลาดในการตรวจสอบสถานะ');
      setPaymentStatus('pending');
    }
  };

  if (paymentStatus === 'completed') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-green-700">ชำระเงินสำเร็จ!</CardTitle>
          <CardDescription>
            การชำระเงินของคุณได้รับการยืนยันแล้ว
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-gray-600">
            หมายเลขออเดอร์: {orderId}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {paymentStatus === 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              ชำระเงินผ่าน PromptPay
            </CardTitle>
            <CardDescription>
              ชำระเงินอย่างรวดเร็วและปลอดภัยผ่าน QR Code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">ยอดรวมที่ต้องชำระ</h4>
                <p className="text-2xl font-bold text-blue-700">
                  {totalAmount.toLocaleString()} บาท
                </p>
              </div>

              <Button 
                onClick={generatePromptPayQR}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'กำลังสร้าง QR Code...' : 'สร้าง QR Code สำหรับชำระเงิน'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentStatus === 'pending' && qrCodeUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">สแกน QR Code เพื่อชำระเงิน</CardTitle>
            <CardDescription className="text-center">
              กรุณาสแกน QR Code นี้ด้วยแอปธนาคารของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <img 
                  src={qrCodeUrl} 
                  alt="PromptPay QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-800 font-semibold">ยอดเงิน: {totalAmount.toLocaleString()} บาท</p>
                <p className="text-green-700 text-sm">หมายเลขออเดอร์: {orderId}</p>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  QR Code นี้จะหมดอายุใน 15 นาที หลังจากชำระเงินแล้ว กรุณากดปุ่ม "ตรวจสอบการชำระเงิน"
                </AlertDescription>
              </Alert>

              <Button 
                onClick={checkPaymentStatus}
                disabled={paymentStatus === 'checking'}
                className="w-full"
                variant="outline"
              >
                {paymentStatus === 'checking' ? 'กำลังตรวจสอบ...' : 'ตรวจสอบการชำระเงิน'}
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">วิธีการชำระเงิน:</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. เปิดแอปธนาคารหรือแอปกระเป๋าเงินอิเล็กทรอนิกส์</li>
                <li>2. เลือกเมนู "สแกน QR" หรือ "PromptPay"</li>
                <li>3. สแกน QR Code ด้านบน</li>
                <li>4. ตรวจสอบข้อมูลและยืนยันการโอน</li>
                <li>5. กดปุ่ม "ตรวจสอบการชำระเงิน" หลังโอนเงินแล้ว</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptPayCheckout;
