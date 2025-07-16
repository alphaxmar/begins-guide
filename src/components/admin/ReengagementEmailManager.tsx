import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, Users, Send } from 'lucide-react';
import { useReengagementEmail } from '@/hooks/useReengagementEmail';

export const ReengagementEmailManager = () => {
  const { sendBulkReengagementEmails, isSending } = useReengagementEmail();

  const handleSendBulkEmails = async () => {
    try {
      const result = await sendBulkReengagementEmails();
      console.log('Bulk email results:', result);
    } catch (error) {
      console.error('Error sending bulk emails:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <CardTitle>Re-engagement Email System</CardTitle>
        </div>
        <CardDescription>
          จัดการอีเมลกระตุ้นเตือนให้ผู้ใช้ที่ไม่ได้เข้าใช้งานกลับมาใช้บริการ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Criteria Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold">90 วัน</p>
              <p className="text-sm text-muted-foreground">ไม่ได้ล็อกอิน</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold">ผู้ใช้ฟรี</p>
              <p className="text-sm text-muted-foreground">Role: User</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Badge variant="outline" className="p-2">
              <span className="text-sm">มี TMI {'>'} 0</span>
            </Badge>
          </div>
        </div>

        {/* Email Template Preview */}
        <div className="border-l-4 border-primary pl-4 bg-primary/5 p-4 rounded-r-lg">
          <h4 className="font-semibold mb-2">Email Template Preview:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Subject:</strong> "[FirstName], เป้าหมายชีวิตของคุณยังเหมือนเดิมไหม?"</p>
            <p><strong>Content:</strong> ส่วนบุคคลพร้อม TMI value และ CTA กลับไปยัง Dashboard</p>
            <p><strong>CTA:</strong> "กลับไปทบทวนพิมพ์เขียวของฉัน" → /dashboard</p>
          </div>
        </div>

        {/* Send Bulk Emails */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">ส่งอีเมล Re-engagement แบบเป็นกลุ่ม</h4>
              <p className="text-sm text-muted-foreground">
                ส่งอีเมลให้ผู้ใช้ทุกคนที่ตรงตามเงื่อนไขข้างต้น
              </p>
            </div>
            <Button
              onClick={handleSendBulkEmails}
              disabled={isSending}
              className="bg-primary hover:bg-primary/90"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  ส่งอีเมลแบบกลุ่ม
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-800 mb-2">คำแนะนำ:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• ระบบจะส่งอีเมลให้เฉพาะผู้ใช้ที่มี TMI (Target Monthly Income) มากกว่า 0</li>
            <li>• อีเมลจะถูกปรับแต่งเป็นรายบุคคลด้วยชื่อและตัวเลข TMI ของแต่ละคน</li>
            <li>• ควรใช้ฟีเจอร์นี้อย่างระมัดระวังเพื่อหลีกเลี่ยง spam</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};