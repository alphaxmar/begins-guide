import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentSlipUploadProps {
  orderId: string;
  amount: number;
  onSuccess?: () => void;
}

export const PaymentSlipUpload: React.FC<PaymentSlipUploadProps> = ({
  orderId,
  amount,
  onSuccess
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [bankName, setBankName] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [slipSubmitted, setSlipSubmitted] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ไฟล์ต้องมีขนาดไม่เกิน 5MB');
      return;
    }

    setUploadedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile || !bankName || !transactionDate) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setUploading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${user.id}/${orderId}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-slips')
        .upload(fileName, uploadedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-slips')
        .getPublicUrl(fileName);

      // Save slip data to database
      const { error: dbError } = await supabase
        .from('payment_slips')
        .insert({
          order_id: orderId,
          user_id: user.id,
          slip_image_url: publicUrl,
          amount: amount,
          transaction_date: transactionDate,
          bank_name: bankName,
          transfer_type: 'bank_transfer',
          status: 'pending'
        });

      if (dbError) throw dbError;

      // Send notification to admin
      await supabase.functions.invoke('send-payment-notification', {
        body: {
          type: 'slip_uploaded',
          orderId: orderId,
          amount: amount,
          bankName: bankName,
          transactionDate: transactionDate
        }
      });

      setSlipSubmitted(true);
      toast.success('อัปโหลดสลิปสำเร็จ! รอการตรวจสอบจากแอดมิน');
      onSuccess?.();
    } catch (error) {
      console.error('Error uploading slip:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดสลิป');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  if (slipSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">อัปโหลดสลิปสำเร็จ!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            เราได้รับสลิปการโอนเงินของคุณแล้ว<br />
            กรุณารอการตรวจสอบจากแอดมิน 1-2 ชั่วโมง
          </p>
          <p className="text-xs text-muted-foreground">
            หากมีปัญหาหรือคำถาม กรุณาติดต่อเรา
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">อัปโหลดสลิปการโอนเงิน</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bank-name">ธนาคารที่โอนเงิน</Label>
            <Input
              id="bank-name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="เช่น ธนาคารกรุงเทพ"
              required
            />
          </div>

          <div>
            <Label htmlFor="transaction-date">วันที่และเวลาที่โอนเงิน</Label>
            <Input
              id="transaction-date"
              type="datetime-local"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="slip-upload">สลิปการโอนเงิน</Label>
            <div className="mt-2">
              {!uploadedFile ? (
                <label
                  htmlFor="slip-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">คลิกเพื่ือเลือกไฟล์</span>
                  <span className="text-xs text-gray-500">รองรับ JPG, PNG (สูงสุด 5MB)</span>
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <Input
                id="slip-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>ยอดที่ต้องโอน:</strong> {amount.toLocaleString()} บาท
            </p>
            <p className="text-xs text-blue-600 mt-1">
              กรุณาตรวจสอบยอดเงินให้ตรงกับที่แสดงในสลิป
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploading || !uploadedFile}
          >
            {uploading ? 'กำลังอัปโหลด...' : 'ส่งสลิปเพื่อตรวจสอบ'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};