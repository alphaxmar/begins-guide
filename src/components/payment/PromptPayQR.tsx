
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PromptPayQRProps {
  amount: number;
  orderId: string;
}

const PromptPayQR = ({ amount, orderId }: PromptPayQRProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const promptPayNumber = "0861234567"; // หมายเลขพร้อมเพย์

  useEffect(() => {
    // สร้าง QR Code URL สำหรับพร้อมเพย์
    // ในการใช้งานจริงควรใช้ API สำหรับสร้าง QR Code
    const qrData = `00020101021129370016A000000677010111011${promptPayNumber.length.toString().padStart(2, '0')}${promptPayNumber}53037645802TH5916BEGINS GUIDE LTD6007Bangkok62410007${orderId}6304`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    setQrCodeUrl(qrUrl);
  }, [amount, orderId, promptPayNumber]);

  const copyPromptPayNumber = () => {
    navigator.clipboard.writeText(promptPayNumber);
    toast.success("คัดลอกหมายเลขพร้อมเพย์แล้ว");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-5 w-5" />
          พร้อมเพย์ QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code สำหรับพร้อมเพย์"
                className="w-48 h-48 mx-auto"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">สแกน QR Code เพื่อชำระเงิน</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <div>
              <p className="text-sm text-gray-600">หมายเลขพร้อมเพย์</p>
              <p className="font-mono font-semibold">{promptPayNumber}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={copyPromptPayNumber}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-3 bg-green-50 rounded">
            <p className="text-sm text-gray-600">จำนวนเงิน</p>
            <p className="font-bold text-green-700 text-xl">{amount.toLocaleString()} บาท</p>
          </div>

          <div className="p-3 bg-orange-50 rounded">
            <p className="text-sm text-gray-600">หมายเลขออเดอร์</p>
            <p className="font-mono text-sm">{orderId}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">วิธีการชำระเงิน:</h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. เปิดแอปธนาคารหรือแอปกระเป๋าเงินอิเล็กทรอนิกส์</li>
            <li>2. เลือกเมนู "สแกน QR" หรือ "พร้อมเพย์"</li>
            <li>3. สแกน QR Code ด้านบน</li>
            <li>4. ตรวจสอบข้อมูลและยืนยันการโอน</li>
            <li>5. เก็บหลักฐานการโอนเงินไว้</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>หมายเหตุ:</strong> การยืนยันการชำระเงินจะใช้เวลา 1-3 ชั่วโมงทำการ 
            หากมีปัญหาติดต่อ: support@beginsguide.com
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptPayQR;
