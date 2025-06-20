
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface TemplateDownloadButtonProps {
  templatePath: string;
  fileName: string;
  productId: string;
  className?: string;
}

const TemplateDownloadButton = ({ 
  templatePath, 
  fileName, 
  productId,
  className = "" 
}: TemplateDownloadButtonProps) => {
  const [downloading, setDownloading] = useState(false);
  const { user } = useAuth();

  const handleDownload = async () => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อดาวน์โหลดไฟล์");
      return;
    }

    setDownloading(true);

    try {
      // ตรวจสอบสิทธิ์การเข้าถึง
      const { data: purchaseCheck, error: purchaseError } = await supabase
        .from('user_purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (purchaseError || !purchaseCheck) {
        toast.error("คุณไม่มีสิทธิ์ดาวน์โหลดไฟล์นี้");
        return;
      }

      // ดาวน์โหลดไฟล์จาก Storage
      const { data, error } = await supabase.storage
        .from('product_templates')
        .download(templatePath);

      if (error) {
        console.error('Download error:', error);
        throw new Error("ไม่สามารถดาวน์โหลดไฟล์ได้");
      }

      // สร้าง URL สำหรับดาวน์โหลด
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("ดาวน์โหลดเสร็จสิ้น!");
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการดาวน์โหลด");
    } finally {
      setDownloading(false);
    }
  };

  if (!user) {
    return (
      <Button variant="outline" disabled className={className}>
        <AlertCircle className="mr-2 h-4 w-4" />
        กรุณาเข้าสู่ระบบ
      </Button>
    );
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading}
      className={className}
      variant="outline"
    >
      {downloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          กำลังดาวน์โหลด...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          <FileText className="mr-2 h-4 w-4" />
          ดาวน์โหลด {fileName}
        </>
      )}
    </Button>
  );
};

export default TemplateDownloadButton;
