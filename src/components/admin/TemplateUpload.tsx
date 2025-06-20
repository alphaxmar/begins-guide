
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TemplateUploadProps {
  productId?: string;
  onUploadSuccess: (filePath: string) => void;
  currentFilePath?: string;
}

const TemplateUpload = ({ productId, onUploadSuccess, currentFilePath }: TemplateUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์ (สูงสุด 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("ขนาดไฟล์เกิน 50MB กรุณาเลือกไฟล์ที่เล็กกว่า");
        return;
      }

      // ตรวจสอบประเภทไฟล์
      const allowedTypes = [
        'application/zip',
        'application/pdf',
        'image/png',
        'image/jpeg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("ประเภทไฟล์ไม่รองรับ กรุณาเลือกไฟล์ .zip, .pdf, .png, .jpeg, .docx, .xlsx หรือ .pptx");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("กรุณาเลือกไฟล์ก่อน");
      return;
    }

    if (!productId) {
      toast.error("ต้องสร้างสินค้าก่อนอัปโหลดไฟล์");
      return;
    }

    setUploading(true);

    try {
      // สร้างชื่อไฟล์ที่ไม่ซ้ำ
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${productId}_${Date.now()}.${fileExtension}`;
      const filePath = `templates/${productId}/${fileName}`;

      // อัปโหลดไฟล์ไปยัง Storage
      const { data, error } = await supabase.storage
        .from('product_templates')
        .upload(filePath, selectedFile);

      if (error) {
        throw error;
      }

      // อัปเดต template_file_path ในตาราง products
      const { error: updateError } = await supabase
        .from('products')
        .update({ template_file_path: filePath })
        .eq('id', productId);

      if (updateError) {
        throw updateError;
      }

      toast.success("อัปโหลดไฟล์สำเร็จ!");
      onUploadSuccess(filePath);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลด: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCurrentFile = async () => {
    if (!currentFilePath || !productId) return;

    try {
      // ลบไฟล์จาก Storage
      const { error: deleteError } = await supabase.storage
        .from('product_templates')
        .remove([currentFilePath]);

      if (deleteError) {
        throw deleteError;
      }

      // อัปเดตฐานข้อมูล
      const { error: updateError } = await supabase
        .from('products')
        .update({ template_file_path: null })
        .eq('id', productId);

      if (updateError) {
        throw updateError;
      }

      toast.success("ลบไฟล์สำเร็จ!");
      onUploadSuccess('');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error("เกิดข้อผิดพลาดในการลบไฟล์: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          อัปโหลดไฟล์เทมเพลต
        </CardTitle>
        <CardDescription>
          อัปโหลดไฟล์เทมเพลตที่ลูกค้าจะได้รับหลังจากซื้อ (รองรับ .zip, .pdf, .png, .jpeg, .docx, .xlsx, .pptx สูงสุด 50MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentFilePath && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  ไฟล์ปัจจุบัน: {currentFilePath.split('/').pop()}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCurrentFile}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="template-file">เลือกไฟล์ใหม่</Label>
          <Input
            ref={fileInputRef}
            id="template-file"
            type="file"
            accept=".zip,.pdf,.png,.jpg,.jpeg,.docx,.xlsx,.pptx"
            onChange={handleFileSelect}
            className="mt-1"
          />
        </div>

        {selectedFile && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-blue-800">{selectedFile.name}</span>
                  <div className="text-xs text-blue-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeSelectedFile}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading || !productId}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังอัปโหลด...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              อัปโหลดไฟล์
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateUpload;
