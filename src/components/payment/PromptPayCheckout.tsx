
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentSettings } from '@/hooks/usePaymentSettings';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PromptPayQR from './PromptPayQR';

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
  const { settings, isLoading: settingsLoading } = usePaymentSettings();
  const [orderId, setOrderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const createPromptPayOrder = async () => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน');
      return;
    }

    if (!settings.promptpay_number) {
      toast.error('ยังไม่มีการตั้งค่าหมายเลข PromptPay');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-promptpay-payment', {
        body: {
          product_ids: productIds,
          amount: totalAmount
        }
      });

      if (error) throw error;

      setOrderId(data.payment_ref);
      setShowQR(true);
      toast.success('สร้าง QR Code สำเร็จ กรุณาชำระเงินตามจำนวนที่กำหนด');
    } catch (error: any) {
      console.error('Error creating PromptPay payment:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้าง QR Code');
    } finally {
      setIsLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            กำลังโหลดข้อมูลการชำระเงิน...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showQR && orderId) {
    return (
      <div className="space-y-6">
        <PromptPayQR 
          amount={totalAmount} 
          orderId={orderId}
          promptPayNumber={settings.promptpay_number || ''}
        />
        
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            หลังจากชำระเงินแล้ว ระบบจะตรวจสอบการชำระเงินโดยอัตโนมัติภายใน 1-3 ชั่วโมงทำการ
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowQR(false)}
          >
            เลือกวิธีการชำระเงินอื่น
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          PromptPay QR Code
        </CardTitle>
        <CardDescription>
          ชำระเงินผ่าน QR Code ด้วยแอปธนาคาร รวดเร็วและปลอดภัย
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">ยอดรวมที่ต้องชำระ</h4>
          <p className="text-2xl font-bold text-blue-700">
            {totalAmount.toLocaleString()} บาท
          </p>
        </div>

        {settings.promptpay_number && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">หมายเลข PromptPay</h4>
            <div className="flex items-center justify-between">
              <p className="font-mono text-green-700">{settings.promptpay_number}</p>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(settings.promptpay_number || '');
                  toast.success('คัดลอกหมายเลข PromptPay แล้ว');
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">ข้อดีของ PromptPay:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• ไม่มีค่าธรรมเนียม</li>
            <li>• รับเงินทันที</li>
            <li>• ปลอดภัยและเชื่อถือได้</li>
            <li>• ใช้ได้กับทุกธนาคาร</li>
          </ul>
        </div>

        <Button 
          onClick={createPromptPayOrder}
          disabled={isLoading || !settings.promptpay_number}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังสร้าง QR Code...
            </>
          ) : (
            <>
              <QrCode className="mr-2 h-4 w-4" />
              สร้าง QR Code สำหรับชำระเงิน
            </>
          )}
        </Button>

        {!settings.promptpay_number && (
          <Alert>
            <AlertDescription>
              ยังไม่มีการตั้งค่าหมายเลข PromptPay กรุณาติดต่อผู้ดูแลระบบ
            </AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground text-center">
          หลังจากกดปุ่มแล้ว จะแสดง QR Code สำหรับสแกนชำระเงิน
        </p>
      </CardContent>
    </Card>
  );
};

export default PromptPayCheckout;
