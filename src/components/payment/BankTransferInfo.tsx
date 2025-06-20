
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BankTransferInfoProps {
  amount: number;
  orderId: string;
}

const BankTransferInfo = ({ amount, orderId }: BankTransferInfoProps) => {
  const bankInfo = {
    bankName: "ธนาคารกสิกรไทย",
    accountNumber: "123-4-56789-0",
    accountName: "บริษัท บีกินส์ไกด์ จำกัด"
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`คัดลอก${label}แล้ว`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="mr-2 h-5 w-5" />
          ข้อมูลการโอนเงิน
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">ธนาคาร</h3>
          <p className="text-blue-800">{bankInfo.bankName}</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="text-sm text-gray-600">เลขที่บัญชี</p>
              <p className="font-mono font-semibold">{bankInfo.accountNumber}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(bankInfo.accountNumber, "เลขบัญชี")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="text-sm text-gray-600">ชื่อบัญชี</p>
              <p className="font-semibold">{bankInfo.accountName}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(bankInfo.accountName, "ชื่อบัญชี")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <div>
              <p className="text-sm text-gray-600">จำนวนเงิน</p>
              <p className="font-bold text-green-700 text-xl">{amount.toLocaleString()} บาท</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(amount.toString(), "จำนวนเงิน")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
            <div>
              <p className="text-sm text-gray-600">หมายเลขออเดอร์</p>
              <p className="font-mono text-sm">{orderId}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(orderId, "หมายเลขออเดอร์")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">หมายเหตุสำคัญ:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• กรุณาโอนเงินตามจำนวนที่ระบุข้างต้นเท่านั้น</li>
            <li>• ระบุหมายเลขออเดอร์ในรายการโอน</li>
            <li>• การยืนยันการชำระเงินจะใช้เวลา 1-3 ชั่วโมงทำการ</li>
            <li>• หากมีปัญหาติดต่อ: support@beginsguide.com</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankTransferInfo;
