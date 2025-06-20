
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { useLessonAttachments } from "@/hooks/useLessonAttachments";
import AttachmentUpload from "./AttachmentUpload";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface LessonAttachmentManagerProps {
  lessonId: string;
}

const LessonAttachmentManager: React.FC<LessonAttachmentManagerProps> = ({ lessonId }) => {
  const { attachments, isLoading, deleteAttachment, generateDownloadUrl, isDeleting } = useLessonAttachments(lessonId);
  const [showUpload, setShowUpload] = useState(false);

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const downloadUrl = await generateDownloadUrl(filePath);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (isLoading) {
    return <div>กำลังโหลดเอกสารประกอบ...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            เอกสารประกอบบทเรียน
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowUpload(!showUpload)}
          >
            <Upload className="h-4 w-4 mr-2" />
            {showUpload ? "ซ่อน" : "อัปโหลด"}
          </Button>
        </CardTitle>
        <CardDescription>
          จัดการไฟล์เอกสารประกอบสำหรับบทเรียนนี้
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showUpload && (
          <AttachmentUpload 
            lessonId={lessonId} 
            onUploadComplete={() => setShowUpload(false)}
          />
        )}

        {attachments && attachments.length > 0 ? (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{attachment.file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {attachment.file_type.toUpperCase()} • 
                      {attachment.file_size ? ` ${(attachment.file_size / 1024 / 1024).toFixed(2)} MB` : ' ไม่ทราบขนาด'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(attachment.file_path, attachment.file_name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isDeleting}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบไฟล์</AlertDialogTitle>
                        <AlertDialogDescription>
                          คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์ "{attachment.file_name}" การกระทำนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteAttachment(attachment.id)}>
                          ลบไฟล์
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            ยังไม่มีเอกสารประกอบสำหรับบทเรียนนี้
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LessonAttachmentManager;
