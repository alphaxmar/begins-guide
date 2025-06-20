
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Key, 
  Eye, 
  EyeOff,
  Save,
  Settings
} from "lucide-react";

const AdminPaymentSettingsPage = () => {
  const [promptPayNumber, setPromptPayNumber] = useState('');
  const [showStripeKey, setShowStripeKey] = useState(false);
  const [showOmiseKey, setShowOmiseKey] = useState(false);
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [omiseSecretKey, setOmiseSecretKey] = useState('');

  const handleSavePromptPay = () => {
    // TODO: Implement save to database or edge function
    toast.success('บันทึกหมายเลข PromptPay สำเร็จ');
  };

  const handleSaveStripeKey = () => {
    // TODO: Implement save to Supabase secrets
    toast.success('บันทึก Stripe Secret Key สำเร็จ');
  };

  const handleSaveOmiseKey = () => {
    // TODO: Implement save to Supabase secrets
    toast.success('บันทึก Omise Secret Key สำเร็จ');
  };

  return (
    <div className="py-8">
      <PageHeader 
        title="ตั้งค่าการชำระเงิน"
        description="จัดการการตั้งค่าบัญชีรับเงินและ Payment Gateway"
      />

      <div className="grid gap-6">
        {/* PromptPay Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              PromptPay QR Code
            </CardTitle>
            <CardDescription>
              ตั้งค่าหมายเลขโทรศัพท์หรือเลขบัตรประชาชนสำหรับรับเงินผ่าน PromptPay
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promptpay">หมายเลข PromptPay</Label>
              <div className="flex gap-2">
                <Input
                  id="promptpay"
                  placeholder="0812345678 หรือ 1234567890123"
                  value={promptPayNumber}
                  onChange={(e) => setPromptPayNumber(e.target.value)}
                />
                <Button onClick={handleSavePromptPay}>
                  <Save className="mr-2 h-4 w-4" />
                  บันทึก
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                สามารถใส่หมายเลขโทรศัพท์ (10 หลัก) หรือเลขบัตรประชาชน (13 หลัก)
              </p>
            </div>
            
            <div className="pt-2">
              <Badge variant="outline" className="text-green-600">
                <DollarSign className="mr-1 h-3 w-3" />
                ค่าธรรมเนียม: ฟรี
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Stripe Payment Gateway
            </CardTitle>
            <CardDescription>
              ตั้งค่า API Key สำหรับรับเงินผ่านบัตรเครดิต/เดบิต (ต่างประเทศ)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stripe-key">Stripe Secret Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="stripe-key"
                    type={showStripeKey ? "text" : "password"}
                    placeholder="sk_live_..."
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowStripeKey(!showStripeKey)}
                  >
                    {showStripeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button onClick={handleSaveStripeKey}>
                  <Save className="mr-2 h-4 w-4" />
                  บันทึก
                </Button>
              </div>
            </div>
            
            <div className="pt-2 space-y-2">
              <Badge variant="outline" className="text-blue-600">
                <DollarSign className="mr-1 h-3 w-3" />
                ค่าธรรมเนียม: 2.9% + 30¢
              </Badge>
              <div className="text-sm text-muted-foreground">
                <p>รองรับ: Visa, Mastercard, American Express</p>
                <p>เหมาะสำหรับลูกค้าต่างประเทศ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Omise Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Omise Payment Gateway
            </CardTitle>
            <CardDescription>
              ตั้งค่า API Key สำหรับรับเงินผ่านบัตรเครดิต/เดบิต (ในประเทศ)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="omise-key">Omise Secret Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="omise-key"
                    type={showOmiseKey ? "text" : "password"}
                    placeholder="skey_..."
                    value={omiseSecretKey}
                    onChange={(e) => setOmiseSecretKey(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowOmiseKey(!showOmiseKey)}
                  >
                    {showOmiseKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button onClick={handleSaveOmiseKey}>
                  <Save className="mr-2 h-4 w-4" />
                  บันทึก
                </Button>
              </div>
            </div>
            
            <div className="pt-2 space-y-2">
              <Badge variant="outline" className="text-purple-600">
                <DollarSign className="mr-1 h-3 w-3" />
                ค่าธรรมเนียม: 2.65%
              </Badge>
              <div className="text-sm text-muted-foreground">
                <p>รองรับ: บัตรไทยทุกธนาคาร, PromptPay</p>
                <p>เหมาะสำหรับลูกค้าในประเทศ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              สรุปช่องทางการชำระเงิน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium">PromptPay QR</h3>
                <p className="text-sm text-muted-foreground">รับเงินทันที, ฟรี</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium">Stripe</h3>
                <p className="text-sm text-muted-foreground">บัตรสากล, 2.9%</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium">Omise</h3>
                <p className="text-sm text-muted-foreground">บัตรไทย, 2.65%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPaymentSettingsPage;
