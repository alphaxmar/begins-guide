
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import BankTransferInfo from './BankTransferInfo';

interface BankTransferCheckoutProps {
  productIds: string[];
  totalAmount: number;
  onSuccess?: () => void;
}

const BankTransferCheckout: React.FC<BankTransferCheckoutProps> = ({
  productIds,
  totalAmount,
  onSuccess
}) => {
  const { user } = useAuth();
  const [orderId, setOrderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTransferInfo, setShowTransferInfo] = useState(false);

  const createOrder = async () => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน');
      return;
    }

    setIsLoading(true);
    try {
      // สร้างคำสั่งซื้อ
      const { data, error } = await supabase.functions.invoke('create-bank-transfer-order', {
        body: {
          product_ids: productIds,
          amount: totalAmount
        }
      });

      if (error) throw error;

      setOrderId(data.order_id);
      setShowTransferInfo(true);
      toast.success('สร้างคำสั่งซื้อสำเร็จ กรุณาโอนเงินตามข้อมูลด้านล่าง');
    } catch (error: any) {
      console.error('Error creating bank transfer order:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
    } finally {
      setIsLoading(false);
    }
  };

  if (showTransferInfo && orderId) {
    return (
      <div className="space-y-6">
        <BankTransferInfo amount={totalAmount} orderId={orderId} />
        
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            หลังจากโอนเงินแล้ว เราจะตรวจสอบการชำระเงินและอัปเดตสถานะภายใน 1-3 ชั่วโมงทำการ
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowTransferInfo(false)}
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
          <Building2 className="h-5 w-5" />
          โอนเงินผ่านธนาคาร
        </CardTitle>
        <CardDescription>
          โอนเงินแล้วแจ้งผ่านระบบ ไม่มีค่าธรรมเนียม
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">ยอดรวมที่ต้องชำระ</h4>
          <p className="text-2xl font-bold text-blue-700">
            {totalAmount.toLocaleString()} บาท
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">ข้อดีของการโอนธนาคาร:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• ไม่มีค่าธรรมเนียมเพิ่มเติม</li>
            <li>• ปลอดภัยและเชื่อถือได้</li>
            <li>• สามารถโอนจากธนาคารใดก็ได้</li>
            <li>• มีหลักฐานการโอนชัดเจน</li>
          </ul>
        </div>

        <Button 
          onClick={createOrder}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'กำลังสร้างคำสั่งซื้อ...' : 'แสดงข้อมูลการโอนเงิน'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          หลังจากกดปุ่มแล้ว จะแสดงข้อมูลบัญชีและหมายเลขออเดอร์สำหรับการโอน
        </p>
      </CardContent>
    </Card>
  );
};

export default BankTransferCheckout;
