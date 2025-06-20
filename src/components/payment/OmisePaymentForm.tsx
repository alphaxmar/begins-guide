
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface OmisePaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: (chargeId: string) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    Omise: any;
  }
}

const OmisePaymentForm = ({ amount, orderId, onSuccess, onError }: OmisePaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry_month: "",
    expiry_year: "",
    security_code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Check if Omise is loaded
      if (!window.Omise) {
        throw new Error("Omise library not loaded");
      }

      // Create token with Omise
      window.Omise.createToken("card", {
        number: cardData.number.replace(/\s/g, ""),
        name: cardData.name,
        expiration_month: cardData.expiry_month,
        expiration_year: cardData.expiry_year,
        security_code: cardData.security_code,
      }, async (statusCode: number, response: any) => {
        if (statusCode === 200) {
          // Token created successfully, now process payment
          try {
            const paymentResponse = await fetch("/api/process-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({
                amount,
                currency: "thb",
                card_token: response.id,
                order_id: orderId,
                description: `ชำระเงินสำหรับออเดอร์ ${orderId}`,
              }),
            });

            const result = await paymentResponse.json();
            
            if (paymentResponse.ok && result.charge.status === "successful") {
              toast.success("ชำระเงินสำเร็จ!");
              onSuccess(result.charge.id);
            } else {
              throw new Error(result.error || "การชำระเงินไม่สำเร็จ");
            }
          } catch (error: any) {
            onError(error.message);
            toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
          }
        } else {
          onError(response.message || "ไม่สามารถสร้าง token ได้");
          toast.error("ข้อมูลบัตรไม่ถูกต้อง");
        }
        setIsProcessing(false);
      });
    } catch (error: any) {
      setIsProcessing(false);
      onError(error.message);
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          ชำระเงินด้วยบัตรเครดิต
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">หมายเลขบัตร</Label>
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
              maxLength={19}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-name">ชื่อบนบัตร</Label>
            <Input
              id="card-name"
              placeholder="JOHN DOE"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry-month">เดือน</Label>
              <Input
                id="expiry-month"
                placeholder="12"
                value={cardData.expiry_month}
                onChange={(e) => setCardData({ ...cardData, expiry_month: e.target.value })}
                maxLength={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry-year">ปี</Label>
              <Input
                id="expiry-year"
                placeholder="25"
                value={cardData.expiry_year}
                onChange={(e) => setCardData({ ...cardData, expiry_year: e.target.value })}
                maxLength={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cardData.security_code}
                onChange={(e) => setCardData({ ...cardData, security_code: e.target.value })}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <div className="text-lg font-semibold mb-4">
              ยอดรวม: {amount.toLocaleString()} บาท
            </div>
            <Button type="submit" disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังดำเนินการ...
                </>
              ) : (
                `ชำระเงิน ${amount.toLocaleString()} บาท`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OmisePaymentForm;
