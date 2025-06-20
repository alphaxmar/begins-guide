
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CourseFileUploadProps {
  productId: string;
  lessonId: string;
  onUploadSuccess: () => void;
}

const CourseFileUpload = ({ productId, lessonId, onUploadSuccess }: CourseFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type (allow PDF, DOC, DOCX, TXT)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("รองรับเฉพาะไฟล์ PDF, DOC, DOCX และ TXT เท่านั้น");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ขนาดไฟล์ต้องไม่เกิน 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `${productId}/${lessonId}/lesson_materials.pdf`;
      
      const { error } = await supabase.storage
        .from('course_files')
        .upload(fileName, file, { upsert: true });

      if (error) {
        throw error;
      }

      toast.success("อัปโหลดไฟล์สำเร็จ!");
      onUploadSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDelete = async () => {
    setIsUploading(true);
    try {
      const fileName = `${productId}/${lessonId}/lesson_materials.pdf`;
      
      const { error } = await supabase.storage
        .from('course_files')
        .remove([fileName]);

      if (error) {
        throw error;
      }

      toast.success("ลบไฟล์สำเร็จ!");
      onUploadSuccess();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("เกิดข้อผิดพลาดในการลบไฟล์");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <Label htmlFor="course-file">ไฟล์เอกสารประกอบบทเรียน</Label>
      <div className="flex items-center gap-2">
        <Input
          id="course-file"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleFileDelete}
          disabled={isUploading}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>รองรับไฟล์ PDF, DOC, DOCX, TXT (ขนาดไม่เกิน 10MB)</span>
      </div>
    </div>
  );
};

export default CourseFileUpload;
