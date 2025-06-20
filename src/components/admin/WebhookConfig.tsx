
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Webhook, Copy, ExternalLink } from "lucide-react";

const WebhookConfig = () => {
  const [webhookUrl] = useState('https://suemonabwttspbmxaxbi.supabase.co/functions/v1/stripe-webhook');
  
  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('คัดลอก Webhook URL แล้ว');
  };

  const openStripeWebhooks = () => {
    window.open('https://dashboard.stripe.com/webhooks', '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          ตั้งค่า Stripe Webhooks
        </CardTitle>
        <CardDescription>
          กำหนดค่า Webhooks สำหรับการชำระเงินอัตโนมัติ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Webhook Endpoint URL</Label>
          <div className="flex gap-2">
            <Input
              value={webhookUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button variant="outline" size="icon" onClick={copyWebhookUrl}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Events ที่ต้อง Subscribe</Label>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">checkout.session.completed</Badge>
            <Badge variant="secondary">payment_intent.succeeded</Badge>
            <Badge variant="secondary">payment_intent.payment_failed</Badge>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={openStripeWebhooks} className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            เปิด Stripe Dashboard
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>วิธีตั้งค่า:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>คลิกปุ่มเปิด Stripe Dashboard</li>
            <li>เพิ่ม Webhook Endpoint ใหม่</li>
            <li>ใส่ URL ข้างบนและเลือก Events ที่กำหนด</li>
            <li>คัดลอก Webhook Secret ไปใส่ใน Supabase Secrets</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
