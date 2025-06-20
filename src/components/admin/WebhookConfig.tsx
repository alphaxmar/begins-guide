
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, ExternalLink, Webhook } from "lucide-react";
import { toast } from "sonner";

const WebhookConfig = () => {
  const webhookUrl = `${window.location.origin.replace('localhost:8080', 'suemonabwttspbmxaxbi.supabase.co')}/functions/v1/stripe-webhook`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('คัดลอกลิงก์แล้ว!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          การตั้งค่า Stripe Webhook
        </CardTitle>
        <CardDescription>
          ตั้งค่า Webhook ใน Stripe Dashboard เพื่อให้ระบบทำงานอัตโนมัติ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Webhook URL</Label>
          <div className="flex gap-2 mt-1">
            <Input 
              value={webhookUrl} 
              readOnly 
              className="font-mono text-sm"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => copyToClipboard(webhookUrl)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label>Events ที่ต้องเลือกใน Stripe</Label>
          <div className="mt-2 p-3 bg-muted rounded-md">
            <ul className="text-sm space-y-1">
              <li>• <code>checkout.session.completed</code></li>
              <li>• <code>payment_intent.payment_failed</code></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">ขั้นตอนการตั้งค่า:</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
            <li>เข้าไปที่ Stripe Dashboard > Webhooks</li>
            <li>คลิก "Add endpoint"</li>
            <li>ใส่ Webhook URL ข้างต้น</li>
            <li>เลือก Events ที่ระบุไว้</li>
            <li>คัดลอก Webhook Secret และตั้งค่าใน Supabase Edge Functions</li>
          </ol>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <a 
            href="https://dashboard.stripe.com/webhooks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            เปิด Stripe Dashboard
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default WebhookConfig;
