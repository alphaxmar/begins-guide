
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  onFileUploaded: (filePath: string) => void;
  productId?: string;
  currentFilePath?: string;
  accept?: string;
  label: string;
  description?: string;
}

const FileUpload = ({ 
  onFileUploaded, 
  productId, 
  currentFilePath, 
  accept = ".zip,.pdf,.png,.jpg,.jpeg",
  label,
  description
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadFile = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = productId 
        ? `templates/${productId}/${fileName}`
        : `general/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product_files')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onFileUploaded(filePath);
      toast.success("อัปโหลดไฟล์สำเร็จ!");
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(`เกิดข้อผิดพลาดในการอัปโหลด: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeCurrentFile = () => {
    onFileUploaded("");
    setSelectedFile(null);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {currentFilePath && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
          <FileText className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700 flex-1">
            ไฟล์ปัจจุบัน: {currentFilePath.split('/').pop()}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeCurrentFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Input
          type="file"
          accept={accept}
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          disabled={uploading}
        />
        
        {selectedFile && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => uploadFile(selectedFile)}
              disabled={uploading}
              size="sm"
            >
              {uploading ? (
                "กำลังอัปโหลด..."
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  อัปโหลด {selectedFile.name}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              ยกเลิก
            </Button>
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default FileUpload;
