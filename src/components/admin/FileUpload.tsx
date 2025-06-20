
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploadProps {
  productId?: string;
  currentFilePath?: string;
  onFileUploaded: (filePath: string) => void;
  accept?: string;
  label?: string;
  description?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  productId,
  currentFilePath,
  onFileUploaded,
  accept = ".zip,.pdf,.png,.jpg,.jpeg,.docx,.xlsx,.pptx",
  label = "อัปโหลดไฟล์",
  description
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !productId) {
      toast.error("กรุณาเลือกไฟล์และระบุ Product ID");
      return;
    }

    setUploading(true);
    try {
      // Create file path
      const fileExt = selectedFile.name.split('.').pop();
      const sanitizedFileName = selectedFile.name.replace(/\s+/g, '_');
      const filePath = `templates/${productId}/${sanitizedFileName}`;

      // Delete old file if exists
      if (currentFilePath && currentFilePath !== filePath) {
        await supabase.storage.from('product_files').remove([currentFilePath]);
      }

      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from('product_files')
        .upload(filePath, selectedFile, { 
          upsert: true 
        });

      if (uploadError) throw uploadError;

      onFileUploaded(filePath);
      toast.success("อัปโหลดไฟล์สำเร็จ!");
      setSelectedFile(null);
      
      // Reset input
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) input.value = '';

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async () => {
    if (!currentFilePath) return;

    try {
      const { error } = await supabase.storage
        .from('product_files')
        .remove([currentFilePath]);

      if (error) throw error;

      onFileUploaded('');
      toast.success("ลบไฟล์สำเร็จ!");
    } catch (error: any) {
      console.error('Remove error:', error);
      toast.error(`เกิดข้อผิดพลาดในการลบไฟล์: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload">{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {currentFilePath && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800">
            ไฟล์ปัจจุบัน: {currentFilePath.split('/').pop()}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveFile}
            className="ml-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Input
          id="file-upload"
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || uploading || !productId}
          size="sm"
        >
          {uploading ? (
            "กำลังอัปโหลด..."
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              อัปโหลด
            </>
          )}
        </Button>
      </div>

      {selectedFile && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <File className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">{selectedFile.name}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
