
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AttachmentUploadProps {
  lessonId: string;
  onUploadComplete?: () => void;
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({ lessonId, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExtension = file.name.split('.').pop();
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const filePath = `lessons/${lessonId}/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('lesson_attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save attachment info to database
        const { error: dbError } = await supabase
          .from('lesson_attachments')
          .insert({
            lesson_id: lessonId,
            file_name: file.name,
            file_path: filePath,
            file_type: fileExtension || 'unknown',
            file_size: file.size,
          });

        if (dbError) throw dbError;

        return { fileName: file.name, filePath };
      });

      return await Promise.all(uploadPromises);
    },
    onSuccess: (results) => {
      toast.success(`อัปโหลดไฟล์ ${results.length} ไฟล์เรียบร้อยแล้ว`);
      setSelectedFiles(null);
      queryClient.invalidateQueries({ queryKey: ["lesson-attachments", lessonId] });
      onUploadComplete?.();
    },
    onError: (error) => {
      toast.error(`เกิดข้อผิดพลาดในการอัปโหลด: ${error.message}`);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleUpload = () => {
    if (selectedFiles && selectedFiles.length > 0) {
      uploadMutation.mutate(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    if (selectedFiles) {
      const dt = new DataTransfer();
      Array.from(selectedFiles).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setSelectedFiles(dt.files.length > 0 ? dt.files : null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          อัปโหลดเอกสารประกอบ
        </CardTitle>
        <CardDescription>
          อัปโหลดไฟล์ PDF, PPT, MP3 หรือไฟล์อื่นๆ สำหรับบทเรียนนี้
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="attachments">เลือกไฟล์</Label>
          <Input
            id="attachments"
            type="file"
            multiple
            accept=".pdf,.ppt,.pptx,.mp3,.wav,.doc,.docx,.zip,.rar"
            onChange={handleFileSelect}
            className="mt-1"
          />
        </div>

        {selectedFiles && selectedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>ไฟล์ที่เลือก:</Label>
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFiles || selectedFiles.length === 0 || uploadMutation.isPending}
          className="w-full"
        >
          {uploadMutation.isPending ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AttachmentUpload;
