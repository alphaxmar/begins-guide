import React, { useState } from 'react';
import { useEmailAutomation } from '@/hooks/useEmailAutomation';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Users, Target } from 'lucide-react';
import { toast } from 'sonner';

const EmailTestPage = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');
  
  const { sendWelcomeSequence, sendNewsletterConfirmation, sendEngagementFollowup } = useEmailAutomation();
  const { subscribeToNewsletter, getSubscribers } = useNewsletterSubscription();

  const testWelcomeEmail = () => {
    if (!testEmail) {
      toast.error('กรุณากรอกอีเมลทดสอบ');
      return;
    }
    
    sendWelcomeSequence.mutate({
      email: testEmail,
      name: testName || 'ผู้ใช้ทดสอบ',
      type: 'signup'
    });
  };

  const testNewsletterConfirmation = () => {
    if (!testEmail) {
      toast.error('กรุณากรอกอีเมลทดสอบ');
      return;
    }
    
    sendNewsletterConfirmation.mutate({
      email: testEmail,
      name: testName || 'ผู้ใช้ทดสอบ'
    });
  };

  const testEngagementEmail = () => {
    if (!testEmail) {
      toast.error('กรุณากรอกอีเมลทดสอบ');
      return;
    }
    
    sendEngagementFollowup.mutate({
      email: testEmail,
      name: testName || 'ผู้ใช้ทดสอบ',
      lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    });
  };

  const testNewsletterSubscription = () => {
    if (!testEmail) {
      toast.error('กรุณากรอกอีเมลทดสอบ');
      return;
    }
    
    subscribeToNewsletter.mutate({
      email: testEmail,
      name: testName
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ระบบทดสอบ Email Automation</h1>
        <p className="text-gray-600">ทดสอบการส่งอีเมลอัตโนมัติและ newsletter subscription</p>
      </div>

      {/* Test Inputs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            ข้อมูลทดสอบ
          </CardTitle>
          <CardDescription>
            กรอกข้อมูลสำหรับทดสอบการส่งอีเมล
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="อีเมลทดสอบ"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <Input
            placeholder="ชื่อทดสอบ (ไม่บังคับ)"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Welcome Email Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Welcome Email Sequence
            </CardTitle>
            <CardDescription>
              ทดสอบการส่งอีเมลต้อนรับสมาชิกใหม่
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testWelcomeEmail}
              disabled={sendWelcomeSequence.isPending}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {sendWelcomeSequence.isPending ? 'กำลังส่ง...' : 'ส่ง Welcome Email'}
            </Button>
            {sendWelcomeSequence.isSuccess && (
              <Badge variant="secondary" className="mt-2">
                ส่งสำเร็จ ✓
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Newsletter Confirmation Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Newsletter Confirmation
            </CardTitle>
            <CardDescription>
              ทดสอบการส่งอีเมลยืนยันการสมัครรับข่าวสาร
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testNewsletterConfirmation}
              disabled={sendNewsletterConfirmation.isPending}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {sendNewsletterConfirmation.isPending ? 'กำลังส่ง...' : 'ส่ง Newsletter Confirmation'}
            </Button>
            {sendNewsletterConfirmation.isSuccess && (
              <Badge variant="secondary" className="mt-2">
                ส่งสำเร็จ ✓
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Engagement Email Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Engagement Follow-up
            </CardTitle>
            <CardDescription>
              ทดสอบการส่งอีเมลติดตามผู้ใช้ที่ไม่ได้ใช้งาน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testEngagementEmail}
              disabled={sendEngagementFollowup.isPending}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {sendEngagementFollowup.isPending ? 'กำลังส่ง...' : 'ส่ง Engagement Email'}
            </Button>
            {sendEngagementFollowup.isSuccess && (
              <Badge variant="secondary" className="mt-2">
                ส่งสำเร็จ ✓
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Newsletter Subscription Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-500" />
              Newsletter Subscription
            </CardTitle>
            <CardDescription>
              ทดสอบการสมัครรับข่าวสาร
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testNewsletterSubscription}
              disabled={subscribeToNewsletter.isPending}
              className="w-full"
            >
              <Users className="mr-2 h-4 w-4" />
              {subscribeToNewsletter.isPending ? 'กำลังสมัคร...' : 'ทดสอบ Newsletter Subscription'}
            </Button>
            {subscribeToNewsletter.isSuccess && (
              <Badge variant="secondary" className="mt-2">
                สมัครสำเร็จ ✓
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Email Templates Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates ที่ใช้ในระบบ</CardTitle>
          <CardDescription>
            ตัวอย่าง template ที่ระบบจะส่งให้ผู้ใช้
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Welcome Email</h4>
            <p className="text-sm text-gray-600">
              หัวข้อ: "ยินดีต้อนรับสู่ begins.Guide! 🎉"<br />
              เนื้อหา: แนะนำแพลตฟอร์ม, ขั้นตอนเริ่มต้น, และลิงก์ทรัพยากรที่มีประโยชน์
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">2. Newsletter Confirmation</h4>
            <p className="text-sm text-gray-600">
              หัวข้อ: "ยืนยันการสมัครรับข่าวสาร begins.Guide"<br />
              เนื้อหา: ยืนยันการสมัครรับข่าวสาร และแนะนำประเภทข่าวสารที่จะได้รับ
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold">3. Engagement Follow-up</h4>
            <p className="text-sm text-gray-600">
              หัวข้อ: "เรามองหาคุณอยู่! กลับมาเรียนรู้ต่อได้เลย"<br />
              เนื้อหา: เชิญให้กลับมาใช้งาน พร้อมแนะนำฟีเจอร์ใหม่และข้อเสนอพิเศษ
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTestPage;
