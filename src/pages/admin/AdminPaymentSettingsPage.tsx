import { useState, useEffect } from 'react';
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Key, 
  Eye, 
  EyeOff,
  Save,
  Settings,
  Banknote,
  Loader2
} from "lucide-react";

const AdminPaymentSettingsPage = () => {
  const { settings, isLoading: settingsLoading, updateSettings } = usePaymentSettings();
  
  // Local state for form inputs
  const [promptPayNumber, setPromptPayNumber] = useState('');
  const [showStripeKey, setShowStripeKey] = useState(false);
  const [showOmiseKey, setShowOmiseKey] = useState(false);
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [omiseSecretKey, setOmiseSecretKey] = useState('');

  // Bank account states
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankBranch, setBankBranch] = useState('');

  // Loading states for individual saves
  const [savingPromptPay, setSavingPromptPay] = useState(false);
  const [savingBank, setSavingBank] = useState(false);

  // Load settings into form when they change
  useEffect(() => {
    if (settings) {
      setPromptPayNumber(settings.promptpay_number || '');
      setBankName(settings.bank_name || '');
      setAccountNumber(settings.bank_account_number || '');
      setAccountName(settings.bank_account_name || '');
      setBankBranch(settings.bank_branch || '');
    }
  }, [settings]);

  const handleSavePromptPay = async () => {
    if (!promptPayNumber.trim()) {
      toast.error('กรุณาใส่หมายเลข PromptPay');
      return;
    }

    setSavingPromptPay(true);
    const success = await updateSettings({
      promptpay_number: promptPayNumber.trim()
    });
    setSavingPromptPay(false);
  };

  const handleSaveStripeKey = () => {
    // TODO: Implement save to Supabase secrets
    toast.success('บันทึก Stripe Secret Key สำเร็จ');
  };

  const handleSaveOmiseKey = () => {
    // TODO: Implement save to Supabase secrets
    toast.success('บันทึก Omise Secret Key สำเร็จ');
  };

  const handleSaveBankAccount = async () => {
    if (!bankName || !accountNumber || !accountName) {
      toast.error('กรุณากรอกข้อมูลธนาคาร หมายเลขบัญชี และชื่อบัญชี');
      return;
    }

    setSavingBank(true);
    const success = await updateSettings({
      bank_name: bankName,
      bank_account_number: accountNumber,
      bank_account_name: accountName,
      bank_branch: bankBranch
    });
    setSavingBank(false);
  };

  if (settingsLoading) {
    return (
      <div className="py-8">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <PageHeader 
        title="ตั้งค่าการชำระเงิน"
        description="จัดการการตั้งค่าบัญชีรับเงินและ Payment Gateway"
      />

      <div className="grid gap-6">
        {/* Bank Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              บัญชีธนาคาร
            </CardTitle>
            <CardDescription>
              ตั้งค่าบัญชีธนาคารสำหรับรับเงินผ่านการโอนแบบดั้งเดิม
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name">ธนาคาร</Label>
                <Select value={bankName} onValueChange={setBankName}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกธนาคาร" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kbank">ธนาคารกสิกรไทย</SelectItem>
                    <SelectItem value="scb">ธนาคารไทยพาณิชย์</SelectItem>
                    <SelectItem value="bbl">ธนาคารกรุงเทพ</SelectItem>
                    <SelectItem value="ktb">ธนาคารกรุงไทย</SelectItem>
                    <SelectItem value="tmb">ธนาคารทหารไทย</SelectItem>
                    <SelectItem value="bay">ธนาคารกรุงศรีอยุธยา</SelectItem>
                    <SelectItem value="gsb">ธนาคารออมสิน</SelectItem>
                    <SelectItem value="tbank">ธนาคารธนชาต</SelectItem>
                    <SelectItem value="uob">ธนาคารยูโอบี</SelectItem>
                    <SelectItem value="lhbank">ธนาคารแลนด์ แอนด์ เฮ้าส์</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-number">หมายเลขบัญชี</Label>
                <Input
                  id="account-number"
                  placeholder="xxx-x-xxxxx-x"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-name">ชื่อบัญชี</Label>
                <Input
                  id="account-name"
                  placeholder="นาย/นาง/นางสาว ชื่อ-นามสกุล"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank-branch">สาขา (ไม่จำเป็น)</Label>
                <Input
                  id="bank-branch"
                  placeholder="สาขาที่เปิดบัญชี"
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                onClick={handleSaveBankAccount} 
                className="w-full md:w-auto"
                disabled={savingBank}
              >
                {savingBank ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                บันทึกข้อมูลบัญชีธนาคาร
              </Button>
            </div>
            
            <div className="pt-2">
              <Badge variant="outline" className="text-orange-600">
                <DollarSign className="mr-1 h-3 w-3" />
                ค่าธรรมเนียม: ฟรี (แต่ลูกค้าต้องจ่ายค่าธรรมเนียมโอน)
              </Badge>
            </div>
          </CardContent>
        </Card>

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
                <Button 
                  onClick={handleSavePromptPay}
                  disabled={savingPromptPay}
                >
                  {savingPromptPay ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
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
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Banknote className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-medium">โอนธนาคาร</h3>
                <p className="text-sm text-muted-foreground">โอนแล้วแจ้ง, ฟรี</p>
              </div>
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
