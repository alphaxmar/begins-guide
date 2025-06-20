
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Building2, QrCode } from "lucide-react";
import OmisePaymentForm from "./OmisePaymentForm";
import BankTransferInfo from "./BankTransferInfo";
import PromptPayQR from "./PromptPayQR";

interface PaymentMethodSelectorProps {
  amount: number;
  orderId: string;
  onSuccess: (chargeId: string) => void;
  onError: (error: string) => void;
}

type PaymentMethod = "credit_card" | "bank_transfer" | "promptpay";

const PaymentMethodSelector = ({ amount, orderId, onSuccess, onError }: PaymentMethodSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("credit_card");

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case "credit_card":
        return (
          <OmisePaymentForm
            amount={amount}
            orderId={orderId}
            onSuccess={onSuccess}
            onError={onError}
          />
        );
      case "bank_transfer":
        return <BankTransferInfo amount={amount} orderId={orderId} />;
      case "promptpay":
        return <PromptPayQR amount={amount} orderId={orderId} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>เลือกวิธีการชำระเงิน</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedMethod} 
            onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card" className="flex items-center cursor-pointer flex-1">
                <CreditCard className="mr-3 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">บัตรเครดิต/เดบิต</p>
                  <p className="text-sm text-gray-500">ชำระเงินทันทีผ่านบัตรเครดิตหรือเดบิต</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="bank_transfer" id="bank_transfer" />
              <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer flex-1">
                <Building2 className="mr-3 h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">โอนเงินผ่านธนาคาร</p>
                  <p className="text-sm text-gray-500">โอนเงินผ่านแอปธนาคารหรือ ATM</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="promptpay" id="promptpay" />
              <Label htmlFor="promptpay" className="flex items-center cursor-pointer flex-1">
                <QrCode className="mr-3 h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">พร้อมเพย์ QR Code</p>
                  <p className="text-sm text-gray-500">สแกน QR Code เพื่อชำระเงินผ่านพร้อมเพย์</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {renderPaymentForm()}
    </div>
  );
};

export default PaymentMethodSelector;
