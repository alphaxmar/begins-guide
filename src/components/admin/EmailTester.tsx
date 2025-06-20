
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TestTube, Loader2 } from "lucide-react";

const EmailTester = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testSubject, setTestSubject] = useState('ทดสอบระบบอีเมล');
  const [testMessage, setTestMessage] = useState('นี่คือการทดสอบระบบส่งอีเมลของ Begins Guide');
  const [testing, setTesting] = useState(false);

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast.error('กรุณากรอกอีเมลผู้รับ');
      return;
    }

    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email-notifications', {
        body: {
          type: 'test_email',
          to: testEmail,
          subject: testSubject,
          body: testMessage,
        }
      });

      if (error) {
        throw error;
      }

      toast.success('ส่งอีเมลทดสอบสำเร็จ!');
      setTestEmail('');
    } catch (error: any) {
      console.error('Test email error:', error);
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          ทดสอบระบบอีเมล
        </CardTitle>
        <CardDescription>ทดสอบการส่งอีเมลผ่านระบบ</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="test-email">อีเมลผู้รับ</Label>
          <Input
            id="test-email"
            type="email"
            placeholder="test@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="test-subject">หัวข้อ</Label>
          <Input
            id="test-subject"
            value={testSubject}
            onChange={(e) => setTestSubject(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="test-message">ข้อความ</Label>
          <Textarea
            id="test-message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
          />
        </div>
        <Button onClick={sendTestEmail} disabled={testing} className="w-full">
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังส่ง...
            </>
          ) : (
            <>
              <TestTube className="mr-2 h-4 w-4" />
              ส่งอีเมลทดสอบ
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailTester;
