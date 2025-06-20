
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LessonDownloadButtonProps {
  lessonId: string;
  lessonTitle: string;
  productId: string;
  hasAccess: boolean;
}

const LessonDownloadButton = ({ lessonId, lessonTitle, productId, hasAccess }: LessonDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!hasAccess) {
      toast.error("คุณไม่มีสิทธิ์ดาวน์โหลดไฟล์นี้");
      return;
    }

    setIsDownloading(true);
    try {
      const fileName = `${productId}/${lessonId}/lesson_materials.pdf`;
      
      const { data, error } = await supabase.storage
        .from('course_files')
        .download(fileName);

      if (error) {
        if (error.message.includes('not found')) {
          toast.error("ไม่พบไฟล์สำหรับบทเรียนนี้");
        } else {
          throw error;
        }
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lessonTitle}_materials.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("ดาวน์โหลดไฟล์สำเร็จ!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!hasAccess) {
    return (
      <Button variant="outline" disabled className="opacity-50">
        <Download className="mr-2 h-4 w-4" />
        ดาวน์โหลดเอกสาร
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      ดาวน์โหลดเอกสาร
    </Button>
  );
};

export default LessonDownloadButton;
