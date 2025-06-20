import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, QrCode, Smartphone } from 'lucide-react';
import StripeCheckoutButton from './StripeCheckoutButton';
import PromptPayCheckout from './PromptPayCheckout';

interface PaymentMethodSelectorProps {
  productIds: string[];
  totalAmount: number;
  onSuccess?: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  productIds,
  totalAmount,
  onSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'promptpay'>('stripe');
  const [showPayment, setShowPayment] = useState(false);

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  if (showPayment) {
    if (selectedMethod === 'promptpay') {
      return (
        <PromptPayCheckout
          productIds={productIds}
          totalAmount={totalAmount}
          onSuccess={onSuccess}
        />
      );
    } else {
      return (
        <div className="space-y-4">
          <StripeCheckoutButton
            productIds={productIds}
            amount={totalAmount}
            onSuccess={onSuccess}
          />
          <Button 
            variant="outline" 
            onClick={() => setShowPayment(false)}
            className="w-full"
          >
            เปลี่ยนวิธีการชำระเงิน
          </Button>
        </div>
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>เลือกวิธีการชำระเงิน</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">ยอดรวมที่ต้องชำระ</h4>
          <p className="text-2xl font-bold text-blue-700">
            {totalAmount.toLocaleString()} บาท
          </p>
        </div>

        <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as 'stripe' | 'promptpay')}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-semibold">บัตรเครดิต/เดบิต</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard, และอื่นๆ</div>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="promptpay" id="promptpay" />
              <Label htmlFor="promptpay" className="flex-1 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <QrCode className="h-6 w-6 text-orange-600" />
                  <div>
                    <div className="font-semibold">PromptPay QR Code</div>
                    <div className="text-sm text-gray-600">ชำระผ่านแอปธนาคาร</div>
                  </div>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Button 
            onClick={handleProceedToPayment}
            className="w-full"
            size="lg"
          >
            {selectedMethod === 'stripe' ? (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                ดำเนินการชำระเงินด้วยบัตร
              </>
            ) : (
              <>
                <Smartphone className="mr-2 h-4 w-4" />
                สร้าง QR Code สำหรับชำระเงิน
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-600 text-center">
            การชำระเงินของคุณมีความปลอดภัยและได้รับการเข้ารหัส
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodSelector;
