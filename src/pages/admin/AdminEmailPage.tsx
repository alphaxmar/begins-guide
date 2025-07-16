import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import EmailTester from '@/components/admin/EmailTester';
import WebhookConfig from '@/components/admin/WebhookConfig';
import { ReengagementEmailManager } from '@/components/admin/ReengagementEmailManager';

const AdminEmailPage = () => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sending, setSending] = useState(false);

  const { data: emailLogs, isLoading } = useQuery({
    queryKey: ['emailLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return data;
    },
  });

  const sendBulkEmail = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-email-notifications', {
        body: {
          type: 'bulk_email',
          to: recipientEmail,
          subject: emailSubject,
          body: emailBody,
        }
      });

      if (error) {
        throw error;
      }

      toast.success('ส่งอีเมลสำเร็จ!');
      setRecipientEmail('');
      setEmailSubject('');
      setEmailBody('');
    } catch (error: any) {
      console.error('Bulk email error:', error);
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="จัดการระบบอีเมลและ Webhooks"
        description="ส่งอีเมลแจ้งข่าวสาร จัดการระบบอีเมลอัตโนมัติ และตั้งค่า Stripe Webhooks"
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                ส่งอีเมลแจ้งข่าวสาร
              </CardTitle>
              <CardDescription>ส่งอีเมลไปยังผู้รับหลายคน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">ผู้รับ (คั่นด้วยเครื่องหมายจุลภาค)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com, air@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">หัวข้อ</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="หัวข้ออีเมล"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="body">เนื้อหา</Label>
                <Textarea
                  id="body"
                  placeholder="เนื้อหาอีเมล"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                />
              </div>
              <Button onClick={sendBulkEmail} disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    ส่งอีเมล
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <WebhookConfig />
          
          <ReengagementEmailManager />
        </div>
        
        <div className="space-y-6">
          <EmailTester />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                บันทึกการส่งอีเมล
              </CardTitle>
              <CardDescription>แสดงประวัติการส่งอีเมล</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>กำลังโหลด...</p>
              ) : emailLogs && emailLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          ผู้รับ
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          หัวข้อ
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          สถานะ
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          วันที่ส่ง
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {emailLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                            {log.recipient_email}
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                            {log.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                            {log.status}
                          </td>
                          <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                            {format(new Date(log.created_at), 'dd MMMM yyyy, HH:mm', { locale: th })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>ไม่มีบันทึกการส่งอีเมล</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminEmailPage;
