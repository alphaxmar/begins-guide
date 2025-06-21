
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Building2, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePaymentSettings } from '@/hooks/usePaymentSettings';

interface BankTransferInfoProps {
  amount: number;
  orderId: string;
}

const BankTransferInfo: React.FC<BankTransferInfoProps> = ({
  amount,
  orderId
}) => {
  const { settings, isLoading } = usePaymentSettings();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`คัดลอก${label}แล้ว`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">กำลังโหลดข้อมูลการโอนเงิน...</div>
        </CardContent>
      </Card>
    );
  }

  // Use settings data or fallback to default values
  const bankInfo = {
    bankName: settings.bank_name || 'ธนาคารกรุงเทพ',
    accountNumber: settings.bank_account_number || '138-4-41680-4',
    accountName: settings.bank_account_name || 'รณยศ ตันติถาวรรัช',
    branch: settings.bank_branch || ''
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            ข้อมูลการโอนเงิน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">ยอดเงินที่ต้องโอน</h4>
                <p className="text-2xl font-bold text-blue-700">
                  {amount.toLocaleString()} บาท
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">หมายเลขออเดอร์</h4>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-green-700">{orderId.slice(0, 8)}</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(orderId.slice(0, 8), 'หมายเลขออเดอร์')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-white">
                <h4 className="font-semibold text-gray-800 mb-3">ข้อมูลบัญชีปลายทาง</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ธนาคาร:</span>
                    <span className="font-semibold">{bankInfo.bankName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">เลขที่บัญชี:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{bankInfo.accountNumber}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(bankInfo.accountNumber, 'เลขบัญชี')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ชื่อบัญชี:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{bankInfo.accountName}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(bankInfo.accountName, 'ชื่อบัญชี')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {bankInfo.branch && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">สาขา:</span>
                      <span className="font-semibold">{bankInfo.branch}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">จำนวนเงิน:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-600">{amount.toLocaleString()} บาท</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(amount.toString(), 'จำนวนเงิน')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800 mb-2">ขั้นตอนการโอนเงิน:</h4>
                <ol className="text-sm text-orange-700 space-y-1">
                  <li>1. โอนเงินตามจำนวนที่ระบุข้างต้น</li>
                  <li>2. ระบุหมายเลขออเดอร์ในรายการโอน (ถ้าได้)</li>
                  <li>3. เก็บสลิปการโอนไว้เป็นหลักฐาน</li>
                  <li>4. เราจะตรวจสอบและอัปเดตสถานะภายใน 1-3 ชั่วโมงทำการ</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">หมายเหตุสำคัญ:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• กรุณาโอนเงินตามจำนวนที่ระบุให้ตรงบาท</li>
                  <li>• ค่าธรรมเนียมการโอน (ถ้ามี) ลูกค้าเป็นผู้รับผิดชอบ</li>
                  <li>• หากมีข้อสงสัย ติดต่อทีมงานผ่านช่องทางต่างๆ</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankTransferInfo;
