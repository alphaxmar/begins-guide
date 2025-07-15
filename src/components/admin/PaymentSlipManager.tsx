import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Check, X, Clock, Image as ImageIcon } from 'lucide-react';
import { usePaymentSlips, PaymentSlip } from '@/hooks/usePaymentSlips';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

const PaymentSlipCard: React.FC<{ slip: PaymentSlip; onUpdate: (id: string, status: string, notes?: string) => void }> = ({ slip, onUpdate }) => {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState(slip.admin_notes || '');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'รอการตรวจสอบ';
      case 'approved': return 'อนุมัติแล้ว';
      case 'rejected': return 'ปฏิเสธ';
      default: return status;
    }
  };

  const handleApprove = () => {
    onUpdate(slip.id, 'approved', adminNotes);
    setReviewDialogOpen(false);
  };

  const handleReject = () => {
    onUpdate(slip.id, 'rejected', adminNotes);
    setReviewDialogOpen(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {slip.orders?.profiles?.full_name || 'ไม่ระบุชื่อ'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Order ID: {slip.order_id}
            </p>
          </div>
          <Badge className={getStatusColor(slip.status)}>
            {getStatusText(slip.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-sm font-medium">ยอดเงิน</Label>
            <p className="text-lg font-semibold">{slip.amount.toLocaleString()} บาท</p>
          </div>
          <div>
            <Label className="text-sm font-medium">ธนาคาร</Label>
            <p>{slip.bank_name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">วันที่โอนเงิน</Label>
            <p>{format(new Date(slip.transaction_date), 'dd/MM/yyyy HH:mm', { locale: th })}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">วันที่อัปโหลด</Label>
            <p>{format(new Date(slip.created_at), 'dd/MM/yyyy HH:mm', { locale: th })}</p>
          </div>
        </div>

        {slip.admin_notes && (
          <div className="mb-4">
            <Label className="text-sm font-medium">หมายเหตุจากแอดมิน</Label>
            <p className="text-sm bg-gray-50 p-2 rounded">{slip.admin_notes}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <ImageIcon className="w-4 h-4 mr-2" />
                ดูสลิป
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>สลิปการโอนเงิน</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center">
                <img
                  src={slip.slip_image_url}
                  alt="Payment slip"
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>

          {slip.status === 'pending' && (
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  ตรวจสอบ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ตรวจสอบสลิปการโอนเงิน</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>หมายเหตุ (ไม่บังคับ)</Label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="เพิ่มหมายเหตุหรือคำอธิบาย..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleApprove} className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      อนุมัติ
                    </Button>
                    <Button onClick={handleReject} variant="destructive" className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      ปฏิเสธ
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const PaymentSlipManager: React.FC = () => {
  const { slips: allSlips, loading, updateSlipStatus } = usePaymentSlips();
  const { slips: pendingSlips } = usePaymentSlips('pending');
  const { slips: approvedSlips } = usePaymentSlips('approved');
  const { slips: rejectedSlips } = usePaymentSlips('rejected');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">จัดการสลิปการโอนเงิน</h1>
        <p className="text-muted-foreground">ตรวจสอบและจัดการสลิปการโอนเงินจากลูกค้า</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            รอตรวจสอบ ({pendingSlips.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            อนุมัติแล้ว ({approvedSlips.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <X className="w-4 h-4" />
            ปฏิเสธ ({rejectedSlips.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            ทั้งหมด ({allSlips.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="mt-6">
            {loading ? (
              <div className="text-center py-8">กำลังโหลด...</div>
            ) : pendingSlips.length > 0 ? (
              pendingSlips.map((slip) => (
                <PaymentSlipCard
                  key={slip.id}
                  slip={slip}
                  onUpdate={updateSlipStatus}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                ไม่มีสลิปที่รอการตรวจสอบ
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="mt-6">
            {approvedSlips.length > 0 ? (
              approvedSlips.map((slip) => (
                <PaymentSlipCard
                  key={slip.id}
                  slip={slip}
                  onUpdate={updateSlipStatus}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                ไม่มีสลิปที่อนุมัติแล้ว
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="mt-6">
            {rejectedSlips.length > 0 ? (
              rejectedSlips.map((slip) => (
                <PaymentSlipCard
                  key={slip.id}
                  slip={slip}
                  onUpdate={updateSlipStatus}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                ไม่มีสลิปที่ปฏิเสธ
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="mt-6">
            {allSlips.length > 0 ? (
              allSlips.map((slip) => (
                <PaymentSlipCard
                  key={slip.id}
                  slip={slip}
                  onUpdate={updateSlipStatus}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                ไม่มีข้อมูลสลิป
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};