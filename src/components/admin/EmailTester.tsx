
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmailNotification } from '@/hooks/useEmailNotification';
import { toast } from 'sonner';
import { Mail, Send } from 'lucide-react';

const EmailTester = () => {
  const [emailType, setEmailType] = useState<'welcome' | 'purchase_confirmation' | 'password_reset'>('welcome');
  const [testEmail, setTestEmail] = useState('');
  const { mutate: sendEmail, isPending } = useEmailNotification();

  const handleSendTestEmail = () => {
    if (!testEmail) {
      toast.error('กรุณากรอกอีเมลทดสอบ');
      return;
    }

    const emailData = {
      type: emailType,
      to: testEmail,
      data: {
        user_name: 'ผู้ทดสอบระบบ',
        order_id: 'TEST-001',
        products: [
          { title: 'คอร์สทดสอบ', price: 1990 },
          { title: 'เทมเพลตทดสอบ', price: 590 }
        ],
        total_amount: 2580,
        reset_link: `${window.location.origin}/reset-password?token=test-token`
      }
    };

    sendEmail(emailData, {
      onSuccess: () => {
        toast.success(`ส่งอีเมลทดสอบประเภท ${emailType} สำเร็จ!`);
      },
      onError: (error: any) => {
        toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          ทดสอบระบบอีเมล
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">ประเภทอีเมล</label>
          <Select value={emailType} onValueChange={(value: any) => setEmailType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">Welcome Email</SelectItem>
              <SelectItem value="purchase_confirmation">Purchase Confirmation</SelectItem>
              <SelectItem value="password_reset">Password Reset</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">อีเมลทดสอบ</label>
          <Input
            type="email"
            placeholder="test@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleSendTestEmail} 
          disabled={isPending}
          className="w-full"
        >
          <Send className="mr-2 h-4 w-4" />
          {isPending ? 'กำลังส่ง...' : 'ส่งอีเมลทดสอบ'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailTester;
