
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEmailTemplates, useEmailLogs, useCreateEmailTemplate, useSendBulkEmail } from "@/hooks/useEmailSystem";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PageHeader } from "@/components/ui/page-header";
import { Mail, Send, FileText } from "lucide-react";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const AdminEmailPage = () => {
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    content: '',
    variables: [] as string[]
  });
  
  const [bulkEmail, setBulkEmail] = useState({
    recipients: '',
    subject: '',
    content: ''
  });

  const { data: templates, isLoading: templatesLoading } = useEmailTemplates();
  const { data: logs, isLoading: logsLoading } = useEmailLogs();
  const createTemplate = useCreateEmailTemplate();
  const sendBulkEmail = useSendBulkEmail();

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    createTemplate.mutate(newTemplate, {
      onSuccess: () => {
        setNewTemplate({ name: '', subject: '', content: '', variables: [] });
      }
    });
  };

  const handleSendBulkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const recipients = bulkEmail.recipients.split('\n').filter(email => email.trim());
    sendBulkEmail.mutate({
      recipients,
      subject: bulkEmail.subject,
      content: bulkEmail.content
    }, {
      onSuccess: () => {
        setBulkEmail({ recipients: '', subject: '', content: '' });
      }
    });
  };

  return (
    <div className="py-8">
      <PageHeader 
        title="จัดการระบบอีเมล"
        description="สร้างเทมเพลต ส่งอีเมล และดูประวัติการส่ง"
      />

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            ส่งอีเมล
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            เทมเพลต
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            ประวัติ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>ส่งอีเมลแบบกลุ่ม</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendBulkEmail} className="space-y-4">
                <div>
                  <Label htmlFor="recipients">ผู้รับ (อีเมลหนึ่งบรรทัดหนึ่งอีเมล)</Label>
                  <Textarea
                    id="recipients"
                    placeholder="user1@example.com&#10;user2@example.com"
                    value={bulkEmail.recipients}
                    onChange={(e) => setBulkEmail(prev => ({ ...prev, recipients: e.target.value }))}
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subject">หัวข้อ</Label>
                  <Input
                    id="subject"
                    value={bulkEmail.subject}
                    onChange={(e) => setBulkEmail(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">เนื้อหา</Label>
                  <Textarea
                    id="content"
                    value={bulkEmail.content}
                    onChange={(e) => setBulkEmail(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[200px]"
                    required
                  />
                </div>
                <Button type="submit" disabled={sendBulkEmail.isPending}>
                  {sendBulkEmail.isPending ? <LoadingSpinner size="sm" /> : 'ส่งอีเมล'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>สร้างเทมเพลตใหม่</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTemplate} className="space-y-4">
                  <div>
                    <Label htmlFor="name">ชื่อเทมเพลต</Label>
                    <Input
                      id="name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">หัวข้อ</Label>
                    <Input
                      id="subject"
                      value={newTemplate.subject}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">เนื้อหา</Label>
                    <Textarea
                      id="content"
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={createTemplate.isPending}>
                    {createTemplate.isPending ? <LoadingSpinner size="sm" /> : 'สร้างเทมเพลต'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>เทมเพลตที่มีอยู่</CardTitle>
              </CardHeader>
              <CardContent>
                {templatesLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-3">
                    {templates?.map((template) => (
                      <div key={template.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          สร้างเมื่อ: {format(new Date(template.created_at), 'dd MMM yyyy', { locale: th })}
                        </p>
                      </div>
                    ))}
                    {(!templates || templates.length === 0) && (
                      <p className="text-center text-muted-foreground py-4">ยังไม่มีเทมเพลต</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>ประวัติการส่งอีเมล</CardTitle>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ผู้รับ</TableHead>
                      <TableHead>หัวข้อ</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>วันที่ส่ง</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.recipient_email}</TableCell>
                        <TableCell>{log.subject}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              log.status === 'sent' 
                                ? 'bg-green-100 text-green-800'
                                : log.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {log.status === 'sent' ? 'ส่งแล้ว' : 
                             log.status === 'failed' ? 'ล้มเหลว' : 'รอส่ง'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(log.created_at), 'dd MMM yyyy HH:mm', { locale: th })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {logs && logs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  ยังไม่มีประวัติการส่งอีเมล
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminEmailPage;
