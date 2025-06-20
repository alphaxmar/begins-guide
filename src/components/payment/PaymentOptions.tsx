
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, Globe, Building2 } from "lucide-react";
import StripeCheckoutButton from "./StripeCheckoutButton";
import OmiseCheckoutButton from "./OmiseCheckoutButton";
import PromptPayCheckout from "./PromptPayCheckout";
import BankTransferCheckout from "./BankTransferCheckout";

interface PaymentOptionsProps {
  productIds: string[];
  amount: number;
  onSuccess?: () => void;
}

const PaymentOptions = ({ productIds, amount, onSuccess }: PaymentOptionsProps) => {
  const [activeTab, setActiveTab] = useState("thai");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>เลือกวิธีการชำระเงิน</CardTitle>
        <CardDescription>
          เลือกวิธีการชำระเงินที่สะดวกสำหรับคุณ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="thai" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              ช่องทางไทย
            </TabsTrigger>
            <TabsTrigger value="international" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              สากล
            </TabsTrigger>
          </TabsList>

          <TabsContent value="thai" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  PromptPay QR Code
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  ชำระเงินผ่านแอปธนาคารที่รองรับ PromptPay
                </p>
                <PromptPayCheckout
                  productIds={productIds}
                  totalAmount={amount}
                  onSuccess={onSuccess}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">หรือ</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  โอนเงินผ่านธนาคาร
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  โอนเงินผ่านบัญชีธนาคาร ไม่มีค่าธรรมเนียม
                </p>
                <BankTransferCheckout
                  productIds={productIds}
                  totalAmount={amount}
                  onSuccess={onSuccess}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">หรือ</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  บัตรเครดิต/เดบิต (Omise)
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  ชำระเงินด้วยบัตรเครดิตหรือเดบิตผ่าน Omise
                </p>
                <OmiseCheckoutButton
                  productIds={productIds}
                  amount={amount}
                  onSuccess={onSuccess}
                  className="w-full"
                >
                  ชำระด้วยบัตรเครดิต/เดบิต
                </OmiseCheckoutButton>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="international" className="space-y-4 mt-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Stripe Payment
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                ชำระเงินด้วยบัตรเครดิตสากลผ่าน Stripe
              </p>
              <StripeCheckoutButton
                productIds={productIds}
                amount={amount}
                onSuccess={onSuccess}
                className="w-full"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-center">
            <strong>จำนวนเงิน:</strong> {amount.toLocaleString()} บาท
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            การชำระเงินของคุณได้รับการปกป้องด้วยระบบความปลอดภัยระดับสูง
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentOptions;
